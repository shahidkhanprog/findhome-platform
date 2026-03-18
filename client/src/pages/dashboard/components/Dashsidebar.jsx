// // components/DashHeader.jsx
// import { useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext"; // adjust path if needed
// import { MdNotificationsNone } from "react-icons/md";

// /* ─── Page title map ─────────────────────────────────────────────── */
// const PAGE_META = {
//   "/dashboard/overview":     { title: "Overview"      },
//   "/dashboard/myProperties": { title: "My Properties" },
//   "/dashboard/addProperty":  { title: "Add Property"  },
//   "/dashboard/favorites":    { title: "Saved Posts"   },
//   "/dashboard/messages":     { title: "Messages"      },
//   "/dashboard/profile":      { title: "Profile"       },
// };

// /* ─── Helpers ────────────────────────────────────────────────────── */
// const getInitials = (name = "") =>
//   name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "?";

// const todayString = () =>
//   new Date().toLocaleDateString("en-US", {
//     weekday: "long", year: "numeric", month: "long", day: "numeric",
//   });

// /* ─── Avatar: shows photo if available, else initials ───────────── */
// function UserAvatar({ user }) {
//   const initials = getInitials(user?.username);

//   // If user has an avatar URL, show the image
//   if (user?.avatar) {
//     return (
//       <img
//         src={user.avatar}
//         alt={user.username ?? "User"}
//         className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-violet-200"
//         onError={(e) => { e.currentTarget.style.display = "none"; }}
//       />
//     );
//   }

//   // Otherwise show initials
//   return (
//     <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 select-none">
//       {initials}
//     </div>
//   );
// }

// /* ─── DashHeader ─────────────────────────────────────────────────── */
// const DashHeader = () => {
//   const { currentUser } = useContext(AuthContext);
//   const { pathname }    = useLocation();
//   const navigate        = useNavigate();

//   // Resolve page title — handles static routes + dynamic /dashboard/property/:id
//   const meta = PAGE_META[pathname]
//     ?? (pathname.startsWith("/dashboard/property/")
//         ? { title: "Property Details" }
//         : { title: "Dashboard" });

//   return (
//     <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4 flex-shrink-0">

//       {/* Page title + date */}
//       <div className="flex-1 min-w-0">
//         <h1 className="text-[15px] font-bold text-slate-800 leading-tight truncate">
//           {meta.title}
//         </h1>
//         <p className="text-[11px] text-slate-400 hidden sm:block leading-tight mt-0.5">
//           {todayString()}
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-2 flex-shrink-0">

//         {/* Bell */}
//         <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all">
//           <MdNotificationsNone size={20} />
//           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
//         </button>

//         {/* User chip → navigates to profile */}
//         <button
//           onClick={() => navigate("/dashboard/profile")}
//           className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 rounded-xl pl-1.5 pr-3 py-1.5 transition-all group"
//         >
//           {/* Smart avatar: photo if available, initials if not */}
//           <UserAvatar user={currentUser} />

//           <div className="hidden sm:block text-left leading-tight">
//             <p className="text-[12px] font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">
//               {currentUser?.username ?? "User"}
//             </p>
//             <p className="text-[10px] text-slate-400 capitalize">
//               {currentUser?.role ?? "Member"}
//             </p>
//           </div>
//         </button>

//       </div>
//     </div>
//   );
// };

// export default DashHeader;

// components/DashSidebar.jsx
import { useLocation, NavLink, Link } from "react-router-dom";
import {
  MdGridView,
  MdOutlineHome,
  MdAddCircleOutline,
  MdFavoriteBorder,
  MdOutlineMessage,
  MdOutlinePersonOutline,
  MdChevronRight,
  MdChevronLeft,
} from "react-icons/md";

/* ─── Constants ──────────────────────────────────────────────────── */
const W_STRIP    = 64;
const W_EXPANDED = 220;
const NAVBAR_H   = 64;

/* ─── Nav items ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "overview",     label: "Overview",      path: "/dashboard/overview",     Icon: MdGridView,             badge: null },
  { id: "myProperties", label: "My Properties", path: "/dashboard/myProperties", Icon: MdOutlineHome,          badge: null },
  { id: "addProperty",  label: "Add Property",  path: "/dashboard/addProperty",  Icon: MdAddCircleOutline,     badge: null },
  { id: "favorites",    label: "Saved Posts",   path: "/dashboard/favorites",    Icon: MdFavoriteBorder,       badge: null },
  { id: "messages",     label: "Messages",      path: "/dashboard/messages",     Icon: MdOutlineMessage,       badge: 12 },
  { id: "profile",      label: "Profile",       path: "/dashboard/profile",      Icon: MdOutlinePersonOutline, badge: null },
];

/* ─── NavList ────────────────────────────────────────────────────── */
function NavList({ showLabels, onNavigate }) {
  const { pathname } = useLocation();

  // Keep "My Properties" highlighted when on a single property detail page
  const isPropertyDetail = pathname.startsWith("/dashboard/property/");

  return (
    <nav className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide ${showLabels ? "px-2.5 py-3" : "px-2 py-3"}`}>
      {NAV_ITEMS.map(({ id, label, path, Icon, badge }) => {
        const forceActive = id === "myProperties" && isPropertyDetail;

        return (
          <NavLink
            key={id}
            to={path}
            title={!showLabels ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) => {
              const active = isActive || forceActive;
              return [
                "relative flex items-center mb-0.5 rounded-[10px] no-underline transition-all duration-150 overflow-hidden",
                showLabels ? "gap-2.5 px-3 py-[9px]" : "justify-center py-[10px] px-0",
                active
                  ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 font-semibold"
                  : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700",
              ].join(" ");
            }}
          >
            {({ isActive }) => {
              const active = isActive || forceActive;
              return (
                <>
                  {active && (
                    <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-full bg-violet-700" />
                  )}
                  <Icon size={20} className={`flex-shrink-0 ${active ? "text-violet-700" : "text-slate-400"}`} />
                  {showLabels && (
                    <>
                      <span className="flex-1 text-[13.5px] whitespace-nowrap">{label}</span>
                      {badge && (
                        <span className="text-[10px] font-bold bg-violet-700 text-white rounded-full px-[7px] py-[2px] leading-none">
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                  {!showLabels && badge && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-violet-700 border-2 border-white" />
                  )}
                </>
              );
            }}
          </NavLink>
        );
      })}
    </nav>
  );
}

/* ─── DashSidebar ────────────────────────────────────────────────── */
const DashSidebar = ({ panelRef, expanded, setExpanded, onNavigate }) => {
  return (
    <div
      ref={panelRef}
      className="flex flex-col bg-white border-r border-slate-100"
      style={{
        position: "fixed",
        top: NAVBAR_H,
        left: 0,
        width: W_STRIP,
        height: `calc(100vh - ${NAVBAR_H}px)`,
        zIndex: 40,
      }}
    >
      {/* Logo icon */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 flex-shrink-0">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-md shadow-violet-200">
          <MdOutlineHome size={17} color="white" />
        </div>
      </div>

      {/* Icon-only nav */}
      <NavList showLabels={false} onNavigate={onNavigate} />

      {/* Expand toggle */}
      <div className="border-t border-slate-100 p-2 flex-shrink-0">
        <button
          onClick={() => setExpanded(true)}
          title="Expand sidebar"
          className="flex items-center justify-center w-full py-2 rounded-[10px] border-none bg-transparent text-slate-400 cursor-pointer hover:bg-violet-50 hover:text-violet-700 transition-all"
        >
          <MdChevronRight size={20} />
        </button>
      </div>

      {/* ── Expanded overlay panel ── */}
      {expanded && (
        <div
          className="sidebar-slide-in absolute top-0 left-0 flex flex-col bg-white border-r border-slate-200 shadow-[6px_0_32px_rgba(0,0,0,0.12)]"
          style={{ width: W_EXPANDED, height: "100%", zIndex: 50 }}
        >
          {/* Logo full */}
          <div className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
            <Link to="/dashboard/overview" onClick={onNavigate} className="flex items-center gap-2.5 no-underline">
              <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200">
                <MdOutlineHome size={17} color="white" />
              </div>
              <span className="font-extrabold text-[16px] text-slate-900 tracking-tight whitespace-nowrap">
                Dash<span className="text-violet-700">board</span>
              </span>
            </Link>
          </div>

          {/* Nav with labels */}
          <NavList showLabels={true} onNavigate={onNavigate} />

          {/* Collapse toggle */}
          <div className="border-t border-slate-100 p-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-[10px] border-none bg-transparent text-slate-400 text-[12.5px] font-medium cursor-pointer hover:bg-violet-50 hover:text-violet-700 transition-all"
            >
              <MdChevronLeft size={18} />
              Collapse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashSidebar;