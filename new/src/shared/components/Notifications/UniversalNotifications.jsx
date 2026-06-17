import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Bell, CheckCircle, Info, AlertTriangle, AlertCircle,
  Trash2, Search, CheckCircle2, Clock, X, ExternalLink, ArrowRight, Settings, BellRing
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { getRoleRoute } from "../../utils/roleRoutes";
import "./UniversalNotifications.scss";

// ─── Icon Helper ───
const getIconForType = (type) => {
  switch (type) {
    case "success": return <CheckCircle className="notif-icon icon-success" size={18} />;
    case "warning": return <AlertTriangle className="notif-icon icon-warning" size={18} />;
    case "error": return <AlertCircle className="notif-icon icon-error" size={18} />;
    case "order": return <Bell className="notif-icon icon-order" size={18} />;
    case "chat": return <Info className="notif-icon icon-chat" size={18} />;
    case "info":
    default: return <Info className="notif-icon icon-info" size={18} />;
  }
};

// ─── Dropdown Component (for header bell) ───
export function NotificationDropdown({ onClose }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const basePath = getRoleRoute(user?.role);
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const dateLocale = i18n.language === "ar" ? ar : enUS;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/notifications?limit=10");
      const data = res.data;
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id || n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(prev => {
        const filtered = prev.filter(n => n.id !== id && n._id !== id);
        const wasUnread = prev.find(n => (n.id === id || n._id === id) && !n.isRead);
        if (wasUnread) setUnreadCount(c => Math.max(0, c - 1));
        return filtered;
      });
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif.id || notif._id);
    if (notif.link) {
      navigate(notif.link);
      onClose?.();
    }
  };

  return (
    <motion.div 
      ref={dropdownRef}
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
          {unreadCount > 0 && (
            <button className="mark-all-btn settings-btn" onClick={markAllAsRead} title={t("admin.mark_all_read", "Mark all read")}>
              <CheckCircle2 size={16} />
            </button>
          )}
          <button className="settings-btn" onClick={onClose} title={t("common.close", "Close")}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="notification-list">
        {loading ? (
          <div className="loading-state" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="spinner"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Bell size={40} strokeWidth={1.5} />
            </div>
            <p>{t("notifications.no_notifications", "No notifications yet")}</p>
            <span>{t("notifications.no_notifications_desc", "When you have messages or alerts, they will appear here.")}</span>
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id || notif._id}
              className={`notification-item ${!notif.isRead ? "unread" : ""}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="icon-wrapper">
                {getIconForType(notif.type)}
              </div>
              <div className="content">
                <p className="title">{notif.title}</p>
                <p className="message">{notif.message}</p>
                <span className="time">
                  <Clock size={12} style={{marginRight: '4px', verticalAlign: 'middle'}} />
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                    locale: dateLocale
                  })}
                </span>
              </div>
              {!notif.isRead && <div className="unread-dot"></div>}
            </div>
          ))
        )}
      </div>

      <div className="dropdown-footer">
        <button className="view-all-btn" onClick={() => { navigate(`${basePath}/notifications`); onClose?.(); }}>
          <span>{t("notifications.view_all", "View All Notifications")}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Bell Icon Component (for headers) ───
export function NotificationBell({ onClick, count = 0 }) {
  const { t } = useTranslation();
  return (
    <button
      className="action-btn notification-btn"
      onClick={onClick}
      title={t("admin.notifications", "Notifications")}
    >
      <Bell size={20} />
      {count > 0 && <span className="badge">{count > 99 ? "99+" : count}</span>}
    </button>
  );
}

// ─── Full Page Component ───
export default function UniversalNotificationsPage() {
  const { t, i18n } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [unreadCount, setUnreadCount] = useState(0);
  const dateLocale = i18n.language === "ar" ? ar : enUS;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/notifications?page=${page}&limit=20${activeTab === "unread" ? "&isRead=false" : ""}`);
      const data = res.data;
      setNotifications(data.notifications || []);
      setTotalPages(data.totalPages || 1);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [page, activeTab]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.patch("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    if (!window.confirm(t("admin.confirm_delete_notifications", "Are you sure you want to clear all notifications?"))) return;
    try {
      await axiosInstance.delete("/notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const filteredNotifications = notifications.filter(n =>
    n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="universal-notifications-page">
      <div className="notifications-header">
        <div className="header-content">
          <div className="title-area">
            <Bell size={24} />
            <div>
              <h1>{t("admin.notifications", "Notifications")}</h1>
              <p>{t("admin.notifications_desc", "Stay updated with your latest alerts and activity.")}</p>
            </div>
          </div>
          <div className="header-actions">
            {unreadCount > 0 && (
              <button className="btn-secondary" onClick={markAllAsRead}>
                <CheckCircle2 size={18} />
                <span>{t("admin.mark_all_read", "Mark all read")}</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button className="btn-danger" onClick={clearAll}>
                <Trash2 size={18} />
                <span>{t("admin.clear_all", "Clear all")}</span>
              </button>
            )}
          </div>
        </div>

        <div className="filters-bar">
          <div className="tabs">
            <button className={`tab ${activeTab === "all" ? "active" : ""}`} onClick={() => { setActiveTab("all"); setPage(1); }}>
              {t("common.all", "All")}
            </button>
            <button className={`tab ${activeTab === "unread" ? "active" : ""}`} onClick={() => { setActiveTab("unread"); setPage(1); }}>
              {t("admin.unread", "Unread")}
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
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
          <div className="loader-container"><div className="spinner"></div></div>
        ) : filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id || notif._id}
                className={`notification-card ${!notif.isRead ? "unread" : ""}`}
                onClick={() => !notif.isRead && markAsRead(notif.id || notif._id)}
              >
                <div className="notif-icon">{getIconForType(notif.type)}</div>
                <div className="notif-content">
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <div className="notif-meta">
                    <Clock size={14} />
                    <span>{formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: dateLocale })}</span>
                  </div>
                </div>
                <div className="notif-actions">
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id || notif._id); }} title={t("common.delete", "Delete")}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p} className={page === p ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <Bell size={48} />
            <h3>{t("admin.no_notifications", "No notifications")}</h3>
            <p>{t("admin.no_notifications_desc", "You're all caught up! No new activity.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
