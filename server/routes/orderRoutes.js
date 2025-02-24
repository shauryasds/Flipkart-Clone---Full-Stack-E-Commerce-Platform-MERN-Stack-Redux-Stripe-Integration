// routes/orderRoutes.js
const express = require('express');
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  cancelOrder,
  checkPaymentStatus,
  stripeWebhook
} = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();


// Regular routes
router.post('/order/new', isAuthenticatedUser, createOrder);
router.get('/order/:id', isAuthenticatedUser, getSingleOrder);
router.get('/orders/me', isAuthenticatedUser, myOrders);
router.post('/order/:id/cancel', isAuthenticatedUser, cancelOrder);
router.get('/payment/status/:orderId', isAuthenticatedUser, checkPaymentStatus);

// Admin routes
router.get('/admin/orders', isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.put('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), updateOrderStatus);
router.delete('/admin/order/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;