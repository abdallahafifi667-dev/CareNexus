import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Bell, Search, User, Menu, Globe, LogOut,
} from "lucide-react";
import { useSelector } from "react-redux";
import { getAvatar } from "../../../utils/imageUtils";
import { useNavigate } from "react-router-dom";
import { NotificationBell, NotificationDropdown } from "../../../shared/components/Notifications/UniversalNotifications";
import axiosInstance from "../../../utils/axiosInstance";
import "./AdminTopBar/AdminTopBar.scss";

const AdminTopBar = ({ isCollapsed, onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axiosInstance.get("/notifications/unread-count");
        setUnreadCount(res.data.unreadCount || 0);
      } catch (err) { console.error(err); }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <header className="admin-topbar">
      <div className="left-section">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="page-title-wrap">
          <h1 className="page-title">{t("admin.admin_dashboard", "Admin Panel")}</h1>
        </div>
      </div>

      <div className="center-section">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder={t("admin.search_everything", "Search everything...")} />
        </div>
      </div>

      <div className="right-section">
        <button className="action-btn" onClick={toggleLanguage} title={t("common.switch_lang")}>
          <Globe size={20} />
          <span className="lang-label">{i18n.language === "ar" ? "EN" : "عربي"}</span>
        </button>

        <div className="notification-wrapper">
          <NotificationBell onClick={() => setShowNotifications(!showNotifications)} count={unreadCount} />
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.username || "Admin"}</span>
            <span className="user-role">Super Admin</span>
          </div>
          <div className="user-avatar">
            {user?.avatar ? <img src={getAvatar(user)} alt="" /> : <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
