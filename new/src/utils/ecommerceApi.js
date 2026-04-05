import axiosInstance from "./axiosInstance";

const ecommerceApi = {
  // Product Methods
  getProducts: (params) => axiosInstance.get("/product-user", { params }),
  getProductById: (id) => axiosInstance.get(`/product-user/${id}`),
  getProductReviews: (id) => axiosInstance.get(`/product-user/${id}/reviews`),

  // Cart Methods
  getCartItems: () => axiosInstance.get("/orders/cart-items"),
  addToCart: (data) => axiosInstance.post("/orders/add-to-cart", data),
  removeFromCart: (id) =>
    axiosInstance.delete(`/orders/remove-from-cart/${id}`),

  // Checkout & Orders
  checkout: (data) => axiosInstance.post("/orders/checkout", data),
  getAllOrders: () => axiosInstance.get("/orders/all-orders"),
  cancelOrder: (id) => axiosInstance.post(`/orders/cancel-order/${id}`),

  // Review Methods
  addReview: (data) => axiosInstance.post("/review/add", data),
  updateReview: (id, data) => axiosInstance.put(`/review/update/${id}`, data),
  deleteReview: (id) => axiosInstance.delete(`/review/delete/${id}`),

  // Category Methods
  getCategories: () => axiosInstance.get("/categories/all"),
};

export default ecommerceApi;
