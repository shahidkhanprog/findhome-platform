import { STATUS_CONFIG } from "../../constants/dashboardConstants";

const STATUS_KEYS = ["all", "available", "sold", "rented", "pending"];

export default function SavedFilterBar({ posts, filter, setFilter }) {
  const count = (s) =>
    s === "all" ? posts.length : posts.filter((p) => p.status === s).length;

  return (
    <div className="sp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
      {STATUS_KEYS.map((s) => {
        const isActive = filter === s;
        const cfg = STATUS_CONFIG[s];
        return (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={[
              "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border",
              isActive
                ? s === "all"
                  ? "bg-blue-500 text-white border-transparent shadow-md shadow-violet-200"
                  : `${cfg.bg} ${cfg.text} ${cfg.border}`
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700",
            ].join(" ")}
          >
            {s === "all" ? "All" : cfg.label}
            <span
              className={[
                "text-[10px] font-bold rounded-full px-1.5 py-px leading-none min-w-[18px] text-center",
                isActive
                  ? s === "all"
                    ? "bg-white/25 text-white"
                    : `${cfg.dot} text-white`
                  : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {count(s)}
            </span>
          </button>
        );
      })}
    </div>
  );
}