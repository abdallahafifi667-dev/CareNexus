import React, { useState } from "react";
import ShippingSidebar from "../ShippingSidebar/ShippingSidebar";
import ShippingHeader from "../ShippingHeader/ShippingHeader";
import "./ShippingLayout.scss";

const ShippingLayout = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`shipping-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`sidebar-wrapper ${isMobileMenuOpen ? "show-mobile" : ""}`}
      >
        <ShippingSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <div className="main-content">
        <ShippingHeader title={title} onMenuClick={toggleMobileMenu} />
        <main className="content-inner">{children}</main>
      </div>
    </div>
  );
};

export default ShippingLayout;
