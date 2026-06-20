import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Users, Search, Filter, ShieldCheck,
  Eye, Ban, CheckCircle, Mail, Phone,
  MapPin, Calendar, AlertCircle, RefreshCw, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Seo from "../../../shared/components/SEO/SEO";
import { UserCheck, UserPlus, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import "../AdminSettings.scss";
import "./UserManagement.scss";

// Mock users data
const mockUsers = [
  { _id: "u1", username: "Dr. Ahmed Hassan", email: "dr.ahmed@carenexus.com", role: "doctor", status: "active", phone: "+201012345678", country: "Egypt", createdAt: "2025-01-15T10:00:00Z", kycStatus: "verified", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Ahmed&backgroundColor=0088ff" },
  { _id: "u2", username: "Dr. Sara Mahmoud", email: "dr.sara@carenexus.com", role: "doctor", status: "active", phone: "+201023456789", country: "Egypt", createdAt: "2025-02-20T10:00:00Z", kycStatus: "verified", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Sara&backgroundColor=0088ff" },
  { _id: "u3", username: "Khaled Mostafa", email: "patient.khaled@carenexus.com", role: "patient", status: "active", phone: "+201034567890", country: "Egypt", createdAt: "2025-03-10T10:00:00Z", kycStatus: "pending", avatar: null },
  { _id: "u4", username: "Nour El-Hassan", email: "patient.nour@carenexus.com", role: "patient", status: "active", phone: "+201045678901", country: "Egypt", createdAt: "2025-03-15T10:00:00Z", kycStatus: "verified", avatar: null },
  { _id: "u5", username: "Layla Ahmed", email: "patient.layla@carenexus.com", role: "patient", status: "suspended", phone: "+201056789012", country: "Egypt", createdAt: "2025-04-01T10:00:00Z", kycStatus: "pending", avatar: null },
  { _id: "u6", username: "Helmy Pharmacy", email: "pharmacy.helmy@carenexus.com", role: "pharmacy", status: "active", phone: "+201067890123", country: "Egypt", createdAt: "2025-01-05T10:00:00Z", kycStatus: "verified", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Helmy&backgroundColor=8b5cf6" },
  { _id: "u7", username: "Shorouk Pharmacy", email: "pharmacy.shorouk@carenexus.com", role: "pharmacy", status: "active", phone: "+201078901234", country: "Egypt", createdAt: "2025-01-10T10:00:00Z", kycStatus: "verified", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Shorouk&backgroundColor=8b5cf6" },
  { _id: "u8", username: "FastShip Express", email: "shipping.fast@carenexus.com", role: "shipping_company", status: "active", phone: "+201089012345", country: "Egypt", createdAt: "2025-02-01T10:00:00Z", kycStatus: "verified", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FastShip&backgroundColor=f59e0b" },
  { _id: "u9", username: "CareDelivery Co.", email: "shipping.care@carenexus.com", role: "shipping_company", status: "pending_verification", phone: "+201090123456", country: "Egypt", createdAt: "2025-05-01T10:00:00Z", kycStatus: "pending", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CareDelivery&backgroundColor=f59e0b" },
  { _id: "u10", username: "Dr. Omar Farouk", email: "dr.omar@carenexus.com", role: "doctor", status: "pending_verification", phone: "+201001234567", country: "Egypt", createdAt: "2025-06-01T10:00:00Z", kycStatus: "pending", avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Dr+Omar&backgroundColor=0088ff" },
  { _id: "u11", username: "Fatma Ali", email: "nurse.fatma@carenexus.com", role: "nursing", status: "active", phone: "+201011223344", country: "Egypt", createdAt: "2025-04-15T10:00:00Z", kycStatus: "verified", avatar: null },
  { _id: "u12", username: "Yousef Samir", email: "patient.yousef@carenexus.com", role: "patient", status: "active", phone: "+201022334455", country: "Egypt", createdAt: "2025-05-20T10:00:00Z", kycStatus: "verified", avatar: null },
];

const UserManagement = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(mockUsers);
    } catch (err) {
      setError(t("admin.fetch_error", "Failed to fetch users"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Filter users based on search, role, and status
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSuspendUser = (userId) => {
    if (!window.confirm(t("admin.confirm_suspend", "Are you sure you want to suspend this user?"))) return;
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "suspended" } : u));
    toast.success(t("admin.user_suspended", "User suspended successfully"));
  };

  const handleActivateUser = (userId) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: "active" } : u));
    toast.success(t("admin.user_activated", "User activated successfully"));
  };

  const roles = ["all", "doctor", "nursing", "patient", "pharmacy", "shipping_company", "admin"];
  const statuses = ["all", "active", "suspended", "pending_verification"];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <div className="admin-user-mgmt admin-settings-page">
        <div className="dashboard-header-premium">
          <div>
            <h2>{t("admin.user_management", "User Management")}</h2>
            <p>{t("admin.user_management_desc", "Manage all users, roles, and account statuses.")}</p>
          </div>
          <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
            <RefreshCw size={16} className={loading ? "spinning" : ""} />
            <span>{t("admin.actions", "Refresh")}</span>
          </button>
        </div>

        {/* Premium Stats Grid */}
        <div className="users-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", marginBottom: "32px" }}>
          {[
            { label: t("admin.total_users", "Total Users"), value: users.length, icon: Users, color: "#3b82f6", bg: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)", action: () => { setRoleFilter("all"); setStatusFilter("all"); } },
            { label: t("admin.active_users", "Active Users"), value: users.filter(u => u.status === "active").length, icon: CheckCircle, color: "#10b981", bg: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)", action: () => { setStatusFilter("active"); setRoleFilter("all"); } },
            { label: t("admin.doctors", "Doctors"), value: users.filter(u => u.role === "doctor").length, icon: ShieldCheck, color: "#f59e0b", bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)", action: () => { setRoleFilter("doctor"); setStatusFilter("all"); } },
            { label: t("admin.suspended_users", "Suspended"), value: users.filter(u => u.status === "suspended").length, icon: Ban, color: "#ef4444", bg: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)", action: () => { setStatusFilter("suspended"); setRoleFilter("all"); } }
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants} onClick={stat.action} className="stat-card" style={{ cursor: "pointer", padding: "24px", borderRadius: "24px", backgroundColor: "#fff", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)", display: "flex", alignItems: "center", gap: "20px", transition: "all 0.3s ease" }} whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, boxShadow: `0 8px 16px ${stat.bg.replace('0.15)', '0.3)')}` }}>
                <stat.icon size={28} strokeWidth={2.5} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", lineHeight: "1.2" }}>{stat.value}</span>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="filters-container" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", background: "#fff", padding: "16px", borderRadius: "20px", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02)" }}>
          <div className="search-bar-premium flex-1" style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "12px 20px", borderRadius: "16px", flex: 1, border: "1px solid #e2e8f0" }}>
            <Search size={20} color="#94a3b8" />
            <input
              type="text"
              placeholder={t("admin.search_users", "Search by name, email, or phone...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "15px", color: "#334155" }}
            />
          </div>
          <div className="filter-group" style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "12px 20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <Filter size={18} color="#94a3b8" />
            <select style={{ border: "none", background: "transparent", outline: "none", color: "#334155", fontWeight: "600", fontSize: "14px", cursor: "pointer" }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? t("admin.all_roles", "All Roles") : r.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group" style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "12px 20px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
            <Activity size={18} color="#94a3b8" />
            <select style={{ border: "none", background: "transparent", outline: "none", color: "#334155", fontWeight: "600", fontSize: "14px", cursor: "pointer" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? t("admin.all_statuses", "All Statuses") : s.replace("_", " ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="premium-table-container" style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
          {loading && users.length === 0 ? (
            <div className="skeleton-loading-table">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-row">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="error-state" style={{ padding: "60px 20px", textAlign: "center" }}>
              <AlertCircle size={48} color="#ef4444" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "#ef4444", fontWeight: "600" }}>{error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="empty-state" style={{ padding: "80px 20px", textAlign: "center", background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}>
              <div style={{ width: "80px", height: "80px", background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
                 <Users size={40} color="#64748b" />
              </div>
              <h3 style={{ fontSize: "20px", color: "#334155", fontWeight: "800", margin: "0 0 8px 0" }}>No Users Found</h3>
              <p style={{ color: "#64748b", margin: 0 }}>{t("admin.no_users", "Try adjusting your filters or search terms.")}</p>
            </div>
          ) : (
            <>
              <table className="premium-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                  <tr>
                    <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{t("admin.user", "User")}</th>
                    <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{t("admin.role", "Role")}</th>
                    <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{t("admin.status", "Status")}</th>
                    <th style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", textAlign: "left" }}>{t("admin.joined", "Joined")}</th>
                    <th className="text-right" style={{ padding: "16px 24px", color: "#64748b", fontSize: "13px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", textAlign: "right" }}>{t("admin.actions", "Actions")}</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                      <motion.tr key={user._id || user.id} variants={itemVariants} exit={{ opacity: 0 }} style={{ borderBottom: "1px solid #f1f5f9", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            {user.avatar ? (
                              <img src={user.avatar} alt="" style={{ width: "48px", height: "48px", borderRadius: "16px", objectFit: "cover", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }} />
                            ) : (
                              <div style={{ width: "48px", height: "48px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", boxShadow: "0 4px 10px rgba(99, 102, 241, 0.1)" }}>
                                <User size={22} strokeWidth={2.5} />
                              </div>
                            )}
                            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                              <span style={{ fontWeight: "800", color: "#0f172a", fontSize: "15px" }}>{user.username || user.name || "Unknown"}</span>
                              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>{user.email?.address || user.email || "No email"}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0" }}>
                            {user.role?.replace("_", " ") || "N/A"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px" }}>
                          <span style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.5px", background: user.status === "active" ? "rgba(16, 185, 129, 0.1)" : user.status === "suspended" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)", color: user.status === "active" ? "#10b981" : user.status === "suspended" ? "#ef4444" : "#d97706", border: `1px solid ${user.status === "active" ? "rgba(16, 185, 129, 0.2)" : user.status === "suspended" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)"}` }}>
                            {user.status || "active"}
                          </span>
                        </td>
                        <td style={{ padding: "16px 24px", color: "#64748b", fontWeight: "600", fontSize: "14px" }}>
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                            <button onClick={() => setSelectedUser(user)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)"} title={t("admin.view_details", "View Details")}>
                              <Eye size={18} strokeWidth={2.5} />
                            </button>
                            {(user.status === "active" || !user.status) ? (
                              <button onClick={() => handleSuspendUser(user._id || user.id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"} title={t("admin.suspend", "Suspend")}>
                                <Ban size={18} strokeWidth={2.5} />
                              </button>
                            ) : (
                              <button onClick={() => handleActivateUser(user._id || user.id)} style={{ padding: "8px", borderRadius: "10px", border: "none", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(16, 185, 129, 0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)"} title={t("admin.activate", "Activate")}>
                                <CheckCircle size={18} strokeWidth={2.5} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>

              {totalPages > 1 && (
                <div className="pagination" style={{ padding: "20px", display: "flex", justifyContent: "center", gap: "8px", borderTop: "1px solid #f1f5f9" }}>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      style={{ width: "36px", height: "36px", borderRadius: "10px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", background: page === p ? "#3b82f6" : "#f1f5f9", color: page === p ? "#fff" : "#64748b" }}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="premium-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="premium-modal-content max-w-lg"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-profile">
                <div className="avatar-lg">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="" />
                  ) : (
                    <Users size={32} className="text-muted" />
                  )}
                </div>
                <div>
                  <h3>{selectedUser.username}</h3>
                  <span className={`role-badge role-${selectedUser.role}`}>{selectedUser.role?.replace("_", " ")}</span>
                </div>
              </div>

              <div className="user-details-list">
                <div className="detail-item">
                  <Mail size={16} />
                  <span>{selectedUser.email?.address || selectedUser.email || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{selectedUser.phone || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{selectedUser.Address || selectedUser.country || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="detail-item">
                  <ShieldCheck size={16} />
                  <span>KYC Status: <strong className={selectedUser.kycStatus === 'verified' ? 'text-green-500' : 'text-amber-500'}>{selectedUser.kycStatus || 'pending'}</strong></span>
                </div>
              </div>

              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setSelectedUser(null)}>
                  {t("common.close", "Close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default UserManagement;
