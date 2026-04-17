import React from 'react';
import { FileText, MessageSquare, Trash2, Shield } from 'lucide-react';

const ContentModeration = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Content & Community</h2>
        <p className="text-slate-500">Moderate blog posts and user comments to maintain quality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Recent Posts
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-bold text-slate-900 text-sm">How to maintain a healthy heart...</h5>
                    <p className="text-xs text-slate-500 mt-1">Author: Dr. Sarah • 12 Comments • 2 hours ago</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors"><Shield className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> Moderation Queue
            </h3>
            <div className="space-y-6 text-center py-10">
              <MessageSquare className="w-12 h-12 text-slate-200 mx-auto" />
              <p className="text-sm text-slate-400">All comments are currently clean.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
