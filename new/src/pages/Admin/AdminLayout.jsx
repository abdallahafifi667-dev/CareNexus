import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminTopBar from './components/AdminTopBar';
import FloatingChatContainer from '../../shared/components/Social/FloatingChatBox/FloatingChatContainer';
import './AdminLayout.scss';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`admin-layout ${isCollapsed ? 'sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
      <div
        className={`sidebar-overlay ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={toggleMobileMenu}
      ></div>

      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'show-mobile' : ''}`}>
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} isMobileOpen={isMobileMenuOpen} onMobileClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="main-content">
        <AdminTopBar onMenuClick={toggleMobileMenu} />
        <main className="content-inner">
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <FloatingChatContainer />
    </div>
  );
};

export default AdminLayout;
