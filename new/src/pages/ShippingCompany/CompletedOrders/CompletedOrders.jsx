import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setCurrentTitle,
  fetchCompletedDeliveries,
} from "../stores/shippingSlice";
import {
  CheckCircle2,
  Package,
  MapPin,
  Clock,
  Search,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../../../shared/components/loader/Loader";
import "./CompletedOrders.scss";

const CompletedOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { completedOrders, loading, error } = useSelector((state) => state.shipping);

  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");

  const loadOrders = useCallback(() => {
    dispatch(fetchCompletedDeliveries());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentTitle(t("nav.completed", { defaultValue: "Completed Deliveries" })));
    loadOrders();
  }, [dispatch, t, loadOrders]);

  const getFilteredOrders = () => {
    let filtered = completedOrders;

    // Time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const cutoff = new Date();
      if (timeFilter === "today") cutoff.setHours(0, 0, 0, 0);
      else if (timeFilter === "week") cutoff.setDate(now.getDate() - 7);
      else if (timeFilter === "month") cutoff.setMonth(now.getMonth() - 1);

      filtered = filtered.filter((o) => new Date(o.updatedAt || o.createdAt) >= cutoff);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (o) =>
          o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.pharmacy?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();
  const totalEarnings = completedOrders.reduce((sum, o) => sum + (o.deliveryFee || o.totalPrice || 0), 0);
  const todayCount = completedOrders.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.updatedAt || o.createdAt).toDateString() === today;
  }).length;

  return (
    <div className="shipping-completed-page">
      <header className="page-header">
        <div className="header-text">
          <h1>{t("shipping.completed_deliveries", "Completed Deliveries")}</h1>
          <p>{t("shipping.completed_desc", "History of all successfully delivered orders.")}</p>
        </div>
        <button className="refresh-btn" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spinning" : ""} />
          <span>{t("common.refresh", "Refresh")}</span>
        </button>
      </header>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedOrders.length}</span>
            <span className="stat-label">{t("shipping.total_completed", "Total Completed")}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayCount}</span>
            <span className="stat-label">{t("shipping.completed_today", "Completed Today")}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">${totalEarnings.toFixed(2)}</span>
            <span className="stat-label">{t("shipping.total_earnings", "Total Earnings")}</span>
          </div>
        </div>
      </div>

      <div className="filters-row">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder={t("shipping.search_completed", "Search completed deliveries...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="time-filters">
          {["all", "today", "week", "month"].map((f) => (
            <button
              key={f}
              className={`time-btn ${timeFilter === f ? "active" : ""}`}
              onClick={() => setTimeFilter(f)}
            >
              {t(`shipping.time_${f}`, f.charAt(0).toUpperCase() + f.slice(1))}
            </button>
          ))}
        </div>
      </div>

      {loading && completedOrders.length === 0 ? (
        <div className="loading-state">
          <Loader loading={true} />
        </div>
      ) : error ? (
        <div className="error-state">
          <AlertCircle size={48} />
          <h3>{t("common.error_occurred", "Something went wrong")}</h3>
          <p>{error}</p>
          <button onClick={loadOrders}>{t("common.retry", "Retry")}</button>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <CheckCircle2 size={64} />
          <h3>{t("shipping.no_completed", "No completed deliveries")}</h3>
          <p>{t("shipping.no_completed_desc", "Your completed delivery history will appear here.")}</p>
        </div>
      ) : (
        <div className="completed-list">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              className="completed-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <div className="card-left">
                <div className="completion-icon">
                  <CheckCircle2 size={24} />
                </div>
                <div className="order-details">
                  <div className="order-top">
                    <span className="order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                    <span className="order-date">
                      {new Date(order.updatedAt || order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="route-summary">
                    <span className="route-text">
                      {order.pharmacy?.username || "Pharmacy"} → {order.userId?.username || "Patient"}
                    </span>
                  </div>
                  <div className="order-items-count">
                    <Package size={14} />
                    <span>{order.items?.length || 0} {t("shipping.items", "items")}</span>
                  </div>
                </div>
              </div>
              <div className="card-right">
                <span className="earnings">+${order.deliveryFee || order.totalPrice || "0.00"}</span>
                <span className="completion-time">
                  <Clock size={12} />
                  {new Date(order.updatedAt || order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedOrders;
