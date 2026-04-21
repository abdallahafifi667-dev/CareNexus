const asyncHandler = require("express-async-handler");
const prisma = require("../../config/prisma");

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json(notifications);
});

/**
 * @desc    Mark notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user._id;

  const notification = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notification || notification.userId !== userId) {
    return res.status(404).json({ error: "Notification not found" });
  }

  const updatedNotification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.status(200).json(updatedNotification);
});

/**
 * @desc    Delete all notifications
 * @route   DELETE /api/notifications
 * @access  Private
 */
exports.deleteAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  await prisma.notification.deleteMany({
    where: { userId },
  });

  res.status(200).json({ message: "All notifications deleted" });
});
