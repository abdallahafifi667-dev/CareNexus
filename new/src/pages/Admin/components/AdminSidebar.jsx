import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Auth/stores/authService";
import "./AdminSidebar/AdminSidebar.scss";
import {
  LayoutDashboard, Users, ShieldCheck, ShoppingBag,
  FileText, Settings, LogOut, User, ChevronLeft, ChevronRight,
} from "lucide-react";

import { useTranslation } from "react-i18next";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard", "Dashboard"), path: "/admin" },
    { icon: Users, label: t("admin.users", "Users"), path: "/admin/users" },
    { icon: ShieldCheck, label: t("admin.verification", "Verification"), path: "/admin/verification" },
    { icon: ShoppingBag, label: t("admin.ecommerce", "Ecommerce"), path: "/admin/ecommerce" },
    { icon: FileText, label: t("admin.blog", "Blog"), path: "/admin/blog" },
    { icon: User, label: t("nav.profile", "Profile"), path: "/admin/profile" },
    { icon: Settings, label: t("nav.settings", "Settings"), path: "/admin/settings" },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <aside className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="logo">
            CareNexus
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
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon className="nav-icon" size={24} />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
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

export default AdminSidebar;
