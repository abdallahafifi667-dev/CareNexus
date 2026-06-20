import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  PlusCircle, Sparkles, BookOpen, ClipboardList, Clock,
  CheckCircle, AlertCircle, Activity, Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./PatientDashboard.scss";
import { getAvatar } from "../../../utils/imageUtils";
import axiosInstance from "../../../utils/axiosInstance";

const PatientDashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get("/order/getOrders?page=1&limit=5");
      setOrders(res.data.data || res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter(o => ["open", "confirmed", "in_progress", "awaiting_provider_confirmation"].includes(o.status));
  const completedOrders = orders.filter(o => o.status === "completed");

  const stats = [
    { label: t("dashboard.active_requests", "Active Requests"), value: activeOrders.length, icon: Clock, color: "#3b82f6" },
    { label: t("dashboard.completed", "Completed"), value: completedOrders.length, icon: CheckCircle, color: "#10b981" },
    { label: t("dashboard.total_orders", "Total Orders"), value: orders.length, icon: Activity, color: "#8b5cf6" },
  ];

  const quickActions = [
    { title: t("dashboard.request_service", "Request a Service"), description: t("dashboard.request_service_desc", "Get a doctor or nurse to your location."), icon: PlusCircle, link: "/patient/orders/create", className: "request-service" },
    { title: t("dashboard.medical_ai", "Medical AI"), description: t("dashboard.medical_ai_desc", "Symptom checker and health advice."), icon: Sparkles, link: "/patient/medical-ai", className: "medical-ai" },
    { title: t("dashboard.knowledge_ai", "Knowledge AI"), description: t("dashboard.knowledge_ai_desc", "Learn more about health conditions."), icon: BookOpen, link: "/patient/knowledge-ai", className: "knowledge-ai" },
  ];

  return (
    <div className="premium-ui">
      <div className="patient-dashboard">
        <header className="dashboard-header">
          <motion.div className="welcome-section" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1>{t("dashboard.welcome", "Welcome back")}, <span className="text-gradient">{user?.username || "Patient"}</span>!</h1>
            <p>{t("dashboard.how_can_we_help", "How can we help with your health today?")}</p>
          </motion.div>
        </header>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-card" whileHover={{ y: -8 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <div className={`stat-icon icon-bg-${index}`} style={{ color: stat.color }}>
                <stat.icon size={28} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="quick-actions-section">
          <h2 className="section-title">{t("dashboard.quick_actions", "Quick Actions")}</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index} className="action-card-link">
                <motion.div className={`action-card ${action.className}`} whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + index * 0.1 }}>
                  <div className="action-content">
                    <div className="action-icon-wrapper"><action.icon size={32} /></div>
                    <div className="action-details">
                      <h3>{action.title}</h3>
                      <p>{action.description}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        <div className="dashboard-content-grid">
          <section className="upcoming-appointments">
            <div className="section-header">
              <h2 className="section-title">{t("dashboard.recent_orders", "Recent Orders")}</h2>
              <Link to="/patient/orders" className="view-all">{t("common.view_all", "View All")}</Link>
            </div>
            <div className="activity-list">
              {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={48} />
                  <p>{t("dashboard.no_recent_activity", "No recent service requests found.")}</p>
                  <Link to="/patient/orders/create" className="btn-primary">{t("orders.create_first", "Create Your First Request")}</Link>
                </div>
              ) : (
                <div className="recent-orders-grid">
                  {orders.slice(0, 5).map((order, idx) => {
                    const statusColor = order.status === "completed" ? "#10b981" : order.status === "in_progress" ? "#3b82f6" : order.status === "cancelled" ? "#ef4444" : "#f59e0b";
                    return (
                      <Link to={`/patient/orders/${order._id || order.id}`} key={idx} className="recent-order-card">
                        <div className="roc-header">
                          <div className="roc-status-dot" style={{ backgroundColor: statusColor }}></div>
                          <span className="roc-status" style={{ color: statusColor }}>{t(`status.${order.status}`, order.status?.replace(/_/g, " "))}</span>
                          <span className="roc-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="roc-title">{order.title}</h4>
                        <p className="roc-desc">{order.description?.substring(0, 80)}{order.description?.length > 80 ? "..." : ""}</p>
                        <div className="roc-footer">
                          <span className="roc-service">{order.medicalServiceType || order.serviceType || ""}</span>
                          {order.price && <span className="roc-price">{order.price} {t("common.currency", "EGP")}</span>}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
