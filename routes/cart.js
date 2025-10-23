const express = require('express');
const router = express.Router();

const CartController = require('../app/controller/cart.controller');
const CartValidator = require('../app/validator/cart.validator');
const AuthMiddleware = require('../middleware/auth.middleware');

router.use('/cart', AuthMiddleware);
router.get('/cart', CartController.viewCart);
router.post('/cart', CartValidator.setItem, CartController.addItem);
router.put('/cart/items/:productId', CartValidator.updateItem, CartController.updateItem);
router.delete('/cart/items/:productId', CartValidator.itemParam, CartController.removeItem);
router.delete('/cart', CartController.clearCart);


module.exports = router;