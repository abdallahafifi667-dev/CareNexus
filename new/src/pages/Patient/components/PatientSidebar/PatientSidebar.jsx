import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { filterNavItems } from "../../utils/permissions";
import { logoutUser } from "../../../../pages/Auth/stores/authService";
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
  PlusCircle,
  ShoppingBag,
  Search,
  Bell,
} from "lucide-react";
import "./PatientSidebar.scss";

const PatientSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const allNavItems = [
    {
      path: "/patient",
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
      feature: "dashboard",
    },
    {
      path: "/patient/orders",
      icon: ClipboardList,
      label: t("nav.orders"),
      feature: "orders",
    },
    {
      path: "/patient/orders/create",
      icon: PlusCircle,
      label: t("nav.request_trip", { defaultValue: "Request Trip" }),
      feature: "orders",
    },
    {
      path: "/patient/feed",
      icon: Rss,
      label: t("nav.feed", { defaultValue: "Social Feed" }),
      feature: "feed",
    },
    {
      path: "/patient/marketplace",
      icon: ShoppingBag,
      label: t("nav.marketplace", { defaultValue: "Marketplace" }),
      feature: "orders",
    },
    {
      path: "/patient/profile",
      icon: UserCircle,
      label: t("nav.profile"),
      feature: "profile",
    },

    {
      path: "/patient/medical-ai",
      icon: Sparkles,
      label: t("nav.medical_ai"),
      feature: "medical_ai",
    },
    {
      path: "/drug-search",
      icon: Search,
      label: t("nav.drug_search", { defaultValue: "Drug Search" }),
      feature: "knowledge_ai",
    },
    {
      path: "/patient/knowledge-ai",
      icon: BookOpen,
      label: t("nav.knowledge_ai"),
      feature: "knowledge_ai",
    },
    {
      path: "/patient/notifications",
      icon: Bell,
      label: t("nav.notifications", { defaultValue: "Notifications" }),
      feature: "notifications",
    },
    {
      path: "/patient/settings",
      icon: Settings,
      label: t("nav.settings", { defaultValue: "Settings" }),
      feature: "settings",
    },
  ];


  const navItems = filterNavItems(allNavItems, role);

  return (
    <aside className={`patient-sidebar ${isCollapsed ? "collapsed" : ""}`}>
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
            end={["/patient", "/patient/orders"].includes(item.path)}
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

export default PatientSidebar;
