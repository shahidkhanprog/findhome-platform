// // import { Avatar, Badge } from "./ui";
// // import { formatPrice } from "../utils";

// // export default function Overview({ posts, user }) {
// //   const stats = [
// //     { label:"Total Listings", value:posts.length,                                     color:"text-indigo-600"  },
// //     { label:"Available",      value:posts.filter(p=>p.status==="available").length,   color:"text-emerald-600" },
// //     { label:"Sold",           value:posts.filter(p=>p.status==="sold").length,        color:"text-slate-600"   },
// //     { label:"Rented",         value:posts.filter(p=>p.status==="rented").length,      color:"text-amber-600"   },
// //   ];

// //   return (
// //     <div className="space-y-5">
// //       {/* Welcome card */}
// //       <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5">
// //         <Avatar src={user.avatar} name={user.username} size={56} />
// //         <div className="min-w-0">
// //           <p className="font-semibold text-slate-800 text-lg truncate">
// //             Welcome back, {user.username} 👋
// //           </p>
// //           <p className="text-sm text-slate-400 capitalize">{user.role} · {user.email}</p>
// //         </div>
// //       </div>

// //       {/* Stats */}
// //       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
// //         {stats.map(({ label, value, color }) => (
// //           <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4">
// //             <p className="text-xs text-slate-500 mb-1">{label}</p>
// //             <p className={`text-2xl font-bold ${color}`}>{value}</p>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Recent listings */}
// //       <div className="bg-white border border-slate-200 rounded-2xl p-5">
// //         <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Listings</h3>
// //         <div>
// //           {posts.slice(0, 4).map(p => (
// //             <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-3">
// //               <div className="flex items-center gap-3 min-w-0 flex-1">
// //                 <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
// //                   ⌂
// //                 </div>
// //                 <div className="min-w-0">
// //                   <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
// //                   <p className="text-xs text-slate-400">{p.city} · {formatPrice(p.price)}</p>
// //                 </div>
// //               </div>
// //               <div className="shrink-0"><Badge status={p.status} /></div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// // pages/dashboard/Overview.jsx
// // Pure React + Tailwind CSS — mobile-first, fully responsive
// import { useContext } from "react";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext"; // adjust path

// // React Icons
// import {
//   MdOutlineHome,
//   MdCheckCircleOutline,
//   MdHighlightOff,
//   MdOutlineAccessTime,
//   MdAddHome,
// } from "react-icons/md";

// /* ─── Dummy user — swap with real AuthContext when ready ─────────── */
// // To test with photo: set avatar to any image URL string
// // To test initials:   set avatar to null or ""
// const DUMMY_USER = {
//   id:       "usr_01",
//   username: "Shahid Khan",
//   email:    "shahid@example.com",
//   role:     "agent",
//   avatar:   null,            // e.g. "https://i.pravatar.cc/150?img=3"
//   createdAt: "2024-03-01",
// };

// /* ─── Dummy posts — swap with real context/API when ready ─────────── */
// const DUMMY_POSTS = [
//   { id: "1", title: "Modern 3BR Apartment in Blue Area", city: "Islamabad", price: 25000000, status: "available" },
//   { id: "2", title: "5 Marla House in DHA Phase 2",      city: "Lahore",    price: 45000000, status: "sold"      },
//   { id: "3", title: "Commercial Shop in Saddar",          city: "Peshawar",  price: 8500000,  status: "rented"   },
//   { id: "4", title: "10 Marla Corner Plot",               city: "Karachi",   price: 32000000, status: "available"},
//   { id: "5", title: "Studio Apartment near LUMS",         city: "Lahore",    price: 9500000,  status: "available"},
// ];

// /* ─── Helpers ────────────────────────────────────────────────────── */
// function formatPrice(n) {
//   if (!n && n !== 0) return "—";
//   if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
//   if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
//   return `PKR ${Number(n).toLocaleString()}`;
// }

// /* ─── Status config ──────────────────────────────────────────────── */
// const STATUS = {
//   available: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", label: "Available" },
//   sold:      { dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-50",   label: "Sold"      },
//   rented:    { dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   label: "Rented"    },
// };

// /* ─── StatusBadge ────────────────────────────────────────────────── */
// function StatusBadge({ status }) {
//   const s = STATUS[status] ?? STATUS.available;
//   return (
//     <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
//       {s.label}
//     </span>
//   );
// }

// /* ─── Smart Avatar ───────────────────────────────────────────────────
//    • If `src` is a valid URL  → shows the profile photo
//    • If no `src`              → shows first letter of `name` (not "U")
//    ─────────────────────────────────────────────────────────────────── */
// function Avatar({ src, name = "", className = "w-12 h-12", textClass = "text-lg" }) {
//   // Use first letter of first word of name, fallback to "?"
//   const letter = name.trim().charAt(0).toUpperCase() || "?";

//   if (src) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100`}
//         onError={(e) => { e.currentTarget.style.display = "none"; }} // graceful fallback
//       />
//     );
//   }

//   return (
//     <div className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none`}>
//       {letter}
//     </div>
//   );
// }

// /* ─── StatCard ───────────────────────────────────────────────────── */
// const STAT_STYLES = {
//   violet:  { value: "text-violet-600",  iconBg: "bg-violet-100",  iconText: "text-violet-500"  },
//   emerald: { value: "text-emerald-600", iconBg: "bg-emerald-100", iconText: "text-emerald-500" },
//   slate:   { value: "text-slate-600",   iconBg: "bg-slate-100",   iconText: "text-slate-500"   },
//   amber:   { value: "text-amber-500",   iconBg: "bg-amber-100",   iconText: "text-amber-500"   },
// };

// function StatCard({ label, value, colorKey, Icon }) {
//   const s = STAT_STYLES[colorKey];
//   return (
//     <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:shadow-slate-100 transition-shadow">
//       <div className="flex items-center justify-between">
//         <span className="text-xs text-slate-400 font-medium">{label}</span>
//         <span className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${s.iconBg} ${s.iconText}`}>
//           <Icon size={18} />
//         </span>
//       </div>
//       <span className={`text-3xl font-extrabold leading-none ${s.value}`}>{value}</span>
//     </div>
//   );
// }

// /* ─── Overview ───────────────────────────────────────────────────── */
// export default function Overview() {
//   // When real data is ready, replace DUMMY_USER / DUMMY_POSTS:
//   // const { currentUser } = useContext(AuthContext);
//   // const { posts } = useContext(PostContext);
//   const currentUser = DUMMY_USER;
//   const posts       = DUMMY_POSTS;

//   const stats = [
//     { label: "Total Listings", value: posts.length,                                      colorKey: "violet",  Icon: MdOutlineHome         },
//     { label: "Available",      value: posts.filter(p => p.status === "available").length, colorKey: "emerald", Icon: MdCheckCircleOutline   },
//     { label: "Sold",           value: posts.filter(p => p.status === "sold").length,      colorKey: "slate",   Icon: MdHighlightOff         },
//     { label: "Rented",         value: posts.filter(p => p.status === "rented").length,    colorKey: "amber",   Icon: MdOutlineAccessTime    },
//   ];

//   return (
//     <div className="flex flex-col gap-4 md:gap-5">

//       {/* ── Welcome card ─────────────────────────────────────── */}
//       <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">

//         {/* Avatar + info */}
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           {/* Smart avatar: shows photo if available, else first letter of name */}
//           <Avatar
//             src={currentUser?.avatar}
//             name={currentUser?.username}
//             className="w-12 h-12 md:w-14 md:h-14"
//             textClass="text-lg md:text-xl"
//           />

//           <div className="min-w-0">
//             <p className="text-base md:text-[17px] font-bold text-slate-800 truncate">
//               Welcome back, {currentUser?.username ?? "User"} 👋
//             </p>
//             <p className="text-xs md:text-[13px] text-slate-400 capitalize mt-0.5 truncate">
//               {currentUser?.role ?? "Member"}
//               {currentUser?.email ? ` · ${currentUser.email}` : ""}
//             </p>
//           </div>
//         </div>

//         {/* Add property CTA */}
//         <Link
//           to="/dashboard/addProperty"
//           className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap flex-shrink-0 transition-all shadow-md shadow-violet-200 w-full sm:w-auto"
//         >
//           <MdAddHome size={17} />
//           Add Property
//         </Link>
//       </div>

//       {/* ── Stats grid: 2 cols mobile → 4 cols desktop ───────── */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//         {stats.map(s => <StatCard key={s.label} {...s} />)}
//       </div>

//       {/* ── Recent listings ──────────────────────────────────── */}
//       <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-slate-100">
//           <h3 className="text-[13px] md:text-sm font-bold text-slate-800">Recent Listings</h3>
//           <Link
//             to="/dashboard/myProperties"
//             className="text-[12px] text-violet-600 font-semibold no-underline hover:text-violet-800 transition-colors"
//           >
//             View all →
//           </Link>
//         </div>

//         {/* Rows */}
//         <div>
//           {posts.slice(0, 5).map((p, i) => (
//             <div
//               key={p.id}
//               className={`flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-slate-50 transition-colors
//                 ${i < Math.min(posts.length, 5) - 1 ? "border-b border-slate-50" : ""}`}
//             >
//               {/* Property icon */}
//               <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex-shrink-0 bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600">
//                 <MdOutlineHome size={18} />
//               </div>

//               {/* Title + city */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
//                   {p.title}
//                 </p>
//                 <p className="text-[11px] text-slate-400 mt-0.5 truncate">
//                   {p.city} · {formatPrice(p.price)}
//                 </p>
//               </div>

//               {/* Status badge */}
//               <div className="flex-shrink-0">
//                 <StatusBadge status={p.status} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Mobile-only footer link */}
//         <div className="sm:hidden px-4 py-3 border-t border-slate-50">
//           <Link
//             to="/dashboard/myProperties"
//             className="block text-center text-[12px] text-violet-600 font-semibold no-underline py-1"
//           >
//             View all properties →
//           </Link>
//         </div>
//       </div>

//     </div>
//   );
// }

// pages/dashboard/Overview.jsx
// Dynamic — fetches real posts from API (mirrors MyProperties fetch pattern)
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

import {
  MdOutlineHome,
  MdCheckCircleOutline,
  MdHighlightOff,
  MdOutlineAccessTime,
  MdAddHome,
  MdLocationOn,
  MdOpenInNew,
} from "react-icons/md";

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

/* ─── Status config (mirrors MyProperties) ───────────────────────── */
const STATUS_CONFIG = {
  available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
  sold:      { label: "Sold",      dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-50"   },
  rented:    { label: "Rented",    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50"   },
  pending:   { label: "Pending",   dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50"    },
};

/* ─── StatusBadge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─── Smart Avatar (mirrors Profile pattern) ─────────────────────── */
function Avatar({ src, name = "", className = "w-12 h-12", textClass = "text-lg" }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100`}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }

  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none`}>
      {letter}
    </div>
  );
}

/* ─── StatCard ───────────────────────────────────────────────────── */
const STAT_STYLES = {
  violet:  { value: "text-violet-600",  iconBg: "bg-violet-100",  iconText: "text-violet-500"  },
  emerald: { value: "text-emerald-600", iconBg: "bg-emerald-100", iconText: "text-emerald-500" },
  slate:   { value: "text-slate-600",   iconBg: "bg-slate-100",   iconText: "text-slate-500"   },
  amber:   { value: "text-amber-500",   iconBg: "bg-amber-100",   iconText: "text-amber-500"   },
};

function StatCard({ label, value, colorKey, Icon, loading }) {
  const s = STAT_STYLES[colorKey];
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md hover:shadow-slate-100 transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${s.iconBg} ${s.iconText}`}>
          <Icon size={18} />
        </span>
      </div>
      {loading ? (
        <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <span className={`text-3xl font-extrabold leading-none ${s.value}`}>{value}</span>
      )}
    </div>
  );
}

/* ─── Skeleton row ───────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-slate-50 animate-pulse">
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="w-16 h-5 bg-slate-100 rounded-full" />
    </div>
  );
}

/* ─── Overview ───────────────────────────────────────────────────── */
export default function Overview() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // currentUser shape mirrors Profile.jsx: currentUser?.userData
  const user   = currentUser?.userData ?? {};
  const userId = user?.id;

  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  /* ── Fetch posts (same pattern as MyProperties) ─────────────────── */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest.get(`/posts/user/${userId}`);
        setPosts(res.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  /* ── Derived stats ───────────────────────────────────────────────── */
  const stats = [
    { label: "Total Listings", value: posts.length,                                       colorKey: "violet",  Icon: MdOutlineHome       },
    { label: "Available",      value: posts.filter(p => p.status === "available").length,  colorKey: "emerald", Icon: MdCheckCircleOutline },
    { label: "Sold",           value: posts.filter(p => p.status === "sold").length,       colorKey: "slate",   Icon: MdHighlightOff       },
    { label: "Rented",         value: posts.filter(p => p.status === "rented").length,     colorKey: "amber",   Icon: MdOutlineAccessTime  },
  ];

  // Last 4 listings, newest first (API order assumed newest-first; slice(0,4) is safe either way)
  const recentPosts = posts.slice(0, 4);

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-4 md:gap-5">

      {/* ── Welcome card ─────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Avatar + info — reads from real currentUser (Profile pattern) */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar
            src={user?.avatar}
            name={user?.username}
            className="w-12 h-12 md:w-14 md:h-14"
            textClass="text-lg md:text-xl"
          />
          <div className="min-w-0">
            <p className="text-base md:text-[17px] font-bold text-slate-800 truncate">
              Welcome back, {user?.username ?? "User"} 👋
            </p>
            <p className="text-xs md:text-[13px] text-slate-400 capitalize mt-0.5 truncate">
              {user?.role ?? "Member"}
              {user?.email ? ` · ${user.email}` : ""}
            </p>
          </div>
        </div>

        {/* Add property CTA */}
        <Link
          to="/dashboard/addProperty"
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap flex-shrink-0 transition-all shadow-md shadow-violet-200 w-full sm:w-auto"
        >
          <MdAddHome size={17} />
          Add Property
        </Link>
      </div>

      {/* ── Stats grid: 2 cols mobile → 4 cols desktop ───────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} loading={loading} />)}
      </div>

      {/* ── Recent listings ──────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-5 py-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-[13px] md:text-sm font-bold text-slate-800">Recent Listings</h3>
            {!loading && (
              <p className="text-[11px] text-slate-400 mt-0.5">Last {recentPosts.length} properties</p>
            )}
          </div>
          <Link
            to="/dashboard/myProperties"
            className="text-[12px] text-violet-600 font-semibold no-underline hover:text-violet-800 transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div className="px-4 md:px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div>
            {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && recentPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
              <MdOutlineHome size={24} className="text-violet-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-500">No listings yet</p>
              <p className="text-xs text-slate-400 mt-1">Add your first property to get started</p>
            </div>
            <Link
              to="/dashboard/addProperty"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2 text-[12px] font-semibold shadow-md shadow-violet-200 transition-all"
            >
              <MdAddHome size={15} />
              Add Property
            </Link>
          </div>
        )}

        {/* Rows — last 4 only */}
        {!loading && !error && recentPosts.length > 0 && (
          <div>
            {recentPosts.map((p, i) => {
              // Normalise field names (same as MyProperties PropertyCard)
              const type = p.property ?? p.type ?? "property";

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer
                    ${i < recentPosts.length - 1 ? "border-b border-slate-50" : ""}`}
                  onClick={() => navigate(`/dashboard/property/${p.id}`)}
                >
                  {/* Thumbnail or icon */}
                  <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex-shrink-0 overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement.classList.add(
                            "bg-gradient-to-br", "from-violet-100", "to-purple-100",
                            "flex", "items-center", "justify-center", "text-violet-600"
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-600">
                        <MdOutlineHome size={18} />
                      </div>
                    )}
                  </div>

                  {/* Title + meta */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                      {p.title}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                      <MdLocationOn size={11} className="text-violet-400 flex-shrink-0" />
                      {p.city}
                      <span className="mx-0.5">·</span>
                      <span className="capitalize text-slate-400">{type}</span>
                      <span className="mx-0.5">·</span>
                      {formatPrice(p.price)}
                    </p>
                  </div>

                  {/* Status badge + arrow */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={p.status} />
                    <MdOpenInNew size={13} className="text-slate-300 hidden sm:block" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile-only footer link */}
        {!loading && recentPosts.length > 0 && (
          <div className="sm:hidden px-4 py-3 border-t border-slate-50">
            <Link
              to="/dashboard/myProperties"
              className="block text-center text-[12px] text-violet-600 font-semibold no-underline py-1"
            >
              View all properties →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}