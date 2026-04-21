const router = require("express").Router();
const {
  getNotifications,
  markAsRead,
  deleteAllNotifications,
} = require("../controllers/notificationController");
const { verifyToken } = require("../../middlewares/verifytoken");

router.get("/", verifyToken, getNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.delete("/", verifyToken, deleteAllNotifications);

module.exports = router;
