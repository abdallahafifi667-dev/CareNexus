import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell, Globe, Database, Key, Save, Shield,
  AlertTriangle, CheckCircle, Server, Lock,
  Settings, Zap, Eye, Moon, Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { toggleDarkMode } from "../../store/slices/aiAppSlice";
import "./AdminSettings.scss";

const ToggleSwitch = ({ checked, onChange, label, description, icon: Icon }) => (
  <motion.div
    className="setting-toggle-card"
    whileHover={{ scale: 1.005 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <div className="toggle-info">
      {Icon && <div className="toggle-icon"><Icon size={18} /></div>}
      <div className="toggle-text">
        <p className="toggle-label">{label}</p>
        <p className="toggle-desc">{description}</p>
      </div>
    </div>
    <button
      className={`toggle-switch ${checked ? "active" : ""}`}
      onClick={onChange}
    >
      <motion.div className="toggle-thumb" layout />
    </button>
  </motion.div>
);

const AdminSettings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const darkModeRedux = useSelector((state) => state.aiApp?.darkMode ?? false);

  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    requireKYC: true,
    maxLoginAttempts: 5,
    sessionTimeout: 120,
    enableNotifications: true,
    enableAnalytics: true,
    defaultLanguage: "en",
    twoFactorAuth: false,
    autoBackup: true,
  });

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  // Sync dark mode from Redux to apply class on <html>
  useEffect(() => {
    if (darkModeRedux) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkModeRedux]);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("admin_settings", JSON.stringify(settings));
    setSaved(true);
    toast.success(t("admin.settings_saved", "Settings saved successfully!"));
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePurgeCache = () => {
    if (window.confirm(t("admin.confirm_purge", "Purge all cached data?"))) {
      localStorage.removeItem("admin_settings");
      toast.success(t("admin.cache_purged", "Cache purged successfully"));
    }
  };

  const handleToggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lng", newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
    setSettings((prev) => ({ ...prev, defaultLanguage: newLang }));
  };

  const sections = [
    { id: "general", label: t("admin.general", "General"), icon: Settings },
    { id: "security", label: t("admin.security", "Security"), icon: Lock },
    { id: "notifications", label: t("admin.notifications", "Notifications"), icon: Bell },
    { id: "system", label: t("admin.system", "System"), icon: Database },
  ];

  return (
    <motion.div
      className="admin-settings admin-settings-page"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="header-icon-wrap">
              <Settings size={24} />
            </div>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: "1.4rem", margin: 0 }}>{t("admin.system_settings", "System Settings")}</h2>
              <p style={{ color: "#64748b", margin: 0 }}>{t("admin.settings_desc", "Configure global platform parameters and admin preferences.")}</p>
            </div>
          </div>
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="save-badge"
              >
                <CheckCircle size={16} />
                <span>{t("admin.saved", "Saved!")}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section Tabs */}
        <div className="tabs-container">
          <div className="tabs-header">
            {sections.map((section) => (
              <button
                key={section.id}
                className={`tab-link ${activeSection === section.id ? "active" : ""}`}
                onClick={() => setActiveSection(section.id)}
              >
                <section.icon size={16} />
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {activeSection === "general" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Server size={18} />
                <h3>{t("admin.general", "Platform")}</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.maintenanceMode} onChange={() => handleToggle("maintenanceMode")} label={t("admin.maintenance_mode", "Maintenance Mode")} description={t("admin.maintenance_desc", "Temporarily disable the platform for all users.")} icon={AlertTriangle} />
                <ToggleSwitch checked={settings.allowRegistrations} onChange={() => handleToggle("allowRegistrations")} label={t("admin.allow_registrations", "Allow New Registrations")} description={t("admin.registrations_desc", "Enable or disable new user sign-ups.")} icon={Zap} />
                <ToggleSwitch checked={settings.requireEmailVerification} onChange={() => handleToggle("requireEmailVerification")} label={t("admin.require_email_verification", "Require Email Verification")} description={t("admin.email_verification_desc", "Users must verify email before accessing the platform.")} icon={Shield} />
                <ToggleSwitch checked={settings.requireKYC} onChange={() => handleToggle("requireKYC")} label={t("admin.require_kyc", "Require KYC for Providers")} description={t("admin.kyc_desc", "Doctors and professionals must complete identity verification.")} icon={Eye} />
              </div>
            </div>

          </div>
        )}

        {activeSection === "security" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Lock size={18} />
                <h3>{t("admin.access_control", "Access Control")}</h3>
              </div>
              <div className="card-body">
                <div className="setting-input-group">
                  <label>{t("admin.max_login_attempts", "Max Login Attempts")}</label>
                  <div className="range-input-wrap">
                    <input type="range" min="1" max="10" value={settings.maxLoginAttempts} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })} />
                    <span className="range-value">{settings.maxLoginAttempts}</span>
                  </div>
                </div>
                <div className="setting-input-group">
                  <label>{t("admin.session_timeout", "Session Timeout (minutes)")}</label>
                  <div className="range-input-wrap">
                    <input type="range" min="15" max="480" step="15" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} />
                    <span className="range-value">{settings.sessionTimeout}m</span>
                  </div>
                </div>
                <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => handleToggle("twoFactorAuth")} label={t("admin.two_factor_auth", "Two-Factor Authentication")} description={t("admin.two_factor_desc", "Require 2FA for all admin accounts.")} icon={Key} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Bell size={18} />
                <h3>{t("admin.notification_preferences", "Notification Preferences")}</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.enableNotifications} onChange={() => handleToggle("enableNotifications")} label={t("admin.enable_push", "Push Notifications")} description={t("admin.push_desc", "Send push notifications via Firebase FCM.")} icon={Bell} />
                <ToggleSwitch checked={settings.enableAnalytics} onChange={() => handleToggle("enableAnalytics")} label={t("admin.enable_analytics", "Analytics Tracking")} description={t("admin.analytics_desc", "Track user behavior and platform usage.")} icon={Globe} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "system" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Database size={18} />
                <h3>{t("admin.system_actions", "System Actions")}</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.autoBackup} onChange={() => handleToggle("autoBackup")} label={t("admin.auto_backup", "Automatic Backups")} description={t("admin.auto_backup_desc", "Daily automatic database backups.")} icon={Database} />
                <div className="system-actions">
                  <button className="system-btn secondary" onClick={handlePurgeCache}>
                    <Database size={16} />
                    {t("admin.purge_cache", "Purge Cache")}
                  </button>
                  <button className="system-btn danger" onClick={() => { if (window.confirm(t("admin.confirm_restart", "Restart all services?"))) { toast.success(t("admin.restarting", "Restarting services...")); } }}>
                    <AlertTriangle size={16} />
                    {t("admin.restart_services", "Restart Services")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          <Save size={18} />
          <span>{t("admin.save_all", "Save All Settings")}</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
