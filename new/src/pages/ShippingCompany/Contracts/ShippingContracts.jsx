import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    setCurrentTitle, 
    fetchShippingContracts, 
    sendShippingContractInvite, 
    respondShippingContract 
} from "../stores/shippingSlice";
import { useTranslation } from "react-i18next";
import { 
    Handshake, 
    Plus, 
    Search, 
    UserPlus, 
    Check, 
    X, 
    Clock, 
    Store,
    Building2,
    CheckCircle2,
    Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import searchApi from "../../../utils/searchApi";
import "./ShippingContracts.scss";

const ShippingContracts = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { contracts, loading } = useSelector((state) => state.shipping);
    
    const [activeTab, setActiveTab] = useState("active"); 
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [inviteMessage, setInviteMessage] = useState("");

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.contracts", { defaultValue: "Supplier Network" })));
        dispatch(fetchShippingContracts());
    }, [dispatch, t]);

    const handleSearch = async (val) => {
        setSearchQuery(val);
        if (val.length < 2) {
            setSearchResults([]);
            return;
        }
        
        setIsSearching(true);
        try {
            const response = await searchApi.advancedSearch({
                q: val,
                role: "pharmacy", // Shipping companies look for pharmacies
                limit: 5
            });
            setSearchResults(response.data.data || []);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSendInvite = async () => {
        if (!selectedPartner) return;
        
        try {
            await dispatch(sendShippingContractInvite({
                targetUserId: selectedPartner.id || selectedPartner._id,
                message: inviteMessage,
                businessDetails: {
                    type: "logistics_partnership",
                    initiatedBy: "shipping_company"
                }
            })).unwrap();
            
            toast.success(t("contracts.invite_sent", "Invitation sent successfully"));
            setIsInviteModalOpen(false);
            setSelectedPartner(null);
            setInviteMessage("");
            dispatch(fetchShippingContracts());
        } catch (error) {
            toast.error(error.message || "Failed to send invitation");
        }
    };

    const handleResponse = async (id, action) => {
        try {
            await dispatch(respondShippingContract({ id, action })).unwrap();
            toast.success(t(`contracts.response_${action}`, `Invitation ${action}ed`));
            dispatch(fetchShippingContracts());
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    const filteredContracts = contracts.filter(c => {
        const isInitiator = c.initiatedById === user?.id;
        if (activeTab === "active") return c.status === "accepted";
        if (activeTab === "pending") return c.status === "pending" && !isInitiator;
        if (activeTab === "sent") return c.status === "pending" && isInitiator;
        return false;
    });

    const getPartner = (contract) => {
        // Since we are shipping company, the partner is the pharmacy
        return contract.pharmacy;
    };

    return (
        <div className="shipping-contracts-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>{t("contracts.shipping_partners", "Pharmacy Network")}</h1>
                    <p>{t("contracts.shipping_subtitle", "Manage your delivery service agreements with local pharmacies.")}</p>
                </div>
                <button className="invite-btn" onClick={() => setIsInviteModalOpen(true)}>
                    <UserPlus size={20} />
                    <span>{t("contracts.propose_service", "Propose Service to Pharmacy")}</span>
                </button>
            </header>

            <nav className="tabs-navigation">
                <button className={activeTab === "active" ? "active" : ""} onClick={() => setActiveTab("active")}>
                    {t("contracts.active", "Active")}
                    <span className="badge">{contracts.filter(c => c.status === "accepted").length}</span>
                </button>
                <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
                    {t("contracts.service_requests", "Requests")}
                    <span className="badge">{contracts.filter(c => c.status === "pending" && c.initiatedById !== user?.id).length}</span>
                </button>
                <button className={activeTab === "sent" ? "active" : ""} onClick={() => setActiveTab("sent")}>
                    {t("contracts.proposals_sent", "Proposals Sent")}
                    <span className="badge">{contracts.filter(c => c.status === "pending" && c.initiatedById === user?.id).length}</span>
                </button>
            </nav>

            {loading ? (
                <div className="loading-state"><div className="spinner"></div></div>
            ) : filteredContracts.length > 0 ? (
                <div className="contracts-list-grid">
                    {filteredContracts.map((contract) => {
                        const partner = getPartner(contract);
                        return (
                            <motion.div key={contract._id} className="contract-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="card-header">
                                    <div className="partner-avatar">
                                        {partner?.avatar ? <img src={partner.avatar} alt={partner.username} /> : <Store size={30} color="#94a3b8" />}
                                    </div>
                                    <div className="partner-info">
                                        <h3>{partner?.username}</h3>
                                        <span className="partner-role">{t("common.pharmacy_client", "Pharmacy Client")}</span>
                                    </div>
                                </div>
                                <div className="contract-details">
                                    <div className="detail-meta">
                                        <span><Clock size={14} /> {new Date(contract.updatedAt).toLocaleDateString()}</span>
                                        <span className={`status-pill ${contract.status}`}>{contract.status}</span>
                                    </div>
                                    {contract.message && <div className="message-box">" {contract.message} "</div>}
                                </div>
                                <div className="card-footer">
                                    {activeTab === "pending" && (
                                        <div className="actions w-full">
                                            <button className="reject-btn flex-1" onClick={() => handleResponse(contract._id, "reject")}>{t("common.decline")}</button>
                                            <button className="accept-btn flex-1" onClick={() => handleResponse(contract._id, "accept")}>{t("common.accept")}</button>
                                        </div>
                                    )}
                                    {activeTab === "active" && <div className="active-meta"><CheckCircle2 color="#3b82f6" size={20} /><span>{t("contracts.authorized", "Authorized Delivery Partner")}</span></div>}
                                    {activeTab === "sent" && <div className="pending-meta"><Clock color="#f59e0b" size={20} /><span>{t("contracts.waiting_pharmacy", "Hanging for client approval")}</span></div>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <Truck size={64} style={{ transform: "scaleX(-1)" }} />
                    <h3>{t("contracts.no_pharmacy_partners", "No pharmacy partners yet")}</h3>
                    <p>{t("contracts.grow_business", "Expand your delivery fleet coverage by partnering with local pharmacies.")}</p>
                </div>
            )}

            {/* Invite Modal (Reuse structure from Pharmacy) */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="invite-modal-overlay">
                        <motion.div className="modal-content" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                            <h2>{t("contracts.propose_partnership", "New Service Proposal")}</h2>
                            {!selectedPartner ? (
                                <div className="search-section">
                                    <div className="search-box"><Search size={18} /><input placeholder={t("contracts.search_pharmacies", "Search pharmacies by name...")} value={searchQuery} onChange={(e) => handleSearch(e.target.value)} /></div>
                                    <div className="results-list">
                                        {isSearching ? <div className="searching">Searching...</div> : searchResults.map(res => (
                                            <div key={res.id} className="result-item">
                                                <div className="user-info"><div className="mini-avatar">{res.avatar && <img src={res.avatar} alt="" />}</div><span>{res.username}</span></div>
                                                <button className="select-btn" onClick={() => setSelectedPartner(res)}>Select</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="invite-form">
                                    <div className="selected-card"><span>Partnership with: <strong>{selectedPartner.username}</strong></span><button onClick={() => setSelectedPartner(null)}>Change</button></div>
                                    <textarea placeholder="Tell the pharmacy why they should choose your delivery service..." value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)} rows="4" className="w-full p-3 border rounded-lg mt-4" />
                                </div>
                            )}
                            <div className="invite-actions mt-6">
                                <button className="cancel-btn" onClick={() => setIsInviteModalOpen(false)}>{t("common.cancel")}</button>
                                <button className="send-btn" disabled={!selectedPartner} onClick={handleSendInvite}>{t("contracts.send_proposal", "Send Proposal")}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ShippingContracts;
