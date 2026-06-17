import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../../pages/Auth/stores/authService";
import {
  LayoutDashboard,
  Truck,
  CheckCircle,
  Handshake,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  ClipboardList,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";
import { getRoleBasePath } from "../../../../shared/utils/roleRoutes";
import "./ShippingSidebar.scss";
import "../../../../scss/premium_theme.scss";

const ShippingSidebar = ({ isCollapsed, setIsCollapsed }) => {

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
      path: `${basePath}/orders`,
      icon: ClipboardList,
      label: t("nav.orders", { defaultValue: "Active Deliveries" }),
    },
    {
      path: `${basePath}/contracts`,
      icon: Handshake,
      label: t("nav.contracts", { defaultValue: "Contracts" }),
    },
    {
      path: `${basePath}/chat`,
      icon: MessageSquare,
      label: t("nav.chat", { defaultValue: "Chat" }),
    },
    {
      path: `${basePath}/notifications`,
      icon: Bell,
      label: t("nav.notifications", { defaultValue: "Notifications" }),
    },
    {
      path: `${basePath}/profile`,
      icon: UserCircle,
      label: t("nav.profile", { defaultValue: "Profile" }),
    },
    {
      path: `${basePath}/settings`,
      icon: Settings,
      label: t("nav.settings", { defaultValue: "Settings" }),
    },
  ];

  return (
    <div className="premium-ui">
      <motion.aside
      className={`shipping-sidebar ${isCollapsed ? "collapsed" : ""}`}
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


export default ShippingSidebar;
