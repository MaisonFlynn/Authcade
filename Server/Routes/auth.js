const express = require('express');
const { register, verifyEmail, login, existence, logout, verifyToken, profile } = require('../Controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/verify', verifyEmail);
router.post('/login', login);
router.post('/exists', existence);
router.post('/logout', logout);
router.post('/token', verifyToken);
router.get('/profile', profile);

module.exports = router;
