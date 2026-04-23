// components/dashboard/FilterBar.jsx
import { MdPeople, MdPersonOutline } from "react-icons/md";
import { STATUS_CONFIG } from "../../constants/dashboardConstants";

const STATUS_KEYS = ["all", "available", "sold", "rented", "pending"];

export default function FilterBar({ allPosts, filter, setFilter, isAdmin, adminScope, setAdminScope, userId }) {
  const scopedPosts = isAdmin && adminScope === "mine"
    ? allPosts.filter(p => p.userId === userId || p.user?.id === userId)
    : allPosts;

  const statusCount = (s) => s === "all" ? scopedPosts.length : scopedPosts.filter(p => p.status === s).length;

  return (
    <div className="flex flex-col gap-2.5">
      {isAdmin && (
        <div className="mp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">View</span>
          <button onClick={() => { setAdminScope("all"); setFilter("all"); }}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border ${adminScope === "all" ? "bg-blue-500 text-white border-transparent shadow-sm" : "bg-white text-slate-500 border-slate-200"}`}>
            <MdPeople size={13} /> All Users
            <span className={`text-[10px] font-bold rounded-full px-1.5 py-px ${adminScope === "all" ? "bg-white/25 text-white" : "bg-slate-100 text-slate-400"}`}>{allPosts.length}</span>
          </button>
          <button onClick={() => { setAdminScope("mine"); setFilter("all"); }}
            className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border ${adminScope === "mine" ? "bg-blue-500 text-white border-transparent shadow-sm" : "bg-white text-slate-500 border-slate-200"}`}>
            <MdPersonOutline size={13} /> Mine Only
            <span className={`text-[10px] font-bold rounded-full px-1.5 py-px ${adminScope === "mine" ? "bg-white/25 text-white" : "bg-slate-100 text-slate-400"}`}>
              {allPosts.filter(p => p.userId === userId || p.user?.id === userId).length}
            </span>
          </button>
        </div>
      )}
      {allPosts.length > 0 && (
        <div className="mp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
          {STATUS_KEYS.map((s) => {
            const isActive = filter === s;
            const cfg = STATUS_CONFIG[s];
            const count = statusCount(s);
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border ${isActive ? (s === "all" ? "bg-blue-500 text-white border-transparent shadow-md shadow-violet-200" : `${cfg.bg} ${cfg.text} ${cfg.border}`) : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}>
                {s === "all" ? "All" : cfg.label}
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-px ${isActive ? (s === "all" ? "bg-white/25 text-white" : `${cfg.dot} text-white`) : "bg-slate-100 text-slate-400"}`}>{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}