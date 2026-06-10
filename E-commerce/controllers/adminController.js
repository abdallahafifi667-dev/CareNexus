const asyncHandler = require('express-async-handler');
const cloudinary = require('../../config/cloudinary');
const prisma = require('../../config/prisma');

const admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Helper: update product rating
async function updateProductRating(productId) {
  const reviews = await prisma.review.findMany({
    where: { targetId: productId, targetType: 'product' }
  });
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = reviews.length > 0 ? total / reviews.length : 0;
  await prisma.product.update({
    where: { id: productId },
    data: { avgRating: avg, totalRatings: reviews.length }
  });
}

// 1. User Management
exports.getAllUsers = [admin, asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, username: true, email: true, role: true,
      phone: true, avatar: true, country: true, createdAt: true
    }
  });
  res.status(200).json(users.map(u => ({ ...u, _id: u.id })));
})];

exports.deleteUser = [admin, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });

  await prisma.user.delete({ where: { id: userId } });
  res.status(200).json({ message: 'User deleted successfully' });
})];

// 2. Product Management
exports.deleteProduct = [admin, asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ message: 'Product not found' });

  // Delete from Cloudinary
  const deletePromises = (product.imageUrl || []).map(url => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = `users/${product.merchantId}/products`;
    return cloudinary.uploader.destroy(`${folder}/${filename}`);
  });
  await Promise.all(deletePromises);

  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(200).json({ message: 'Product deleted successfully' });
})];

// 3. Order Management
exports.getAllOrders = [admin, asyncHandler(async (req, res) => {
  const orders = await prisma.ecommerceOrder.findMany({
    include: {
      user: { select: { id: true, username: true, email: true } },
      ShippingCompany: { select: { id: true, username: true, email: true } },
      items: { include: { product: { select: { id: true, name: true, price: true } } } }
    }
  });
  res.status(200).json(orders.map(o => ({ ...o, _id: o.id })));
})];

exports.updateOrderStatus = [admin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await prisma.ecommerceOrder.update({
    where: { id: req.params.id },
    data: { orderStatus: status }
  });

  res.status(200).json({ ...order, _id: order.id });
})];

// 6. User Status Management
exports.suspendUser = [admin, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  await prisma.user.update({ where: { id: userId }, data: { emailVerified: false } });
  res.status(200).json({ message: 'User suspended successfully' });
})];

exports.activateUser = [admin, asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
  res.status(200).json({ message: 'User activated successfully' });
})];

// 4. Review Management
exports.deleteReview = [admin, asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ message: 'Review not found' });

  await prisma.review.delete({ where: { id: req.params.id } });
  await updateProductRating(review.targetId);

  res.status(200).json({ message: 'Review deleted successfully' });
})];

// 5. Category Management
exports.updateCategory = [admin, asyncHandler(async (req, res) => {
  const { text, type } = req.body;
  const updateData = {};
  if (text) updateData.text = text;
  if (type) updateData.type = type;

  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: updateData
  });

  res.status(200).json({ ...category, _id: category.id });
})];