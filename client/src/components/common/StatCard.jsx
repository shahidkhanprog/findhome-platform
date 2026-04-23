import { STAT_STYLES } from "../../constants/dashboardConstants";

export default function StatCard({ label, value, colorKey, Icon, loading, isAdminView }) {
  const s = STAT_STYLES[colorKey];
  return (
    <div
      className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-all duration-200
      ${isAdminView ? "border-gray-100 shadow-sm shadow-gray-50/80 hover:shadow-gray-100" : "border-slate-100 hover:shadow-slate-100"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium leading-tight">{label}</span>
        <span className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${s.iconBg} ${s.iconText}`}>
          <Icon size={18} />
        </span>
      </div>
      {loading ? (
        <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <span className={`text-3xl font-extrabold leading-none ${s.value}`}>{value}</span>
      )}
    </div>
  );
}