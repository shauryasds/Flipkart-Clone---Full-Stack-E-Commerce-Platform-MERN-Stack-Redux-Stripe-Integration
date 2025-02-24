const express = require('express');
const router = express.Router();
const {
  createCart,
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} = require('../controllers/cartController');
const { isAuthenticatedUser } = require('../middleware/auth');

// Create new cart
router.post('/cart', isAuthenticatedUser, createCart);

// Get user's cart
router.get('/cart', isAuthenticatedUser, getCart);

// Add item to cart
router.post('/cart/items', isAuthenticatedUser, addItemToCart);

// Update item quantity
router.put('/cart/items', isAuthenticatedUser, updateItemQuantity);

// Remove item from cart
router.delete('/cart/items', isAuthenticatedUser, removeItemFromCart);

// Clear entire cart
router.delete('/cart', isAuthenticatedUser, clearCart);

module.exports = router;