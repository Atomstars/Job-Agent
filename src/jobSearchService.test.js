const test = require('node:test');
const assert = require('node:assert/strict');
const { createJobSearchPlan } = require('./jobSearchService');

test('createJobSearchPlan returns queries and links', () => {
  const result = createJobSearchPlan({
    targetRoles: ['Backend Engineer'],
    locations: ['Austin, TX'],
    remoteOnly: true,
    seniority: 'mid',
    salaryMinUsd: 120000,
    keywords: ['Node.js']
  });

  assert.equal(result.queries.length, 1);
  assert.equal(result.links.LinkedIn.length, 1);
  assert.match(result.queries[0], /"Backend Engineer"/);
  assert.ok(result.dailyPlan.length >= 6);
});

test('createJobSearchPlan validates missing roles', () => {
  assert.throws(() => {
    createJobSearchPlan({
      targetRoles: [],
      locations: ['Remote']
    });
  }, /targetRoles must contain at least one non-empty value/);
});
