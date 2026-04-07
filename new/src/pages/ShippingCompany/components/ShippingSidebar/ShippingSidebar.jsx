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
} from "lucide-react";
import { motion } from "framer-motion";
import "./ShippingSidebar.scss";

const ShippingSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    {
      path: "/shipping-company",
      icon: LayoutDashboard,
      label: t("nav.dashboard", { defaultValue: "Dashboard" }),
    },
    {
      path: "/shipping-company/active-orders",
      icon: Truck,
      label: t("nav.active_orders", { defaultValue: "Active Deliveries" }),
    },
    {
      path: "/shipping-company/completed",
      icon: CheckCircle,
      label: t("nav.completed", { defaultValue: "Completed" }),
    },
    {
      path: "/shipping-company/contracts",
      icon: Handshake,
      label: t("nav.contracts", { defaultValue: "Contracts" }),
    },
    {
      path: "/shipping-company/chat",
      icon: MessageSquare,
      label: t("nav.chat", { defaultValue: "Chat" }),
    },
    {
      path: "/shipping-company/profile",
      icon: UserCircle,
      label: t("nav.profile", { defaultValue: "Profile" }),
    },
    {
      path: "/shipping-company/settings",
      icon: Settings,
      label: t("nav.settings", { defaultValue: "Settings" }),
    },
  ];

  return (
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
            end={item.path === "/shipping-company"}
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
  );
};

export default ShippingSidebar;
