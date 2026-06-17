import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck, FileText, CheckCircle, XCircle,
  AlertCircle, RefreshCw, User, ZoomIn
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import "../AdminSettings.scss";
import "./VerificationCenter.scss";

const VerificationCenter = () => {
  const { t, i18n } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin-ecommerce/all-users?status=${filter}`);
      const data = res.data;
      setVerifications(Array.isArray(data) ? data : (data.users || data.data || []));
    } catch (err) {
      try {
        const res = await axiosInstance.get("/admin-ecommerce/all-users");
        const data = res.data;
        setVerifications(Array.isArray(data) ? data : (data.users || data.data || []));
      } catch (fallbackErr) {
        setError(t("admin.fetch_error", "Failed to fetch verifications"));
      }
    } finally {
      setLoading(false);
    }
  }, [filter, t]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleApprove = async (userId) => {
    try {
      await axiosInstance.patch(`/admin/verifications/${userId}/approve`);
      toast.success(t("admin.approved", "Verification approved"));
      fetchVerifications();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const handleReject = async (userId) => {
    const reason = prompt(t("admin.reject_reason", "Enter rejection reason:"));
    if (!reason) return;
    try {
      await axiosInstance.patch(`/admin/verifications/${userId}/reject`, { reason });
      toast.success(t("admin.rejected", "Verification rejected"));
      fetchVerifications();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const filters = ["pending", "approved", "rejected"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`admin-verification admin-settings-page ${i18n.language === 'ar' ? 'rtl' : ''}`}>
      <div className="dashboard-header-premium" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h2>{t("admin.verification_center", "Verification Center")}</h2>
          <p>{t("admin.verification_desc", "Review and approve professional documents and identities.")}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {verifications.filter((v) => v.status === "pending").length > 0 && (
            <div className="pending-badge-premium">
              <span>{verifications.filter((v) => v.status === "pending").length}</span>
              {t("admin.pending", "Pending")}
            </div>
          )}
          <button className="refresh-btn-premium" onClick={fetchVerifications} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
          </button>
        </div>
      </div>

      <div className="premium-tabs" style={{ marginBottom: "2rem" }}>
        {filters.map((f) => (
          <button
            key={f}
            className={`premium-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "pending" && t("admin.pending", "Pending")}
            {f === "approved" && t("admin.approved", "Approved")}
            {f === "rejected" && t("admin.rejected", "Rejected")}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        {loading && verifications.length === 0 ? (
          <div className="skeleton-loading-list">
             {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-item">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <AlertCircle size={48} />
            <p>{error}</p>
          </div>
        ) : verifications.length === 0 ? (
          <div className="empty-state" style={{ padding: "60px 20px", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "2px dashed #cbd5e1", borderRadius: "24px" }}>
            <div style={{ width: "80px", height: "80px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
               <ShieldCheck size={40} color="#64748b" />
            </div>
            <h3 style={{ fontSize: "20px", color: "#334155", fontWeight: "800", margin: "0 0 8px 0" }}>{t("admin.all_caught_up", "All Caught Up!")}</h3>
            <p style={{ color: "#64748b", margin: 0 }}>{t("admin.no_verifications", "There are no verifications to review right now.")}</p>
          </div>
        ) : (
          <motion.div
            className="verification-grid"
            variants={containerVariants}
            initial={false}
            animate="visible"
          >
            {verifications.map((verification, index) => (
              <motion.div
                key={verification._id || verification.userId || index}
                className="verification-card"
                variants={itemVariants}
                style={{ borderRadius: "20px", backgroundColor: "#fff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
              >
                <div className="card-header">
                  <div className="user-brief">
                    <div className="avatar-wrapper">
                      {verification.avatar ? (
                        <img src={verification.avatar} alt="" />
                      ) : (
                        <User size={20} className="text-muted" />
                      )}
                    </div>
                    <div className="info">
                      <h4>{verification.username || verification.userId?.username || t("common.unknown", "Unknown")}</h4>
                      <p>
                        <span className="role-text">{verification.role?.replace("_", " ")}</span> • {t("admin.applied", "Applied")} {verification.createdAt ? new Date(verification.createdAt).toLocaleDateString() : t("common.na", "N/A")}
                      </p>
                    </div>
                  </div>
                  <span className={`status-pill status-${verification.status || "pending"}`}>
                    {verification.status || "pending"}
                  </span>
                </div>

                <div className="card-body">
                  <div className="documents-grid">
                    <div
                      className="document-preview"
                      onClick={() => verification.documentPhoto && setSelectedDoc(verification.documentPhoto)}
                    >
                      {verification.documentPhoto ? (
                        <>
                          <img src={verification.documentPhoto} alt="ID" />
                          <div className="zoom-overlay">
                            <ZoomIn size={16} />
                          </div>
                        </>
                      ) : (
                        <div className="placeholder">
                          <FileText size={24} />
                          <span>{t("admin.national_id", "National ID")}</span>
                        </div>
                      )}
                    </div>

                    <div
                      className="document-preview"
                      onClick={() => verification.selfie && setSelectedDoc(verification.selfie)}
                    >
                      {verification.selfie ? (
                        <>
                          <img src={verification.selfie} alt="Selfie" />
                          <div className="zoom-overlay">
                            <ZoomIn size={16} />
                          </div>
                        </>
                      ) : (
                        <div className="placeholder">
                          <FileText size={24} />
                          <span>{t("admin.selfie", "Selfie")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {verification.idVerificationData && (
                    <div className="extracted-data">
                      <p><strong>{t("admin.extracted_id", "Extracted ID")}:</strong> {verification.idVerificationData.extractedId || t("common.na", "N/A")}</p>
                      <p><strong>{t("admin.dob", "Date of Birth")}:</strong> {verification.idVerificationData.extractedDateOfBirth || t("common.na", "N/A")}</p>
                    </div>
                  )}

                  {verification.riskScore && (
                    <div className="risk-score">
                      <strong>{t("admin.risk_score", "Risk")}:</strong>
                      <span className={`risk-pill risk-${verification.riskScore.level}`}>
                        {verification.riskScore.level}
                      </span>
                    </div>
                  )}
                </div>

                {filter === "pending" && (
                  <div className="card-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleApprove(verification._id || verification.userId)}
                    >
                      <CheckCircle size={16} /> {t("admin.approve", "Approve")}
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleReject(verification._id || verification.userId)}
                    >
                      <XCircle size={16} /> {t("admin.reject", "Reject")}
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            className="document-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
          >
            <motion.img
              src={selectedDoc}
              alt="Document"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationCenter;
