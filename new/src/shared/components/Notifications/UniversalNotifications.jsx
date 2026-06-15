import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle, Info, AlertTriangle, AlertCircle,
  Trash2, Search, CheckCircle2, Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import axiosInstance from "../../../utils/axiosInstance";
import Loader from "../../components/loader/Loader";
import Seo from "../../components/SEO/SEO";
import "./UniversalNotifications.scss";

const getIconForType = (type) => {
  switch (type) {
    case "success": return <CheckCircle className="icon-success" size={20} />;
    case "warning": return <AlertTriangle className="icon-warning" size={20} />;
    case "error": return <AlertCircle className="icon-error" size={20} />;
    case "info":
    default:
      return <Info className="icon-info" size={20} />;
  }
};

const UniversalNotifications = () => {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const dateLocale = i18n.language === "ar" ? ar : enUS;

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/notifications");
      setNotifications(res.data.notifications || res.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/mark-all-read");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const clearAll = async () => {
    if (!window.confirm(t("admin.confirm_delete_notifications", "Are you sure?"))) return;
    try {
      await axiosInstance.delete("/notifications/clear-all");
      setNotifications([]);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  const filteredNotifications = notifications
    .filter(n => {
      if (activeTab === "unread") return !n.isRead;
      return true;
    })
    .filter(n =>
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="universal-notifications premium-ui">
      <Seo title={t("admin.notifications", "Notifications")} />

      <div className="notifications-header">
        <div className="header-content">
          <div className="title-area">
            <div className="icon-box">
              <Bell size={24} />
            </div>
            <div>
              <h1>{t("admin.notifications", "Notifications")}</h1>
              <p>{t("admin.notifications_desc", "Stay updated with your latest alerts and activity.")}</p>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn-secondary" onClick={markAllAsRead}>
              <CheckCircle2 size={18} />
              <span>{t("admin.mark_all_read", "Mark all read")}</span>
            </button>
            <button className="btn-danger" onClick={clearAll}>
              <Trash2 size={18} />
              <span>{t("admin.clear_all", "Clear all")}</span>
            </button>
          </div>
        </div>

        <div className="filters-bar">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              {t("shipping.all", "All")}
            </button>
            <button 
              className={`tab ${activeTab === "unread" ? "active" : ""}`}
              onClick={() => setActiveTab("unread")}
            >
              {t("admin.unread", "Unread")}
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="badge">{notifications.filter(n => !n.isRead).length}</span>
              )}
            </button>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder={t("admin.search_content", "Search...")} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="loader-container">
            <Loader loading={true} />
          </div>
        ) : filteredNotifications.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="list-wrapper"
          >
            <AnimatePresence>
              {filteredNotifications.map((notif) => (
                <motion.div 
                  key={notif._id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`notification-card ${!notif.isRead ? "unread" : ""}`}
                  onClick={() => !notif.isRead && markAsRead(notif._id)}
                >
                  <div className="notif-icon">
                    {getIconForType(notif.type)}
                  </div>
                  
                  <div className="notif-content">
                    <h3 className="notif-title">{notif.title}</h3>
                    <p className="notif-message">{notif.message}</p>
                    <div className="notif-meta">
                      <Clock size={14} />
                      <span>
                        {formatDistanceToNow(new Date(notif.createdAt), { 
                          addSuffix: true, 
                          locale: dateLocale 
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="notif-actions">
                    <button 
                      className="delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      title={t("admin.delete", "Delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Bell size={48} />
            </div>
            <h3>{t("admin.no_notifications", "No notifications")}</h3>
            <p>{t("admin.no_notifications_desc", "You're all caught up! No new activity.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalNotifications;
