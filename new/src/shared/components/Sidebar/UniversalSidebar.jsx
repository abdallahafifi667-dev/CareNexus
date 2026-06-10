/**
 * UniversalSidebar - Shared sidebar for all roles
 * 
 * Props:
 * - role: 'admin' | 'doctor' | 'nursing' | 'patient' | 'pharmacy' | 'shipping_company'
 * - collapsed: boolean
 * - setCollapsed: function
 * 
 * Each role gets its own color scheme and nav items.
 * Single source of truth - no more duplicate sidebars.
 */
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, ShieldCheck, ShoppingBag, FileText,
  Settings, LogOut, ChevronLeft, ChevronRight, User, Rss,
  ClipboardList, Package, Handshake, MessageCircle, Activity,
  Star, Search, Sparkles, BookOpen, PlusCircle, MapPin,
} from "lucide-react";
import { logoutUser } from "../../../pages/Auth/stores/authService";

// ─── Role Configuration ──────────────────────────────────────────
const ROLE_CONFIG = {
  admin: {
    theme: { primary: "#3b82f6", bg: "#0f172a", accent: "#1e293b" },
    label: "Admin",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
      { icon: Users, label: "Users", path: "/admin/users" },
      { icon: ShieldCheck, label: "Verification", path: "/admin/verification" },
      { icon: ShoppingBag, label: "Ecommerce", path: "/admin/ecommerce" },
      { icon: FileText, label: "Blog", path: "/admin/blog" },
      { icon: User, label: "Profile", path: "/admin/profile" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  },
  doctor: {
    theme: { primary: "#10b981", bg: "#064e3b", accent: "#065f46" },
    label: "Doctor",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
      { icon: ClipboardList, label: "Orders", path: "/doctor/orders" },
      { icon: Rss, label: "Feed", path: "/doctor/feed" },
      { icon: MessageCircle, label: "Chat", path: "/doctor/chat" },
      { icon: ShoppingBag, label: "Marketplace", path: "/doctor/marketplace" },
      { icon: Star, label: "Reviews", path: "/doctor/reviews" },
      { icon: User, label: "Profile", path: "/doctor/profile" },
      { icon: Sparkles, label: "Medical AI", path: "/doctor/medical-ai" },
      { icon: BookOpen, label: "Knowledge", path: "/doctor/knowledge-ai" },
      { icon: Settings, label: "Settings", path: "/doctor/settings" },
    ],
  },
  nursing: {
    theme: { primary: "#ec4899", bg: "#831843", accent: "#9d174d" },
    label: "Nursing",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
      { icon: ClipboardList, label: "Orders", path: "/doctor/orders" },
      { icon: Rss, label: "Feed", path: "/doctor/feed" },
      { icon: MessageCircle, label: "Chat", path: "/doctor/chat" },
      { icon: User, label: "Profile", path: "/doctor/profile" },
      { icon: Settings, label: "Settings", path: "/doctor/settings" },
    ],
  },
  patient: {
    theme: { primary: "#8b5cf6", bg: "#4c1d95", accent: "#5b21b6" },
    label: "Patient",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/patient" },
      { icon: ClipboardList, label: "My Orders", path: "/patient/orders" },
      { icon: PlusCircle, label: "New Request", path: "/patient/orders/create" },
      { icon: Rss, label: "Feed", path: "/patient/feed" },
      { icon: MessageCircle, label: "Chat", path: "/patient/chat" },
      { icon: ShoppingBag, label: "Marketplace", path: "/patient/marketplace" },
      { icon: User, label: "Profile", path: "/patient/profile" },
      { icon: Sparkles, label: "Medical AI", path: "/patient/medical-ai" },
      { icon: BookOpen, label: "Knowledge", path: "/patient/knowledge-ai" },
      { icon: Settings, label: "Settings", path: "/patient/settings" },
    ],
  },
  pharmacy: {
    theme: { primary: "#f59e0b", bg: "#78350f", accent: "#92400e" },
    label: "Pharmacy",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/pharmacy" },
      { icon: Rss, label: "Feed", path: "/pharmacy/feed" },
      { icon: ClipboardList, label: "Orders", path: "/pharmacy/orders" },
      { icon: Package, label: "Products", path: "/pharmacy/products" },
      { icon: Handshake, label: "Contracts", path: "/pharmacy/contracts" },
      { icon: MessageCircle, label: "Chat", path: "/pharmacy/chat" },
      { icon: User, label: "Profile", path: "/pharmacy/profile" },
      { icon: Settings, label: "Settings", path: "/pharmacy/settings" },
    ],
  },
  shipping_company: {
    theme: { primary: "#06b6d4", bg: "#164e63", accent: "#155e75" },
    label: "Shipping",
    navItems: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/shipping-company" },
      { icon: ClipboardList, label: "Active Orders", path: "/shipping-company/active-orders" },
      { icon: Activity, label: "Completed", path: "/shipping-company/completed" },
      { icon: Handshake, label: "Contracts", path: "/shipping-company/contracts" },
      { icon: MessageCircle, label: "Chat", path: "/shipping-company/chat" },
      { icon: User, label: "Profile", path: "/shipping-company/profile" },
      { icon: Settings, label: "Settings", path: "/shipping-company/settings" },
    ],
  },
};

const UniversalSidebar = ({ role, collapsed, setCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.doctor;

  const handleLogout = () => {
  dispatch(logoutUser());
    navigate("/auth/login");
  };

  return (
    <motion.aside
      className="universal-sidebar"
      style={{ "--sb-primary": config.theme.primary, "--sb-bg": config.theme.bg, "--sb-accent": config.theme.accent }}
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
    >
      <div className="sb-header">
        <div className="sb-logo">
          <div className="sb-logo-icon">
            {role === "admin" ? <ShieldCheck size={20} /> :
             role === "pharmacy" ? <ShoppingBag size={20} /> :
             role === "shipping_company" ? <Package size={20} /> :
             role === "patient" ? <User size={20} /> :
             <Activity size={20} />}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <span className="sb-logo-text">Care<span>Nexus</span></span>
                <span className="sb-role-label">{config.label}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="sb-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sb-nav">
        {config.navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/${role === "nursing" ? "doctor" : role === "shipping_company" ? "shipping-company" : role}`}
            className={({ isActive }) => `sb-nav-item ${isActive ? "active" : ""}${collapsed ? " collapsed" : ""}`}
          >
            <item.icon size={20} />
            {!collapsed && <span className="sb-nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sb-footer">
        <button className="sb-nav-item sb-logout" onClick={handleLogout}>
          <LogOut size={20} />
          {!collapsed && <span className="sb-nav-label">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default UniversalSidebar;
