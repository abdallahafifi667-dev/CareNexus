import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  PlusCircle,
  Sparkles,
  BookOpen,
  ClipboardList,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./PatientDashboard.scss";
import "../../../scss/premium_theme.scss";
import { getAvatar } from "../../../utils/imageUtils";

const PatientDashboard = () => {

  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      label: t("dashboard.active_requests", "Active Requests"),
      value: "2",
      icon: Clock,
      color: "#3b82f6",
    },
    {
      label: t("dashboard.completed_trips", "Completed Trips"),
      value: "15",
      icon: CheckCircle,
      color: "#10b981",
    },
    {
      label: t("dashboard.emergency_alerts", "Emergency Alerts"),
      value: "0",
      icon: AlertCircle,
      color: "#ef4444",
    },
  ];

  const quickActions = [
    {
      title: t("dashboard.request_service", "Request a Service"),
      description: t(
        "dashboard.request_service_desc",
        "Get a doctor or nurse to your location.",
      ),
      icon: PlusCircle,
      link: "/patient/orders/create",
      className: "request-service",
    },
    {
      title: t("dashboard.medical_ai", "Medical AI"),
      description: t(
        "dashboard.medical_ai_desc",
        "Symptom checker and health advice.",
      ),
      icon: Sparkles,
      link: "/patient/medical-ai",
      className: "medical-ai",
    },
    {
      title: t("dashboard.knowledge_ai", "Knowledge AI"),
      description: t(
        "dashboard.knowledge_ai_desc",
        "Learn more about health conditions.",
      ),
      icon: BookOpen,
      link: "/patient/knowledge-ai",
      className: "knowledge-ai",
    },
  ];

  return (
    <div className="premium-ui">
      <div className="patient-dashboard">
      <header className="dashboard-header">
        <motion.div 
            className="welcome-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
          <h1>
            {t("dashboard.welcome", "Welcome back")},{" "}
            <span className="text-gradient">{user?.username || user?.name || "Patient"}</span>!
          </h1>
          <p>
            {t(
              "dashboard.how_can_we_help",
              "How can we help with your health today?",
            )}
          </p>
        </motion.div>

        <motion.div 
            className="user-profile-summary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="avatar-container">
                <img src={getAvatar(user)} alt="Patient" />
                <div className="status-dot"></div>
            </div>
        </motion.div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            whileHover={{ y: -8, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className={`stat-icon icon-bg-${index}`}
              style={{ color: stat.color }}
            >
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
        <h2 className="section-title">
          {t("dashboard.quick_actions", "Quick Actions")}
        </h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index} className="action-card-link">
              <motion.div
                className={`action-card ${action.className}`}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="action-content">
                  <div className="action-icon-wrapper">
                    <action.icon size={32} />
                  </div>
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
            <h2 className="section-title">
              {t("dashboard.upcoming_trips", "Recent Activity")}
            </h2>
            <Link to="/patient/orders" className="view-all">
              {t("common.view_all", "View All")}
            </Link>
          </div>
          <div className="activity-list">
            <div className="empty-state">
              <ClipboardList size={48} />
              <p>
                {t(
                  "dashboard.no_recent_activity",
                  "No recent service requests found.",
                )}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default PatientDashboard;
