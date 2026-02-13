function parseList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderPlan(data) {
  const results = document.getElementById('results');
  const meta = document.getElementById('meta');
  const queries = document.getElementById('queries');
  const links = document.getElementById('links');
  const dailyPlan = document.getElementById('dailyPlan');

  meta.textContent = `Generated at: ${new Date(data.generatedAt).toLocaleString()}`;

  queries.innerHTML = '';
  data.queries.forEach((query) => {
    const li = document.createElement('li');
    li.textContent = query;
    queries.appendChild(li);
  });

  links.innerHTML = '';
  Object.entries(data.links).forEach(([board, urls]) => {
    const section = document.createElement('div');
    const title = document.createElement('h4');
    const list = document.createElement('ul');
    title.textContent = board;

    urls.forEach((url) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noreferrer noopener';
      anchor.textContent = url;
      li.appendChild(anchor);
      list.appendChild(li);
    });

    section.appendChild(title);
    section.appendChild(list);
    links.appendChild(section);
  });

  dailyPlan.innerHTML = '';
  data.dailyPlan.forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    dailyPlan.appendChild(li);
  });

  results.hidden = false;
}

function showError(message) {
  const error = document.getElementById('error');
  error.textContent = message;
  error.hidden = false;
}

function clearError() {
  const error = document.getElementById('error');
  error.hidden = true;
  error.textContent = '';
}

async function submitProfile(event) {
  event.preventDefault();
  clearError();

  const payload = {
    targetRoles: parseList(document.getElementById('targetRoles').value),
    locations: parseList(document.getElementById('locations').value),
    seniority: document.getElementById('seniority').value.trim(),
    salaryMinUsd: Number(document.getElementById('salaryMinUsd').value) || null,
    keywords: parseList(document.getElementById('keywords').value),
    remoteOnly: document.getElementById('remoteOnly').checked
  };

  try {
    const response = await fetch('/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate plan.');
    }

    renderPlan(data);
  } catch (error) {
    showError(error.message);
  }
}

document.getElementById('profile-form').addEventListener('submit', submitProfile);
