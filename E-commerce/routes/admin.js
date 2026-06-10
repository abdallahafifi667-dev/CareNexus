var express = require('express');
var router = express.Router();
const { verifyTokenAndAdmin } = require('../../middlewares/verifytoken');
const {
  deleteProduct, deleteReview, deleteUser, getAllOrders, getAllUsers,
  updateCategory, updateOrderStatus, suspendUser, activateUser
} = require("../controllers/adminController");

// User Management
router.get('/all-users', verifyTokenAndAdmin, getAllUsers);
router.delete('/delete-user/:id', verifyTokenAndAdmin, deleteUser);
router.patch('/users/:id/suspend', verifyTokenAndAdmin, suspendUser);
router.patch('/users/:id/activate', verifyTokenAndAdmin, activateUser);

// Product Management
router.delete('/delete-product/:id', verifyTokenAndAdmin, deleteProduct);

// Order Management
router.get('/all-orders', verifyTokenAndAdmin, getAllOrders);
router.put('/update-order-status/:id', verifyTokenAndAdmin, updateOrderStatus);

// Review Management
router.delete('/delete-review/:id', verifyTokenAndAdmin, deleteReview);

// Category Management
router.put('/update-category/:id', verifyTokenAndAdmin, updateCategory);

module.exports = router;
