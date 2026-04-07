import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    Zap, 
    ArrowLeft, 
    Brain, 
    ShoppingCart, 
    Activity, 
    MessageSquare, 
    CheckCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './CategoryPage.scss';

const PlatformFeatures = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const platformFeatures = [
        {
            icon: Brain,
            title: t('support.categories.features.feature1.title', 'AI Medical Analysis'),
            desc: t('support.categories.features.feature1.desc', 'Get instant insights from your symptoms or medical images using our state-of-the-art AI analysis tool.')
        },
        {
            icon: ShoppingCart,
            title: t('support.categories.features.feature2.title', 'Secure Marketplace'),
            desc: t('support.categories.features.feature2.desc', 'Order medications and healthcare products directly from verified pharmacies through our secure checkout.')
        },
        {
            icon: Activity,
            title: t('support.categories.features.feature3.title', 'Health Feed'),
            desc: t('support.categories.features.feature3.desc', 'A social hub where doctors share insights and patients can learn more about wellness and disease prevention.')
        },
        {
            icon: MessageSquare,
            title: t('support.categories.features.feature4.title', 'Direct Chat'),
            desc: t('support.categories.features.feature4.desc', 'Communicate securely with specialists or pharmacies to discuss your needs or get professional advice.')
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
                        <span>{t('support.categories.features.title')}</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {t('support.categories.features.title')}
                    </motion.h1>
                    <motion.p 
                        className="subtitle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {t('support.categories.features.desc')}
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
                            <div className="icon-box"><Zap size={24} /></div>
                            {t('support.categories.features.contentTitle', 'Everything You Need in One Platform')}
                        </h2>
                        <p>
                            {t('support.categories.features.contentDesc', 'CareNexus is more than just a medical app. We have built an ecosystem that connects all parts of the healthcare experience into one easy-to-use platform.')}
                        </p>

                        <div className="feature-grid">
                            <div className="feature-list">
                                {platformFeatures.map((feature, i) => (
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
                            <p>{t('support.categories.features.proTip', 'Tip: You can use the Knowledge AI to search for information about medications or medical conditions anytime.')}</p>
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

export default PlatformFeatures;