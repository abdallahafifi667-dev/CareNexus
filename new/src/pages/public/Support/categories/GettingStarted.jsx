import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    LifeBuoy, 
    ArrowLeft, 
    CheckCircle, 
    Rocket, 
    UserPlus, 
    Settings, 
    ShieldCheck 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CategoryPage.scss';

const GettingStarted = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const steps = [
        {
            icon: UserPlus,
            title: t('support.categories.gettingStarted.step1.title', 'Create Account'),
            desc: t('support.categories.gettingStarted.step1.desc', 'Register as a Patient, Doctor, or Pharmacy to access our ecosystem.')
        },
        {
            icon: ShieldCheck,
            title: t('support.categories.gettingStarted.step2.title', 'Verification'),
            desc: t('support.categories.gettingStarted.step2.desc', 'Complete our AI-powered KYC process to ensure a secure platform for everyone.')
        },
        {
            icon: Rocket,
            title: t('support.categories.gettingStarted.step3.title', 'Explore Services'),
            desc: t('support.categories.gettingStarted.step3.desc', 'Start using Medical AI, browse the marketplace, or connect with specialists.')
        },
        {
            icon: Settings,
            title: t('support.categories.gettingStarted.step4.title', 'Personalize'),
            desc: t('support.categories.gettingStarted.step4.desc', 'Set up your profile, preferences, and security settings for the best experience.')
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
                        <span>{t('support.categories.gettingStarted.title')}</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t('support.categories.gettingStarted.title')}
                    </motion.h1>
                    <motion.p 
                        className="subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {t('support.categories.gettingStarted.desc')}
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
                            <div className="icon-box"><LifeBuoy size={24} /></div>
                            {t('support.categories.gettingStarted.contentTitle', 'Quick Start Guide')}
                        </h2>
                        <p>
                            {t('support.categories.gettingStarted.contentDesc', 'Welcome to CareNexus! Our platform is designed to make healthcare accessible, secure, and efficient. Follow these steps to get the most out of your experience.')}
                        </p>

                        <div className="feature-grid">
                            <div className="feature-list">
                                {steps.map((step, i) => (
                                    <div key={i} className="feature-item">
                                        <div className="feat-icon">
                                            <step.icon size={28} />
                                        </div>
                                        <div className="feat-text">
                                            <h4>{step.title}</h4>
                                            <p>{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pro-tip">
                            <CheckCircle size={20} className="tip-icon" />
                            <p>{t('support.categories.gettingStarted.proTip', 'Tip: You can use our Global AI Assistant at any time for help navigating the platform.')}</p>
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

export default GettingStarted;