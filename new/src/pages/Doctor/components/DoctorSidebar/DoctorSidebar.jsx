import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { filterNavItems } from "../../utils/permissions";
import { logoutUser } from "../../../../pages/Auth/stores/authService";
import { getRoleRoute } from "../../../../shared/utils/roleRoutes";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  Star,
  Rss,
  ShoppingBag,
  Search,
  Bell,
} from "lucide-react";
import "./DoctorSidebar.scss";

const DoctorSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const basePath = getRoleRoute(role);

  const allNavItems = [
    {
      path: basePath,
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
      feature: "dashboard",
    },
    {
      path: `${basePath}/orders`,
      icon: ClipboardList,
      label: t("nav.orders"),
      feature: "orders",
    },
    {
      path: `${basePath}/feed`,
      icon: Rss,
      label: t("nav.feed", { defaultValue: "Social Feed" }),
      feature: "feed",
    },
    {
      path: `${basePath}/chat`,
      icon: MessageSquare,
      label: t("nav.chat", { defaultValue: "Order Chat" }),
      feature: "chat",
    },
    {
      path: `${basePath}/marketplace`,
      icon: ShoppingBag,
      label: t("nav.marketplace", { defaultValue: "Marketplace" }),
      feature: "orders",
    },
    {
      path: `${basePath}/profile`,
      icon: UserCircle,
      label: t("nav.profile"),
      feature: "profile",
    },

    {
      path: `${basePath}/reviews`,
      icon: Star,
      label: t("nav.reviews", { defaultValue: "Reviews" }),
      feature: "reviews",
    },
    {
      path: `${basePath}/medical-ai`,
      icon: Sparkles,
      label: t("nav.medical_ai"),
      feature: "medical_ai",
    },
    {
      path: `${basePath}/drug-search`,
      icon: Search,
      label: t("nav.drug_search", { defaultValue: "Drug Search" }),
      feature: "knowledge_ai",
    },
    {
      path: `${basePath}/knowledge-ai`,
      icon: BookOpen,
      label: t("nav.knowledge_ai"),
      feature: "knowledge_ai",
    },
    {
      path: `${basePath}/notifications`,
      icon: Bell,
      label: t("nav.notifications", { defaultValue: "Notifications" }),
      feature: "notifications",
    },
    {
      path: `${basePath}/settings`,
      icon: Settings,
      label: t("nav.settings", { defaultValue: "Settings" }),
      feature: "settings",
    },
  ];

  const navItems = filterNavItems(allNavItems, role);

  return (
    <aside className={`doctor-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="logo">
            {t("nav.brand_name", { defaultValue: "CareNexus" })}
          </div>
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
    </aside>
  );
};

export default DoctorSidebar;

