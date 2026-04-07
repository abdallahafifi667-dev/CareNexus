import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { getDrugSuggestions, getDrugDetails } from '../stores/knowledgeService';
import { Search, Info, AlertTriangle, FileText, Package, Droplets, BookOpen, ExternalLink, Loader2, X } from 'lucide-react';
import './DrugSearch.scss';

const DrugSearch = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [drugInfo, setDrugInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSuggesting(true);
                const result = await dispatch(getDrugSuggestions(query));
                if (getDrugSuggestions.fulfilled.match(result)) {
                    setSuggestions(result.payload);
                    setShowSuggestions(true);
                }
                setIsSuggesting(false);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, dispatch]);

    const handleSearch = async (name) => {
        setIsLoading(true);
        setError(null);
        setDrugInfo(null);
        setShowSuggestions(false);
        setQuery(name);

        const result = await dispatch(getDrugDetails(name));
        if (getDrugDetails.fulfilled.match(result)) {
            setDrugInfo(result.payload);
        } else {
            setError(result.payload || t('drugs.not_found'));
        }
        setIsLoading(false);
    };

    const renderDetailSection = (title, content, icon) => {
        if (!content) return null;
        return (
            <div className="detail-section">
                <div className="section-header">
                    {icon}
                    <h3>{title}</h3>
                </div>
                <div className="section-content">
                    <p>{content}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="drug-search-page">
            <div className="search-header-bg">
                <div className="dots-overlay"></div>
                <div className="header-content">
                    <h1>{t('drugs.title')}</h1>
                    <p>{t('drugs.subtitle')}</p>

                    <div className="search-box-container" ref={suggestionRef}>
                        <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
                            <div className="input-wrapper">
                                <div className="search-icon-box">
                                    {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Search size={22} />}
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder={t('drugs.placeholder')}
                                    autoComplete="off"
                                />
                                {query && !isLoading && (
                                    <button type="button" className="clear-btn" onClick={() => { setQuery(''); setDrugInfo(null); }}>
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((name, index) => (
                                        <li key={index} onClick={() => handleSearch(name)}>
                                            <Search size={14} className="mr-2 opacity-50" />
                                            {name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            <div className="content-container">
                {isLoading && (
                    <div className="loading-state">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p>{t('common.searching')}</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <AlertTriangle size={48} />
                        <p>{error}</p>
                    </div>
                )}

                {drugInfo && (
                    <div className="drug-details-container">
                        <div className="drug-main-card">
                            <div className="drug-header">
                                <div className="title-area">
                                    <div className="drug-icon-box">
                                        <Package size={32} />
                                    </div>
                                    <div>
                                        <h2>{drugInfo.name}</h2>
                                        {drugInfo.generic_name && (
                                            <span className="generic-name">{drugInfo.generic_name}</span>
                                        )}
                                    </div>
                                </div>
                                {drugInfo.manufacturer && (
                                    <div className="manufacturer-info">
                                        <span className="label">{t('drugs.manufacturer', 'الشركة المصنعة')}:</span>
                                        <span className="value">{drugInfo.manufacturer}</span>
                                    </div>
                                )}
                            </div>

                            <div className="drug-grid">
                                {renderDetailSection(t('drugs.indications'), drugInfo.indications, <BookOpen size={20} />)}
                                {renderDetailSection(t('drugs.dosage'), drugInfo.dosage, <Droplets size={20} />)}
                                {renderDetailSection(t('drugs.warnings'), drugInfo.warnings, <AlertTriangle className="text-amber-500" size={20} />)}
                                {renderDetailSection(t('drugs.side_effects'), drugInfo.side_effects, <Info size={20} />)}
                                {renderDetailSection(t('drugs.contraindications'), drugInfo.contraindications, <X size={20} className="text-red-500" />)}
                                {renderDetailSection(t('drugs.description'), drugInfo.description, <FileText size={20} />)}
                                {renderDetailSection(t('drugs.pharmacology'), drugInfo.pharmacology, <BookOpen size={20} />)}
                                {renderDetailSection(t('drugs.storage'), drugInfo.storage, <Package size={20} />)}
                            </div>

                            <div className="drug-footer">
                                <div className="source-info">
                                    <span>{t('drugs.source', 'المصدر')}: <strong>OpenFDA / NIH</strong></span>
                                </div>
                                <button className="print-btn" onClick={() => window.print()}>
                                    <FileText size={18} />
                                    {t('drugs.print', 'طباعة التقرير')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {!drugInfo && !isLoading && !error && (
                    <div className="welcome-state">
                        <div className="welcome-icon">
                            <BookOpen size={64} />
                        </div>
                        <h3>{t('drugs.welcome_title_search')}</h3>
                        <p>{t('drugs.welcome_desc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrugSearch;
