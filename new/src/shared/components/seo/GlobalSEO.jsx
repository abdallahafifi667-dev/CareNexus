import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Seo from './SEO';

const GlobalSEO = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const getTitleKey = (pathname) => {
    const parts = pathname.split('/').filter(p => p);
    if (parts.length === 0) return 'home';
    if (parts[0] === 'auth' && parts[1]) return parts[1].replace('-', '_');
    
    // Custom mapping for inner pages
    if (parts.length > 1) {
        // e.g. /doctor/settings -> doctor_settings
        return `${parts[0]}_${parts[1].replace('-', '_')}`;
    }
    
    return parts[0].replace('-', '_');
  };

  const titleKey = getTitleKey(location.pathname);
  // We can try to resolve it from nav or titles
  let title = t(`nav.${titleKey}`, { defaultValue: '' });
  if (!title) {
      title = t(`titles.${titleKey}`, { defaultValue: t('titles.home') });
  }

  return <Seo title={title} />;
};

export default GlobalSEO;
