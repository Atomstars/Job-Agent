function parseList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderPlan(data) {
  const results = document.getElementById('results');
  const meta = document.getElementById('meta');
  const summary = document.getElementById('summary');
  const opportunities = document.getElementById('opportunities');
  const tips = document.getElementById('tips');
  const queries = document.getElementById('queries');
  const links = document.getElementById('links');
  const dailyPlan = document.getElementById('dailyPlan');

  meta.textContent = `Generated at: ${new Date(data.generatedAt).toLocaleString()}`;
  summary.textContent = data.summary;

  opportunities.innerHTML = '';
  data.opportunities.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'opportunity-card';
    card.innerHTML = `
      <h4>${item.company}</h4>
      <p><strong>Role:</strong> ${item.role}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><a href="${item.links.linkedin}" target="_blank" rel="noreferrer noopener">LinkedIn</a> |
      <a href="${item.links.indeed}" target="_blank" rel="noreferrer noopener">Indeed</a> |
      <a href="${item.links.googleJobs}" target="_blank" rel="noreferrer noopener">Google Jobs</a> |
      <a href="${item.links.companyCareers}" target="_blank" rel="noreferrer noopener">Company Careers</a></p>
    `;
    opportunities.appendChild(card);
  });

  tips.innerHTML = '';
  data.tips.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    tips.appendChild(li);
  });

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
    companyWatchlist: parseList(document.getElementById('companyWatchlist').value),
    seniority: document.getElementById('seniority').value.trim(),
    salaryMinUsd: Number(document.getElementById('salaryMinUsd').value) || null,
    keywords: parseList(document.getElementById('keywords').value),
    maxOpportunities: Number(document.getElementById('maxOpportunities').value) || 16,
    remoteOnly: document.getElementById('remoteOnly').checked
  };

  try {
    const response = await fetch('/api/bot/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Assistant failed to generate plan.');
    }

    renderPlan(data);
  } catch (error) {
    showError(error.message);
  }
}

document.getElementById('profile-form').addEventListener('submit', submitProfile);
