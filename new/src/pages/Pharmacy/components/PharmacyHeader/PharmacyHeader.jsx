import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search, Bell, Globe, User, Menu } from "lucide-react";
import "./PharmacyHeader.scss";

const PharmacyHeader = ({ title, onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { currentTitle } = useSelector((state) => state.pharmacy);
  const displayTitle = currentTitle || title || t("nav.dashboard", { defaultValue: "Dashboard" });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    if ((e.key === "Enter" || e.type === "click") && searchQuery.trim()) {
      // Implement global search if needed
    }
  };

  useEffect(() => {
    if (displayTitle) {
      document.title = `${displayTitle} | Pharmacy`;
    }
  }, [displayTitle]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="pharmacy-header">
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
            placeholder={t("common.search", { defaultValue: "Search..." })}
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

        <button className="action-btn notification-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.username || "Pharmacy"}</span>
            <span className="user-role">{t("auth.role_pharmacist", { defaultValue: "Pharmacist" })}</span>
          </div>
          <div className="user-avatar">
            {user?.avatar ? <img src={user.avatar} alt="Avatar" /> : <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PharmacyHeader;
