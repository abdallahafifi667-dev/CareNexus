import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag, Package, ListChecks, DollarSign,
  AlertCircle, RefreshCw, Eye, Trash2, Search, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import "../AdminSettings.scss";
import "./StoreManagement.scss";

const StoreManagement = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.allSettled([
        axiosInstance.get("/admin-ecommerce/all-orders"),
        axiosInstance.get("/product-merchant/get"),
      ]);

      if (ordersRes.status === "fulfilled") {
        const orderData = ordersRes.value.data;
        setOrders(Array.isArray(orderData) ? orderData : (orderData.orders || orderData.data || []));
      }
      if (productsRes.status === "fulfilled") {
        const productData = productsRes.value.data;
        setProducts(Array.isArray(productData) ? productData : (productData.products || productData.data || []));
      }
    } catch (err) {
      setError(t("admin.fetch_error", "Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm(t("admin.confirm_delete", "Delete this product?"))) return;
    try {
      await axiosInstance.delete(`/product-merchant/delete/${productId}`);
      toast.success(t("admin.product_deleted", "Product deleted"));
      fetchData();
    } catch (err) {
      toast.error(t("admin.action_failed", "Action failed"));
    }
  };

  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing").length;

  const filteredOrders = orders.filter(
    (o) =>
      o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="admin-ecommerce admin-settings-page">
      {/* Premium Header */}
      <div className="dashboard-header-premium" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h2>{t("admin.ecommerce_mgmt", "E-Commerce Management")}</h2>
          <p>{t("admin.ecommerce_desc", "Monitor orders, products, and sales across the platform.")}</p>
        </div>
        <button className="refresh-btn-premium" onClick={fetchData} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* Premium Tabs */}
      <div className="premium-tabs" style={{ marginBottom: "2rem" }}>
        {["orders", "products"].map((tab) => (
          <button
            key={tab}
            className={`premium-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "orders" ? t("admin.orders", "Orders") : t("admin.products", "Products")}
          </button>
        ))}
      </div>


      <div className="dashboard-content">
        {/* Stats Grid */}
        <div className="stats-grid-small">
          <motion.div className="stat-card-compact" variants={itemVariants} initial="hidden" animate="visible">
            <div className="icon-wrap bg-blue">
              <DollarSign size={20} />
            </div>
            <div className="info">
              <span className="label">{t("admin.total_sales", "Total Sales")}</span>
              <span className="value">${totalSales.toFixed(2)}</span>
            </div>
            <ArrowUpRight size={16} className="trend-icon" />
          </motion.div>

          <motion.div className="stat-card-compact" variants={itemVariants} initial="hidden" animate="visible">
            <div className="icon-wrap bg-amber">
              <ShoppingBag size={20} />
            </div>
            <div className="info">
              <span className="label">{t("admin.pending_orders", "Pending Orders")}</span>
              <span className="value">{pendingOrders}</span>
            </div>
            <ArrowUpRight size={16} className="trend-icon" />
          </motion.div>

          <motion.div className="stat-card-compact" variants={itemVariants} initial="hidden" animate="visible">
            <div className="icon-wrap bg-purple">
              <Package size={20} />
            </div>
            <div className="info">
              <span className="label">{t("admin.active_products", "Active Products")}</span>
              <span className="value">{products.length}</span>
            </div>
            <ArrowUpRight size={16} className="trend-icon" />
          </motion.div>
        </div>

        {/* Search */}
        <div className="search-bar-premium">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t("admin.search_orders_products", "Search orders or products...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && orders.length === 0 && products.length === 0 ? (
          <div className="premium-table-container">
            <div className="skeleton-loading-table">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-row">
                  <div className="skeleton-shimmer"></div>
                </div>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="error-state">
            <AlertCircle size={48} />
            <p>{error}</p>
          </div>
        ) : activeTab === "orders" ? (
          <div className="premium-table-container">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <ShoppingBag size={48} />
                <p>{t("admin.no_orders", "No orders found")}</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>{t("admin.order_id", "Order ID")}</th>
                    <th>{t("admin.customer", "Customer")}</th>
                    <th>{t("admin.total", "Total")}</th>
                    <th>{t("admin.status", "Status")}</th>
                    <th>{t("admin.date", "Date")}</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  <AnimatePresence>
                    {filteredOrders.map((order) => (
                      <motion.tr key={order._id} variants={itemVariants} exit={{ opacity: 0 }}>
                        <td className="font-mono">#{order._id?.slice(-8).toUpperCase()}</td>
                        <td>
                          <div className="user-cell">
                            <span className="user-name">{order.userId?.username || "Unknown"}</span>
                          </div>
                        </td>
                        <td className="font-bold">${order.totalPrice || order.totalAmount || "0.00"}</td>
                        <td>
                          <span className={`status-pill status-${order.status || 'unknown'}`}>
                            {order.status || 'unknown'}
                          </span>
                        </td>
                        <td className="text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="premium-table-container">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>{t("admin.no_products", "No products found")}</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>{t("admin.product", "Product")}</th>
                    <th>{t("admin.category", "Category")}</th>
                    <th>{t("admin.price", "Price")}</th>
                    <th>{t("admin.stock", "Stock")}</th>
                    <th className="text-right">{t("admin.actions", "Actions")}</th>
                  </tr>
                </thead>
                <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr key={product._id} variants={itemVariants} exit={{ opacity: 0 }}>
                        <td>
                          <div className="product-cell">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt="" className="product-img" />
                            ) : (
                              <div className="product-img-placeholder">
                                <Package size={16} />
                              </div>
                            )}
                            <span className="product-name">{product.name}</span>
                          </div>
                        </td>
                        <td className="text-muted">{product.category || "N/A"}</td>
                        <td className="font-bold">${product.price || "0.00"}</td>
                        <td>
                          <span className={`stock-pill ${product.quantity < 10 ? 'low-stock' : 'in-stock'}`}>
                            {product.quantity || 0}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            className="action-btn delete"
                            onClick={() => handleDeleteProduct(product._id)}
                            title={t("common.delete", "Delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </motion.tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
