const express = require('express');
const router = express.Router();

const { update, remove, image} = require('../controllers/usersController')
const { checkToken, adminNotAutoDestroy} = require('../middlewares')

router
    .patch('/', checkToken, update)
    .delete('/:id?', checkToken, adminNotAutoDestroy, remove)
    .get('/image/:img', image)

module.exports = router