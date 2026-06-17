import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../../pages/Auth/stores/authService";
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  Handshake,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Newspaper,
  MessageCircle,
  User,
  Search,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { getRoleBasePath } from "../../../../shared/utils/roleRoutes";
import "./PharmacySidebar.scss";
import "../../../../scss/premium_theme.scss";

const PharmacySidebar = ({ isCollapsed, setIsCollapsed }) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const basePath = getRoleBasePath(user?.role);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    {
      path: basePath,
      icon: LayoutDashboard,
      label: t("nav.dashboard", { defaultValue: "Dashboard" }),
    },
    {
      path: `${basePath}/feed`,
      icon: Newspaper,
      label: t("nav.feed", { defaultValue: "Community Feed" }),
    },
    {
      path: `${basePath}/orders`,
      icon: ClipboardList,
      label: t("nav.orders", { defaultValue: "Orders" }),
    },
    {
      path: `${basePath}/products`,
      icon: Package,
      label: t("nav.products", { defaultValue: "Products" }),
    },
    {
      path: `${basePath}/contracts`,
      icon: Handshake,
      label: t("nav.contracts", { defaultValue: "Contracts" }),
    },
    {
      path: `${basePath}/chat`,
      icon: MessageCircle,
      label: t("nav.chat", { defaultValue: "Messages" }),
    },
    {
      path: `${basePath}/notifications`,
      icon: Bell,
      label: t("nav.notifications", { defaultValue: "Notifications" }),
    },
    {
      path: `${basePath}/settings`,
      icon: Settings,
      label: t("nav.settings", { defaultValue: "Settings" }),
    },
    {
      path: `${basePath}/profile`,
      icon: User,
      label: t("nav.profile", { defaultValue: "Profile" }),
    },
  ];

  return (
    <div className="premium-ui">
      <motion.aside
      className={`pharmacy-sidebar ${isCollapsed ? "collapsed" : ""}`}
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        {!isCollapsed && (
          <motion.div
            className="logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Care<span>Nexus</span>
          </motion.div>
        )}
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            end={item.path === basePath}
          >
            <item.icon className="nav-icon" size={24} />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut className="nav-icon" size={24} />
          {!isCollapsed && <span className="nav-label">{t("nav.logout")}</span>}
        </button>
      </div>
    </motion.aside>
    </div>
  );
};


export default PharmacySidebar;
