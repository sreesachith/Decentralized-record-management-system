const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); 
// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);
router.get('/profile', authMiddleware, (req, res) => {
    // Access the authenticated user's info from req.user
    res.json({ message: 'This is your profile', user: req.user });
  });

module.exports = router;


