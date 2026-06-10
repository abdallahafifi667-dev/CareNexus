import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UniversalSidebar from '../../shared/components/Sidebar/UniversalSidebar';
import AdminTopBar from './components/AdminTopBar';
import './AdminLayout.scss';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      <UniversalSidebar
        role="admin"
        collapsed={isCollapsed}
        setCollapsed={setIsCollapsed}
      />
      <main className="admin-main" style={{ marginLeft: isCollapsed ? '72px' : '260px' }}>
        <AdminTopBar />
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
