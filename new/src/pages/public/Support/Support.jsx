import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
    LifeBuoy, 
    MessageCircle, 
    FileText, 
    BookOpen, 
    Search,
    ArrowRight,
    Headphones,
    ShieldCheck,
    Zap,
    ChevronDown,
    CheckCircle,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Support.scss';

const Support = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    // Load FAQ items for live search
    const allFaqs = useMemo(() => {
        const items = t('faq.items', { returnObjects: true });
        return Array.isArray(items) ? items : [];
    }, [t]);

    // Filter as user types
    const filteredFaqs = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return allFaqs.filter(
            item =>
                item.q?.toLowerCase().includes(q) ||
                item.a?.toLowerCase().includes(q)
        );
    }, [searchQuery, allFaqs]);

    const showResults = searchQuery.trim().length > 0;

    const supportCategories = [
        {
            icon: LifeBuoy,
            title: t('support.categories.gettingStarted.title'),
            desc: t('support.categories.gettingStarted.desc'),
            link: '/support/getting-started'
        },
        {
            icon: ShieldCheck,
            title: t('support.categories.security.title'),
            desc: t('support.categories.security.desc'),
            link: '/support/security-privacy'
        },
        {
            icon: Zap,
            title: t('support.categories.features.title'),
            desc: t('support.categories.features.desc'),
            link: '/support/platform-features'
        }
    ];

    const contactMethods = [
        {
            icon: MessageCircle,
            title: t('support.contact.chat.title'),
            desc: t('support.contact.chat.desc'),
            action: t('support.contact.chat.action'),
            link: '/contact'
        },
        {
            icon: Headphones,
            title: t('support.contact.call.title'),
            desc: t('support.contact.call.desc'),
            action: t('support.contact.call.action'),
            link: '/contact'
        }
    ];

    return (
        <div className="support-page">
            <section className="support-hero">
                <div className="container">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hero-content"
                    >
                        <h1 className="title">{t('support.hero.title')}</h1>
                        <p className="subtitle">{t('support.hero.subtitle')}</p>
                        
                        {/* ── Live Search ── */}
                        <div className="search-wrapper">
                            <div className="search-container">
                                <Search className="search-icon" size={20} />
                                <input 
                                    type="text" 
                                    placeholder={t('support.hero.searchPlaceholder')} 
                                    className="search-input"
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoComplete="off"
                                />
                                {searchQuery && (
                                    <button className="clear-btn" onClick={() => { setSearchQuery(''); setOpenFaq(null); }}>
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* ── Search results dropdown ── */}
                            {showResults && (
                                <motion.div
                                    className="search-results"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {filteredFaqs.length === 0 ? (
                                        <div className="no-results">
                                            <p>{t('support.search.empty', 'No results found for your search.')}</p>
                                        </div>
                                    ) : (
                                        filteredFaqs.map((faq, i) => (
                                            <div key={i} className="result-item">
                                                <button
                                                    className="result-question"
                                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                >
                                                    <span>{faq.q}</span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`result-chevron ${openFaq === i ? 'open' : ''}`}
                                                    />
                                                </button>
                                                {openFaq === i && (
                                                    <div className="result-answer">
                                                        <CheckCircle size={14} className="answer-check" />
                                                        <p>{faq.a}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
                <div className="bg-decor">
                    <div className="circle circle-1"></div>
                    <div className="circle circle-2"></div>
                </div>
            </section>

            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h2>{t('support.categories.title')}</h2>
                        <p>{t('support.categories.subtitle')}</p>
                    </div>

                    <div className="categories-grid">
                        {supportCategories.map((cat, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="category-card"
                            >
                                <div className="icon-wrapper">
                                    <cat.icon size={32} />
                                </div>
                                <h3>{cat.title}</h3>
                                <p>{cat.desc}</p>
                                <Link to={cat.link} className="learn-more">
                                    {t('support.learnMore')} <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="help-center-section">
                <div className="container">
                    <div className="help-grid">
                        <div className="help-info">
                            <h2>{t('support.helpCenter.title')}</h2>
                            <p>{t('support.helpCenter.desc')}</p>
                            <div className="help-stats">
                                <div className="stat">
                                    <span className="number">99%</span>
                                    <span className="label">{t('support.stats.satisfaction')}</span>
                                </div>
                                <div className="stat">
                                    <span className="number">24/7</span>
                                    <span className="label">{t('support.stats.availability')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="quick-links">
                            <Link to="/faq" className="quick-link-card">
                                <BookOpen size={24} />
                                <span>{t('support.links.faq')}</span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/contact" className="quick-link-card">
                                <MessageCircle size={24} />
                                <span>{t('support.links.contact')}</span>
                                <ArrowRight size={18} />
                            </Link>
                            <div className="quick-link-card disabled">
                                <FileText size={24} />
                                <span>{t('support.links.docs')}</span>
                                <span className="badge">{t('support.comingSoon')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <div className="contact-banner">
                        <div className="bg-decor">
                            <div className="circle circle-1"></div>
                            <div className="circle circle-2"></div>
                        </div>
                        <div className="banner-content">
                            <h2>{t('support.footer.title')}</h2>
                            <p>{t('support.footer.desc')}</p>
                            <div className="contact-options">
                                {contactMethods.map((method, idx) => (
                                    <Link key={idx} to={method.link} className="contact-option">
                                        <div className="option-icon">
                                            <method.icon size={24} />
                                        </div>
                                        <div className="option-text">
                                            <h4>{method.title}</h4>
                                            <p>{method.desc}</p>
                                            <span className="action">{method.action}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Support;