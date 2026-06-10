import axiosInstance from "./axiosInstance";

const ecommerceApi = {
  // ─────────────── Product (User/Doctor) ───────────────
  getProducts: (params) => axiosInstance.get("/product-user", { params }),
  getProductById: (id) => axiosInstance.get(`/product-user/${id}`),
  getProductReviews: (id) => axiosInstance.get(`/product-user/${id}/reviews`),
  getCategories: () => axiosInstance.get("/categories/all?type=ecommerce"),

  // ─────────────── Pharmacy (Merchant) Products ───────────────
  getPharmacyProducts: () => axiosInstance.get("/product-merchant/get").then(res => res.data),
  addProduct: (formData) =>
    axiosInstance.post("/product-merchant/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(res => res.data),
  updateProduct: (id, data) =>
    axiosInstance.put(`/product-merchant/update/${id}`, data).then(res => res.data),
  deleteProduct: (id) =>
    axiosInstance.delete(`/product-merchant/delete/${id}`).then(res => res.data),

  // ─────────────── Cart ───────────────
  getCartItems: () => axiosInstance.get("/orders/cart-items").then(res => res.data),
  addToCart: (data) => axiosInstance.post("/orders/add-to-cart", data).then(res => res.data),
  removeFromCart: (id) =>
    axiosInstance.delete(`/orders/remove-from-cart/${id}`).then(res => res.data),

  // ─────────────── Checkout & User Orders ───────────────
  checkout: (data) => axiosInstance.post("/orders/checkout", data).then(res => res.data),
  getAllOrders: () => axiosInstance.get("/orders/all-orders").then(res => res.data),
  cancelOrder: (id) => axiosInstance.post(`/orders/cancel-order/${id}`).then(res => res.data),
  trackOrder: (id) => axiosInstance.get(`/orders/track/${id}`).then(res => res.data),

  // ─────────────── Pharmacy Order Management ───────────────
  getPharmacyOrders: (status) =>
    axiosInstance.get("/orders/pharmacy-orders", { params: { status } }).then(res => res.data),
  markOrderReady: (id) => axiosInstance.put(`/orders/mark-ready/${id}`).then(res => res.data),

  // ─────────────── Shipping Company ───────────────
  getShippedOrders: () => axiosInstance.get("/orders/shipped").then(res => res.data),
  markOrderPickedUp: (id) => axiosInstance.put(`/orders/mark-picked-up/${id}`).then(res => res.data),
  markOrderDelivered: (id) => axiosInstance.put(`/orders/mark-delivered/${id}`).then(res => res.data),
  getCompletedDeliveries: () => axiosInstance.get("/orders/completed-deliveries").then(res => res.data),

  // ─────────────── Contracts ───────────────
  sendContractInvite: (data) => axiosInstance.post("/contracts/invite", data).then(res => res.data),
  respondContract: (id, action) =>
    axiosInstance.put(`/contracts/respond/${id}`, { action }).then(res => res.data),
  getMyContracts: () => axiosInstance.get("/contracts/my-contracts").then(res => res.data),

  // ─────────────── Reviews (Products) ───────────────
  getReviews: (productId) => axiosInstance.get(`/product-user/${productId}/reviews`).then(res => res.data),
  addReview: (data) => axiosInstance.post(`/product-user/review`, data).then(res => res.data),
  updateReview: (id, data) => axiosInstance.put(`/product-user/review/${id}`, data).then(res => res.data),
  deleteReview: (id) => axiosInstance.delete(`/product-user/review/${id}`).then(res => res.data),
  addProductReview: (data) => axiosInstance.post("/review/add", data).then(res => res.data),
  updateProductReview: (id, data) => axiosInstance.put(`/review/update/${id}`, data).then(res => res.data),
  deleteProductReview: (id) => axiosInstance.delete(`/review/delete/${id}`).then(res => res.data),
};

export default ecommerceApi;
