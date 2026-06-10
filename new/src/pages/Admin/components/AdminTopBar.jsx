import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getAvatar } from '../../../utils/imageUtils';

const AdminTopBar = ({ isCollapsed }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <div className="page-title-wrap">
          <span className="page-icon">⚡</span>
          <h1 className="page-title">Admin Panel</h1>
        </div>
      </div>

      <div className="topbar-center">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search everything..." />
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-action-btn notification-btn">
          <Bell size={20} />
          <span className="notification-badge"></span>
        </button>

        <div className="topbar-user">
          <div className="user-text">
            <span className="user-name">{user?.username || "Admin"}</span>
            <span className="user-role">Super Admin</span>
          </div>
          <div className="user-avatar">
            {user?.avatar ? <img src={getAvatar(user)} alt="" /> : <User size={20} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
