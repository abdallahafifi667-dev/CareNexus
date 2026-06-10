import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag,
  Package,
  ListChecks,
  TrendingUp,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Eye,
  Trash2,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import Loader from "../../../shared/components/loader/Loader";

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
        setOrders(ordersRes.value.data.orders || ordersRes.value.data || []);
      }
      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value.data.products || productsRes.value.data || []);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("admin.ecommerce_mgmt", "E-Commerce Management")}</h2>
          <p className="text-slate-500">{t("admin.ecommerce_desc", "Monitor orders, products, and categories across the platform.")}</p>
        </div>
        <button className="refresh-btn" onClick={fetchData} disabled={loading}>
          <RefreshCw size={16} className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">{t("admin.total_sales", "Total Sales")}</p>
            <h4 className="text-xl font-bold text-slate-900">${totalSales.toFixed(2)}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
            <Package size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">{t("admin.pending_orders", "Pending Orders")}</p>
            <h4 className="text-xl font-bold text-slate-900">{pendingOrders}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
            <ListChecks size={24} />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">{t("admin.active_products", "Active Products")}</p>
            <h4 className="text-xl font-bold text-slate-900">{products.length}</h4>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["orders", "products"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "orders" ? t("admin.orders", "Orders") : t("admin.products", "Products")}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder={t("admin.search_orders_products", "Search orders or products...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && orders.length === 0 && products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center">
          <Loader loading={true} />
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-20 text-center text-slate-400">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>{error}</p>
        </div>
      ) : activeTab === "orders" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <ShoppingBag size={48} className="mx-auto mb-4" />
              <p>{t("admin.no_orders", "No orders found")}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.order_id", "Order ID")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.customer", "Customer")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.total", "Total")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.status", "Status")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.date", "Date")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order._id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="p-4 text-sm font-mono">#{order._id?.slice(-8).toUpperCase()}</td>
                    <td className="p-4 text-sm">{order.userId?.username || "Unknown"}</td>
                    <td className="p-4 text-sm font-medium">${order.totalPrice || order.totalAmount || "0.00"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        order.status === "completed" ? "bg-green-100 text-green-700" :
                        order.status === "pending" ? "bg-amber-100 text-amber-700" :
                        order.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <Package size={48} className="mx-auto mb-4" />
              <p>{t("admin.no_products", "No products found")}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.product", "Product")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.category", "Category")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.price", "Price")}</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-500">{t("admin.stock", "Stock")}</th>
                  <th className="text-right p-4 text-sm font-semibold text-slate-500">{t("admin.actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id || index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-slate-50 hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Package size={16} className="text-slate-400" />
                          </div>
                        )}
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">{product.category || "N/A"}</td>
                    <td className="p-4 text-sm font-medium">${product.price || "0.00"}</td>
                    <td className="p-4 text-sm">
                      <span className={product.quantity < 10 ? "text-red-600 font-bold" : "text-slate-500"}>
                        {product.quantity || 0}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
