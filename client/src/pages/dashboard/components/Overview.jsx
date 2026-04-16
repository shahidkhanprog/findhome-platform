// // pages/dashboard/Overview.jsx
// import { useState, useEffect, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../../context/AuthContext";
// import apiRequest from "../../../lib/apiRequest";

// import {
//   MdOutlineHome,
//   MdCheckCircleOutline,
//   MdHighlightOff,
//   MdOutlineAccessTime,
//   MdAddHome,
//   MdLocationOn,
//   MdOpenInNew,
//   MdAdminPanelSettings,
//   MdPerson,
//   MdFilterList,
//   MdDomain,
//   MdEmail,
//   MdVerified,
// } from "react-icons/md";

// /* ─── Helpers ────────────────────────────────────────────────────── */
// function formatPrice(n) {
//   if (!n && n !== 0) return "—";
//   if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
//   if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
//   return `PKR ${Number(n).toLocaleString()}`;
// }

// /* ─── Status config ───────────────────────────────────────────────── */
// const STATUS_CONFIG = {
//   available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-100" },
//   sold:      { label: "Sold",      dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-50",    border: "border-slate-100"   },
//   rented:    { label: "Rented",    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-100"   },
//   pending:   { label: "Pending",   dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-100"    },
// };

// /* ─── StatusBadge ────────────────────────────────────────────────── */
// function StatusBadge({ status }) {
//   const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
//   return (
//     <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}>
//       <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
//       {s.label}
//     </span>
//   );
// }

// /* ─── Avatar ─────────────────────────────────────────────────────── */
// function Avatar({ src, name = "", className = "w-12 h-12", textClass = "text-lg" }) {
//   const [imgError, setImgError] = useState(false);
//   const letter = name.trim().charAt(0).toUpperCase() || "?";

//   if (src && !imgError) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100 shadow-sm`}
//         onError={() => setImgError(true)}
//       />
//     );
//   }

//   return (
//     <div className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none shadow-sm`}>
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

// function StatCard({ label, value, colorKey, Icon, loading, isAdminView }) {
//   const s = STAT_STYLES[colorKey];
//   return (
//     <div className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-all duration-200
//       ${isAdminView
//         ? "border-violet-100 shadow-sm shadow-violet-50/80 hover:shadow-violet-100"
//         : "border-slate-100 hover:shadow-slate-100"}`}>
//       <div className="flex items-center justify-between">
//         <span className="text-xs text-slate-400 font-medium leading-tight">{label}</span>
//         <span className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${s.iconBg} ${s.iconText}`}>
//           <Icon size={18} />
//         </span>
//       </div>
//       {loading ? (
//         <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse" />
//       ) : (
//         <span className={`text-3xl font-extrabold leading-none ${s.value}`}>{value}</span>
//       )}
//     </div>
//   );
// }

// /* ─── Skeleton row ───────────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-slate-50 animate-pulse">
//       <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
//       <div className="flex-1 flex flex-col gap-1.5">
//         <div className="h-3 bg-slate-100 rounded w-2/3" />
//         <div className="h-2.5 bg-slate-100 rounded w-1/3" />
//       </div>
//       <div className="flex gap-2">
//         <div className="w-20 h-5 bg-slate-100 rounded-full" />
//         <div className="w-16 h-5 bg-slate-100 rounded-full" />
//       </div>
//     </div>
//   );
// }

// /* ─── UserChip — clickable, navigates to user's profile page ─────── */
// function UserChip({ username, onClick }) {
//   return (
//     <button
//       type="button"
//       onClick={(e) => {
//         e.stopPropagation();
//         onClick?.();
//       }}
//       className="inline-flex items-center gap-1.5 bg-white border border-violet-200 text-violet-700 text-[10px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap hover:bg-violet-50 hover:border-violet-400 hover:shadow-sm active:scale-95 transition-all cursor-pointer"
//       title={`View ${username}'s profile`}
//     >
//       <MdPerson size={11} />
//       {username}
//     </button>
//   );
// }

// /* ─── Admin hint banner inside the listings panel ────────────────── */
// function AdminHintBanner() {
//   return (
//     <div className="flex items-center gap-2 px-4 md:px-5 py-2 bg-gradient-to-r from-violet-50 to-purple-50/60 border-b border-violet-100/80">
//       <MdAdminPanelSettings size={13} className="text-violet-400 flex-shrink-0" />
//       <span className="text-[11px] font-semibold text-violet-500 tracking-wide uppercase">
//         Admin view — click a username chip to open that user's profile
//       </span>
//     </div>
//   );
// }

// /* ════════════════════════════════════════════════════════════════════
//    OVERVIEW
// ════════════════════════════════════════════════════════════════════ */
// export default function Overview() {
//   const navigate = useNavigate();
//   const { currentUser } = useContext(AuthContext);

//   const user    = currentUser?.userData ?? {};
//   const userId  = user?.id;
//   const isAdmin = user?.role === "ADMIN";

//   // Admin toggle: true = platform-wide (default), false = own data only
//   const [adminViewAll, setAdminViewAll] = useState(true);

//   const [posts, setPosts]   = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]   = useState("");

//   /* ── Fetch ────────────────────────────────────────────────────────
//      ADMIN + adminViewAll  → GET /posts          (all, includes user relation)
//      ADMIN + !adminViewAll → GET /posts/user/:id
//      USER                  → GET /posts/user/:id
//   ─────────────────────────────────────────────────────────────────── */
//   useEffect(() => {
//     if (!userId) { setLoading(false); return; }

//     const fetchPosts = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const endpoint =
//           isAdmin && adminViewAll ? "/posts" : `/posts/user/${userId}`;
//         const res = await apiRequest.get(endpoint);
//         setPosts(res.data);
//       } catch (err) {
//         console.error("Error fetching posts:", err);
//         setError(err.response?.data?.message || "Failed to load listings.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, [userId, isAdmin, adminViewAll]);

//   const showingAll  = isAdmin && adminViewAll;
//   const recentPosts = posts.slice(0, 4);

//   const stats = [
//     { label: showingAll ? "Total Properties" : "Total Listings", value: posts.length,                                      colorKey: "violet",  Icon: MdOutlineHome       },
//     { label: "Available",                                          value: posts.filter(p => p.status === "available").length, colorKey: "emerald", Icon: MdCheckCircleOutline },
//     { label: "Sold",                                               value: posts.filter(p => p.status === "sold").length,      colorKey: "slate",   Icon: MdHighlightOff       },
//     { label: "Rented",                                             value: posts.filter(p => p.status === "rented").length,    colorKey: "amber",   Icon: MdOutlineAccessTime  },
//   ];

//   /* ─────────────────────────────────────────────────────────────── */
//   return (
//     <div className="flex flex-col gap-4 md:gap-5">

//       {/* ════════════════════════════════════════════════════════════
//           WELCOME / PROFILE CARD
//       ════════════════════════════════════════════════════════════ */}
//       <div className={`bg-white rounded-2xl overflow-hidden transition-all
//         ${isAdmin
//           ? "border border-violet-100 shadow-md shadow-violet-50"
//           : "border border-slate-100 shadow-sm"}`}>

//         {/* Admin accent stripe */}
//         {isAdmin && (
//           <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
//         )}

//         <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">

//           {/* ── Avatar + profile info ──────────────────────────── */}
//           <div className="flex items-center gap-4 flex-1 min-w-0">
//             {/* Avatar with admin badge */}
//             <div className="relative flex-shrink-0">
//               <Avatar
//                 src={user?.avatar}
//                 name={user?.username}
//                 className="w-14 h-14 md:w-16 md:h-16"
//                 textClass="text-xl md:text-2xl"
//               />
//               {isAdmin && (
//                 <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow ring-2 ring-white">
//                   <MdVerified size={12} className="text-white" />
//                 </span>
//               )}
//             </div>

//             {/* Name, role, email, listing count */}
//             <div className="min-w-0 flex-1">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <p className="text-base md:text-lg font-bold text-slate-800 truncate">
//                   {user?.username ?? "User"}
//                 </p>
//                 {/* Role pill */}
//                 <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
//                   ${isAdmin
//                     ? "bg-violet-100 text-violet-700 border-violet-200"
//                     : "bg-slate-100 text-slate-500 border-slate-200"}`}>
//                   {isAdmin
//                     ? <><MdAdminPanelSettings size={10} />{user?.role}</>
//                     : <><MdPerson size={10} />{user?.role}</>}
//                 </span>
//               </div>

//               <div className="flex flex-col gap-0.5 mt-1.5">
//                 {user?.email && (
//                   <p className="text-[12px] text-slate-400 flex items-center gap-1.5 truncate">
//                     <MdEmail size={12} className="flex-shrink-0 text-slate-300" />
//                     {user.email}
//                   </p>
//                 )}
//                 {!loading && (
//                   <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
//                     <MdDomain size={12} className="flex-shrink-0 text-slate-300" />
//                     {posts.length} {posts.length === 1 ? "listing" : "listings"}
//                     {showingAll ? " across all users" : " in your account"}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* ── Actions ────────────────────────────────────────── */}
//           <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">

//             {/* Admin data scope toggle */}
//             {isAdmin && (
//               <button
//                 type="button"
//                 onClick={() => setAdminViewAll(v => !v)}
//                 className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all whitespace-nowrap
//                   ${adminViewAll
//                     ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 hover:bg-violet-700 w-full sm:w-auto"
//                     : "bg-white text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-400 w-full sm:w-auto"}`}
//               >
//                 <MdFilterList size={15} />
//                 {adminViewAll ? "Showing: All Users" : "Showing: My Listings"}
//               </button>
//             )}

//             {/* Add property */}
//             <Link
//               to="/dashboard/addProperty"
//               className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all shadow-md shadow-violet-200 w-full sm:w-auto"
//             >
//               <MdAddHome size={17} />
//               Add Property
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* ════════════════════════════════════════════════════════════
//           DATA SCOPE LABEL (admin only)
//       ════════════════════════════════════════════════════════════ */}
//       {isAdmin && (
//         <div className="flex items-center gap-2">
//           <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border
//             ${showingAll
//               ? "bg-violet-50 text-violet-600 border-violet-100"
//               : "bg-slate-50 text-slate-500 border-slate-100"}`}>
//             {showingAll
//               ? <><MdAdminPanelSettings size={13} />Platform-wide data</>
//               : <><MdPerson size={13} />Your listings only</>}
//           </div>
//         </div>
//       )}

//       {/* ════════════════════════════════════════════════════════════
//           STATS GRID
//       ════════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//         {stats.map(s => (
//           <StatCard key={s.label} {...s} loading={loading} isAdminView={showingAll} />
//         ))}
//       </div>

//       {/* ════════════════════════════════════════════════════════════
//           RECENT LISTINGS
//       ════════════════════════════════════════════════════════════ */}
//       <div className={`bg-white rounded-2xl overflow-hidden transition-all
//         ${showingAll
//           ? "border border-violet-100 shadow-md shadow-violet-50/80"
//           : "border border-slate-100 shadow-sm"}`}>

//         {/* Admin top accent */}
//         {showingAll && (
//           <div className="h-0.5 w-full bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />
//         )}

//         {/* Header */}
//         <div className={`flex items-center justify-between px-4 md:px-5 py-3.5 border-b
//           ${showingAll
//             ? "border-violet-50 bg-gradient-to-r from-violet-50/70 to-transparent"
//             : "border-slate-100"}`}>
//           <div>
//             <div className="flex items-center gap-2 flex-wrap">
//               <h3 className="text-[13px] md:text-sm font-bold text-slate-800">
//                 Recent Listings
//               </h3>
//               {showingAll && (
//                 <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
//                   <MdAdminPanelSettings size={10} />
//                   All Users
//                 </span>
//               )}
//             </div>
//             {!loading && (
//               <p className="text-[11px] text-slate-400 mt-0.5">
//                 Last {recentPosts.length} {showingAll ? "platform-wide" : ""} propert{recentPosts.length === 1 ? "y" : "ies"}
//               </p>
//             )}
//           </div>
//           <Link
//             to="/dashboard/myProperties"
//             className="text-[12px] text-violet-600 font-semibold no-underline hover:text-violet-800 transition-colors"
//           >
//             View all →
//           </Link>
//         </div>

//         {/* Admin hint banner */}
//         {/* {showingAll && !loading && recentPosts.length > 0 && <AdminHintBanner />} */}

//         {/* Error */}
//         {error && (
//           <div className="px-4 md:px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
//             {error}
//           </div>
//         )}

//         {/* Loading skeletons */}
//         {loading && <div>{[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}</div>}

//         {/* Empty state */}
//         {!loading && !error && recentPosts.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-14 gap-3">
//             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center
//               ${showingAll ? "bg-violet-50" : "bg-slate-50"}`}>
//               <MdOutlineHome size={26} className={showingAll ? "text-violet-300" : "text-slate-300"} />
//             </div>
//             <div className="text-center">
//               <p className="text-sm font-bold text-slate-500">No listings yet</p>
//               <p className="text-xs text-slate-400 mt-1">
//                 {showingAll
//                   ? "No properties have been added to the platform yet."
//                   : "Add your first property to get started"}
//               </p>
//             </div>
//             <Link
//               to="/dashboard/addProperty"
//               className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2 text-[12px] font-semibold shadow-md shadow-violet-200 transition-all"
//             >
//               <MdAddHome size={15} />
//               Add Property
//             </Link>
//           </div>
//         )}

//         {/* Listing rows */}
//         {!loading && !error && recentPosts.length > 0 && (
//           <div>
//             {recentPosts.map((p, i) => {
//               const type     = p.property ?? p.type ?? "property";
//               // Expects backend to include: post.user { id, username }
//               const postedBy = p.user?.username ?? p.username ?? null;
//               const posterId = p.user?.id ?? p.userId ?? null;

//               return (
//                 <div
//                   key={p.id}
//                   className={`flex items-center gap-3 px-4 md:px-5 py-3.5 transition-colors cursor-pointer group
//                     ${i < recentPosts.length - 1
//                       ? `border-b ${showingAll ? "border-violet-50" : "border-slate-50"}`
//                       : ""}
//                     ${showingAll ? "hover:bg-violet-50/50" : "hover:bg-slate-50"}`}
//                   onClick={() => navigate(`/dashboard/property/${p.id}`)}
//                 >
//                   {/* Thumbnail */}
//                   <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-slate-100">
//                     {p.images?.length > 0 ? (
//                       <img
//                         src={p.images[0]}
//                         alt={p.title}
//                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                         onError={(e) => {
//                           e.currentTarget.style.display = "none";
//                           e.currentTarget.parentElement.classList.add(
//                             "bg-gradient-to-br", "from-violet-100", "to-purple-100",
//                             "flex", "items-center", "justify-center"
//                           );
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-500">
//                         <MdOutlineHome size={18} />
//                       </div>
//                     )}
//                   </div>

//                   {/* Title + meta */}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight group-hover:text-violet-700 transition-colors">
//                       {p.title}
//                     </p>
//                     <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
//                       <MdLocationOn size={11} className="text-violet-400 flex-shrink-0" />
//                       <span className="truncate">{p.city}</span>
//                       <span className="mx-0.5 flex-shrink-0">·</span>
//                       <span className="capitalize flex-shrink-0">{type}</span>
//                       <span className="mx-0.5 flex-shrink-0">·</span>
//                       <span className="flex-shrink-0 font-medium text-slate-500">{formatPrice(p.price)}</span>
//                     </p>
//                   </div>

//                   {/* Right: username chip (admin) + status + arrow */}
//                   <div className="flex items-center gap-2 flex-shrink-0">
//                     {showingAll && postedBy && (
//                       <UserChip
//                         username={postedBy}
//                         onClick={() =>
//                           navigate(
//                             // posterId
//                             //   ? `/dashboard/users/${posterId}`
//                             //   : `/dashboard/users?username=${encodeURIComponent(postedBy)}`
//                           )
//                         }
//                       />
//                     )}
//                     <StatusBadge status={p.status} />
//                     <MdOpenInNew
//                       size={13}
//                       className="text-slate-300 hidden sm:block group-hover:text-violet-400 transition-colors"
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Mobile footer */}
//         {!loading && recentPosts.length > 0 && (
//           <div className={`sm:hidden px-4 py-3 border-t ${showingAll ? "border-violet-50" : "border-slate-50"}`}>
//             <Link
//               to="/dashboard/myProperties"
//               className="block text-center text-[12px] text-violet-600 font-semibold no-underline py-1"
//             >
//               View all properties →
//             </Link>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// }


// pages/dashboard/Overview.jsx
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
  MdAdminPanelSettings,
  MdPerson,
  MdFilterList,
  MdDomain,
  MdEmail,
  MdVerified,
} from "react-icons/md";

function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

const STATUS_CONFIG = {
  available: { label: "Available", dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-100" },
  sold:      { label: "Sold",      dot: "bg-slate-400",   text: "text-slate-600",   bg: "bg-slate-50",    border: "border-slate-100"   },
  rented:    { label: "Rented",    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-100"   },
  pending:   { label: "Pending",   dot: "bg-blue-400",    text: "text-blue-700",    bg: "bg-blue-50",     border: "border-blue-100"    },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

function Avatar({ src, name = "", className = "w-12 h-12", textClass = "text-lg" }) {
  const [imgError, setImgError] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src && !imgError) {
    return (
      <img src={src} alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100 shadow-sm`}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none shadow-sm`}>
      {letter}
    </div>
  );
}

const STAT_STYLES = {
  violet:  { value: "text-violet-600",  iconBg: "bg-violet-100",  iconText: "text-violet-500"  },
  emerald: { value: "text-emerald-600", iconBg: "bg-emerald-100", iconText: "text-emerald-500" },
  slate:   { value: "text-slate-600",   iconBg: "bg-slate-100",   iconText: "text-slate-500"   },
  amber:   { value: "text-amber-500",   iconBg: "bg-amber-100",   iconText: "text-amber-500"   },
};

function StatCard({ label, value, colorKey, Icon, loading, isAdminView }) {
  const s = STAT_STYLES[colorKey];
  return (
    <div className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-all duration-200
      ${isAdminView ? "border-violet-100 shadow-sm shadow-violet-50/80 hover:shadow-violet-100" : "border-slate-100 hover:shadow-slate-100"}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium leading-tight">{label}</span>
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

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-3.5 border-b border-slate-50 animate-pulse min-w-0">
      <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="h-3 bg-slate-100 rounded w-2/3" />
        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <div className="w-20 h-5 bg-slate-100 rounded-full" />
        <div className="w-16 h-5 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

function UserChip({ username, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      className="inline-flex items-center gap-1.5 bg-white border border-violet-200 text-violet-700 text-[10px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap hover:bg-violet-50 hover:border-violet-400 hover:shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0 w-[100%]"
      title={`View ${username}'s profile`}
    >
      <MdPerson size={11} />
      {username}
    </button>
  );
}

export default function Overview() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const user    = currentUser?.userData ?? {};
  const userId  = user?.id;
  const isAdmin = user?.role === "ADMIN";

  const [adminViewAll, setAdminViewAll] = useState(true);
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = isAdmin && adminViewAll ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);
        setPosts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, isAdmin, adminViewAll]);

  const showingAll = isAdmin && adminViewAll;

  // Last week filter
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentPosts = posts.filter(p => {
    const created = new Date(p.createdAt);
    return created >= oneWeekAgo;
  });

  const stats = [
    { label: showingAll ? "Total Properties" : "Total Listings", value: posts.length,                                      colorKey: "violet",  Icon: MdOutlineHome       },
    { label: "Available",                                          value: posts.filter(p => p.status === "available").length, colorKey: "emerald", Icon: MdCheckCircleOutline },
    { label: "Sold",                                               value: posts.filter(p => p.status === "sold").length,      colorKey: "slate",   Icon: MdHighlightOff       },
    { label: "Rented",                                             value: posts.filter(p => p.status === "rented").length,    colorKey: "amber",   Icon: MdOutlineAccessTime  },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-5">

      {/* WELCOME / PROFILE CARD */}
      <div className={`bg-white rounded-2xl overflow-hidden transition-all
        ${isAdmin ? "border border-violet-100 shadow-md shadow-violet-50" : "border border-slate-100 shadow-sm"}`}>
        {isAdmin && <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar src={user?.avatar} name={user?.username} className="w-14 h-14 md:w-16 md:h-16" textClass="text-xl md:text-2xl" />
              {isAdmin && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow ring-2 ring-white">
                  <MdVerified size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base md:text-lg font-bold text-slate-800 truncate">{user?.username ?? "User"}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${isAdmin ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {isAdmin ? <><MdAdminPanelSettings size={10} />{user?.role}</> : <><MdPerson size={10} />{user?.role}</>}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1.5">
                {user?.email && (
                  <p className="text-[12px] text-slate-400 flex items-center gap-1.5 truncate">
                    <MdEmail size={12} className="flex-shrink-0 text-slate-300" />
                    {user.email}
                  </p>
                )}
                {!loading && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MdDomain size={12} className="flex-shrink-0 text-slate-300" />
                    {posts.length} {posts.length === 1 ? "listing" : "listings"}
                    {showingAll ? " across all users" : " in your account"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setAdminViewAll(v => !v)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all whitespace-nowrap w-full sm:w-auto
                  ${adminViewAll
                    ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 hover:bg-violet-700"
                    : "bg-white text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-400"}`}
              >
                <MdFilterList size={15} />
                {adminViewAll ? "Showing: All Users" : "Showing: My Listings"}
              </button>
            )}
            <Link
              to="/dashboard/addProperty"
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all shadow-md shadow-violet-200 w-full sm:w-auto"
            >
              <MdAddHome size={17} />
              Add Property
            </Link>
          </div>
        </div>
      </div>

      {/* DATA SCOPE LABEL */}
      {isAdmin && (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border
            ${showingAll ? "bg-violet-50 text-violet-600 border-violet-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
            {showingAll ? <><MdAdminPanelSettings size={13} />Platform-wide data</> : <><MdPerson size={13} />Your listings only</>}
          </div>
        </div>
      )}

      {/* STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} loading={loading} isAdminView={showingAll} />)}
      </div>

      {/* RECENT LISTINGS */}
      <div className={`bg-white rounded-2xl overflow-hidden transition-all
        ${showingAll ? "border border-violet-100 shadow-md shadow-violet-50/80" : "border border-slate-100 shadow-sm"}`}>

        {showingAll && <div className="h-0.5 w-full bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />}

        {/* Header */}
        <div className={`flex items-center justify-between px-4 md:px-5 py-3.5 border-b
          ${showingAll ? "border-violet-50 bg-gradient-to-r from-violet-50/70 to-transparent" : "border-slate-100"}`}>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[13px] md:text-sm font-bold text-slate-800">Recent Listings</h3>
              {showingAll && (
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                  <MdAdminPanelSettings size={10} />All Users
                </span>
              )}
            </div>
            {!loading && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {recentPosts.length} {showingAll ? "platform-wide" : ""} {recentPosts.length === 1 ? "property" : "properties"} this week
              </p>
            )}
          </div>
          <Link to="/dashboard/myProperties" className="text-[12px] text-violet-600 font-semibold no-underline hover:text-violet-800 transition-colors whitespace-nowrap">
            View all →
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 md:px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />{error}
          </div>
        )}

        {/* Loading */}
        {loading && <div>{[1,2,3,4].map(i => <SkeletonRow key={i} />)}</div>}

        {/* Empty */}
        {!loading && !error && recentPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${showingAll ? "bg-violet-50" : "bg-slate-50"}`}>
              <MdOutlineHome size={26} className={showingAll ? "text-violet-300" : "text-slate-300"} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-500">No listings this week</p>
              <p className="text-xs text-slate-400 mt-1">
                {showingAll ? "No properties have been added this week." : "Add your first property to get started"}
              </p>
            </div>
            <Link
              to="/dashboard/addProperty"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2 text-[12px] font-semibold shadow-md shadow-violet-200 transition-all"
            >
              <MdAddHome size={15} />Add Property
            </Link>
          </div>
        )}

        {/* Listing rows — scrollable on small screens */}
        {!loading && !error && recentPosts.length > 0 && (
          <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: "touch" }}>
            {/* FIX: Table-like fixed columns so every row aligns perfectly */}
            <div className="min-w-[580px]">
              {recentPosts.map((p, i) => {
                const type     = p.property ?? p.type ?? "property";
                const postedBy = p.user?.username ?? p.username ?? null;
                const posterId = p.user?.id ?? p.userId ?? null;

                return (
                  // FIX: Row is NO LONGER clickable — removed onClick and cursor-pointer from the row div
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 px-4 md:px-5 py-3
                      ${i < recentPosts.length - 1 ? `border-b ${showingAll ? "border-violet-50" : "border-slate-50"}` : ""}`}
                  >
                    {/* Thumbnail — fixed width */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-slate-100">
                      {p.images?.length > 0 ? (
                        <img
                          src={p.images[0]} alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.add("bg-gradient-to-br","from-violet-100","to-purple-100","flex","items-center","justify-center");
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-500">
                          <MdOutlineHome size={18} />
                        </div>
                      )}
                    </div>

                    {/* Title + location/type/price — flex-1 so it fills remaining space */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <MdLocationOn size={11} className="text-violet-400 flex-shrink-0" />
                        <span className="truncate">{p.city}</span>
                        <span className="mx-0.5 flex-shrink-0">·</span>
                        <span className="capitalize flex-shrink-0">{type}</span>
                        <span className="mx-0.5 flex-shrink-0">·</span>
                        <span className="flex-shrink-0 font-medium text-slate-500">{formatPrice(p.price)}</span>
                      </p>
                    </div>

                    {/* FIX: Right-side columns all use fixed widths so they line up across every row */}

                    {/* Username column — fixed width, always rendered (empty placeholder when not admin) */}
                    <div className="flex-shrink-0 w-28 flex justify-center">
                      {showingAll && postedBy && (
                        <UserChip
                          username={postedBy}
                          onClick={() => navigate(posterId ? `/dashboard/users/${posterId}` : `/dashboard/users?username=${encodeURIComponent(postedBy)}`)}
                        />
                      )}
                    </div>

                    {/* Status badge column — fixed width */}
                    <div className="flex-shrink-0 w-24 flex justify-end">
                      <StatusBadge status={p.status} />
                    </div>

                    {/* Open icon — fixed width, ONLY clickable element on the row */}
                    <div className="flex-shrink-0 w-7 flex justify-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/property/${p.id}`)}
                        aria-label="View property details"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-violet-500 hover:bg-violet-50 transition-all cursor-pointer"
                      >
                        <MdOpenInNew size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mobile footer */}
        {!loading && recentPosts.length > 0 && (
          <div className={`sm:hidden px-4 py-3 border-t ${showingAll ? "border-violet-50" : "border-slate-50"}`}>
            <Link to="/dashboard/myProperties" className="block text-center text-[12px] text-violet-600 font-semibold no-underline py-1">
              View all properties →
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}