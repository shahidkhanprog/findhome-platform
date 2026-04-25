export default function DetailRow({ icon, label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-[#f36c3a] text-base shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-slate-500 shrink-0 w-36">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}