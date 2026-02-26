const express = require('express');
const router = express.Router();

const LoginController = require('../controllers/login');

// login via query parameters (GET)
router.get('/login', LoginController.login);

module.exports = router;