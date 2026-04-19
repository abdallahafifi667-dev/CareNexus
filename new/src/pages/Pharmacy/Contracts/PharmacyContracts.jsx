import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    setCurrentTitle, 
    fetchContracts, 
    sendContractInvite, 
    respondContract 
} from "../stores/pharmacySlice";
import { useTranslation } from "react-i18next";
import { 
    Handshake, 
    Plus, 
    Search, 
    UserPlus, 
    Check, 
    X, 
    Clock, 
    FileText,
    Truck,
    Building2,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import searchApi from "../../../utils/searchApi";
import "./PharmacyContracts.scss";

const PharmacyContracts = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { user } = useSelector((state) => state.auth);
    const { contracts, loading } = useSelector((state) => state.pharmacy);
    
    const [activeTab, setActiveTab] = useState("active"); // active, pending, sent
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    
    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [inviteMessage, setInviteMessage] = useState("");

    useEffect(() => {
        dispatch(setCurrentTitle(t("nav.contracts", { defaultValue: "Partnership Contracts" })));
        dispatch(fetchContracts());
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
                role: "shipping_company", // Pharmacies look for shipping companies
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
            await dispatch(sendContractInvite({
                targetUserId: selectedPartner.id || selectedPartner._id,
                message: inviteMessage,
                businessDetails: {
                    type: "delivery_partnership",
                    initiatedBy: "pharmacy"
                }
            })).unwrap();
            
            toast.success(t("contracts.invite_sent", "Invitation sent successfully"));
            setIsInviteModalOpen(false);
            setSelectedPartner(null);
            setInviteMessage("");
            dispatch(fetchContracts());
        } catch (error) {
            toast.error(error.message || "Failed to send invitation");
        }
    };

    const handleResponse = async (id, action) => {
        try {
            await dispatch(respondContract({ id, action })).unwrap();
            toast.success(t(`contracts.response_${action}`, `Invitation ${action}ed`));
            dispatch(fetchContracts());
        } catch (error) {
            toast.error(error.message || "Action failed");
        }
    };

    const filteredContracts = contracts.filter(c => {
        const isInitiator = c.initiatedById === user?.id;
        if (activeTab === "active") return c.status === "accepted";
        if (activeTab === "pending") return c.status === "pending" && !isInitiator;
        if (activeTab === "sent") return c.status === "pending" && isInitiator;
        if (activeTab === "rejected") return c.status === "rejected";
        return false;
    });

    const getPartner = (contract) => {
        // Since we are pharmacy, the partner is the shipping company
        return contract.shippingCompany;
    };

    return (
        <div className="contracts-management-page">
            <header className="page-header">
                <div className="header-text">
                    <h1>{t("contracts.title", "Partnership Networks")}</h1>
                    <p>{t("contracts.subtitle", "Establish and manage formal logistics agreements with shipping companies.")}</p>
                </div>
                <button className="invite-btn" onClick={() => setIsInviteModalOpen(true)}>
                    <UserPlus size={20} />
                    <span>{t("contracts.new_partnership", "Invite Shipping Partner")}</span>
                </button>
            </header>

            <nav className="tabs-navigation">
                <button 
                    className={activeTab === "active" ? "active" : ""} 
                    onClick={() => setActiveTab("active")}
                >
                    {t("contracts.active", "Active")}
                    <span className="badge">{contracts.filter(c => c.status === "accepted").length}</span>
                </button>
                <button 
                    className={activeTab === "pending" ? "active" : ""} 
                    onClick={() => setActiveTab("pending")}
                >
                    {t("contracts.requests", "Requests")}
                    <span className="badge">{contracts.filter(c => c.status === "pending" && c.initiatedById !== user?.id).length}</span>
                </button>
                <button 
                    className={activeTab === "sent" ? "active" : ""} 
                    onClick={() => setActiveTab("sent")}
                >
                    {t("contracts.sent", "Sent Invite")}
                    <span className="badge">{contracts.filter(c => c.status === "pending" && c.initiatedById === user?.id).length}</span>
                </button>
            </nav>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                </div>
            ) : filteredContracts.length > 0 ? (
                <div className="contracts-list-grid">
                    {filteredContracts.map((contract) => {
                        const partner = getPartner(contract);
                        return (
                            <motion.div 
                                key={contract._id} 
                                className="contract-card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="card-header">
                                    <div className="partner-avatar">
                                        {partner?.avatar ? (
                                            <img src={partner.avatar} alt={partner.username} />
                                        ) : (
                                            <Truck size={30} color="#94a3b8" />
                                        )}
                                    </div>
                                    <div className="partner-info">
                                        <h3>{partner?.username}</h3>
                                        <span className="partner-role">{t("common.logistics_partner", "Logistics Provider")}</span>
                                    </div>
                                </div>

                                <div className="contract-details">
                                    <div className="detail-meta">
                                        <span><Clock size={14} /> {new Date(contract.updatedAt).toLocaleDateString()}</span>
                                        <span className={`status-pill ${contract.status}`}>{contract.status}</span>
                                    </div>
                                    {contract.message && (
                                        <div className="message-box">
                                            " {contract.message} "
                                        </div>
                                    )}
                                </div>

                                <div className="card-footer">
                                    {activeTab === "pending" && (
                                        <div className="actions w-full">
                                            <button 
                                                className="reject-btn flex-1" 
                                                onClick={() => handleResponse(contract._id, "reject")}
                                            >
                                                {t("common.decline")}
                                            </button>
                                            <button 
                                                className="accept-btn flex-1" 
                                                onClick={() => handleResponse(contract._id, "accept")}
                                            >
                                                {t("common.accept")}
                                            </button>
                                        </div>
                                    )}
                                    {activeTab === "active" && (
                                        <div className="active-meta">
                                            <CheckCircle2 color="#10b981" size={20} />
                                            <span>{t("contracts.verified", "Fully Operational")}</span>
                                        </div>
                                    )}
                                    {activeTab === "sent" && (
                                        <div className="pending-meta">
                                            <Clock color="#f59e0b" size={20} />
                                            <span>{t("contracts.awaiting", "Awaiting response")}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <Handshake size={64} />
                    <h3>{t("contracts.no_contracts", "No contracts yet")}</h3>
                    <p>{t("contracts.no_contracts_desc", "Start connecting with shipping companies to expand your delivery network.")}</p>
                </div>
            )}

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="invite-modal-overlay">
                        <motion.div 
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            <h2>{t("contracts.invite_partner", "Invite Partner")}</h2>
                            
                            {!selectedPartner ? (
                                <div className="search-section">
                                    <div className="search-box">
                                        <Search size={18} />
                                        <input 
                                            placeholder={t("contracts.search_shipping", "Search shipping companies...")}
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    
                                    <div className="results-list">
                                        {isSearching ? (
                                            <div className="searching">Searching...</div>
                                        ) : searchResults.length > 0 ? (
                                            searchResults.map(res => (
                                                <div key={res.id} className="result-item">
                                                    <div className="user-info">
                                                        <div className="mini-avatar">
                                                            {res.avatar && <img src={res.avatar} alt="" />}
                                                        </div>
                                                        <span>{res.username}</span>
                                                    </div>
                                                    <button 
                                                        className="select-btn"
                                                        onClick={() => setSelectedPartner(res)}
                                                    >
                                                        Select
                                                    </button>
                                                </div>
                                            ))
                                        ) : searchQuery.length > 1 ? (
                                            <div className="no-results">No companies found</div>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div className="invite-form">
                                    <div className="selected-card">
                                        <CheckCircle2 size={16} color="#10b981" />
                                        <span>Invitation for: <strong>{selectedPartner.username}</strong></span>
                                        <button onClick={() => setSelectedPartner(null)} className="change-btn">Change</button>
                                    </div>
                                    <textarea 
                                        placeholder={t("contracts.message_placeholder", "Add a message for the shipping company...")}
                                        value={inviteMessage}
                                        onChange={(e) => setInviteMessage(e.target.value)}
                                        rows="4"
                                        className="w-full p-3 border rounded-lg mt-4"
                                    />
                                </div>
                            )}

                            <div className="invite-actions mt-6">
                                <button className="cancel-btn" onClick={() => setIsInviteModalOpen(false)}>
                                    {t("common.cancel")}
                                </button>
                                <button 
                                    className="send-btn" 
                                    disabled={!selectedPartner}
                                    onClick={handleSendInvite}
                                >
                                    {t("contracts.send_invite", "Send Invitation")}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PharmacyContracts;
