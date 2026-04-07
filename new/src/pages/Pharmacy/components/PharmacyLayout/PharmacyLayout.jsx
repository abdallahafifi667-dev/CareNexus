import React, { useState } from "react";
import PharmacySidebar from "../PharmacySidebar/PharmacySidebar";
import PharmacyHeader from "../PharmacyHeader/PharmacyHeader";
import "./PharmacyLayout.scss";

const PharmacyLayout = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`pharmacy-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`sidebar-wrapper ${isMobileMenuOpen ? "show-mobile" : ""}`}
      >
        <PharmacySidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <div className="main-content">
        <PharmacyHeader title={title} onMenuClick={toggleMobileMenu} />
        <main className="content-inner">{children}</main>
      </div>
    </div>
  );
};

export default PharmacyLayout;
