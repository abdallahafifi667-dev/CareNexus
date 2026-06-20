import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Bell,
  Globe,
  ShieldCheck,
  ChevronRight,
  Search,
  Fingerprint,
  KeyRound,
  X,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./PatientSettings.scss";

const PatientSettings = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [activeModal, setActiveModal] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    messageAlerts: true,
    promotional: false,
  });

  const settingsSections = [
    {
      title: t("settings.account", "Account Settings"),
      icon: KeyRound,
      items: [
        {
          id: "password",
          icon: Lock,
          label: t("settings.change_password", "Change Password"),
          desc: t("settings.password_desc", "Update your password for better security."),
          color: "#3b82f6",
          action: () => setActiveModal("password"),
        },
        {
          id: "notifications",
          icon: Bell,
          label: t("settings.notifications", "Notifications"),
          desc: t("settings.notif_desc", "Manage how you receive alerts and updates."),
          color: "#f59e0b",
          action: () => setActiveModal("notifications"),
        },
        {
          id: "language",
          icon: Globe,
          label: t("settings.language", "Language"),
          desc: t("settings.lang_desc", "Choose your preferred language (Arabic/English)."),
          color: "#10b981",
          action: () => setActiveModal("language"),
        },
      ],
    },
    {
      title: t("settings.security_finance", "Security & Finance"),
      icon: ShieldCheck,
      items: [
        {
          id: "verification",
          icon: Fingerprint,
          label: t("settings.identity_verification", "Identity Verification"),
          desc: t("settings.kyc_desc", "Verify your ID for more features."),
          color: "#6366f1",
          badge: user?.documentation ? t("profile.verified", "Verified") : t("profile.pending", "Pending"),
          badgeColor: user?.documentation ? "#10b981" : "#f59e0b",
          action: () => setActiveModal("verification"),
        },
      ],
    },
  ];

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPass.length < 8) {
      setPasswordError(t("auth.password_too_short", "Password must be at least 8 characters long."));
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError(t("auth.password_mismatch", "Passwords do not match."));
      return;
    }

    setPasswordSuccess(t("auth.password_success", "Password changed successfully!"));
    setPasswordForm({ current: "", newPass: "", confirm: "" });
    setTimeout(() => {
      setActiveModal(null);
      setPasswordSuccess("");
    }, 1500);
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lng", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    setActiveModal(null);
  };

  return (
    <div className="patient-settings-page">
      <header className="page-header">
        <h1>{t("nav.settings", "Settings")}</h1>
        <p>{t("settings.manage_desc", "Customize your experience and manage security.")}</p>
      </header>

      <div className="settings-container">
        {/* Sidebar Navigation */}
        <div className="settings-sidebar">
          <div className="search-settings">
            <Search size={18} />
            <input
              type="text"
              placeholder={t("settings.search", "Search settings...")}
            />
          </div>
          <div className="settings-nav">
            {settingsSections.map((section, idx) => (
              <div key={idx} className="settings-nav-group">
                <div className="nav-group-title">
                  <section.icon size={16} />
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className={`settings-nav-item ${activeModal === item.id ? "active" : ""}`}
                    onClick={item.action}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {settingsSections.map((section, idx) => (
            <motion.div
              key={idx}
              className="settings-group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="group-header">
                <div className="group-icon">
                  <section.icon size={20} />
                </div>
                <h3 className="group-title">{section.title}</h3>
              </div>
              <div className="items-list">
                {section.items.map((item) => (
                  <motion.button
                    key={item.id}
                    className="settings-item"
                    whileHover={{ x: 5 }}
                    onClick={item.action}
                  >
                    <div
                      className="item-icon-wrapper"
                      style={{
                        backgroundColor: `${item.color}12`,
                        color: item.color,
                      }}
                    >
                      <item.icon size={22} />
                    </div>
                    <div className="item-details">
                      <div className="item-label-row">
                        <h4>{item.label}</h4>
                        {item.badge && (
                          <span
                            className="item-badge"
                            style={{
                              backgroundColor: `${item.badgeColor}15`,
                              color: item.badgeColor,
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p>{item.desc}</p>
                    </div>
                    <ChevronRight size={20} className="arrow" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Password Modal */}
      <AnimatePresence>
        {activeModal === "password" && (
          <motion.div
            className="settings-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="settings-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t("settings.change_password", "Change Password")}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handlePasswordChange}>
                <div className="modal-body">
                  {passwordError && (
                    <div className="alert-error">{passwordError}</div>
                  )}
                  {passwordSuccess && (
                    <div className="alert-success">
                      <Check size={16} /> {passwordSuccess}
                    </div>
                  )}
                  <div className="input-group">
                    <label>{t("settings.current_password", "Current Password")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        placeholder={t("settings.enter_current_password", "Enter current password")}
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setPasswordForm((p) => ({})) || setShowPassword((s) => ({ ...s, current: !s.current }))}
                      >
                        {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>{t("settings.new_password", "New Password")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        placeholder={t("auth.min_8_chars", "Minimum 8 characters")}
                        value={passwordForm.newPass}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((s) => ({ ...s, new: !s.new }))}
                      >
                        {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="input-group">
                    <label>{t("settings.confirm_password_label", "Confirm New Password")}</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder={t("auth.repeat_password", "Repeat new password")}
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword((s) => ({ ...s, confirm: !s.confirm }))}
                      >
                        {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={() => setActiveModal(null)}>
                    {t("common.close", "Close")}
                  </button>
                  <button type="submit" className="btn-save">
                    {t("settings.update", "Update")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Modal */}
      <AnimatePresence>
        {activeModal === "notifications" && (
          <motion.div
            className="settings-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="settings-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t("settings.notifications", "Notifications")}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="toggle-list">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>{t("settings.order_updates", "Order Updates")}</h4>
                      <p>{t("settings.order_updates_desc", "Receive push notifications for new order requests.")}</p>
                    </div>
                    <button
                      className={`toggle-switch ${notifSettings.orderUpdates ? "on" : ""}`}
                      onClick={() => setNotifSettings((s) => ({ ...s, orderUpdates: !s.orderUpdates }))}
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>{t("settings.message_alerts", "Message Alerts")}</h4>
                      <p>{t("settings.message_alerts_desc", "Get notified when someone sends you a message.")}</p>
                    </div>
                    <button
                      className={`toggle-switch ${notifSettings.messageAlerts ? "on" : ""}`}
                      onClick={() => setNotifSettings((s) => ({ ...s, messageAlerts: !s.messageAlerts }))}
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <h4>{t("settings.promotional", "Promotional")}</h4>
                      <p>{t("settings.promotional_desc", "Receive news and special offers.")}</p>
                    </div>
                    <button
                      className={`toggle-switch ${notifSettings.promotional ? "on" : ""}`}
                      onClick={() => setNotifSettings((s) => ({ ...s, promotional: !s.promotional }))}
                    >
                      <div className="toggle-knob" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-save" onClick={() => setActiveModal(null)}>
                  {t("common.save", "Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {activeModal === "language" && (
          <motion.div
            className="settings-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="settings-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t("settings.language", "Language")}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                <div className="language-options">
                  <button
                    className={`language-option ${i18n.language === "ar" ? "selected" : ""}`}
                    onClick={() => handleLanguageChange("ar")}
                  >
                    <span className="lang-flag">🇪🇬</span>
                    <span className="lang-name">العربية</span>
                    {i18n.language === "ar" && <Check size={18} className="lang-check" />}
                  </button>
                  <button
                    className={`language-option ${i18n.language === "en" ? "selected" : ""}`}
                    onClick={() => handleLanguageChange("en")}
                  >
                    <span className="lang-flag">🇺🇸</span>
                    <span className="lang-name">English</span>
                    {i18n.language === "en" && <Check size={18} className="lang-check" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Modal */}
      <AnimatePresence>
        {activeModal === "verification" && (
          <motion.div
            className="settings-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              className="settings-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{t("settings.identity_verification", "Identity Verification")}</h3>
                <button className="close-btn" onClick={() => setActiveModal(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body">
                {user?.documentation ? (
                  <div className="verification-status verified">
                    <Check size={48} />
                    <h4>{t("profile.verified", "Verified")}</h4>
                    <p>{t("settings.verified_desc", "Your identity has been verified successfully.")}</p>
                  </div>
                ) : (
                  <div className="verification-status pending">
                    <Fingerprint size={48} />
                    <h4>{t("profile.pending_verification", "Pending Verification")}</h4>
                    <p>{t("settings.kyc_desc", "Verify your identity to increase trust and access more features.")}</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setActiveModal(null)}>
                  {t("common.close", "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientSettings;
