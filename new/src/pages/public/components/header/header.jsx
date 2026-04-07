import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import useScrollLock from '../../../../shared/hooks/useScrollLock';
import './header.scss';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Apply global scroll lock hook
    useScrollLock(isMobileMenuOpen);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;

            if (isHome) {
                setIsSticky(scrollY >= viewportHeight - 80);
            } else {
                setIsSticky(true);
            }

            setScrolled(scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHome]);

    const toggleLanguage = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
        localStorage.setItem('lng', nextLang);
        // The direction is handled in App.jsx but we can sync it here too for immediate feedback
        document.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = nextLang;
    };

    const handleMobileToggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsMobileMenuOpen(prev => !prev);
    };

    useEffect(() => {
        const currentLang = i18n.language;
        document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }, [i18n.language]);

    return (
        <header className={`header ${isSticky ? 'sticky' : 'initial'} ${isHome ? 'home-header' : 'sub-header'} ${scrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'mobile-menu-active' : ''}`}>
            <div className="container nav-container">
                <div className="logo-wrapper">
                    <Link to="/" className="brand-name">CareNexus</Link>
                </div>

                {/* Mobile Menu Overlay */}
                <div
                    className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMobileMenuOpen(false);
                    }}
                ></div>

                <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>{t('nav.home')}</Link>
                    <Link to="/about" className="nav-link">{t('nav.about')}</Link>
                    <Link to="/services" className="nav-link">{t('nav.services')}</Link>
                    <Link to="/medical-ai" className="nav-link ai-link">{t('nav.medical_ai')}</Link>
                    <Link to="/drug-search" className="nav-link">{t('nav.drug_search', { defaultValue: 'Drug Search' })}</Link>
                    <Link to="/knowledge-ai" className="nav-link">{t('nav.knowledge_ai')}</Link>
                    <Link to="/support" className="nav-link">{t('nav.support')}</Link>

                    <div className="mobile-only-actions">
                        <button onClick={toggleLanguage} className="mobile-action-btn">
                            <Globe size={20} />
                            {t('common.switch_lang', { defaultValue: i18n.language === 'ar' ? 'English' : 'العربية' })}
                        </button>
                        <Link to="/auth/login" className="mobile-action-btn login">
                            <LogIn size={20} />
                            {t('nav.login')}
                        </Link>
                    </div>
                </nav>

                <div className="header-actions">
                    <button onClick={toggleLanguage} className="lang-switcher">
                        <Globe size={20} className="globe-icon" />
                        <span className="lang-text">{t('common.switch_lang', { defaultValue: i18n.language === 'ar' ? 'English' : 'العربية' })}</span>
                    </button>
                    <Link to="/auth/login" className="cta-button">
                        <LogIn size={20} className="login-icon-mobile" />
                        <span className="btn-text">{t('nav.login')}</span>
                    </Link>

                    <button
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={handleMobileToggle}
                        aria-label="Toggle Menu"
                    >
                        <div className="hamburger-box">
                            <span className="hamburger-line top"></span>
                            <span className="hamburger-line middle"></span>
                            <span className="hamburger-line bottom"></span>
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
