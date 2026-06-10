import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  RefreshCw,
  User,
  Calendar,
  Clock,
  ZoomIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";

const VerificationCenter = () => {
  const { t } = useTranslation();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin-ecommerce/all-users?status=${filter}`);
      setVerifications(res.data.verifications || res.data.data || []);
    } catch (err) {
      // Fallback: try users endpoint with KYC filter
      try {
        const res = await axiosInstance.get("/admin-ecommerce/all-users");
        setVerifications(res.data.users || res.data || []);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("admin.verification_center", "Verification Center")}</h2>
          <p className="text-slate-500">{t("admin.verification_desc", "Review and approve professional documents and identities.")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-xl text-sm font-bold border border-amber-500/20">
            {verifications.filter((v) => v.status === "pending").length} {t("admin.pending", "Pending")}
          </div>
          <button className="refresh-btn" onClick={fetchVerifications} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === f ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && verifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center">
          <Loader loading={true} />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center text-slate-400">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : verifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center text-slate-400">
          <ShieldCheck size={48} className="mx-auto mb-4" />
          <p>{t("admin.no_verifications", "No verifications found")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {verifications.map((verification, index) => (
            <motion.div
              key={verification._id || verification.userId || index}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    {verification.avatar ? (
                      <img src={verification.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{verification.username || verification.userId?.username || "Unknown"}</h4>
                    <p className="text-xs text-slate-500 capitalize">{verification.role?.replace("_", " ")} • {t("admin.applied", "Applied")} {verification.createdAt ? new Date(verification.createdAt).toLocaleDateString() : "N/A"}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                  verification.status === "pending" ? "bg-amber-100 text-amber-700" :
                  verification.status === "approved" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {verification.status || "pending"}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* ID Document */}
                  <div
                    className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => verification.documentPhoto && setSelectedDoc(verification.documentPhoto)}
                  >
                    {verification.documentPhoto ? (
                      <>
                        <img src={verification.documentPhoto} alt="ID" className="w-full h-full object-cover rounded-xl" />
                        <div className="absolute">
                          <ZoomIn size={16} className="text-white drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <>
                        <FileText size={24} className="text-slate-400 mb-2" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">{t("admin.national_id", "National ID")}</span>
                      </>
                    )}
                  </div>

                  {/* Selfie / Guide Document */}
                  <div
                    className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => verification.selfie && setSelectedDoc(verification.selfie)}
                  >
                    {verification.selfie ? (
                      <>
                        <img src={verification.selfie} alt="Selfie" className="w-full h-full object-cover rounded-xl" />
                      </>
                    ) : (
                      <>
                        <FileText size={24} className="text-slate-400 mb-2" />
                        <span className="text-[10px] font-bold uppercase text-slate-500">{t("admin.selfie", "Selfie")}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Verification Info */}
                {verification.idVerificationData && (
                  <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1">
                    <p><span className="font-semibold">{t("admin.extracted_id", "Extracted ID")}:</span> {verification.idVerificationData.extractedId || "N/A"}</p>
                    <p><span className="font-semibold">{t("admin.dob", "Date of Birth")}:</span> {verification.idVerificationData.extractedDateOfBirth || "N/A"}</p>
                  </div>
                )}

                {verification.riskScore && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{t("admin.risk_score", "Risk")}:</span>
                    <span className={`px-2 py-0.5 rounded-full font-bold ${
                      verification.riskScore.level === "low" ? "bg-green-100 text-green-700" :
                      verification.riskScore.level === "medium" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {verification.riskScore.level}
                    </span>
                  </div>
                )}
              </div>

              {filter === "pending" && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button
                    className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    onClick={() => handleApprove(verification._id || verification.userId)}
                  >
                    <CheckCircle size={16} /> {t("admin.approve", "Approve")}
                  </button>
                  <button
                    className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                    onClick={() => handleReject(verification._id || verification.userId)}
                  >
                    <XCircle size={16} /> {t("admin.reject", "Reject")}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDoc(null)}
          >
            <motion.img
              src={selectedDoc}
              alt="Document"
              className="max-w-full max-h-[90vh] rounded-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationCenter;
