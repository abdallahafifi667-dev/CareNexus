import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Search,
  Globe,
  User,
  Menu,
  Plus,
  ShoppingCart,
} from "lucide-react";
import CreatePostModal from "../../../../shared/components/CreatePostModal/CreatePostModal";
import CartDrawer from "../../../../shared/components/Ecommerce/CartDrawer";
import { getRoleRoute } from "../../../../shared/utils/roleRoutes";
import { NotificationBell, NotificationDropdown } from "../../../../shared/components/Notifications/UniversalNotifications";
import axiosInstance from "../../../../utils/axiosInstance";

import "./DoctorHeader.scss";

const DoctorHeader = ({ title, onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { currentTitle } = useSelector((state) => state.doctor);
  const { cart } = useSelector((state) => state.ecommerce);
  const displayTitle = currentTitle || title || t("nav.dashboard");

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const basePath = getRoleRoute(user?.role);

  // Fetch unread count
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

  const getSearchContext = () => {
    const path = location.pathname;
    if (path.includes("/feed")) return {
      placeholder: t("common.search_posts", "Search posts or doctors..."),
      url: `${basePath}/feed/search`
    };
    if (path.includes("/marketplace")) return {
      placeholder: t("ecommerce.search_placeholder", "Search medicines & supplies..."),
      url: `${basePath}/marketplace`
    };
    if (path.includes("/medical-ai")) return {
      placeholder: t("ai.search_placeholder", "Ask Medical AI..."),
      url: "/medical-ai"
    };
    return {
      placeholder: t("common.search_people", "Search for people..."),
      url: `${basePath}/search`
    };
  };

  const { placeholder, url } = getSearchContext();

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
      navigate(`${url}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (displayTitle) {
      document.title = `${displayTitle}`;
    }
  }, [displayTitle]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  const cartItemsCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <>
      <header className="doctor-header">
        <div className="left-section">
          <button className="mobile-menu-btn" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          <h2 className="page-title">{displayTitle}</h2>
        </div>

        <div className="center-section">
          <div className="search-bar">
            <Search size={18} onClick={handleSearch} style={{ cursor: "pointer" }} />
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
        </div>

        <div className="right-section">
          <button className="action-btn" onClick={toggleLanguage} title={t("common.switch_lang")}>
            <Globe size={20} />
            <span className="lang-label">{i18n.language === "ar" ? "EN" : "عربي"}</span>
          </button>

          <button className="action-btn create-post-btn" onClick={() => setIsCreatePostOpen(true)} title={t("posts.create_post", "Create Post")}>
            <Plus size={20} />
          </button>

          <div className="notification-wrapper">
            <NotificationBell onClick={() => setShowNotifications(!showNotifications)} count={unreadCount} />
            {showNotifications && (
              <NotificationDropdown onClose={() => { setShowNotifications(false); }} />
            )}
          </div>

          <button className="action-btn cart-btn" onClick={() => setIsCartOpen(true)} title={t("ecommerce.cart", "Cart")}>
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && <span className="badge">{cartItemsCount}</span>}
          </button>

          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user?.username || "Doctor"}</span>
              <span className="user-role">{user?.role === "nursing" ? t("auth.role_nurse", "Nurse") : t("auth.role_doctor")}</span>
            </div>
            <div className="user-avatar">
              {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <User size={20} />}
            </div>
          </div>
        </div>
      </header>

      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default DoctorHeader;
