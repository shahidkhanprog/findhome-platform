import { STATUS_CONFIG } from "../../constants/dashboardConstants";

export default function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} text-[11px] font-bold rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0 w-[100%]`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}