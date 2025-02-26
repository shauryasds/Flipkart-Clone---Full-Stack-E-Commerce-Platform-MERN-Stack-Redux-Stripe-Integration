const Order = require('../models/orderModel');
const ErrorHander = require('../utils/errorHandler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

// Create Stripe Checkout Session
const createStripeCheckoutSession = async (order) => {
  try {
    const lineItems = order.orderItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-verification/${order._id}`,
  cancel_url: `${process.env.FRONTEND_URL}/payment-verification/${order._id}`,
  metadata: { orderId: order._id.toString() },
    });

    return session;
  } catch (error) {
    throw new ErrorHander('Error creating Stripe session', 500);
  }
};

// Create New Order
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingInfo, orderItems, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    shippingInfo,
    orderItems,
    paymentInfo: {
      id: 'temp_payment_id',
      status: 'pending',
      method: paymentMethod,
    },
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

    const session = await createStripeCheckoutSession(order);
    order.paymentInfo.id = session.id;
    await order.save();
    
    return res.status(201).json({
      success: true,
      order,
      paymentUrl: session.url
    });
  

  
});

// Handle Stripe Webhook
exports.stripeWebhook = asyncHandler(async (req, res) => {
  console.log("in stripe webhook")
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const order = await Order.findById(session.metadata.orderId);

    if (order && order.paymentInfo.status === 'pending') {
      order.paymentInfo.status = 'paid';
      order.paidAt = Date.now();
      await order.save();
    }
  }

  res.status(200).json({ received: true });
});

// Check Payment Status
exports.checkPaymentStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new ErrorHander('Order not found', 404));

  // Authorization check
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHander('Not authorized to access this order', 403));
  }

  const session = await stripe.checkout.sessions.retrieve(order.paymentInfo.id);
  order.paymentInfo.status = session.payment_status;
  await order.save();

  res.status(200).json({
    success: true,
    status: order.paymentInfo.status
  });
});

// Update Order Status (Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHander('Order not found', 404));

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHander('Order already delivered', 400));
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.status(200).json({ success: true, order });
});

// Cancel Order
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHander('Order not found', 404));

  // Authorization check
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHander('Not authorized to cancel this order', 403));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHander('Cannot cancel delivered order', 400));
  }

  order.orderStatus = 'Cancelled';
  await order.save();
  res.status(200).json({ success: true, order });
});

// Get Single Order
exports.getSingleOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return next(new ErrorHander('Order not found', 404));

  // Authorization check
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHander('Not authorized to access this order', 403));
  }

  res.status(200).json({ success: true, order });
});
// Get Logged-in User Orders
exports.myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({ success: true, orders });
});

// Get All Orders (Admin)
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  const totalAmount = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  
  res.status(200).json({
    success: true,
    count: orders.length,
    totalAmount,
    orders
  });
});

// Delete Order (Admin)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHander('Order not found', 404));

  await order.remove();
  res.status(200).json({ success: true, message: 'Order removed' });
});