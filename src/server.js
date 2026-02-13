const http = require('http');
const fs = require('fs');
const path = require('path');
const { createJobSearchPlan } = require('./jobSearchService');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveStaticFile(req, res) {
  const urlPath = req.url === '/' ? '/index.html' : req.url;
  const safePath = path.normalize(urlPath).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(PUBLIC_DIR, safePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendJson(res, 403, { error: 'Forbidden', message: 'Invalid path.' });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      sendJson(res, 404, { error: 'Not Found', message: 'Resource not found.' });
      return;
    }

    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 200_000) {
        reject(new Error('Request payload too large.'));
      }
    });

    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON payload.'));
      }
    });

    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/api/health') {
      sendJson(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
      return;
    }

    if (req.method === 'GET' && req.url === '/api/profile/template') {
      sendJson(res, 200, {
        targetRoles: ['Software Engineer', 'Backend Engineer'],
        locations: ['New York, NY', 'Austin, TX'],
        remoteOnly: true,
        seniority: 'mid',
        salaryMinUsd: 120000,
        keywords: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL']
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/plan') {
      const body = await parseRequestBody(req);
      const plan = createJobSearchPlan(body);
      sendJson(res, 200, plan);
      return;
    }

    if (req.method === 'GET') {
      serveStaticFile(req, res);
      return;
    }

    sendJson(res, 404, { error: 'Not Found', message: 'Endpoint not found.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.url} failed:`, error.message);
    sendJson(res, 400, { error: 'Bad Request', message: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`[job-agent] server running on http://localhost:${PORT}`);
});
