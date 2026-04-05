import React, { useState } from "react";
import PatientSidebar from "../PatientSidebar/PatientSidebar";
import PatientHeader from "../PatientHeader/PatientHeader";
import FloatingChatContainer from "../../../../shared/components/Social/FloatingChatBox/FloatingChatContainer";
import "./PatientLayout.scss";

const PatientLayout = ({ children, title }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`patient-layout ${isCollapsed ? "sidebar-collapsed" : ""}`}>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? "show" : ""}`}
        onClick={toggleMobileMenu}
      ></div>

      <div
        className={`sidebar-wrapper ${isMobileMenuOpen ? "show-mobile" : ""}`}
      >
        <PatientSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <div className="main-content">
        <PatientHeader title={title} onMenuClick={toggleMobileMenu} />
        <main className="content-inner">{children}</main>
      </div>
      <FloatingChatContainer />
    </div>
  );
};

export default PatientLayout;
