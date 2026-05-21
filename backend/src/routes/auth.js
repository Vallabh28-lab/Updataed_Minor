const express = require('express');
const { registerUser, login } = require('../controllers/authController');

const router = express.Router();

// Use the controller functions
router.post('/signup', registerUser);
router.post('/login', login);

// Health check endpoint
router.get('/ping', (req, res) => {
  res.json({
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;