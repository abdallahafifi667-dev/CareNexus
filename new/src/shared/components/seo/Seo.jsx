import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_PUBLIC_URL || 'https://care-nexus-front-9hn1.vercel.app';
const formatUrl = (path) => `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const Seo = ({ title, description, keywords, image = '/logo1.png', path, noIndex = false }) => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const currentPath = path || location.pathname;
    const pageUrl = formatUrl(currentPath);
    const imageUrl = formatUrl(image);
    const robotsValue = noIndex ? 'noindex, nofollow' : 'index, follow';
    
    const siteName = t('nav.brand_name', { defaultValue: 'CareNexus' });
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const fullDesc = description || t('common.welcome_desc', { defaultValue: 'Search for thousands of global medicines and get accurate information.' });

    return (
        <Helmet htmlAttributes={{ lang: i18n.language, dir: i18n.language === 'ar' ? 'rtl' : 'ltr' }}>
            <title>{fullTitle}</title>
            <meta name="description" content={fullDesc} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="robots" content={robotsValue} />
            <link rel="canonical" href={pageUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={pageUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={fullDesc} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={i18n.language === 'ar' ? 'ar_EG' : 'en_US'} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={pageUrl} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={fullDesc} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:site" content="@CareNexus" />
        </Helmet>
    );
};

export default Seo;

