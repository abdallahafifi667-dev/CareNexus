import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MoveLeft, MoveRight } from 'lucide-react';
import './header.scss';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isRtl = i18n.language === 'ar';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(nextLang);
        localStorage.setItem('lng', nextLang);
    };

    return (
        <header className={`auth-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-content">
                <div className="minimal-nav">
                    <div className="divider"></div>

                    <Link to="/" className="nav-item home-link">
                        {t('nav.home')}
                    </Link>

                    <div className="divider"></div>

                    <button onClick={toggleLanguage} className="nav-item lang-switcher">
                        {t('common.switch_lang')}
                    </button>

                    <button onClick={() => navigate(-1)} className="nav-item back-link">
                        <span>{t('common.back')}</span>
                        {isRtl ? <MoveLeft size={20} /> : <MoveRight size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
