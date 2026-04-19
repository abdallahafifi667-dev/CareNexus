import React from 'react';

const UserManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <p className="text-slate-500">Manage all users, roles, and account statuses.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
             <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">All Users</button>
             <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">Doctors</button>
             <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">Patients</button>
             <button className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors">Merchants</button>
          </div>
        </div>
        <div className="p-20 text-center text-slate-400">
          <p className="text-lg">User Table Visualization Placement</p>
          <p className="text-sm mt-2">Connecting to Users-Core API...</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
