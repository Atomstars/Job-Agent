const SUPPORTED_BOARDS = Object.freeze([
  'LinkedIn',
  'Indeed',
  'Google',
  'Wellfound',
  'RemoteOK'
]);

function normalizeArray(value, fieldName) {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  const trimmed = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean);

  if (!trimmed.length) {
    throw new Error(`${fieldName} must contain at least one non-empty value.`);
  }

  return trimmed;
}

function validateProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Profile payload must be a JSON object.');
  }

  const targetRoles = normalizeArray(profile.targetRoles, 'targetRoles');
  const locations = normalizeArray(profile.locations, 'locations');

  const seniority = typeof profile.seniority === 'string' ? profile.seniority.trim() : 'mid';
  const keywords = Array.isArray(profile.keywords)
    ? profile.keywords.map((k) => String(k).trim()).filter(Boolean)
    : [];

  const remoteOnly = Boolean(profile.remoteOnly);
  const salaryMinUsd = Number.isFinite(profile.salaryMinUsd) ? Number(profile.salaryMinUsd) : null;

  return {
    targetRoles,
    locations,
    remoteOnly,
    seniority: seniority || 'mid',
    salaryMinUsd,
    keywords
  };
}

function buildBooleanQueries(profile) {
  return profile.targetRoles.map((role) => {
    const parts = [`"${role}"`, `"${profile.seniority}"`];

    if (profile.remoteOnly) {
      parts.push('"remote"');
    }

    if (profile.keywords.length) {
      const keywordSection = profile.keywords.map((k) => `"${k}"`).join(' OR ');
      parts.push(`(${keywordSection})`);
    }

    return parts.join(' AND ');
  });
}

function generateSearchLinks(profile, queries) {
  const links = {
    LinkedIn: [],
    Indeed: [],
    Google: [],
    Wellfound: [],
    RemoteOK: []
  };

  for (const query of queries) {
    for (const location of profile.locations) {
      const effectiveLocation = profile.remoteOnly ? 'Remote' : location;
      const queryValue = encodeURIComponent(query);
      const locationValue = encodeURIComponent(effectiveLocation);

      links.LinkedIn.push(`https://www.linkedin.com/jobs/search/?keywords=${queryValue}&location=${locationValue}`);
      links.Indeed.push(`https://www.indeed.com/jobs?q=${queryValue}&l=${locationValue}`);
      links.Google.push(`https://www.google.com/search?q=${queryValue}+jobs+in+${locationValue}`);
      links.Wellfound.push(`https://wellfound.com/jobs?query=${queryValue}&location=${locationValue}`);
      links.RemoteOK.push(`https://remoteok.com/remote-${encodeURIComponent(query.toLowerCase()).replace(/%20/g, '-').replace(/%22/g, '')}-jobs`);
    }
  }

  return links;
}

function buildDailyPlan(profile) {
  const salaryText = profile.salaryMinUsd
    ? `Target compensation: $${profile.salaryMinUsd.toLocaleString()}+`
    : 'No salary floor configured yet';

  return [
    'Run searches from the generated links and shortlist at least 15 relevant jobs.',
    `Prioritize opportunities matching: ${profile.targetRoles.join(', ')}.`,
    'Tailor your resume summary and 3-5 bullet points for top opportunities.',
    'Submit at least 5 quality applications (not bulk one-click applies).',
    'Send 3 networking messages to recruiters, hiring managers, or alumni.',
    'Update your tracker with status, follow-up dates, and interview notes.',
    `Profile context: seniority=${profile.seniority}, remoteOnly=${profile.remoteOnly}.`,
    salaryText
  ];
}

function createJobSearchPlan(rawProfile) {
  const profile = validateProfile(rawProfile);
  const queries = buildBooleanQueries(profile);
  const links = generateSearchLinks(profile, queries);
  const dailyPlan = buildDailyPlan(profile);

  return {
    profile,
    supportedBoards: SUPPORTED_BOARDS,
    queries,
    links,
    dailyPlan,
    generatedAt: new Date().toISOString()
  };
}

module.exports = {
  createJobSearchPlan,
  validateProfile,
  SUPPORTED_BOARDS
};
