const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Create or retrieve user's cart
exports.createCart = catchAsyncErrors(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  
  if (cart) {
    return res.status(200).json({
      success: true,
      cart,
    });
  }

  cart = await Cart.create({
    user: req.user._id,
    items: []
  });

  res.status(201).json({
    success: true,
    cart,
  });
});

// Get user's cart with populated product details
exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    match: { deleted: { $ne: true } } // Exclude deleted products
  });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  // Filter out deleted products
  cart.items = cart.items.filter(item => item.product !== null);
  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});

// Add item to cart
exports.addItemToCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity, options } = req.body;

  if (!productId || !quantity) {
    return next(new ErrorHandler("Product ID and quantity are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product || product.deleted) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (quantity > product.stock) {
    return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && 
    JSON.stringify(item.options) === JSON.stringify(options || {})
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    if (newQuantity > product.stock) {
      return next(new ErrorHandler(`Cannot add more than ${product.stock} items`, 400));
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    cart.items.push({ 
      product: productId, 
      quantity,
      price: product.price,
      options: options || {}
    });
  }

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    cart,
  });
});

// Update item quantity
exports.updateItemQuantity = catchAsyncErrors(async (req, res, next) => {
  const { productId, quantity, options } = req.body;

  if (!productId || quantity === undefined) {
    return next(new ErrorHandler("Product ID and quantity are required", 400));
  }

  const product = await Product.findById(productId);
  if (!product || product.deleted) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId &&
    JSON.stringify(item.options) === JSON.stringify(options || {})
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  if (quantity > product.stock) {
    return next(new ErrorHandler(`Only ${product.stock} items available in stock`, 400));
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    cart,
  });
});

// Remove item from cart
exports.removeItemFromCart = catchAsyncErrors(async (req, res, next) => {
  const { productId, options } = req.body;

  if (!productId) {
    return next(new ErrorHandler("Product ID is required", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId &&
    JSON.stringify(item.options) === JSON.stringify(options || {})
  );

  if (itemIndex === -1) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    success: true,
    cart,
  });
});

// Clear all items from cart
exports.clearCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    cart,
  });
});