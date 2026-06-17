import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Bell, Trash2, ArrowRight, Settings, BellRing } from "lucide-react";
import { markNotificationAsRead, deleteAllNotifications } from "../../stores/doctorSlice";
import { getRoleBasePath } from "../../../../shared/utils/roleRoutes";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import "./NotificationDropdown.scss";

const NotificationDropdown = ({ notifications = [], onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const basePath = getRoleBasePath(user?.role);
  const { t } = useTranslation();

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
    if (notification.link) {
      navigate(notification.link);
      onClose();
    }
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    if (window.confirm(t("notifications.clear_confirm", "Are you sure you want to clear all notifications?"))) {
      dispatch(deleteAllNotifications());
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="notification-dropdown-premium" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="dropdown-header">
        <div className="header-title">
          <div className="icon-wrap">
            <BellRing size={18} />
            {unreadCount > 0 && <span className="pulse-dot"></span>}
          </div>
          <h3>{t("nav.notifications", "Notifications")}</h3>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
        
        <div className="header-actions">
          {notifications.length > 0 && (
            <button className="clear-btn" onClick={handleClearAll} title={t("notifications.clear_all", "Clear All")}>
              <Trash2 size={16} />
            </button>
          )}
          <button className="settings-btn" onClick={() => { navigate(`/${basePath}/settings`); onClose(); }} title={t("nav.settings", "Settings")}>
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Bell size={40} strokeWidth={1.5} />
            </div>
            <p>{t("notifications.no_notifications", "No notifications yet")}</p>
            <span>{t("notifications.no_notifications_desc", "When you have messages or alerts, they will appear here.")}</span>
          </div>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? "unread" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="icon-wrapper">
                {notification.type === "order" ? "📦" : "🔔"}
              </div>
              <div className="content">
                <p className="title">{notification.title}</p>
                <p className="message">{notification.message}</p>
                <span className="time">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {!notification.isRead && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>

      <div className="dropdown-footer">
        <button className="view-all-btn" onClick={() => { navigate(`/${basePath}/notifications`); onClose(); }}>
          <span>{t("notifications.view_all", "View All Notifications")}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationDropdown;
