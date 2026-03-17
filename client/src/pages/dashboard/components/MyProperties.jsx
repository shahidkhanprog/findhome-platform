// import { useState } from "react";
// import PropertyCard from "./PropertyCard";
// import { STATUS_CONFIG } from "../constants";

// export default function MyProperties({ posts, onEdit, onDelete, onStatusChange, onAddNew }) {
//   const [filterStatus, setFilterStatus] = useState("all");

//   const filtered = filterStatus === "all"
//     ? posts
//     : posts.filter(p => p.status === filterStatus);

//   return (
//     <div>
//       {/* Header row */}
//       <div className="flex items-center justify-between mb-5 gap-3">
//         <h2 className="text-lg font-semibold text-slate-800 shrink-0">My Properties</h2>
//         <button
//           onClick={onAddNew}
//           className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
//         >
//           <span className="text-base leading-none">＋</span>
//           <span className="hidden sm:inline">Add Property</span>
//           <span className="sm:hidden">Add</span>
//         </button>
//       </div>

//       {/* Filter pills */}
//       <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
//         {["all","available","sold","rented","pending"].map(s => (
//           <button
//             key={s}
//             onClick={() => setFilterStatus(s)}
//             className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
//               filterStatus === s
//                 ? "bg-indigo-600 text-white"
//                 : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
//             }`}
//           >
//             {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
//             {s !== "all" && (
//               <span className="ml-1.5 opacity-70">
//                 {posts.filter(p => p.status === s).length}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Cards grid */}
//       {filtered.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-slate-400">
//           <div className="text-6xl mb-4 opacity-20">⌂</div>
//           <p className="text-sm">No properties found</p>
//         </div>
//       ) : (
//         <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
//           {filtered.map(post => (
//             <PropertyCard
//               key={post.id}
//               post={post}
//               onEdit={onEdit}
//               onDelete={onDelete}
//               onStatusChange={onStatusChange}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// pages/dashboard/MyProperties.jsx
// ─────────────────────────────────────────────────────────────────
// Standalone page at /dashboard/myProperties.
// Uses DUMMY_POSTS until you wire up real data.
// To use real data: replace DUMMY_POSTS with your context/API hook.
// ─────────────────────────────────────────────────────────────────



// pages/dashboard/MyProperties.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineHome,
  MdAddHome,
  MdLocationOn,
  MdEdit,
  MdDeleteOutline,
  MdKeyboardArrowDown,
  MdCheck,
  MdOpenInNew,
  MdSquareFoot,
  MdBed,
  MdBathtub,
} from "react-icons/md";

/* ─── Dummy data ─────────────────────────────────────────────────── */
export const DUMMY_POSTS = [
  { id: "1", title: "Modern 3BR Apartment in Blue Area", city: "Islamabad", price: 25000000, status: "available", type: "apartment", area: 1800, bedrooms: 3, bathrooms: 2, description: "A beautifully designed 3-bedroom apartment located in the heart of Blue Area, Islamabad. Features modern fittings, central AC, and stunning city views. Walking distance to major offices and shopping centres.", postedDate: "2025-01-15" },
  { id: "2", title: "5 Marla House in DHA Phase 2",      city: "Lahore",    price: 45000000, status: "sold",      type: "house",     area: 1125, bedrooms: 4, bathrooms: 3, description: "Fully renovated 5 Marla house in a prime DHA Phase 2 location. Double storey with marble flooring, modular kitchen, and a well-maintained lawn.", postedDate: "2024-11-20" },
  { id: "3", title: "Commercial Shop in Saddar",          city: "Peshawar",  price: 8500000,  status: "rented",   type: "commercial",area: 400,  bedrooms: 0, bathrooms: 1, description: "Prime commercial unit on the main Saddar road with high footfall. Currently rented to a retail brand. Excellent investment opportunity.", postedDate: "2024-09-05" },
  { id: "4", title: "10 Marla Corner Plot",               city: "Karachi",   price: 32000000, status: "available",type: "plot",      area: 2250, bedrooms: 0, bathrooms: 0, description: "Corner plot with three-side open street access in a peaceful residential area. Registry and all documentation complete.", postedDate: "2025-02-01" },
  { id: "5", title: "Studio Apartment near LUMS",         city: "Lahore",    price: 9500000,  status: "available",type: "apartment", area: 650,  bedrooms: 1, bathrooms: 1, description: "Compact and modern studio apartment ideal for students or young professionals. Located 5 minutes from LUMS and major restaurants.", postedDate: "2025-03-10" },
  { id: "6", title: "4 Bed Bungalow in F-7",              city: "Islamabad", price: 85000000, status: "pending",  type: "house",     area: 3200, bedrooms: 4, bathrooms: 4, description: "Luxurious 4-bedroom bungalow in the prestigious F-7 sector. Includes a private garden, servant quarters, and a spacious rooftop terrace.", postedDate: "2025-01-28" },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
export function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

/* ─── Status config ──────────────────────────────────────────────── */
export const STATUS_CONFIG = {
  available: { label: "Available", bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400", border: "border-emerald-100" },
  sold:      { label: "Sold",      bg: "bg-slate-50",   text: "text-slate-600",   dot: "bg-slate-400",   border: "border-slate-100"   },
  rented:    { label: "Rented",    bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   border: "border-amber-100"   },
  pending:   { label: "Pending",   bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    border: "border-blue-100"    },
};

const STATUS_KEYS = ["all", "available", "sold", "rented", "pending"];

/* ─── StatusBadge ────────────────────────────────────────────────── */
export function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─── Property Card ──────────────────────────────────────────────── */
function PropertyCard({ post, onEdit, onDelete, onStatusChange, onDetails }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80 shadow-sm shadow-slate-100 border border-slate-100">

      {/* ── Image area ── */}
      <div className="relative h-40 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-violet-200/40" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-200/30" />
        <MdOutlineHome size={56} className="text-violet-400/60 relative z-10" />

        {/* Status badge */}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={post.status} />
        </div>

        {/* Type chip bottom-left */}
        <span className="absolute bottom-3 left-3 text-[10.5px] font-semibold capitalize bg-white/80 backdrop-blur-sm text-slate-600 rounded-lg px-2 py-0.5 border border-white/60">
          {post.type}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col gap-2">

        {/* Title */}
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* City */}
        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-violet-400 flex-shrink-0" />
          <span>{post.city}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 pt-0.5">
          {post.area > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdSquareFoot size={13} className="text-slate-400" />
              <span>{post.area.toLocaleString()} sqft</span>
            </div>
          )}
          {post.bedrooms > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdBed size={13} className="text-slate-400" />
              <span>{post.bedrooms} bed</span>
            </div>
          )}
          {post.bathrooms > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdBathtub size={13} className="text-slate-400" />
              <span>{post.bathrooms} bath</span>
            </div>
          )}
        </div>

        {/* Price */}
        <p className="text-base font-extrabold text-violet-600 mt-auto pt-1">
          {formatPrice(post.price)}
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-dashed border-slate-100" />

      {/* ── Actions ── */}
      <div className="p-3 flex items-center gap-2">

        {/* Details — primary CTA */}
        <button
          onClick={() => onDetails?.(post.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl border-none cursor-pointer transition-all shadow-sm shadow-violet-200"
        >
          <MdOpenInNew size={14} />
          Details
        </button>

        {/* Edit */}
        <button
          onClick={() => onEdit?.(post)}
          className="flex items-center justify-center gap-1 py-2 px-3 text-[12px] font-semibold bg-violet-50 text-violet-600 hover:bg-violet-100 rounded-xl border-none cursor-pointer transition-colors"
        >
          <MdEdit size={14} />
          Edit
        </button>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-0.5 py-2 px-2.5 text-[12px] font-semibold bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors"
          >
            <MdKeyboardArrowDown size={16} className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute bottom-[calc(100%+6px)] right-0 z-50 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200 overflow-hidden min-w-[136px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-3 pt-2.5 pb-1">
                  Change Status
                </p>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => { onStatusChange?.(post.id, key); setMenuOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium text-slate-700 border-none cursor-pointer transition-colors
                      ${post.status === key ? "bg-violet-50" : "bg-white hover:bg-slate-50"}`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    {cfg.label}
                    {post.status === key && <MdCheck size={13} className="ml-auto text-violet-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete?.(post.id)}
          className="flex items-center justify-center py-2 px-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-xl cursor-pointer transition-colors"
        >
          <MdDeleteOutline size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── MyProperties Page ──────────────────────────────────────────── */
export default function MyProperties() {
  const navigate = useNavigate();

  const [posts, setPosts]   = useState(DUMMY_POSTS);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);

  const handleEdit         = (post) => navigate("/dashboard/addProperty", { state: { post } });
  const handleDelete       = (id)   => setPosts(ps => ps.filter(p => p.id !== id));
  const handleStatusChange = (id, status) => setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  const handleDetails      = (id)   => navigate(`/dashboard/property/${id}`);

  return (
    <div
      className="flex flex-col gap-5"
      style={{ overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .mp-pills::-webkit-scrollbar { display: none; }
        .mp-root::-webkit-scrollbar  { display: none; }
      `}</style>

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-800 leading-tight">My Properties</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {posts.length} listing{posts.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/addProperty")}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md shadow-violet-200 transition-all"
        >
          <MdAddHome size={17} />
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Filter pills ─────────────────────────────────────── */}
      <div className="overflow-hidden -mx-1 px-1">
        <div className="mp-pills flex gap-2 overflow-x-auto pb-1">
          {STATUS_KEYS.map(s => {
            const isActive = filter === s;
            const cfg      = STATUS_CONFIG[s];
            const count    = s === "all" ? posts.length : posts.filter(p => p.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={[
                  "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border",
                  isActive
                    ? s === "all"
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-md shadow-violet-200"
                      : `${cfg.bg} ${cfg.text} ${cfg.border}`
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700",
                ].join(" ")}
              >
                {s === "all" ? "All" : cfg.label}
                <span className={[
                  "text-[10px] font-bold rounded-full px-1.5 py-px leading-none min-w-[18px] text-center",
                  isActive
                    ? s === "all" ? "bg-white/25 text-white" : `${cfg.dot} text-white`
                    : "bg-slate-100 text-slate-400",
                ].join(" ")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Grid or empty state ──────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-3">
          <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
            <MdOutlineHome size={32} className="text-violet-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-600">No properties found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different filter or add a new listing</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/addProperty")}
            className="mt-1 inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none rounded-xl px-5 py-2.5 text-[13px] font-semibold cursor-pointer shadow-md shadow-violet-200 transition-all"
          >
            <MdAddHome size={16} />
            Add Property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(post => (
            <PropertyCard
              key={post.id}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onDetails={handleDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}