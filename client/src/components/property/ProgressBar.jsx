import { STEPS, STEP_ICONS, S_PAL, IC } from "../../constants/addPropertyConstants.jsx";

export default function ProgressBar({ current, completed, failed, visited, onNav }) {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-3 mb-6 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done = completed.has(i);
        const hasFailed = failed.has(i) && !done;
        const wasVisited = visited.has(i) && !done;
        const active = current === i;
        const Icon = STEP_ICONS[i];
        const p = S_PAL[i];
        return (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onNav(i)}
              className={[
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 w-full justify-center sm:justify-start cursor-pointer",
                active && done ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : active ? "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
                  : done ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : hasFailed ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : wasVisited ? "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  : "text-slate-400 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className={[
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                active && done ? "bg-emerald-500 text-white"
                  : active ? `${p.num} text-white`
                  : done ? "bg-emerald-500 text-white"
                  : hasFailed ? "bg-red-400 text-white"
                  : wasVisited ? "bg-slate-300 text-white"
                  : "bg-slate-100 text-slate-300",
              ].join(" ")}>
                {done ? <IC.Check className="w-3 h-3" />
                  : (hasFailed && !active) || (wasVisited && !active) ? <IC.X className="w-3 h-3" />
                  : (!done && !hasFailed && !wasVisited && !active) ? <IC.Lock className="w-3 h-3" />
                  : <Icon className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline truncate">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <IC.ChevR className={`w-4 h-4 mx-1 shrink-0 ${done ? "text-emerald-400" : hasFailed ? "text-red-300" : "text-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}