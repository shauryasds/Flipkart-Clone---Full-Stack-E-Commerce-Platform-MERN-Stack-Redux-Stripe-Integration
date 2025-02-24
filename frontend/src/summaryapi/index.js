const backendUrl = "http://localhost:4000";

const api = {
  // User-related endpoints
  signup: {
    url: `${backendUrl}/api/signup`,
    method: "post",
  },
  login: {
    url: `${backendUrl}/api/login`,
    method: "post",
  },
  logout: {
    url: `${backendUrl}/api/logout`,
    method: "get",
  },
  checkAuth: {
    url: `${backendUrl}/api/me`,
    method: "post",
  },
  forgotPassword: {
    url: `${backendUrl}/api/forgotpassword`,
    method: "put",
  },
  updateProfile: {
    url: `${backendUrl}/api/me/update`,
    method: "put",
  },
  updatePassword: {
    url: `${backendUrl}/api/password/update`,
    method: "put",
  },
  resetPassword: {
    url: `${backendUrl}/api/password/reset`,
    method: "put",
  },

  // Product-related endpoints
  getAllProducts: {
    url: `${backendUrl}/api/products`,
    method: "get",
  },
  getProductById: {
    url: `${backendUrl}/api/product`,
    method: "get",
  },
  getAdminAllProducts: {
    url: `${backendUrl}/api/admin/products`,
    method: "get",
  },
  searchProducts: {
    url: `${backendUrl}/api/searchproducts`,
    method: "get",
  },
  categorywiseproducts: {
    url: `${backendUrl}/api/categorywiseproducts`,
    method: "get",
  },
  createProduct: {
    url: `${backendUrl}/api/admin/product/new`,
    method: "post",
  },
  updateProduct: {
    url: `${backendUrl}/api/admin/product`,
    method: "put",
  },
  deleteProduct: {
    url: `${backendUrl}/api/admin/product`,
    method: "delete",
  },

  // Order-related endpoints
  getAllOrders: {
    url: `${backendUrl}/api/admin/orders`,
    method: "get",
  },
  getSingleOrder: {
    url: `${backendUrl}/api/order`,
    method: "get",
  },
  myOrders: {
    url: `${backendUrl}/api/orders/me`,
    method: "get",
  },
  createOrder: {
    url: `${backendUrl}/api/order/new`,
    method: "post",
  },
  updateOrder: {
    url: `${backendUrl}/api/admin/order`,
    method: "put",
  },
  deleteOrder: {
    url: `${backendUrl}/api/admin/order`,
    method: "delete",
  },
  cancelOrder: {
    url: `${backendUrl}/api/order`,
    method: "post",  // Added /cancel will be handled in thunk
  },
  checkPaymentStatus: {
    url: `${backendUrl}/api/payment/status`,
    method: "get",
  },

  
  stripeWebhook: {
    url: `${backendUrl}/api/webhook`,
    method: "post",
  },

  // Review endpoints
  addReview: {
    url: `${backendUrl}/api/review`,
    method: "put",
  },
  deleteReview: {
    url: `${backendUrl}/api/reviews`,
    method: "delete",
  },

  // Cart endpoints
  getCart: {
    url: `${backendUrl}/api/cart`,
    method: "get",
  },
  addItemToCart: {
    url: `${backendUrl}/api/cart/items`,
    method: "post",
  },
  updateItemQuantity: {
    url: `${backendUrl}/api/cart/items`,
    method: "put",
  },
  removeItemFromCart: {
    url: `${backendUrl}/api/cart/items`,
    method: "delete",
  },
  clearCart: {
    url: `${backendUrl}/api/cart`,
    method: "delete",
  },
  getCartSummary: {
    url: `${backendUrl}/api/cart/summary`,
    method: "get",
  },
};

export default api;