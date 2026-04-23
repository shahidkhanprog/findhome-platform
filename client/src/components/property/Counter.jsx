import { IC } from "../../constants/addPropertyConstants.jsx";

export default function Counter({ value, onChange, btnCls }) {
  const n = Math.max(0, parseInt(value, 10) || 0);
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, n - 1))} disabled={n === 0}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btnCls}`}>
        <IC.Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-xl font-bold text-slate-800 tabular-nums select-none">{n}</span>
      <button type="button" onClick={() => onChange(Math.min(99, n + 1))} disabled={n >= 99}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btnCls}`}>
        <IC.Plus className="w-4 h-4" />
      </button>
    </div>
  );
}