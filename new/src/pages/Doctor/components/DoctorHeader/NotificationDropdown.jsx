import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Bell, Check, Trash2, ExternalLink } from "lucide-react";
import { markNotificationAsRead, deleteAllNotifications } from "../../stores/doctorSlice";
import "./NotificationDropdown.scss";

const NotificationDropdown = ({ notifications, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      dispatch(deleteAllNotifications());
    }
  };

  return (
    <div className="notification-dropdown" onClick={(e) => e.stopPropagation()}>
      <div className="dropdown-header">
        <h3>Notifications</h3>
        {notifications.length > 0 && (
          <button className="clear-btn" onClick={handleClearAll}>
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <Bell size={40} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
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
        <button onClick={() => { navigate("/doctor/settings"); onClose(); }}>
          Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
