const express = require('express');
const router = express.Router();

const { update, remove, image} = require('../controllers/userController')
const { checkToken, adminNotAutoDestroy} = require('../middlewares')

router
    .patch('/', checkToken, update)
    .delete('/:id?', checkToken, adminNotAutoDestroy, remove)
    .get('/image/:img', image)

module.exports = router