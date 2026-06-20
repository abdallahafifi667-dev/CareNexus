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
      label: t("nav.dashboard", "Dashboard"),
      feature: "dashboard",
      section: "main",
    },
    {
      path: "/patient/orders",
      icon: ClipboardList,
      label: t("nav.orders", "My Orders"),
      feature: "orders",
      section: "service",
    },
    {
      path: "/patient/orders/create",
      icon: PlusCircle,
      label: t("nav.request_trip", "Request Trip"),
      feature: "orders",
      section: "service",
    },
    {
      path: "/patient/feed",
      icon: Rss,
      label: t("nav.feed", "Social Feed"),
      feature: "feed",
      section: "social",
    },
    {
      path: "/patient/marketplace",
      icon: ShoppingBag,
      label: t("nav.marketplace", "Marketplace"),
      feature: "orders",
      section: "service",
    },
    {
      path: "/patient/profile",
      icon: UserCircle,
      label: t("nav.profile", "Profile"),
      feature: "profile",
      section: "main",
    },
    {
      path: "/patient/medical-ai",
      icon: Sparkles,
      label: t("nav.medical_ai", "Medical AI"),
      feature: "medical_ai",
      section: "tools",
    },
    {
      path: "/patient/drug-search",
      icon: Search,
      label: t("nav.drug_search", "Drug Search"),
      feature: "knowledge_ai",
      section: "tools",
    },
    {
      path: "/patient/knowledge-ai",
      icon: BookOpen,
      label: t("nav.knowledge_ai", "Knowledge AI"),
      feature: "knowledge_ai",
      section: "tools",
    },
    {
      path: "/patient/notifications",
      icon: Bell,
      label: t("nav.notifications", "Notifications"),
      feature: "notifications",
      section: "main",
    },
    {
      path: "/patient/settings",
      icon: Settings,
      label: t("nav.settings", "Settings"),
      feature: "settings",
      section: "main",
    },
  ];

  const navItems = filterNavItems(allNavItems, role);

  const sections = {
    main: { label: t("nav.section_main", "Main"), items: [] },
    service: { label: t("nav.section_service", "Services"), items: [] },
    social: { label: t("nav.section_social", "Social"), items: [] },
    tools: { label: t("nav.section_tools", "Tools"), items: [] },
  };

  navItems.forEach((item) => {
    const section = item.section || "main";
    if (sections[section]) {
      sections[section].items.push(item);
    }
  });

  return (
    <aside className={`patient-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="logo">
            {t("nav.brand_name", "CareNexus")}
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
        {Object.entries(sections).map(([key, section]) => {
          if (section.items.length === 0) return null;
          return (
            <div key={key} className="nav-section">
              {!isCollapsed && (
                <div className="nav-section-title">{section.label}</div>
              )}
              {section.items.map((item) => (
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
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut className="nav-icon" size={24} />
          {!isCollapsed && <span className="nav-label">{t("nav.logout", "Logout")}</span>}
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;
