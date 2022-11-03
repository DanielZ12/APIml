const express = require('express');
const router = express.Router();

// Middleware requie
const {registerImageAvatar, checkToken} = require('../middlewares/authController');

// Controller require
const {register, login, getUserAuthenticated} = require('../controllers/authController')

router
    .post('/register', register)
    .post('/login', login)
    .get('/me/:token?', checkToken, getUserAuthenticated)

module.exports = router;    