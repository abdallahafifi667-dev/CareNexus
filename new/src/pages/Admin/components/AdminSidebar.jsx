import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../Auth/stores/authService";
import "./AdminSidebar/AdminSidebar.scss";
import {
  LayoutDashboard, Users, ShieldCheck, ShoppingBag,
  FileText, Settings, LogOut, User, ChevronLeft, ChevronRight,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: ShieldCheck, label: "Verification", path: "/admin/verification" },
  { icon: ShoppingBag, label: "Ecommerce", path: "/admin/ecommerce" },
  { icon: FileText, label: "Blog", path: "/admin/blog" },
  { icon: User, label: "Profile", path: "/admin/profile" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <aside
      className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}
    >
      <div className="sb-header">
        <div className="sb-logo">
          {!isCollapsed && (
            <div className="sb-logo-content">
              <div className="sb-logo-icon"><ShieldCheck size={20} /></div>
              <div className="sb-logo-text">Care<span>Nexus</span></div>
              <span className="sb-role">Admin</span>
            </div>
          )}
        </div>
        <button
          className="sb-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      <nav className="sb-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) => `sb-nav-item ${isActive ? "active" : ""}`}
          >
            <item.icon size={20} />
            {!isCollapsed && <span className="sb-nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sb-footer">
        <button className="sb-nav-item sb-logout" onClick={handleLogout}>
          <LogOut size={20} />
          {!isCollapsed && <span className="sb-nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
