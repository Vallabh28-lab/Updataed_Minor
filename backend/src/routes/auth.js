const express = require('express');
const { registerUser, login, forgotPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

// Health check endpoint
router.get('/ping', (req, res) => {
  res.json({
    message: 'Auth service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;