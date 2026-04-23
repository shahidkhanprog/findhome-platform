import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { MdNotificationsNone } from "react-icons/md";

/* ─── Page titles ────────────────────────────────────────────────── */
const PAGE_META = {
  "/dashboard/overview": "Overview",
  "/dashboard/myProperties": "My Properties",
  "/dashboard/addProperty": "Add Property",
  "/dashboard/favorites": "Saved Posts",
  "/dashboard/messages": "Messages",
  "/dashboard/profile": "Profile",
};

const getPageTitle = (pathname) => {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith("/dashboard/property/")) return "Property Details";
  return "Dashboard";
};

const getInitials = (name) => {
  if (!name || typeof name !== "string") return "?";
  return name.trim().charAt(0).toUpperCase() || "?";
};

const todayString = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const DashHeader = () => {
  const [unreadCount] = useState(12);

  const { currentUser } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //  FIX: correct structure from your system
  const user = currentUser?.userData ?? {};

  const avatar = user.avatar ?? null;
  const username = user.username ?? "User";
  const role = user.role ?? "Member";
  const initials = getInitials(username);

  const title = getPageTitle(pathname);

  return (
    <header className="h-16 flex items-center md:px-6 gap-4 flex-shrink-0 w-full max-w-[1280px] mx-auto shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]">
      {/* Page title + date */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-bold text-slate-800 leading-tight truncate capitalize">
          {title}
        </h1>
        <p className="text-[11px] text-slate-400 hidden sm:block leading-tight mt-0.5">
          {todayString()}
        </p>
      </div>

      {/* Bell + user chip */}
      <div className="flex items-center gap-2 flex-shrink-0">

        <button
          onClick={() => navigate("/dashboard/messages")}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all"
        >
          <MdNotificationsNone size={20} />

          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 border-2 border-white text-white text-[10px] font-bold leading-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* User chip */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 rounded-xl pl-1.5 pr-3 py-1.5 transition-all group"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-violet-200"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 select-none">
              {initials}
            </div>
          )}

          <div className="hidden sm:block text-left leading-tight">
            <p className="text-[12px] font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">
              {username}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">{role}</p>
          </div>
        </button>

      </div>
    </header>
  );
};

export default DashHeader;