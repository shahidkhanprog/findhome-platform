import { STATUS_CONFIG } from "../constants";

/* ─── Avatar ────────────────────────────────────────────────────────────────── */
export function Avatar({ src, name, size = 40 }) {
  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const sizeClass = {
    36: "w-9 h-9 min-w-[36px] text-sm",
    40: "w-10 h-10 min-w-[40px] text-sm",
    56: "w-14 h-14 min-w-[56px] text-base",
    72: "w-[72px] h-[72px] min-w-[72px] text-xl",
  }[size] ?? "w-10 h-10 min-w-[40px] text-sm";

  return src ? (
    <img src={src} alt={name}
      className={`${sizeClass} rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div className={`${sizeClass} rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold ring-2 ring-white select-none`}>
      {initials}
    </div>
  );
}

/* ─── Badge ─────────────────────────────────────────────────────────────────── */
export function Badge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─── ChevronIcon ───────────────────────────────────────────────────────────── */
export function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-0" : "rotate-180"}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}