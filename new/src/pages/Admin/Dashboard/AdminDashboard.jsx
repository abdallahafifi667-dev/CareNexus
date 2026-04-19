import React from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  TrendingUp, 
  UserPlus, 
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Total Users', value: '12,842', change: '+12.5%', isPositive: true, icon: Users, color: 'blue' },
  { label: 'Active Doctors', value: '842', change: '+5.2%', isPositive: true, icon: UserCheck, color: 'emerald' },
  { label: 'Pending Verifications', value: '48', change: '-2.4%', isPositive: false, icon: UserPlus, color: 'amber' },
  { label: 'Suspended Accounts', value: '12', change: '-1.1%', isPositive: true, icon: UserMinus, color: 'red' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
        <p className="text-slate-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">User Growth</h3>
          <div className="flex items-center justify-center h-full text-slate-400">
            <TrendingUp className="w-12 h-12 opacity-20" />
            <p className="ml-4">Chart Visualization Placeholder</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900 font-medium">Dr. Sarah Wilson <span className="text-slate-500 font-normal">uploaded medical certificates for verification.</span></p>
                  <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
