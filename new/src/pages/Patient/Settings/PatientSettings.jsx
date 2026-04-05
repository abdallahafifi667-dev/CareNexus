import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Bell,
  Globe,
  Smartphone,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import "./PatientSettings.scss";

const PatientSettings = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  const settingsSections = [
    {
      title: t("settings.account", "Account Settings"),
      items: [
        {
          id: "password",
          icon: Lock,
          label: t("settings.change_password", "Change Password"),
          desc: t(
            "settings.password_desc",
            "Update your password for better security.",
          ),
        },
        {
          id: "notifications",
          icon: Bell,
          label: t("settings.notifications", "Notifications"),
          desc: t(
            "settings.notif_desc",
            "Manage how you receive alerts and updates.",
          ),
        },
        {
          id: "language",
          icon: Globe,
          label: t("settings.language", "Language"),
          desc: t(
            "settings.lang_desc",
            "Choose your preferred language (Arabic/English).",
          ),
        },
      ],
    },
    {
      title: t("settings.security_finance", "Security & Finance"),
      items: [
        {
          id: "verification",
          icon: ShieldCheck,
          label: t("settings.identity_verification", "Identity Verification"),
          desc: t("settings.kyc_desc", "Verify your ID for more features."),
        },
        {
          id: "billing",
          icon: CreditCard,
          label: t("settings.billing_methods", "Billing Methods"),
          desc: t(
            "settings.billing_desc",
            "Manage your payment cards and wallet.",
          ),
        },
        {
          id: "devices",
          icon: Smartphone,
          label: t("settings.logged_devices", "Logged Devices"),
          desc: t(
            "settings.devices_desc",
            "See which devices are logged into your account.",
          ),
        },
      ],
    },
  ];

  return (
    <div className="patient-settings-page">
      <header className="page-header">
        <h1>{t("nav.settings", "Settings")}</h1>
        <p>
          {t(
            "settings.manage_desc",
            "Customize your experience and manage security.",
          )}
        </p>
      </header>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="search-settings">
            <Search size={18} />
            <input
              type="text"
              placeholder={t("settings.search", "Search settings...")}
            />
          </div>
        </div>

        <div className="settings-content">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="settings-group">
              <h3 className="group-title">{section.title}</h3>
              <div className="items-list">
                {section.items.map((item) => (
                  <motion.div
                    key={item.id}
                    className="settings-item"
                    whileHover={{ x: 5 }}
                  >
                    <div className="item-icon-wrapper">
                      <item.icon size={22} />
                    </div>
                    <div className="item-details">
                      <h4>{item.label}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <ChevronRight size={20} className="arrow" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientSettings;
