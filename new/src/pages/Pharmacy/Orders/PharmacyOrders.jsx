import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchPharmacyOrders,
  markOrderReady,
  setCurrentTitle,
} from "../stores/pharmacySlice";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Search,
  Filter,
  Eye,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  User,
  MapPin,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";
import "./PharmacyOrders.scss";

const PharmacyOrders = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.pharmacy);

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(() => {
    dispatch(fetchPharmacyOrders());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setCurrentTitle(t("nav.orders", { defaultValue: "Orders" })));
    loadOrders();
  }, [dispatch, t, loadOrders]);

  const handleMarkReady = async (orderId) => {
    try {
      await dispatch(markOrderReady(orderId)).unwrap();
      toast.success(t("pharmacy.order_ready", "Order marked as ready!"));
      loadOrders();
    } catch (err) {
      toast.error(err.message || "Failed to mark order as ready");
    }
  };

  const tabs = [
    { key: "all", label: t("pharmacy.all_orders", "All Orders"), icon: Package },
    { key: "preparing", label: t("pharmacy.pending", "Preparing"), icon: Clock },
    { key: "ready", label: t("pharmacy.ready", "Ready"), icon: CheckCircle2 },
    { key: "shipped", label: t("pharmacy.shipped", "Shipped"), icon: Truck },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f59e0b",
      processing: "#3b82f6",
      ready: "#10b981",
      shipped: "#8b5cf6",
      delivered: "#059669",
      cancelled: "#ef4444",
    };
    return colors[status] || "#6b7280";
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && order.orderStatus === activeTab;
  });

  return (
    <div className="pharmacy-orders-page">
      <header className="page-header">
        <div className="header-text">
          <h1>{t("pharmacy.orders_management", "Orders Management")}</h1>
          <p>{t("pharmacy.orders_desc", "View and manage incoming orders from patients.")}</p>
        </div>
        <button className="refresh-btn" onClick={loadOrders} disabled={loading}>
          <RefreshCw size={18} className={loading ? "spinning" : ""} />
          <span>{t("common.refresh", "Refresh")}</span>
        </button>
      </header>

      <div className="tabs-bar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
            <span className="count">
              {tab.key === "all"
                ? orders.length
                : orders.filter((o) => o.orderStatus === tab.key).length}
            </span>
          </button>
        ))}
      </div>

      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder={t("pharmacy.search_orders", "Search by order ID or patient name...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && orders.length === 0 ? (
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
          <Package size={64} />
          <h3>{t("pharmacy.no_orders", "No orders found")}</h3>
          <p>{t("pharmacy.no_orders_desc", "New patient orders will appear here.")}</p>
        </div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t("pharmacy.order_id", "Order ID")}</th>
                <th>{t("pharmacy.patient", "Patient")}</th>
                <th>{t("pharmacy.items", "Items")}</th>
                <th>{t("pharmacy.total", "Total")}</th>
                <th>{t("pharmacy.status", "Status")}</th>
                <th>{t("pharmacy.date", "Date")}</th>
                <th>{t("pharmacy.actions", "Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td>
                    <span className="order-id">#{order._id?.slice(-8).toUpperCase()}</span>
                  </td>
                  <td>
                    <div className="patient-cell">
                      <User size={16} />
                      <span>{order.userId?.username || "Unknown"}</span>
                    </div>
                  </td>
                  <td>
                    <span className="items-count">
                      {order.items?.length || 0} {t("pharmacy.items_count", "items")}
                    </span>
                  </td>
                  <td>
                    <span className="price-cell">${order.totalPrice || order.totalAmount || "0.00"}</span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: `${getStatusColor(order.orderStatus)}15`, color: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => setSelectedOrder(order)}
                        title={t("common.view_details", "View Details")}
                      >
                        <Eye size={16} />
                      </button>
                      {order.orderStatus === "preparing" && (
                        <button
                          className="ready-btn"
                          onClick={() => handleMarkReady(order._id)}
                          title={t("pharmacy.mark_ready", "Mark as Ready")}
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="order-detail-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              className="order-detail-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>
                  {t("pharmacy.order_details", "Order Details")} #
                  {selectedOrder._id?.slice(-8).toUpperCase()}
                </h2>
                <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h4>{t("pharmacy.patient_info", "Patient Information")}</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <User size={16} />
                      <span>{selectedOrder.userId?.username || "Unknown"}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{selectedOrder.shippingAddress || selectedOrder.userId?.Address || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={16} />
                      <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>{t("pharmacy.order_items", "Order Items")}</h4>
                  {selectedOrder.items?.length > 0 ? (
                    <div className="items-list">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <div className="item-info">
                            <span className="item-name">{item.name || item.productId?.name || `Item ${idx + 1}`}</span>
                            <span className="item-qty">x{item.quantity}</span>
                          </div>
                          <span className="item-price">${item.price || item.unitPrice || "0.00"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-items">{t("pharmacy.no_items", "No item details available")}</p>
                  )}
                </div>

                <div className="detail-section">
                  <h4>{t("pharmacy.order_summary", "Summary")}</h4>
                  <div className="summary-row">
                    <span>{t("pharmacy.subtotal", "Subtotal")}</span>
                    <span>${selectedOrder.subtotal || selectedOrder.totalPrice || "0.00"}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t("pharmacy.delivery_fee", "Delivery Fee")}</span>
                    <span>${selectedOrder.deliveryFee || "0.00"}</span>
                  </div>
                  <div className="summary-row total">
                    <span>{t("pharmacy.total", "Total")}</span>
                    <span>${selectedOrder.totalPrice || selectedOrder.totalAmount || "0.00"}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedOrder.orderStatus === "preparing" && (
                  <button
                    className="mark-ready-btn"
                    onClick={() => {
                      handleMarkReady(selectedOrder._id);
                      setSelectedOrder(null);
                    }}
                  >
                    <CheckCircle2 size={18} />
                    {t("pharmacy.mark_ready", "Mark as Ready")}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PharmacyOrders;
