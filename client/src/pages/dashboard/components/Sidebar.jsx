/* ─────────────────────────────────────────────────────────────
   Sidebar Component (React + Tailwind + React Icons)
───────────────────────────────────────────────────────────── */

import {
  FiGrid,
  FiHome,
  FiPlusCircle,
  FiHeart,
  FiMail,
  FiUser,
  FiChevronLeft,
} from "react-icons/fi";

/* Navigation Items */

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: <FiGrid /> },
  { id: "properties", label: "My Properties", icon: <FiHome /> },
  { id: "add", label: "Add Property", icon: <FiPlusCircle /> },
  { id: "saved", label: "Saved Posts", icon: <FiHeart /> },
  { id: "messages", label: "Messages", icon: <FiMail />, badge: 2 },
  { id: "profile", label: "Profile", icon: <FiUser /> },
];

/* Chevron Icon */

function ChevronIcon({ open }) {
  return (
    <FiChevronLeft
      className={`w-4 h-4 transition-transform duration-300 ${
        open ? "rotate-0" : "rotate-180"
      }`}
    />
  );
}

/* Sidebar Component */

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeNav,
  setActiveNav,
  setEditingPost,
}) {
  return (
    <aside
      className={`
        ${sidebarOpen ? "w-60" : "w-16"}
        transition-[width] duration-300 ease-[cubic-bezier(.4,0,.2,1)]
        bg-white border-r border-slate-200
        flex flex-col shrink-0 overflow-hidden
      `}
    >
      {/* Logo */}

      <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          P
        </div>

        {sidebarOpen && (
          <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">
            PropHive
          </span>
        )}
      </div>

      {/* Navigation */}

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon, badge }) => (
          <button
            key={id}
            onClick={() => {
              setActiveNav(id);
              setEditingPost(null);
            }}
            title={!sidebarOpen ? label : undefined}
            className={`
              relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
              ${
                activeNav === id
                  ? "bg-indigo-50 text-indigo-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            {/* Icon */}

            <span className="text-lg w-5 flex justify-center shrink-0">
              {icon}
            </span>

            {/* Label */}

            {sidebarOpen ? (
              <>
                <span className="whitespace-nowrap">{label}</span>

                {badge && (
                  <span className="ml-auto bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                    {badge}
                  </span>
                )}
              </>
            ) : (
              badge && (
                <span className="absolute top-1.5 left-7 bg-indigo-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}

      <div className="shrink-0 border-t border-slate-100 p-3">
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
        >
          <ChevronIcon open={sidebarOpen} />

          {sidebarOpen && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}


//-----------------------------
/* ─────────────────────────────────────────────────────────────
   App Router (React Router v6 + React)
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   Sidebar Component (React + Tailwind + React Icons)
───────────────────────────────────────────────────────────── */

// import {
//   FiGrid,
//   FiHome,
//   FiPlusCircle,
//   FiHeart,
//   FiMail,
//   FiUser,
//   FiChevronLeft,
// } from "react-icons/fi";
// import { NavLink } from "react-router-dom";

// /* Navigation Items */

// const NAV_ITEMS = [
//   { id: "overview", url: "/dashboard/overview", label: "Overview", icon: <FiGrid /> },
//   { id: "properties", url: "/dashboard/myProperties", label: "My Properties", icon: <FiHome /> },
//   { id: "add", url: "/dashboard/addProperty", label: "Add Property", icon: <FiPlusCircle /> },
//   { id: "saved", url: "/dashboard/favorites", label: "Saved Posts", icon: <FiHeart /> },
//   { id: "messages", url: "/dashboard/messages", label: "Messages", icon: <FiMail />, badge: 2 },
//   { id: "profile", url: "/dashboard/profile", label: "Profile", icon: <FiUser /> },
// ];

// /* Chevron Icon */

// function ChevronIcon({ open }) {
//   return (
//     <FiChevronLeft
//       className={`w-4 h-4 transition-transform duration-300 ${
//         open ? "rotate-0" : "rotate-180"
//       }`}
//     />
//   );
// }

// /* Sidebar Component */

// export default function Sidebar({
//   sidebarOpen,
//   setSidebarOpen,
//   activeNav,
//   setActiveNav,
//   setEditingPost,
// }) {
//   return (
//     <aside
//       className={`
//         ${sidebarOpen ? "w-60" : "w-16"}
//         transition-[width] duration-300 ease-[cubic-bezier(.4,0,.2,1)]
//         bg-white border-r border-slate-200
//         flex flex-col shrink-0 overflow-hidden
//       `}
//     >
//       {/* Logo */}

//       <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 shrink-0">
//         <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
//           P
//         </div>

//         {sidebarOpen && (
//           <span className="font-semibold text-slate-800 text-sm whitespace-nowrap">
//             PropHive
//           </span>
//         )}
//       </div>

//       {/* Navigation */}

//      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
//   {NAV_ITEMS.map(({ id, url, label, icon, badge }) => (
//     <NavLink
//       key={id}
//       to={url} // URL of the page to navigate
//       title={!sidebarOpen ? label : undefined}
//       className={({ isActive }) =>
//         `relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
//         ${isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`
//       }
//       onClick={() => setEditingPost(null)} // optional if needed
//     >
//       {/* Icon */}
//       <span className="text-lg w-5 flex justify-center shrink-0">
//         {icon}
//       </span>

//       {/* Label */}
//       {sidebarOpen ? (
//         <>
//           <span className="whitespace-nowrap">{label}</span>

//           {badge && (
//             <span className="ml-auto bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center shrink-0">
//               {badge}
//             </span>
//           )}
//         </>
//       ) : (
//         badge && (
//           <span className="absolute top-1.5 left-7 bg-indigo-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
//             {badge}
//           </span>
//         )
//       )}
//     </NavLink>
//   ))}
// </nav>

//       {/* Collapse Button */}

//       <div className="shrink-0 border-t border-slate-100 p-3">
//         <button
//           onClick={() => setSidebarOpen((v) => !v)}
//           title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
//           className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
//         >
//           <ChevronIcon open={sidebarOpen} />

//           {sidebarOpen && <span className="whitespace-nowrap">Collapse</span>}
//         </button>
//       </div>
//     </aside>
//   );
// }
