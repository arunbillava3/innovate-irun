const express = require('express');
const router = express.Router();

// Get all users
router.get('/', (req, res) => {
  res.json({ message: 'Get all users' });
});

// Get user by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get user with ID: ${req.params.id}` });
});

// Create new user
router.post('/', (req, res) => {
  res.json({ message: 'Create new user', data: req.body });
});

module.exports = router;