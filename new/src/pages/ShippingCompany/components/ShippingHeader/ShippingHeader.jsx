import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Globe, User, Menu, Truck } from "lucide-react";
import { getRoleBasePath } from "../../../../shared/utils/roleRoutes";
import { NotificationBell, NotificationDropdown } from "../../../../shared/components/Notifications/UniversalNotifications";
import axiosInstance from "../../../../utils/axiosInstance";
import "./ShippingHeader.scss";

const ShippingHeader = ({ title, onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { currentTitle } = useSelector((state) => state.shipping);
  const displayTitle = currentTitle || title || t("nav.dashboard", { defaultValue: "Dashboard" });
  const basePath = getRoleBasePath(user?.role);

  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
      navigate(`${basePath}/orders?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (displayTitle) document.title = `${displayTitle} | Shipping`;
  }, [displayTitle]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <header className="shipping-header">
      <div className="left-section">
        <button className="mobile-menu-btn" onClick={onMenuClick}><Menu size={24} /></button>
        <div className="page-title-wrap">
          {/* <span className="page-icon"><Truck size={20} /></span> */}
          <h2 className="page-title">{displayTitle}</h2>
        </div>
      </div>

      <div className="center-section">
        <div className="search-bar">
          <Search size={18} onClick={handleSearch} />
          <input type="text" placeholder={t("common.search", { defaultValue: "Search orders..." })} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} />
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
            <span className="user-name">{user?.username || "Shipping Co"}</span>
            <span className="user-role">{t("auth.role_shipping", { defaultValue: "Delivery" })}</span>
          </div>
          <div className="user-avatar">
            {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <User size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ShippingHeader;
