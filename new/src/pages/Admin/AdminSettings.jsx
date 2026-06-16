import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell, Globe, Database, Key, Save, Shield,
  AlertTriangle, CheckCircle, Server, Lock,
  Settings, Zap, Eye, Moon, Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
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
  const { t } = useTranslation();

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
    darkMode: false,
    twoFactorAuth: false,
    autoBackup: true,
  });

  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState("general");

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Database },
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
              <h2 style={{ fontWeight: 700, fontSize: "1.4rem", margin: 0 }}>System Settings</h2>
              <p style={{ color: "#64748b", margin: 0 }}>Configure global platform parameters and admin preferences.</p>
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
                <span>Saved!</span>
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
                <h3>Platform</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.maintenanceMode} onChange={() => handleToggle("maintenanceMode")} label="Maintenance Mode" description="Temporarily disable the platform for all users." icon={AlertTriangle} />
                <ToggleSwitch checked={settings.allowRegistrations} onChange={() => handleToggle("allowRegistrations")} label="Allow New Registrations" description="Enable or disable new user sign-ups." icon={Zap} />
                <ToggleSwitch checked={settings.requireEmailVerification} onChange={() => handleToggle("requireEmailVerification")} label="Require Email Verification" description="Users must verify email before accessing the platform." icon={Shield} />
                <ToggleSwitch checked={settings.requireKYC} onChange={() => handleToggle("requireKYC")} label="Require KYC for Providers" description="Doctors and professionals must complete identity verification." icon={Eye} />
              </div>
            </div>
            <div className="settings-card">
              <div className="card-title">
                <Globe size={18} />
                <h3>Localization</h3>
              </div>
              <div className="card-body">
                <div className="setting-input-group">
                  <label>Default Language</label>
                  <div className="language-selector">
                    <button className={`lang-option ${settings.defaultLanguage === "en" ? "active" : ""}`} onClick={() => setSettings({ ...settings, defaultLanguage: "en" })}>🇺🇸 English</button>
                    <button className={`lang-option ${settings.defaultLanguage === "ar" ? "active" : ""}`} onClick={() => setSettings({ ...settings, defaultLanguage: "ar" })}>🇸🇦 العربية</button>
                  </div>
                </div>
                <ToggleSwitch checked={settings.darkMode} onChange={() => handleToggle("darkMode")} label="Dark Mode (Admin)" description="Enable dark theme for admin panel." icon={settings.darkMode ? Moon : Sun} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Lock size={18} />
                <h3>Access Control</h3>
              </div>
              <div className="card-body">
                <div className="setting-input-group">
                  <label>Max Login Attempts</label>
                  <div className="range-input-wrap">
                    <input type="range" min="1" max="10" value={settings.maxLoginAttempts} onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })} />
                    <span className="range-value">{settings.maxLoginAttempts}</span>
                  </div>
                </div>
                <div className="setting-input-group">
                  <label>Session Timeout (minutes)</label>
                  <div className="range-input-wrap">
                    <input type="range" min="15" max="480" step="15" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })} />
                    <span className="range-value">{settings.sessionTimeout}m</span>
                  </div>
                </div>
                <ToggleSwitch checked={settings.twoFactorAuth} onChange={() => handleToggle("twoFactorAuth")} label="Two-Factor Authentication" description="Require 2FA for all admin accounts." icon={Key} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Bell size={18} />
                <h3>Notification Preferences</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.enableNotifications} onChange={() => handleToggle("enableNotifications")} label="Push Notifications" description="Send push notifications via Firebase FCM." icon={Bell} />
                <ToggleSwitch checked={settings.enableAnalytics} onChange={() => handleToggle("enableAnalytics")} label="Analytics Tracking" description="Track user behavior and platform usage." icon={Globe} />
              </div>
            </div>
          </div>
        )}

        {activeSection === "system" && (
          <div className="settings-grid">
            <div className="settings-card">
              <div className="card-title">
                <Database size={18} />
                <h3>System Actions</h3>
              </div>
              <div className="card-body">
                <ToggleSwitch checked={settings.autoBackup} onChange={() => handleToggle("autoBackup")} label="Automatic Backups" description="Daily automatic database backups." icon={Database} />
                <div className="system-actions">
                  <button className="system-btn secondary" onClick={handlePurgeCache}>
                    <Database size={16} />
                    Purge Cache
                  </button>
                  <button className="system-btn danger" onClick={() => { if (window.confirm("Restart all services?")) { toast.success("Restarting services..."); } }}>
                    <AlertTriangle size={16} />
                    Restart Services
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
          <span>Save All Settings</span>
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
