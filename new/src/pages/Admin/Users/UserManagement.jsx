import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  ShieldX,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  RefreshCw,
  UserCheck,
  UserX,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";
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
      // Fallback: try users endpoint
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

  const getRoleColor = (role) => {
    const colors = {
      doctor: "#3b82f6",
      nursing: "#8b5cf6",
      patient: "#10b981",
      pharmacy: "#f59e0b",
      shipping_company: "#06b6d4",
      admin: "#ef4444",
    };
    return colors[role] || "#6b7280";
  };

  const getStatusColor = (status) => {
    const colors = { active: "#10b981", suspended: "#ef4444", pending_verification: "#f59e0b" };
    return colors[status] || "#6b7280";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("admin.user_management", "User Management")}</h2>
          <p className="text-slate-500">{t("admin.user_management_desc", "Manage all users, roles, and account statuses.")}</p>
        </div>
        <button className="refresh-btn" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="search-box flex-1 min-w-[200px]">
            <Search size={18} />
            <input
              type="text"
              placeholder={t("admin.search_users", "Search by name, email, or phone...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <Filter size={16} />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === "all" ? t("admin.all_roles", "All Roles") : r.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? t("admin.all_statuses", "All Statuses") : s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="p-20 text-center">
            <Loader loading={true} />
          </div>
        ) : error ? (
          <div className="p-20 text-center text-slate-400">
            <AlertCircle size={48} className="mx-auto mb-4" />
            <p>{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            <Users size={48} className="mx-auto mb-4" />
            <p>{t("admin.no_users", "No users found")}</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.user", "User")}</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.role", "Role")}</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.status", "Status")}</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.joined", "Joined")}</th>
                <th className="text-right p-4 text-sm font-semibold text-slate-500">{t("admin.actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id || user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Users size={18} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{user.username || user.name || "Unknown"}</p>
                        <p className="text-xs text-slate-500">{user.email?.address || user.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                      style={{
                        backgroundColor: `${getRoleColor(user.role)}15`,
                        color: getRoleColor(user.role),
                      }}
                    >
                      {user.role?.replace("_", " ") || "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold capitalize"
                      style={{
                        backgroundColor: `${getStatusColor(user.status || "active")}15`,
                        color: getStatusColor(user.status || "active"),
                      }}
                    >
                      {user.status || "active"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setSelectedUser(user)}
                        title={t("admin.view_details", "View Details")}
                      >
                        <Eye size={16} className="text-slate-400" />
                      </button>
                      {(user.status === "active" || !user.status) ? (
                        <button
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleSuspendUser(user._id || user.id)}
                          title={t("admin.suspend", "Suspend")}
                        >
                          <Ban size={16} className="text-red-400" />
                        </button>
                      ) : (
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          onClick={() => handleActivateUser(user._id || user.id)}
                          title={t("admin.activate", "Activate")}
                        >
                          <CheckCircle size={16} className="text-green-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users size={28} className="text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedUser.username}</h3>
                  <p className="text-sm text-slate-500 capitalize">{selectedUser.role?.replace("_", " ")}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-slate-400" />
                  <span>{selectedUser.email?.address || selectedUser.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-slate-400" />
                  <span>{selectedUser.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{selectedUser.Address || selectedUser.country || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                  onClick={() => setSelectedUser(null)}
                >
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

export default UserManagement;
