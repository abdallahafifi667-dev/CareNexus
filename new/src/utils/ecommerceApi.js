import axiosInstance from "./axiosInstance";

const ecommerceApi = {
  // ─────────────── Product (User/Doctor) ───────────────
  getProducts: (params) => axiosInstance.get("/product-user", { params }),
  getProductById: (id) => axiosInstance.get(`/product-user/${id}`),
  getProductReviews: (id) => axiosInstance.get(`/product-user/${id}/reviews`),
  getCategories: () => axiosInstance.get("/categories/all"),

  // ─────────────── Pharmacy (Merchant) Products ───────────────
  getPharmacyProducts: () => axiosInstance.get("/product-merchant/get"),
  addProduct: (formData) =>
    axiosInstance.post("/product-merchant/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateProduct: (id, data) =>
    axiosInstance.put(`/product-merchant/update/${id}`, data),
  deleteProduct: (id) =>
    axiosInstance.delete(`/product-merchant/delete/${id}`),

  // ─────────────── Cart ───────────────
  getCartItems: () => axiosInstance.get("/orders/cart-items"),
  addToCart: (data) => axiosInstance.post("/orders/add-to-cart", data),
  removeFromCart: (id) =>
    axiosInstance.delete(`/orders/remove-from-cart/${id}`),

  // ─────────────── Checkout & User Orders ───────────────
  checkout: (data) => axiosInstance.post("/orders/checkout", data),
  getAllOrders: () => axiosInstance.get("/orders/all-orders"),
  cancelOrder: (id) => axiosInstance.post(`/orders/cancel-order/${id}`),
  trackOrder: (id) => axiosInstance.get(`/orders/track/${id}`),

  // ─────────────── Pharmacy Order Management ───────────────
  getPharmacyOrders: (status) =>
    axiosInstance.get("/orders/pharmacy-orders", { params: { status } }),
  markOrderReady: (id) => axiosInstance.put(`/orders/mark-ready/${id}`),

  // ─────────────── Shipping Company ───────────────
  getShippedOrders: () => axiosInstance.get("/orders/shipped"),
  markOrderPickedUp: (id) => axiosInstance.put(`/orders/mark-picked-up/${id}`),
  markOrderDelivered: (id) => axiosInstance.put(`/orders/mark-delivered/${id}`),
  getCompletedDeliveries: () => axiosInstance.get("/orders/completed-deliveries"),

  // ─────────────── Contracts ───────────────
  sendContractInvite: (data) => axiosInstance.post("/contracts/invite", data),
  respondContract: (id, action) =>
    axiosInstance.put(`/contracts/respond/${id}`, { action }),
  getMyContracts: () => axiosInstance.get("/contracts/my-contracts"),

  // ─────────────── Reviews ───────────────
  addReview: (data) => axiosInstance.post("/review/add", data),
  updateReview: (id, data) => axiosInstance.put(`/review/update/${id}`, data),
  deleteReview: (id) => axiosInstance.delete(`/review/delete/${id}`),
};

export default ecommerceApi;
