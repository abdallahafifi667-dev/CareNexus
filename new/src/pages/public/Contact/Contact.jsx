import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    Send, 
    CheckCircle, 
    MessageSquare, 
    Mail as MailIcon,
    Terminal
} from 'lucide-react';
import './Contact.scss';

const Contact = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isMessageSent, setIsMessageSent] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    const handleSubscribe = () => {
        if (email) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail("");
        }
    };

    const handleSendMessage = () => {
        if (message) {
            setIsMessageSent(true);
            setTimeout(() => setIsMessageSent(false), 3000);
            setMessage("");
        }
    };

    const contactInfo = [
        {
            icon: Phone,
            title: t('contact.callUs'),
            info: "+20155-730-2873",
            subInfo: "Mon-Fri 9AM-6PM EST"
        },
        {
            icon: Mail,
            title: t('contact.emailUs'),
            info: "support@carenexus.com",
            subInfo: t('contact.respond24h')
        },
        {
            icon: MapPin,
            title: t('contact.visitUs'),
            info: "123 Healthcare Ave",
            subInfo: "Cairo, Egypt 11511"
        }
    ];

    return (
        <div className="contact-page">
            {/* Enhanced Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="content"
                    >
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                            className="hero-badge-minimal"
                        >
                            <MessageSquare size={32} className="hero-icon" />
                            <div className="icon-glow" />
                        </motion.div>

                        <h1 className="title">
                            {t('contact.title')}
                        </h1>
                        <p className="subtitle">
                            {t("contact.subtitle")}
                        </p>
                    </motion.div>
                </div>

                {/* Background Motion Elements */}
                <div className="hero-bg-elements">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        className="blob blob-1"
                    />
                    <motion.div
                        animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 0.9, 1] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                        className="blob blob-2"
                    />
                </div>
            </section>

            <section className="contact-grid-section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Information Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="info-side"
                        >
                            <h3 className="section-title">{t('contact.infoTitle')}</h3>
                            <p className="section-desc">{t('contact.infoDesc')}</p>

                            <div className="info-cards">
                                {contactInfo.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + index * 0.1 }}
                                        className="info-card"
                                    >
                                        <div className="icon-box">
                                            <item.icon size={24} />
                                        </div>
                                        <div className="details">
                                            <h4>{item.title}</h4>
                                            <p className="main-info">{item.info}</p>
                                            <p className="sub-info">{item.subInfo}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="response-time-box"
                            >
                                <Clock className="icon" size={20} />
                                <div className="text-content">
                                    <span className="label">{t('contact.responseTime')}</span>
                                    <p className="desc">{t('contact.responseTimeDesc')}</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Form Side */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="form-side"
                        >
                            <div className="form-card">
                                {/* Newsletter */}
                                <div className="newsletter-section">
                                    <div className="form-header">
                                        <MailIcon className="header-icon" size={24} />
                                        <h3 className="form-title">{t('contact.stayUpdated')}</h3>
                                    </div>
                                    <p className="form-desc">{t('contact.subscribeDesc')}</p>
                                    
                                    <div className="subscription-box">
                                        <div className={`input-field ${focusedField === 'email' ? 'focused' : ''}`}>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder={t('contact.placeholderEmail')}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleSubscribe}
                                            disabled={isSubscribed}
                                            className={`btn-subscribe ${isSubscribed ? 'success' : ''}`}
                                        >
                                            {isSubscribed ? (
                                                <><CheckCircle size={20} /><span>{t('contact.subscribed')}</span></>
                                            ) : (
                                                <><MailIcon size={20} /><span>{t('contact.subscribe')}</span></>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="divider">
                                    <span>{t('contact.orMessage')}</span>
                                </div>

                                {/* Message Form */}
                                <div className="message-section">
                                    <div className="form-header">
                                        <MessageSquare className="header-icon" size={24} />
                                        <h3 className="form-title">{t('contact.sendMessageTitle')}</h3>
                                    </div>
                                    <p className="form-desc">{t('contact.sendMessageDesc')}</p>

                                    <div className={`textarea-field ${focusedField === 'message' ? 'focused' : ''}`}>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onFocus={() => setFocusedField('message')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder={t('contact.placeholderMessage')}
                                            rows={5}
                                        />
                                    </div>
                                    
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={isMessageSent}
                                        className={`btn-send-message ${isMessageSent ? 'success' : ''}`}
                                    >
                                        {isMessageSent ? (
                                            <><CheckCircle size={24} /><span>{t('contact.messageSent')}</span></>
                                        ) : (
                                            <><Send size={24} /><span>{t('contact.sendMessage')}</span></>
                                        )}
                                    </button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="trust-indicators">
                                    <div className="indicator">
                                        <CheckCircle size={16} />
                                        <span>{t('contact.hipaa')}</span>
                                    </div>
                                    <div className="indicator">
                                        <CheckCircle size={16} />
                                        <span>{t('contact.support247')}</span>
                                    </div>
                                    <div className="indicator">
                                        <CheckCircle size={16} />
                                        <span>{t('contact.secure')}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

