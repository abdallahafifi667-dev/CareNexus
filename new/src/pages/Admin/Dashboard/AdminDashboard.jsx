import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Users, UserCheck, UserPlus, Activity, ShoppingBag, FileText,
  TrendingUp, ArrowUpRight, Shield,
} from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import Seo from "../../../shared/components/SEO/SEO";
import "./AdminDashboard.scss";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, ordersRes] = await Promise.allSettled([
        axiosInstance.get("/admin-ecommerce/all-users"),
        axiosInstance.get("/admin-ecommerce/all-orders"),
      ]);

      if (usersRes.status === "fulfilled") {
        const users = usersRes.value.data?.users || usersRes.value.data || [];
        setRecentUsers(users.slice(0, 5));
        setStats({
          totalUsers: users.length,
          doctors: users.filter(u => u.role === "doctor").length,
          patients: users.filter(u => u.role === "patient").length,
          pharmacies: users.filter(u => u.role === "pharmacy").length,
          nurses: users.filter(u => u.role === "nursing").length,
          shipping: users.filter(u => u.role === "shipping_company").length,
        });
      }

      if (ordersRes.status === "fulfilled") {
        setRecentOrders((ordersRes.value.data?.orders || ordersRes.value.data || []).slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const statCards = stats ? [
    { label: t("admin.total_users", "Total Users"), value: stats.totalUsers, icon: Users, gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", change: "+12%" },
    { label: t("admin.doctors", "Doctors"), value: stats.doctors, icon: UserCheck, gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)", change: "+8%" },
    { label: t("admin.patients", "Patients"), value: stats.patients, icon: UserPlus, gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)", change: "+15%" },
    { label: t("admin.pharmacies", "Pharmacies"), value: stats.pharmacies, icon: ShoppingBag, gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", change: "+5%" },
    { label: t("admin.nurses", "Nurses"), value: stats.nurses, icon: Activity, gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", change: "+3%" },
    { label: t("admin.shipping", "Shipping"), value: stats.shipping, icon: FileText, gradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)", change: "+7%" },
  ] : [];

  return (
    <motion.div
      className="admin-dashboard admin-settings-page"
      variants={containerVariants}
      initial={false}
      animate="visible"
    >
      <Seo title={t("admin.admin_dashboard", "Admin Dashboard")} />
      {/* Welcome Header */}
      <motion.div className="dash-welcome" variants={itemVariants}>
        <div className="welcome-text">
          <h1>{t("admin.welcome_admin", "Welcome back, Admin")}</h1>
          <p>{t("admin.admin_stats", "Here's what's happening with CareNexus today.")}</p>
        </div>
        <div className="welcome-badge">
          <TrendingUp size={16} />
          <span>Live Dashboard</span>
        </div>
      </motion.div>

      {/* Stats Grid - Square Cards */}
      <div className="stats-grid">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="stat-card skeleton">
              <div className="skeleton-shimmer"></div>
            </div>
          ))
        ) : (
          statCards.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="stat-card"
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div className="stat-icon-wrap" style={{ background: stat.gradient }}>
                <stat.icon size={24} color="white" />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
              <div className="stat-change">
                <ArrowUpRight size={14} />
                <span>{stat.change}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-grid">
        <motion.div className="dash-card" variants={itemVariants}>
          <div className="card-header">
            <div className="header-left">
              <div className="header-icon users-icon">
                <Users size={18} />
              </div>
              <h3>{t("admin.recent_users", "Recent Users")}</h3>
            </div>
            <Link to="/admin/users" className="header-action">{t("common.view_all", "View All")} →</Link>
          </div>
          <div className="card-body">
            {recentUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Users size={32} /></div>
                <p>{t("admin.no_users", "No users found")}</p>
              </div>
            ) : (
              recentUsers.map((user, idx) => (
                <motion.div
                  key={idx}
                  className="list-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="item-avatar">
                    {user.avatar ? <img src={user.avatar} alt="" /> : <Users size={16} />}
                  </div>
                  <div className="item-info">
                    <span className="item-name">{user.username || "Unknown"}</span>
                    <span className="item-email">{user.email?.address || user.email || "No email"}</span>
                  </div>
                  <span className={`role-badge role-${user.role}`}>{user.role?.replace("_", " ")}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div className="dash-card" variants={itemVariants}>
          <div className="card-header">
            <div className="header-left">
              <div className="header-icon orders-icon">
                <ShoppingBag size={18} />
              </div>
              <h3>{t("admin.recent_orders", "Recent Orders")}</h3>
            </div>
            <Link to="/admin/ecommerce" className="header-action">{t("common.view_all", "View All")} →</Link>
          </div>
          <div className="card-body">
            {recentOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><FileText size={32} /></div>
                <p>{t("admin.no_orders", "No orders found")}</p>
              </div>
            ) : (
              recentOrders.map((order, idx) => (
                <motion.div
                  key={idx}
                  className="list-item"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="item-icon-wrap" style={{
                    background: order.orderStatus === "delivered" ? "#ecfdf5" : "#eff6ff"
                  }}>
                    <FileText size={16} color={order.orderStatus === "delivered" ? "#10b981" : "#3b82f6"} />
                  </div>
                  <div className="item-info">
                    <span className="item-name">{order.items?.[0]?.product?.name || "Order"}</span>
                    <span className="item-email">{order.user?.username || order.userId?.username || "Unknown"}</span>
                  </div>
                  <span className={`status-badge status-${order.orderStatus}`}>{order.orderStatus}</span>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
