import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Info, AlertTriangle, FileText, Package, Droplets, BookOpen, Loader2, X } from 'lucide-react';
import './DrugSearch.scss';
import { mockDrugSearchResults } from '../mockData';

const DrugSearch = () => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [drugInfo, setDrugInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [error, setError] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim().length >= 2) {
                setIsSuggesting(true);
                const matches = mockDrugSearchResults
                    .filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.genericName.toLowerCase().includes(query.toLowerCase()))
                    .map(d => d.name);
                setSuggestions(matches);
                setShowSuggestions(matches.length > 0);
                setIsSuggesting(false);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = (name) => {
        setIsLoading(true);
        setError(null);
        setDrugInfo(null);
        setShowSuggestions(false);
        setQuery(name);
        setTimeout(() => {
            const found = mockDrugSearchResults.find(d => d.name.toLowerCase() === name.toLowerCase());
            if (found) {
                setDrugInfo(found);
            } else {
                setError(t('drugs.not_found', 'No details found for this drug.'));
            }
            setIsLoading(false);
        }, 500);
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
                    <h1>{t('drugs.title', 'Global Drug Search Engine')}</h1>
                    <p>{t('drugs.subtitle', 'Search for any drug to get full details from certified global sources')}</p>

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
                                    placeholder={t('drugs.placeholder', 'Enter drug name (e.g. Aspirin, Ibuprofen)...')}
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
                        <p>{t('common.searching', 'Searching...')}</p>
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
                                        {drugInfo.genericName && (
                                            <span className="generic-name">{drugInfo.genericName}</span>
                                        )}
                                    </div>
                                </div>
                                {drugInfo.manufacturer && (
                                    <div className="manufacturer-info">
                                        <span className="label">{t('drugs.manufacturer', 'Manufacturer')}:</span>
                                        <span className="value">{drugInfo.manufacturer}</span>
                                    </div>
                                )}
                            </div>

                            <div className="drug-grid">
                                {renderDetailSection(t('drugs.indications', 'Indications & Usage'), drugInfo.indications, <BookOpen size={20} />)}
                                {renderDetailSection(t('drugs.dosage', 'Dosage & Administration'), drugInfo.dosage, <Droplets size={20} />)}
                                {renderDetailSection(t('drugs.side_effects', 'Side Effects'), drugInfo.sideEffects, <Info size={20} />)}
                                {renderDetailSection(t('drugs.contraindications', 'Contraindications'), drugInfo.contraindications, <X size={20} className="text-red-500" />)}
                            </div>

                            <div className="drug-footer">
                                <div className="source-info">
                                    <span>{t('drugs.source', 'Source')}: <strong>OpenFDA / NIH</strong></span>
                                </div>
                                <button className="print-btn" onClick={() => window.print()}>
                                    <FileText size={18} />
                                    {t('drugs.print', 'Print Report')}
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
                        <h3>{t('drugs.welcome_title_search', 'Start Searching Now')}</h3>
                        <p>{t('drugs.welcome_desc', 'You can search for thousands of global drugs and get accurate and documented information.')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DrugSearch;
