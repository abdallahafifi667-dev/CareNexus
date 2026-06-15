import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Users, Search, Filter, ShieldCheck,
  Eye, Ban, CheckCircle, Mail, Phone,
  MapPin, Calendar, AlertCircle, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";
import Seo from "../../../shared/components/SEO/SEO";
import { UserCheck, UserPlus, Activity, TrendingUp, ArrowUpRight } from "lucide-react";
import "../AdminSettings.scss";
import "./UserManagement.scss";

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
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("q", searchTerm);
      params.append("page", page);
      params.append("limit", 20);

      const res = await axiosInstance.get(`/admin-ecommerce/all-users?${params.toString()}`);
      setUsers(res.data.users || res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data.users || res.data || []);
      } catch (fallbackErr) {
        setError(t("admin.fetch_error", "Failed to fetch users"));
      }
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter, searchTerm, page, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSuspendUser = async (userId) => {
    if (!window.confirm(t("admin.confirm_suspend", "Are you sure you want to suspend this user?"))) return;
    try {
      await axiosInstance.patch(`/admin-ecommerce/users/${userId}/suspend`);
      toast.success(t("admin.user_suspended", "User suspended successfully"));
      fetchUsers();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await axiosInstance.patch(`/admin-ecommerce/users/${userId}/activate`);
      toast.success(t("admin.user_activated", "User activated successfully"));
      fetchUsers();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
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
        <div className="users-stats-grid">
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4 }}>
            <div className="stat-icon-wrap" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}>
              <Users size={24} color="white" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{users.length}</span>
              <span className="stat-label">{t("admin.total_users", "Total Users")}</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4 }}>
            <div className="stat-icon-wrap" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
              <CheckCircle size={24} color="white" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{users.filter(u => u.status === "active").length}</span>
              <span className="stat-label">{t("admin.active_users", "Active Users")}</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4 }}>
            <div className="stat-icon-wrap" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
              <ShieldCheck size={24} color="white" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{users.filter(u => u.role !== "patient").length}</span>
              <span className="stat-label">{t("admin.doctors", "Providers")}</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="stat-card" whileHover={{ y: -4 }}>
            <div className="stat-icon-wrap" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
              <Ban size={24} color="white" />
            </div>
            <div className="stat-details">
              <span className="stat-value">{users.filter(u => u.status === "suspended").length}</span>
              <span className="stat-label">{t("admin.suspended_users", "Suspended")}</span>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="search-bar-premium flex-1">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder={t("admin.search_users", "Search by name, email, or phone...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} className="text-muted" />
            <select className="premium-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? t("admin.all_roles", "All Roles") : r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select className="premium-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? t("admin.all_statuses", "All Statuses") : s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="premium-table-container">
          {loading && users.length === 0 ? (
            <div className="loading-state">
              <Loader loading={true} />
            </div>
          ) : error ? (
            <div className="error-state">
              <AlertCircle size={48} />
              <p>{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>{t("admin.no_users", "No users found")}</p>
            </div>
          ) : (
            <>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>{t("admin.user", "User")}</th>
                    <th>{t("admin.role", "Role")}</th>
                    <th>{t("admin.status", "Status")}</th>
                    <th>{t("admin.joined", "Joined")}</th>
                    <th className="text-right">{t("admin.actions", "Actions")}</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  <AnimatePresence>
                    {users.map((user) => (
                      <motion.tr key={user._id || user.id} variants={itemVariants} exit={{ opacity: 0 }}>
                        <td>
                          <div className="user-cell">
                            <div className="avatar-wrapper">
                              {user.avatar ? (
                                <img src={user.avatar} alt="" />
                              ) : (
                                <Users size={16} />
                              )}
                            </div>
                            <div className="user-info">
                              <span className="user-name">{user.username || user.name || "Unknown"}</span>
                              <span className="user-email">{user.email?.address || user.email || "No email"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-pill role-${user.role || 'default'}`}>
                            {user.role?.replace("_", " ") || "N/A"}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill status-${user.status || 'active'}`}>
                            {user.status || "active"}
                          </span>
                        </td>
                        <td className="text-muted">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="text-right">
                          <div className="action-buttons">
                            <button
                              className="action-btn view"
                              onClick={() => setSelectedUser(user)}
                              title={t("admin.view_details", "View Details")}
                            >
                              <Eye size={16} />
                            </button>
                            {(user.status === "active" || !user.status) ? (
                              <button
                                className="action-btn suspend"
                                onClick={() => handleSuspendUser(user._id || user.id)}
                                title={t("admin.suspend", "Suspend")}
                              >
                                <Ban size={16} />
                              </button>
                            ) : (
                              <button
                                className="action-btn activate"
                                onClick={() => handleActivateUser(user._id || user.id)}
                                title={t("admin.activate", "Activate")}
                              >
                                <CheckCircle size={16} />
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
                <div className="pagination">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={page === p ? "active" : ""}
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
