const DEFAULT_COMPANIES = Object.freeze([
  'Google',
  'Microsoft',
  'Amazon',
  'Stripe',
  'Shopify',
  'Airbnb',
  'Atlassian'
]);

function cleanList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function pickCompanies(profile) {
  const watchlist = cleanList(profile.companyWatchlist);
  if (watchlist.length) {
    return watchlist;
  }

  return DEFAULT_COMPANIES;
}

function buildOpportunity(company, role, location, remoteOnly) {
  const targetLocation = remoteOnly ? 'Remote' : location;
  const query = `${company} ${role} ${targetLocation}`;
  const encodedQuery = encodeURIComponent(query);

  return {
    company,
    role,
    location: targetLocation,
    links: {
      linkedin: `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}&location=${encodeURIComponent(targetLocation)}`,
      indeed: `https://www.indeed.com/jobs?q=${encodedQuery}&l=${encodeURIComponent(targetLocation)}`,
      googleJobs: `https://www.google.com/search?q=${encodedQuery}+jobs`,
      companyCareers: `https://www.google.com/search?q=${encodeURIComponent(company + ' careers')}`
    }
  };
}

function buildOpportunities(profile) {
  const companies = pickCompanies(profile);
  const maxCards = Number.isFinite(profile.maxOpportunities)
    ? Math.max(5, Math.min(40, Math.floor(profile.maxOpportunities)))
    : 20;

  const opportunities = [];

  for (const company of companies) {
    for (const role of profile.targetRoles) {
      const location = profile.locations[0] || 'Remote';
      opportunities.push(buildOpportunity(company, role, location, profile.remoteOnly));
      if (opportunities.length >= maxCards) {
        return opportunities;
      }
    }
  }

  return opportunities;
}

function createBotReply(profile) {
  const opportunities = buildOpportunities(profile);
  const companies = [...new Set(opportunities.map((item) => item.company))];
  const roles = [...new Set(opportunities.map((item) => item.role))];

  const summary = `I found ${opportunities.length} high-signal opportunities across ${companies.length} companies for roles: ${roles.join(', ')}.`;
  const tips = [
    'Start with 5 roles where your experience strongly matches 70%+ requirements.',
    'Prioritize companies with active hiring this month and recruiter activity on LinkedIn.',
    'For each application, tailor resume headline and top 3 bullets to the job post keywords.'
  ];

  return {
    summary,
    opportunities,
    tips
  };
}

module.exports = {
  createBotReply,
  buildOpportunities
};
