import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, 
    ArrowLeft, 
    Lock, 
    Key, 
    EyeOff, 
    Server, 
    CheckCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CategoryPage.scss';

const SecurityPrivacy = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const securityFeatures = [
        {
            icon: Lock,
            title: t('support.categories.security.feature1.title', 'Encryption'),
            desc: t('support.categories.security.feature1.desc', 'End-to-end encryption for all medical records and messages, ensuring only you and your provider have access.')
        },
        {
            icon: Key,
            title: t('support.categories.security.feature2.title', 'AI-KYC Verification'),
            desc: t('support.categories.security.feature2.desc', 'Every user is verified using AI-powered face detection and ID OCR to prevent fraud and impersonation.')
        },
        {
            icon: EyeOff,
            title: t('support.categories.security.feature3.title', 'Data Privacy'),
            desc: t('support.categories.security.feature3.desc', 'We follow strict data protection regulations, giving you full control over what data is shared.')
        },
        {
            icon: Server,
            title: t('support.categories.security.feature4.title', 'Secure Infrastructure'),
            desc: t('support.categories.security.feature4.desc', 'Hosted on AWS and Google Cloud with enterprise-grade firewalls and automated threat detection.')
        }
    ];

    return (
        <div className="category-page">
            <div className="container">
                <header className="category-hero">
                    <div className="breadcrumb">
                        <Link to="/">{t('nav.home')}</Link>
                        <span className="separator">/</span>
                        <Link to="/support">{t('nav.support')}</Link>
                        <span className="separator">/</span>
                        <span>{t('support.categories.security.title')}</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t('support.categories.security.title')}
                    </motion.h1>
                    <motion.p 
                        className="subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {t('support.categories.security.desc')}
                    </motion.p>
                </header>

                <motion.section 
                    className="content-section"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="article-content">
                        <h2>
                            <div className="icon-box"><ShieldCheck size={24} /></div>
                            {t('support.categories.security.contentTitle', 'Your Security is Our Priority')}
                        </h2>
                        <p>
                            {t('support.categories.security.contentDesc', 'At CareNexus, we believe that healthcare is a fundamental right, and so is your data security. We implement multi-layered security protocols to keep your medical information safe.')}
                        </p>

                        <div className="feature-grid">
                            <div className="feature-list">
                                {securityFeatures.map((feature, i) => (
                                    <div key={i} className="feature-item">
                                        <div className="feat-icon">
                                            <feature.icon size={28} />
                                        </div>
                                        <div className="feat-text">
                                            <h4>{feature.title}</h4>
                                            <p>{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pro-tip">
                            <CheckCircle size={20} className="tip-icon" />
                            <p>{t('support.categories.security.proTip', 'Tip: Use Two-Factor Authentication (2FA) in your settings to add an extra layer of protection to your account.')}</p>
                        </div>
                    </div>
                </motion.section>

                <footer className="page-footer">
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft size={18} />
                        {t('common.go_back', 'Go Back to Support')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SecurityPrivacy;