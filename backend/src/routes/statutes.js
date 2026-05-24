const express = require('express');
const router = express.Router();
const statutes = require('../data/legal_statutes.json');

// GET /api/statutes — return all statutes grouped by category
router.get('/', (req, res) => {
  const grouped = {};
  for (const item of statutes) {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push({ offense: item.offense, ipc: item.ipc, bns: item.bns });
  }
  res.json({ success: true, data: grouped });
});

// GET /api/statutes/search?q=murder — search by offense keyword
router.get('/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json({ success: true, data: [] });
  const results = statutes.filter(s =>
    s.offense.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    (s.description && s.description.toLowerCase().includes(q))
  );
  res.json({ success: true, data: results });
});

module.exports = router;
