const express = require('express');
const router = express.Router();

// Dummy login handler for demonstration
router.post('/login', (req, res) => {
  // In a real app, you'd check req.body for credentials
  // and return a JWT or error
  res.json({ success: true, message: 'Login successful (demo)' });
});

module.exports = router;
