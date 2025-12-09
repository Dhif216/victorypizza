const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes - with rate limiting
router.post('/login', (req, res, next) => {
  const authLimiter = req.app.get('authLimiter');
  if (authLimiter) {
    authLimiter(req, res, () => {
      authController.login(req, res);
    });
  } else {
    authController.login(req, res);
  }
});

// Protected routes
router.post('/register', auth, authController.register); // Only authenticated users can create new users
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);
router.patch('/password', auth, authController.updatePassword);
router.patch('/email', auth, authController.updateEmail);

module.exports = router;
