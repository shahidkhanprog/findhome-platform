// export default DashSidebar;
// components/dashboard/DashSidebar.jsx
import { useContext } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  MdGridView,
  MdOutlineHome,
  MdAddCircleOutline,
  MdFavoriteBorder,
  MdOutlineMessage,
  MdOutlinePersonOutline,
  MdInbox,
} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";

/* ─── Constants ──────────────────────────────────────────────── */
const W_STRIP  = 64;
const NAVBAR_H = 64;

/* ─── Nav item definitions ───────────────────────────────────── */
const NAV_ITEMS = [
  {
    id:    "overview",
    label: "Overview",
    path:  "/dashboard/overview",
    Icon:  MdGridView,
  },
  {
    id:    "myProperties",
    label: "Properties",
    path:  "/dashboard/myProperties",
    Icon:  MdOutlineHome,
  },
  {
    id:    "addProperty",
    label: "Add Property",
    path:  "/dashboard/addProperty",
    Icon:  MdAddCircleOutline,
  },
  {
    id:    "favorites",
    label: "Saved Posts",
    path:  "/dashboard/favorites",
    Icon:  MdFavoriteBorder,
  },
  {
    id:       "messages",
    label:    "Messages",
    path:     "/dashboard/messages",
    Icon:     MdOutlineMessage,
    badgeKey: "messages",
  },
  {
    id:        "users",
    label:     "All Users",
    path:      "/dashboard/users",
    Icon:      MdOutlinePersonOutline,
    adminOnly: true,
  },
  {
    id:        "queries",
    label:     "Queries Messages ",
    path:      "/dashboard/queries",
    Icon:      MdInbox,
    badgeKey:  "queries",
    adminOnly: true,
  },
];

/* ─── DashSidebar ────────────────────────────────────────────── */
/**
 * Props
 * ─────
 * badges — { messages?: number, queries?: number }
 */
export default function DashSidebar({ badges = {} }) {
  const { pathname }    = useLocation();
  const { currentUser } = useContext(AuthContext);
  const role            = currentUser?.userData?.role ?? "";

  const isPropertyDetail = pathname.startsWith("/dashboard/property/");

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || role === "ADMIN"
  );

  return (
    <div
      className="fixed flex flex-col bg-white border-r border-slate-100"
      style={{
        top:    NAVBAR_H,
        left:   0,
        width:  W_STRIP,
        height: `calc(100vh - ${NAVBAR_H}px)`,
        zIndex: 40,
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-100 flex-shrink-0">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-md shadow-violet-200">
          <MdOutlineHome size={17} color="white" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-2 py-3">
        {visibleItems.map(({ id, label, path, Icon, badgeKey }) => {
          const count       = badgeKey ? (badges[badgeKey] ?? 0) : 0;
          const forceActive = id === "myProperties" && isPropertyDetail;

          return (
            <NavLink
              key={id}
              to={path}
              title={label}
              className={({ isActive }) => {
                const active = isActive || forceActive;
                return [
                  "relative flex items-center justify-center py-[10px] mb-0.5 rounded-[10px] transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-violet-50 to-purple-50"
                    : "hover:bg-slate-50",
                ].join(" ");
              }}
            >
              {({ isActive }) => {
                const active = isActive || forceActive;
                return (
                  <>
                    {/* Active left accent line */}
                    {active && (
                      <span className="absolute left-0 top-[20%] h-[60%] w-[3px] rounded-r-full bg-violet-700" />
                    )}

                    {/* Icon with badge */}
                    <span className="relative">
                      <Icon
                        size={20}
                        className={active ? "text-violet-700" : "text-slate-400"}
                      />
                      {count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-[3px] border-2 border-white leading-none">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                    </span>
                  </>
                );
              }}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}