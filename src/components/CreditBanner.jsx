import React from 'react';

export default function CreditBanner() {
  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-indigo-500/30 shadow-lg my-4 space-y-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-sm font-extrabold text-indigo-400">👑 Study-Vault Credits</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
          v2.5
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400">👑</span>
          <span><strong>Owner:</strong> Ravikishan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-400">✨</span>
          <span><strong>Curated by:</strong> Ravikishan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400">💡</span>
          <span><strong>Made with curiosity by:</strong> Ravikishan</span>
        </div>
      </div>
    </div>
  );
}
