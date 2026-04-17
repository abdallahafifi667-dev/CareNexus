import React from 'react';
import { ShoppingBag, Package, ListChecks } from 'lucide-react';

const StoreManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ecommerce Management</h2>
        <p className="text-slate-500">Monitor orders, products, and categories across the platform.</p>
      </div>

      <div className="flex gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Total Sales</p>
            <h4 className="text-xl font-bold text-slate-900">$24,592.00</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Pending Orders</p>
            <h4 className="text-xl font-bold text-slate-900">12</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">Active Products</p>
            <h4 className="text-xl font-bold text-slate-900">432</h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 text-center text-slate-400">
          <p className="text-lg">Orders & Inventory Table Placement</p>
          <p className="text-sm mt-2">Connecting to E-commerce API...</p>
        </div>
      </div>
    </div>
  );
};

export default StoreManagement;
