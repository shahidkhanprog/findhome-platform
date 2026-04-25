export default function SpecCard({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm min-w-[90px]">
      <div className="text-[#f36c3a] text-xl">{icon}</div>
      <p className="text-base font-black text-slate-900 leading-none">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</p>
    </div>
  );
}