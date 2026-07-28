export default function CreditBanner() {
  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl border border-indigo-500/30 shadow-lg my-4">
      <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-3">
        <h3 className="text-sm font-bold text-indigo-400">
          📘 Study Vault
        </h3>

        <span className="text-xs text-slate-400">
          Version 2.5
        </span>
      </div>

      <div className="space-y-1 text-sm">
        <p>
          <strong>Creator:</strong> Ravikishan
        </p>

        <p>
          <strong>Purpose:</strong> Free NEB study notes, practice questions and learning resources.
        </p>

        <p className="text-slate-400 italic">
          Made with curiosity ❤️
        </p>
      </div>
    </div>
  );
}
