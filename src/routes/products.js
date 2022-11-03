const express = require('express');
const router = express.Router();

const { uploadImageProduct, checkToken, checkRol } = require("../middlewares");
const { store, detail, update, destroy, all, image} = require('../controllers/productsController')

router
    .get('/', all)
    .get('/:id', detail)
    .post('/',uploadImageProduct.array('images') ,checkToken,checkRol,store)
    .patch('/:id', uploadImageProduct.array('images'), checkToken, checkRol, update)
    .delete('/:id', checkToken, checkRol, destroy)
    .get('/image/:img', image)

module.exports = router;    