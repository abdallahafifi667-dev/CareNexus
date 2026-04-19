import React from 'react';
import { ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';

const VerificationCenter = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Verification Center</h2>
          <p className="text-slate-500">Review and approve professional documents and identities.</p>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-xl text-sm font-bold border border-amber-500/20">
          48 Pending Reviews
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Dr. Mohamed Ali</h4>
                  <p className="text-xs text-slate-500">Cardiologist • Applied 2 hours ago</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-full">Pending Review</span>
            </div>

            <div className="p-6 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase text-slate-500">National ID</span>
                </div>
                <div className="h-32 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                  <FileText className="w-6 h-6 mb-2" />
                  <span className="text-[10px] font-bold uppercase text-slate-500">Certificate</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                <CheckCircle className="w-4 h-4" /> Approve
              </button>
              <button className="flex-1 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationCenter;
