import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./AuthVisual.scss";

const AuthVisual = React.memo(() => {
  const { t } = useTranslation();
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [shouldLoadImg, setShouldLoadImg] = useState(false);

  useEffect(() => {
    // Defer image loading slightly to prioritize the first paint
    const timer = setTimeout(() => setShouldLoadImg(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="auth-visual">
      <div className={`visual-background ${isBgLoaded ? "loaded" : ""}`}>
        {shouldLoadImg && (
          <img
            src="/abstract-tech.png"
            alt="CareNexus Tech"
            className="bg-img"
            onLoad={() => setIsBgLoaded(true)}
          />
        )}
        <div className="bg-overlay"></div>
      </div>
      <div className="visual-content">
        <div className="glass-card">
          <img src="/logo2.png" alt="CareNexus Logo" className="auth-logo" />
          <h2 className="slogan">{t("auth.slogan")}</h2>
        </div>
      </div>
    </div>
  );
});

export default AuthVisual;
