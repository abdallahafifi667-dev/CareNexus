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
} from "lucide-react";
import { motion } from "framer-motion";
import "./PharmacySidebar.scss";

const PharmacySidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navItems = [
    {
      path: "/pharmacy",
      icon: LayoutDashboard,
      label: t("nav.dashboard", { defaultValue: "Dashboard" }),
    },
    {
      path: "/pharmacy/orders",
      icon: ClipboardList,
      label: t("nav.orders", { defaultValue: "Orders" }),
    },
    {
      path: "/pharmacy/products",
      icon: Package,
      label: t("nav.products", { defaultValue: "Products" }),
    },
    {
      path: "/pharmacy/contracts",
      icon: Handshake,
      label: t("nav.contracts", { defaultValue: "Contracts" }),
    },
    {
      path: "/pharmacy/chat",
      icon: MessageSquare,
      label: t("nav.chat", { defaultValue: "Chat" }),
    },
    {
      path: "/pharmacy/profile",
      icon: UserCircle,
      label: t("nav.profile", { defaultValue: "Profile" }),
    },

  ];

  return (
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
            end={item.path === "/pharmacy"}
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

export default PharmacySidebar;
