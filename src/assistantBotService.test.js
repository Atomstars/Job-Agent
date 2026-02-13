const test = require('node:test');
const assert = require('node:assert/strict');
const { createBotReply } = require('./assistantBotService');

test('createBotReply returns opportunities with links', () => {
  const result = createBotReply({
    targetRoles: ['Backend Engineer'],
    locations: ['Austin, TX'],
    remoteOnly: true,
    companyWatchlist: ['Stripe', 'Shopify'],
    maxOpportunities: 8
  });

  assert.equal(result.opportunities.length, 2);
  assert.equal(result.opportunities[0].company, 'Stripe');
  assert.ok(result.opportunities[0].links.linkedin.includes('linkedin.com/jobs/search'));
  assert.ok(result.summary.includes('opportunities'));
});
