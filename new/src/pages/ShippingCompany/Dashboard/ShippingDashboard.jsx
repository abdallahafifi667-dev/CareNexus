import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    setCurrentTitle, 
    fetchShippedOrders, 
    fetchCompletedDeliveries,
    fetchShippingContracts 
} from "../stores/shippingSlice";
import { 
    Truck, 
    PackageCheck, 
    Clock, 
    Handshake, 
    TrendingUp, 
    MapPin,
    Calendar,
    ArrowUpRight,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import "./ShippingDashboard.scss";
import "../../../scss/premium_theme.scss";

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div className="stat-card" whileHover={{ y: -5 }}>
        <div className={`icon-bar ${color}`}><Icon size={24} /></div>
        <div className="stat-content">
            <p className="label">{title}</p>
            <h3 className="value">{value}</h3>
            {trend && <div className="trend text-green"><ArrowUpRight size={14} /> <span>{trend}</span></div>}
        </div>
    </motion.div>
);

const ShippingDashboard = () => {
    const dispatch = useDispatch();
    const { activeOrders, completedOrders, contracts, loading } = useSelector((state) => state.shipping);

    useEffect(() => {
        dispatch(setCurrentTitle("Logistics Overview"));
        dispatch(fetchShippedOrders());
        dispatch(fetchCompletedDeliveries());
        dispatch(fetchShippingContracts());
    }, [dispatch]);

    const stats = [
        {
            title: "Active Deliveries",
            value: activeOrders?.length || 0,
            icon: Truck,
            color: "blue",
            trend: "+2 this hour"
        },
        {
            title: "Completed Today",
            value: completedOrders?.filter(o => {
                const today = new Date().toDateString();
                const updatedDay = new Date(o.updatedAt).toDateString();
                return today === updatedDay;
            }).length || 0,
            icon: PackageCheck,
            color: "green"
        },
        {
            title: "Network Partners",
            value: contracts?.filter(c => c.status === "accepted").length || 0,
            icon: Handshake,
            color: "purple"
        },
        {
            title: "Pending Pickup",
            value: activeOrders?.filter(o => o.status === "shipped").length || 0, // shipped means ready for pickup
            icon: Clock,
            color: "orange"
        }
    ];

    return (
        <div className="premium-ui">
            <div className="shipping-dashboard-container">

            <header className="dashboard-header">
                <div className="title-area">
                    <h1>Shipping Operations</h1>
                    <p className="text-muted">Real-time tracking and logistics management.</p>
                </div>
                <div className="date-display">
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>

            <div className="main-grid">
                <section className="data-card recent-shipments">
                    <div className="card-title">
                        <h3>Active Fleet Tasks</h3>
                        <Activity size={18} className="text-green" />
                    </div>
                    <div className="card-body">
                        {activeOrders?.length > 0 ? (
                            <table className="deliveries-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Origin (Pharmacy)</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeOrders.slice(0, 6).map((order) => (
                                        <tr key={order._id}>
                                            <td>#{order._id.slice(-6)}</td>
                                            <td>{order.pharmacy?.username || "---"}</td>
                                            <td>
                                                <span className={`status-pill ${order.status}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="empty-state">
                                <Truck size={40} />
                                <p>No active tasks currently assigned.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="data-card logistics-summary">
                    <div className="card-title"><h3>Performance</h3></div>
                    <div className="card-body">
                        <div className="performance-list">
                            <div className="perf-item">
                                <div className="label-row">
                                    <span>Daily Quota</span>
                                    <span>85%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="fill" style={{ width: "85%", background: "var(--clr-primary, #3b82f6)" }}></div>
                                </div>
                            </div>
                            <div className="perf-item">
                                <div className="label-row">
                                    <span>Success Rate</span>
                                    <span>98%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="fill" style={{ width: "98%", background: "var(--clr-success, #10b981)" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
        </div>
    );
};

export default ShippingDashboard;
