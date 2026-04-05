import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft } from 'lucide-react';
import './NotFound.scss';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    React.useEffect(() => {
        document.title = t('titles.not_found', 'Page Not Found');
    }, [t]);

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="creative-404">
                    <div className="digit">4</div>
                    <div className="visual-zero">
                        {/* Custom animated SVG representing a heartbeat/medical pulse */}
                        <svg viewBox="0 0 100 100" className="pulse-svg">
                            <circle cx="50" cy="50" r="48" className="outer-circle" />
                            <circle cx="50" cy="50" r="35" className="inner-circle" />
                            <path 
                                d="M20,50 L40,50 L45,30 L55,70 L60,50 L80,50" 
                                className="pulse-line" 
                            />
                        </svg>
                    </div>
                    <div className="digit">4</div>
                </div>
                
                <h2 className="error-title">{t('common.not_found_title', 'Oops! Page Abandoned')}</h2>
                <p className="error-message">
                    {t('common.not_found_message', "It seems you've ventured into uncharted territory. This page doesn't exist.")}
                </p>

                <div className="actions">
                    <button onClick={() => navigate(-1)} className="btn-secondary">
                        <ArrowLeft size={18} />
                        <span>{t('common.go_back', 'Go Back')}</span>
                    </button>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        <Home size={18} />
                        <span>{t('common.back_to_home', 'Back to Home')}</span>
                    </button>
                </div>
            </div>
            
            <div className="premium-background">
                <div className="grid-overlay"></div>
                <div className="glow-orb orb-1"></div>
                <div className="glow-orb orb-2"></div>
            </div>
        </div>
    );
};

export default NotFound;
