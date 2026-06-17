import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { User, Mail, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.scss";

const AdminProfile = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "A";
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <motion.div
      className="admin-profile admin-settings-page"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dashboard-header" style={{ marginBottom: "2rem", borderBottom: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0 1rem" }}>
          <div className="header-icon-wrap" style={{ background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)" }}>
            <Shield size={24} color="white" />
          </div>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: "1.4rem", margin: 0 }}>
              {t("nav.profile", "My Profile")}
            </h2>
            <p style={{ color: "#64748b", margin: 0 }}>
              {t("admin.account_details", "Admin Account Details")}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-header-card">
          <div className="profile-avatar-container">
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {getInitials(user?.username)}
              </div>
            )}
            <div className="role-badge-floating">
              {t("admin.super_admin", "Super Admin")}
            </div>
          </div>
          
          <div className="profile-info-main">
            <h3>{user?.username || "Admin"}</h3>
            <p className="email-text">
              <Mail size={14} />
              {user?.email?.address || user?.email || "admin@carenexus.com"}
            </p>
            <div className="status-indicator">
              <CheckCircle size={14} /> {t("admin.active_account", "Active Account")}
            </div>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="detail-card">
            <h4>{t("admin.account_info", "Account Information")}</h4>
            <div className="detail-row">
              <span className="label">{t("admin.role", "Role")}</span>
              <span className="value admin-role">Admin</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("admin.system_access", "System Access")}</span>
              <span className="value">{t("admin.full_privileges", "Full Privileges")}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("admin.joined", "Joined")}</span>
              <span className="value">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("admin.system_default", "System Default")}</span>
            </div>
          </div>

          <div className="detail-card">
            <h4>{t("admin.security_settings", "Security Settings")}</h4>
            <div className="detail-row">
              <span className="label">{t("admin.two_factor_auth", "2FA Authentication")}</span>
              <span className="value status-badge status-open">{t("admin.enabled", "Enabled")}</span>
            </div>
            <div className="detail-row">
              <span className="label">{t("admin.last_login", "Last Login")}</span>
              <span className="value">{t("admin.just_now", "Just now")}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
