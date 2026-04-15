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
const W_STRIP = 64;
const W_EXPANDED = 220;
const NAVBAR_H = 64;

/* ─── Nav items ──────────────────────────────────────────────────── */
const NAV_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    path: "/dashboard/overview",
    Icon: MdGridView,
    badge: null,
  },
  {
    id: "myProperties",
    label: "Properties",
    path: "/dashboard/myProperties",
    Icon: MdOutlineHome,
    badge: null,
  },
  {
    id: "addProperty",
    label: "Add Property",
    path: "/dashboard/addProperty",
    Icon: MdAddCircleOutline,
    badge: null,
  },
  {
    id: "favorites",
    label: "Saved Posts",
    path: "/dashboard/favorites",
    Icon: MdFavoriteBorder,
    badge: null,
  },
  {
    id: "messages",
    label: "Messages",
    path: "/dashboard/messages",
    Icon: MdOutlineMessage,
    badge: 12,
  },
  {
    id: "users",
    label: "All Users",
    path: "/dashboard/users",
    Icon: MdOutlinePersonOutline,
    badge: null,
  },
];

/* ─── NavList ────────────────────────────────────────────────────── */
function NavList({ showLabels, onNavigate }) {
  const { pathname } = useLocation();

  // Keep "My Properties" highlighted when on a single property detail page
  const isPropertyDetail = pathname.startsWith("/dashboard/property/");

  return (
    <nav
      className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide ${showLabels ? "px-2.5 py-3" : "px-2 py-3"}`}
    >
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
                showLabels
                  ? "gap-2.5 px-3 py-[9px]"
                  : "justify-center py-[10px] px-0",
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
                  <Icon
                    size={20}
                    className={`flex-shrink-0 ${active ? "text-violet-700" : "text-slate-400"}`}
                  />
                  {showLabels && (
                    <>
                      <span className="flex-1 text-[13.5px] whitespace-nowrap">
                        {label}
                      </span>
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
            <Link
              to="/dashboard/overview"
              onClick={onNavigate}
              className="flex items-center gap-2.5 no-underline"
            >
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
