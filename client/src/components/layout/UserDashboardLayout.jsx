
// import { useState, useEffect, useRef, useContext } from "react";
// import { Navigate, Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext"; // adjust path
// import Navbar from "../navbar/Navbar";              // your existing Navbar

// import {
//   MdGridView,
//   MdOutlineHome,
//   MdAddCircleOutline,
//   MdFavoriteBorder,
//   MdOutlineMessage,
//   MdOutlinePersonOutline,
//   MdChevronRight,
//   MdChevronLeft,
//   MdNotificationsNone,
// } from "react-icons/md";

// /* ─── Constants ──────────────────────────────────────────────────── */
// const W_STRIP    = 64;   // icon strip width (always in place)
// const W_EXPANDED = 220;  // expanded panel width (overlays content)
// const NAVBAR_H   = 64;   // height of your top <Navbar /> in px

// /* ─── Nav items ──────────────────────────────────────────────────── */
// const NAV_ITEMS = [
//   { id: "overview",     label: "Overview",      path: "/dashboard/overview",     Icon: MdGridView             },
//   { id: "myProperties", label: "My Properties", path: "/dashboard/myProperties", Icon: MdOutlineHome          },
//   { id: "addProperty",  label: "Add Property",  path: "/dashboard/addProperty",  Icon: MdAddCircleOutline     },
//   { id: "favorites",    label: "Saved Posts",   path: "/dashboard/favorites",    Icon: MdFavoriteBorder       },
//   { id: "messages",     label: "Messages",      path: "/dashboard/messages",     Icon: MdOutlineMessage, badge: 2 },
//   { id: "profile",      label: "Profile",       path: "/dashboard/profile",      Icon: MdOutlinePersonOutline },
// ];

// /* ─── Page meta ──────────────────────────────────────────────────── */
// const PAGE_META = {
//   "/dashboard/overview":     { title: "Overview",      sub: "Your activity at a glance"    },
//   "/dashboard/myProperties": { title: "My Properties", sub: "Manage your listings"          },
//   "/dashboard/addProperty":  { title: "Add Property",  sub: "Create a new listing"          },
//   "/dashboard/favorites":    { title: "Saved Posts",   sub: "Properties you've bookmarked"  },
//   "/dashboard/messages":     { title: "Messages",      sub: "Your conversations"             },
//   "/dashboard/profile":      { title: "Profile",       sub: "Manage your account"            },
// };

// /* ─── Helpers ────────────────────────────────────────────────────── */
// const getInitials = (name = "") =>
//   name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "U";

// const todayString = () =>
//   new Date().toLocaleDateString("en-US", {
//     weekday: "long", year: "numeric", month: "long", day: "numeric",
//   });

// /* ─── Nav items list (shared by strip + expanded panel) ─────────── */
// function NavList({ showLabels, onNavigate }) {
//   return (
//     <nav
//       className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide"
//       style={{ padding: showLabels ? "12px 10px" : "12px 8px" }}
//     >
//       {NAV_ITEMS.map(({ id, label, path, Icon, badge }) => (
//         <NavLink
//           key={id}
//           to={path}
//           title={!showLabels ? label : undefined}
//           onClick={onNavigate}
//           style={({ isActive }) => ({
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//             gap: showLabels ? 10 : 0,
//             justifyContent: showLabels ? "flex-start" : "center",
//             padding: showLabels ? "9px 12px" : "10px 0",
//             marginBottom: 2,
//             borderRadius: 10,
//             textDecoration: "none",
//             fontSize: 13.5,
//             fontWeight: isActive ? 600 : 500,
//             color: isActive ? "#7c3aed" : "#64748b",
//             background: isActive
//               ? "linear-gradient(90deg,#f5f3ff 0%,#ede9fe 100%)"
//               : "transparent",
//             transition: "background 0.15s, color 0.15s",
//             overflow: "hidden",
//             whiteSpace: "nowrap",
//           })}
//         >
//           {({ isActive }) => (
//             <>
//               {/* Active left accent bar */}
//               {isActive && (
//                 <span style={{
//                   position: "absolute", left: 0, top: "20%",
//                   height: "60%", width: 3,
//                   borderRadius: "0 3px 3px 0",
//                   background: "#7c3aed",
//                 }} />
//               )}

//               <Icon size={20} style={{ flexShrink: 0, color: isActive ? "#7c3aed" : "#94a3b8" }} />

//               {showLabels && (
//                 <>
//                   <span style={{ flex: 1 }}>{label}</span>
//                   {badge && (
//                     <span style={{
//                       fontSize: 10, fontWeight: 700,
//                       background: "#7c3aed", color: "#fff",
//                       borderRadius: 20, padding: "2px 7px",
//                     }}>
//                       {badge}
//                     </span>
//                   )}
//                 </>
//               )}

//               {/* Collapsed badge dot */}
//               {!showLabels && badge && (
//                 <span style={{
//                   position: "absolute", top: 6, right: 8,
//                   width: 8, height: 8, borderRadius: "50%",
//                   background: "#7c3aed", border: "2px solid #fff",
//                 }} />
//               )}
//             </>
//           )}
//         </NavLink>
//       ))}
//     </nav>
//   );
// }

// /* ─── Inner DashHeader ───────────────────────────────────────────── */
// function DashHeader() {
//   const { currentUser } = useContext(AuthContext);
//   const { pathname }    = useLocation();
//   const navigate        = useNavigate();
//   const meta            = PAGE_META[pathname] ?? { title: "Dashboard", sub: "" };
//   const initials        = getInitials(currentUser?.username);

//   return (
//     <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
//       {/* Page title */}
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
//         <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all">
//           <MdNotificationsNone size={20} />
//           <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
//         </button>

//         {/* User chip */}
//         <button
//           onClick={() => navigate("/dashboard/profile")}
//           className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 rounded-xl pl-1.5 pr-3 py-1.5 transition-all group"
//         >
//           <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
//             {initials}
//           </div>
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
// }

// /* ─── Layout ─────────────────────────────────────────────────────── */
// export default function UserDashboardLayout() {
//   const { currentUser, logout } = useContext(AuthContext);
//   const navigate                = useNavigate();
//   const panelRef                = useRef(null);

//   const [expanded, setExpanded] = useState(false);

//   // Collapse when clicking outside the expanded panel
//   useEffect(() => {
//     if (!expanded) return;
//     const handler = (e) => {
//       if (panelRef.current && !panelRef.current.contains(e.target)) {
//         setExpanded(false);
//       }
//     };
//     // small delay so the open-click itself doesn't immediately trigger close
//     const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
//     return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
//   }, [expanded]);

//   const handleNavigate = () => setExpanded(false);
//   const handleLogout   = () => { logout?.(); navigate("/login"); };

//   if (!currentUser) return <Navigate to="/login" />;

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         body { margin: 0; }
//         .scrollbar-hide::-webkit-scrollbar { display: none; }
//         .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
//         a { text-decoration: none; }

//         @keyframes sidebarIn {
//           from { opacity: 0.7; transform: translateX(-10px); }
//           to   { opacity: 1;   transform: translateX(0); }
//         }
//         .sidebar-slide-in { animation: sidebarIn 0.2s cubic-bezier(.4,0,.2,1); }
//       `}</style>

//       {/* ── Wrapper: everything stacks vertically ── */}
//       <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

//         {/* ── Top Navbar (your existing component) ── */}
//         <Navbar />

//         {/* ── Page body below Navbar ── */}
//         <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>

//           {/*
//             ╔══════════════════════════════════════════╗
//             ║  FIXED ICON STRIP                        ║
//             ║  position: fixed → sticks to viewport    ║
//             ║  top: NAVBAR_H   → sits below Navbar     ║
//             ║  height: calc(100vh - NAVBAR_H)          ║
//             ║  z-index: 40     → above page content    ║
//             ║                                          ║
//             ║  A 64px margin-left spacer div sits in   ║
//             ║  normal flow so content doesn't go under ║
//             ╚══════════════════════════════════════════╝
//           */}
//           <div
//             ref={panelRef}
//             style={{
//               position: "fixed",
//               top: NAVBAR_H,
//               left: 0,
//               width: W_STRIP,
//               height: `calc(100vh - ${NAVBAR_H}px)`,
//               zIndex: 40,
//               display: "flex",
//               flexDirection: "column",
//               background: "#ffffff",
//               borderRight: "1px solid #e8e8f0",
//             }}
//           >
//             {/* Logo icon */}
//             <div style={{
//               height: 64,
//               display: "flex", alignItems: "center", justifyContent: "center",
//               borderBottom: "1px solid #f1f5f9",
//               flexShrink: 0,
//             }}>
//               <div style={{
//                 width: 34, height: 34, borderRadius: 10,
//                 background: "linear-gradient(135deg,#7c3aed,#9333ea)",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
//               }}>
//                 <MdOutlineHome size={17} color="white" />
//               </div>
//             </div>

//             {/* Icon-only nav */}
//             <NavList showLabels={false} onNavigate={handleNavigate} />

//             {/* Expand button */}
//             <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px", flexShrink: 0 }}>
//               <button
//                 onClick={() => setExpanded(true)}
//                 title="Expand sidebar"
//                 style={{
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   width: "100%", padding: "8px 0",
//                   borderRadius: 10, border: "none", cursor: "pointer",
//                   background: "transparent", color: "#94a3b8",
//                   transition: "background 0.15s, color 0.15s",
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.background = "#f8f7ff"; e.currentTarget.style.color = "#7c3aed"; }}
//                 onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
//               >
//                 <MdChevronRight size={20} />
//               </button>
//             </div>

//             {/*
//               ╔══════════════════════════════════════════╗
//               ║  EXPANDED PANEL                          ║
//               ║  Same fixed position, wider (220px)      ║
//               ║  Overlays main content                   ║
//               ║  Rendered on top of the icon strip       ║
//               ╚══════════════════════════════════════════╝
//             */}
//             {expanded && (
//               <div
//                 className="sidebar-slide-in"
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   width: W_EXPANDED,
//                   height: "100%",
//                   zIndex: 50,
//                   display: "flex",
//                   flexDirection: "column",
//                   background: "#ffffff",
//                   borderRight: "1px solid #e8e8f0",
//                   boxShadow: "6px 0 32px rgba(0,0,0,0.12)",
//                 }}
//               >
//                 {/* Logo full */}
//                 <div style={{
//                   height: 64,
//                   display: "flex", alignItems: "center",
//                   padding: "0 20px",
//                   borderBottom: "1px solid #f1f5f9",
//                   flexShrink: 0,
//                 }}>
//                   <Link to="/" onClick={handleNavigate} style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                     <div style={{
//                       width: 34, height: 34, borderRadius: 10,
//                       background: "linear-gradient(135deg,#7c3aed,#9333ea)",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                       boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
//                       flexShrink: 0,
//                     }}>
//                       <MdOutlineHome size={17} color="white" />
//                     </div>
//                     <span style={{
//                       fontWeight: 800, fontSize: 16,
//                       color: "#0f172a", letterSpacing: "-0.3px", whiteSpace: "nowrap",
//                     }}>
//                       Prop<span style={{ color: "#7c3aed" }}>Hive</span>
//                     </span>
//                   </Link>
//                 </div>

//                 {/* Nav with labels */}
//                 <NavList showLabels={true} onNavigate={handleNavigate} />

//                 {/* Collapse button */}
//                 <div style={{ borderTop: "1px solid #f1f5f9", padding: "8px 10px", flexShrink: 0 }}>
//                   <button
//                     onClick={() => setExpanded(false)}
//                     style={{
//                       display: "flex", alignItems: "center", gap: 8,
//                       width: "100%", padding: "8px 12px",
//                       borderRadius: 10, border: "none", cursor: "pointer",
//                       background: "transparent",
//                       color: "#94a3b8", fontSize: 12.5, fontWeight: 500,
//                       fontFamily: "'DM Sans', sans-serif",
//                       transition: "background 0.15s, color 0.15s",
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = "#f8f7ff"; e.currentTarget.style.color = "#7c3aed"; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
//                   >
//                     <MdChevronLeft size={18} />
//                     Collapse
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/*
//             ╔══════════════════════════════════════════╗
//             ║  LAYOUT SPACER                           ║
//             ║  64px wide, sits in normal flow          ║
//             ║  This is what "pushes" the content right ║
//             ║  so it never goes under the fixed strip  ║
//             ╚══════════════════════════════════════════╝
//           */}
//           <div style={{ width: W_STRIP, minWidth: W_STRIP, flexShrink: 0 }} />

//           {/* ── Main content column ── */}
//           <div style={{
//             flex: 1,
//             minWidth: 0,
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//           }}>
//             {/* Inner topbar */}
//             <DashHeader />

//             {/* Scrollable page area */}
//             <main
//               className="scrollbar-hide"
//               style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}
//             >
//               <div style={{ padding: "20px 24px 40px", width: "100%", maxWidth: 1280, margin: "0 auto" }}>
//                 <Outlet />
//               </div>
//             </main>
//           </div>

//         </div>
//       </div>
//     </>
//   );
// }

// layouts/UserDashboardLayout.jsx
// Pure React + Tailwind CSS — no inline styles except dynamic values (widths/positions)
import { useState, useEffect, useRef, useContext } from "react";
import { Navigate, Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Navbar from "../navbar/Navbar";

import {
  MdGridView,
  MdOutlineHome,
  MdAddCircleOutline,
  MdFavoriteBorder,
  MdOutlineMessage,
  MdOutlinePersonOutline,
  MdChevronRight,
  MdChevronLeft,
  MdNotificationsNone,
} from "react-icons/md";

/* ─── Constants ──────────────────────────────────────────────────── */
const W_STRIP    = 64;
const W_EXPANDED = 220;
const NAVBAR_H   = 64;

/* ─── Nav items ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "overview",     label: "Overview",      path: "/dashboard/overview",     Icon: MdGridView,              badge: null },
  { id: "myProperties", label: "My Properties", path: "/dashboard/myProperties", Icon: MdOutlineHome,           badge: null },
  { id: "addProperty",  label: "Add Property",  path: "/dashboard/addProperty",  Icon: MdAddCircleOutline,      badge: null },
  { id: "favorites",    label: "Saved Posts",   path: "/dashboard/favorites",    Icon: MdFavoriteBorder,        badge: null },
  { id: "messages",     label: "Messages",      path: "/dashboard/messages",     Icon: MdOutlineMessage,        badge: 2    },
  { id: "profile",      label: "Profile",       path: "/dashboard/profile",      Icon: MdOutlinePersonOutline,  badge: null },
];

/* ─── Page meta ──────────────────────────────────────────────────── */
const PAGE_META = {
  "/dashboard/overview":     { title: "Overview",      sub: "Your activity at a glance"    },
  "/dashboard/myProperties": { title: "My Properties", sub: "Manage your listings"          },
  "/dashboard/addProperty":  { title: "Add Property",  sub: "Create a new listing"          },
  "/dashboard/favorites":    { title: "Saved Posts",   sub: "Properties you've bookmarked"  },
  "/dashboard/messages":     { title: "Messages",      sub: "Your conversations"             },
  "/dashboard/profile":      { title: "Profile",       sub: "Manage your account"            },
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const getInitials = (name = "") =>
  name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "U";

const todayString = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

/* ─── NavList ────────────────────────────────────────────────────── */
function NavList({ showLabels, onNavigate }) {
  return (
    <nav className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide ${showLabels ? "px-2.5 py-3" : "px-2 py-3"}`}>
      {NAV_ITEMS.map(({ id, label, path, Icon, badge }) => (
        <NavLink
          key={id}
          to={path}
          title={!showLabels ? label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "relative flex items-center mb-0.5 rounded-[10px] no-underline transition-all duration-150 overflow-hidden",
              showLabels ? "gap-2.5 px-3 py-[9px]" : "justify-center py-[10px] px-0",
              isActive
                ? "bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 font-semibold"
                : "text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-full bg-violet-700" />
              )}

              <Icon
                size={20}
                className={`flex-shrink-0 ${isActive ? "text-violet-700" : "text-slate-400"}`}
              />

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

              {/* Collapsed badge dot */}
              {!showLabels && badge && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-violet-700 border-2 border-white" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

/* ─── DashHeader ─────────────────────────────────────────────────── */
function DashHeader() {
  const { currentUser } = useContext(AuthContext);
  const { pathname }    = useLocation();
  const navigate        = useNavigate();
  const meta            = PAGE_META[pathname] ?? { title: "Dashboard", sub: "" };
  const initials        = getInitials(currentUser?.username);

  return (
    <div className="h-16 bg-white border-b border-slate-100 flex items-center px-4 md:px-6 gap-4 flex-shrink-0">

      {/* Title + date */}
      <div className="flex-1 min-w-0">
        <h1 className="text-[15px] font-bold text-slate-800 leading-tight truncate">
          {meta.title}
        </h1>
        <p className="text-[11px] text-slate-400 hidden sm:block leading-tight mt-0.5">
          {todayString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all">
          <MdNotificationsNone size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        {/* User chip */}
        <button
          onClick={() => navigate("/dashboard/profile")}
          className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 rounded-xl pl-1.5 pr-3 py-1.5 transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-[12px] font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">
              {currentUser?.username ?? "User"}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {currentUser?.role ?? "Member"}
            </p>
          </div>
        </button>

      </div>
    </div>
  );
}

/* ─── Layout ─────────────────────────────────────────────────────── */
export default function UserDashboardLayout() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate                = useNavigate();
  const panelRef                = useRef(null);

  const [expanded, setExpanded] = useState(false);

  /* Close on outside click */
  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 10);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [expanded]);

  const handleNavigate = () => setExpanded(false);
  const handleLogout   = () => { logout?.(); navigate("/login"); };

  if (!currentUser) return <Navigate to="/login" />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; font-family: 'DM Sans', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        a { text-decoration: none; }
        @keyframes sidebarIn {
          from { opacity: 0.6; transform: translateX(-10px); }
          to   { opacity: 1;   transform: translateX(0); }
        }
        .sidebar-slide-in { animation: sidebarIn 0.2s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* Root */}
      <div className="flex flex-col min-h-screen bg-slate-50 font-[DM_Sans]">

        {/* Top Navbar */}
        <Navbar />

        {/* Body */}
        <div className="flex flex-1 relative overflow-hidden">

          {/* ── FIXED ICON STRIP ── */}
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
            <NavList showLabels={false} onNavigate={handleNavigate} />

            {/* Expand button */}
            <div className="border-t border-slate-100 p-2 flex-shrink-0">
              <button
                onClick={() => setExpanded(true)}
                title="Expand sidebar"
                className="flex items-center justify-center w-full py-2 rounded-[10px] border-none bg-transparent text-slate-400 cursor-pointer hover:bg-violet-50 hover:text-violet-700 transition-all"
              >
                <MdChevronRight size={20} />
              </button>
            </div>

            {/* ── EXPANDED PANEL (overlays content) ── */}
            {expanded && (
              <div
                className="sidebar-slide-in absolute top-0 left-0 flex flex-col bg-white border-r border-slate-200 shadow-[6px_0_32px_rgba(0,0,0,0.12)]"
                style={{ width: W_EXPANDED, height: "100%", zIndex: 50 }}
              >
                {/* Logo full */}
                <div className="h-16 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
                  <Link
                    to="/"
                    onClick={handleNavigate}
                    className="flex items-center gap-2.5 no-underline"
                  >
                    <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-200">
                      <MdOutlineHome size={17} color="white" />
                    </div>
                    <span className="font-extrabold text-[16px] text-slate-900 tracking-tight whitespace-nowrap">
                      Prop<span className="text-violet-700">Hive</span>
                    </span>
                  </Link>
                </div>

                {/* Nav with labels */}
                <NavList showLabels={true} onNavigate={handleNavigate} />

                {/* Collapse button */}
                <div className="border-t border-slate-100 p-2 flex-shrink-0">
                  <button
                    onClick={() => setExpanded(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-[10px] border-none bg-transparent text-slate-400 text-[12.5px] font-medium cursor-pointer hover:bg-violet-50 hover:text-violet-700 transition-all font-[DM_Sans]"
                  >
                    <MdChevronLeft size={18} />
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── LAYOUT SPACER (keeps content from going under fixed strip) ── */}
          <div className="flex-shrink-0" style={{ width: W_STRIP, minWidth: W_STRIP }} />

          {/* ── MAIN CONTENT ── */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

            {/* Inner topbar */}
            <DashHeader />

            {/* Page scroll area */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
              <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-5">
                <Outlet />
              </div>
            </main>

          </div>
        </div>
      </div>
    </>
  );
}