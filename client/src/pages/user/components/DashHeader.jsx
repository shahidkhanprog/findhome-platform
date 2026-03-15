import { Avatar } from "./ui";

export default function DashHeader({ activeNav, editingPost, user, setActiveNav }) {
  const title = editingPost
    ? "Edit Property"
    : activeNav === "add"
    ? "Add Property"
    : activeNav;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 w-full">
      {/* Left: page title + date */}
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-slate-800 capitalize truncate">{title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString("en-PK", {
            weekday:"long", year:"numeric", month:"long", day:"numeric",
          })}
        </p>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0 ml-3">
        <button className="relative w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors text-sm">
          🔔
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        <button
          onClick={() => setActiveNav("profile")}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Avatar src={user.avatar} name={user.username} size={36} />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-slate-700 leading-tight">{user.username}</p>
            <p className="text-[11px] text-slate-400 capitalize">{user.role}</p>
          </div>
        </button>
      </div>
    </header>
  );
}