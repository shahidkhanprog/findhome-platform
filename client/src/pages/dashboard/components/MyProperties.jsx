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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Dummy data ─────────────────────────────────────────────────── */
const DUMMY_POSTS = [
  { id: "1", title: "Modern 3BR Apartment in Blue Area", city: "Islamabad", price: 25000000, status: "available", type: "apartment", area: 1800, bedrooms: 3, bathrooms: 2 },
  { id: "2", title: "5 Marla House in DHA Phase 2",      city: "Lahore",    price: 45000000, status: "sold",      type: "house",     area: 1125, bedrooms: 4, bathrooms: 3 },
  { id: "3", title: "Commercial Shop in Saddar",          city: "Peshawar",  price: 8500000,  status: "rented",   type: "commercial",area: 400,  bedrooms: 0, bathrooms: 1 },
  { id: "4", title: "10 Marla Corner Plot",               city: "Karachi",   price: 32000000, status: "available",type: "plot",      area: 2250, bedrooms: 0, bathrooms: 0 },
  { id: "5", title: "Studio Apartment near LUMS",         city: "Lahore",    price: 9500000,  status: "available",type: "apartment", area: 650,  bedrooms: 1, bathrooms: 1 },
  { id: "6", title: "4 Bed Bungalow in F-7",              city: "Islamabad", price: 85000000, status: "pending",  type: "house",     area: 3200, bedrooms: 4, bathrooms: 4 },
];

/* ─── Helpers ────────────────────────────────────────────────────── */
function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

const STATUS_CONFIG = {
  available: { label: "Available", bg: "#ecfdf5", color: "#059669", dot: "#10b981" },
  sold:      { label: "Sold",      bg: "#f8fafc", color: "#475569", dot: "#94a3b8" },
  rented:    { label: "Rented",    bg: "#fffbeb", color: "#b45309", dot: "#f59e0b" },
  pending:   { label: "Pending",   bg: "#eff6ff", color: "#2563eb", dot: "#3b82f6" },
};

const STATUS_KEYS = ["all", "available", "sold", "rented", "pending"];

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      borderRadius: 20, fontSize: 11, fontWeight: 600,
      padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─── Property Card ──────────────────────────────────────────────── */
function PropertyCard({ post, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e8e8f0",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.18s, transform 0.18s",
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(99,102,241,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Image placeholder */}
      <div style={{
        height: 148,
        background: "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 60%,#c4b5fd 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#8b5cf6", fontSize: 44, position: "relative",
      }}>
        ⌂
        {/* Status badge top-right */}
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <StatusBadge status={post.status} />
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        <p style={{
          fontSize: 14, fontWeight: 700, color: "#1e1b4b",
          margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {post.title}
        </p>

        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {post.city}
        </p>

        {/* Meta pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 2 }}>
          {post.area > 0 && (
            <span style={{ fontSize: 11, color: "#64748b", background: "#f8f7ff", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>
              {post.area} sqft
            </span>
          )}
          {post.bedrooms > 0 && (
            <span style={{ fontSize: 11, color: "#64748b", background: "#f8f7ff", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>
              {post.bedrooms} bed
            </span>
          )}
          {post.bathrooms > 0 && (
            <span style={{ fontSize: 11, color: "#64748b", background: "#f8f7ff", borderRadius: 6, padding: "2px 8px", fontWeight: 500 }}>
              {post.bathrooms} bath
            </span>
          )}
          <span style={{ fontSize: 11, color: "#64748b", background: "#f8f7ff", borderRadius: 6, padding: "2px 8px", fontWeight: 500, textTransform: "capitalize" }}>
            {post.type}
          </span>
        </div>

        {/* Price */}
        <p style={{ fontSize: 15, fontWeight: 800, color: "#6366f1", margin: "4px 0 0" }}>
          {formatPrice(post.price)}
        </p>
      </div>

      {/* Action row */}
      <div style={{
        padding: "10px 16px",
        borderTop: "1px solid #f1f0f9",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        {/* Edit */}
        <button
          onClick={() => onEdit?.(post)}
          style={{
            flex: 1, padding: "7px 0", fontSize: 12, fontWeight: 600,
            background: "#f5f3ff", color: "#6366f1",
            border: "none", borderRadius: 8, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            transition: "background 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#ede9fe"}
          onMouseLeave={e => e.currentTarget.style.background = "#f5f3ff"}
        >
          Edit
        </button>

        {/* Status change dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              padding: "7px 10px", fontSize: 12, fontWeight: 600,
              background: "#f8fafc", color: "#64748b",
              border: "1px solid #e8e8f0", borderRadius: 8, cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            Status
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="11" height="11">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 6px)", right: 0,
              background: "#fff", border: "1px solid #e8e8f0",
              borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              zIndex: 50, minWidth: 120, overflow: "hidden",
            }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => { onStatusChange?.(post.id, key); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    width: "100%", padding: "8px 12px",
                    fontSize: 12, fontWeight: 500, color: "#1e1b4b",
                    background: post.status === key ? "#f5f3ff" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => { if (post.status !== key) e.currentTarget.style.background = "#fafafe"; }}
                  onMouseLeave={e => { if (post.status !== key) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                  {cfg.label}
                  {post.status === key && (
                    <span style={{ marginLeft: "auto", color: "#6366f1", fontSize: 11 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Delete */}
        <button
          onClick={() => onDelete?.(post.id)}
          style={{
            padding: "7px 10px", fontSize: 12, fontWeight: 600,
            background: "#fff5f5", color: "#ef4444",
            border: "1px solid #fecaca", borderRadius: 8, cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            transition: "background 0.12s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#fee2e2"}
          onMouseLeave={e => e.currentTarget.style.background = "#fff5f5"}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── MyProperties page ──────────────────────────────────────────── */
export default function MyProperties() {
  const navigate = useNavigate();

  // ── Swap DUMMY_POSTS with real data when ready ──────────────────
  // e.g. const { posts, deletePost, updatePostStatus } = useContext(PostContext);
  const [posts, setPosts] = useState(DUMMY_POSTS);
  // ───────────────────────────────────────────────────────────────

  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);

  const handleEdit = (post) => {
    // Navigate to add/edit page with post data
    // When using real router: navigate("/dashboard/addProperty", { state: { post } });
    navigate("/dashboard/addProperty", { state: { post } });
  };

  const handleDelete = (id) => {
    // Replace with your real delete call:
    // await deletePost(id);
    setPosts(ps => ps.filter(p => p.id !== id));
  };

  const handleStatusChange = (id, status) => {
    // Replace with your real update call:
    // await updatePostStatus(id, status);
    setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .mp-root { font-family:'DM Sans',sans-serif; display:flex; flex-direction:column; gap:20px; }
        .mp-root * { box-sizing:border-box; }
        .mp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
          gap: 16px;
        }
        .mp-pill { transition: background .12s, color .12s; white-space: nowrap; }
        .mp-pill:hover { opacity: .85; }
      `}</style>

      <div className="mp-root">

        {/* ── Header ───────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e1b4b", margin: 0 }}>My Properties</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
              {posts.length} listing{posts.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/addProperty")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "#fff", border: "none", borderRadius: 10,
              padding: "9px 16px", fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              whiteSpace: "nowrap", flexShrink: 0,
              boxShadow: "0 2px 10px rgba(99,102,241,.25)",
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Property
          </button>
        </div>

        {/* ── Filter pills ─────────────────────────────────────── */}
        <div style={{
          display: "flex", gap: 8, overflowX: "auto",
          paddingBottom: 4, msOverflowStyle: "none", scrollbarWidth: "none",
        }}>
          {STATUS_KEYS.map(s => {
            const isActive = filter === s;
            const cfg = STATUS_CONFIG[s];
            const count = s === "all" ? posts.length : posts.filter(p => p.status === s).length;
            return (
              <button
                key={s}
                className="mp-pill"
                onClick={() => setFilter(s)}
                style={{
                  flexShrink: 0,
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12, fontWeight: 600,
                  border: isActive ? "none" : "1.5px solid #e8e8f0",
                  background: isActive
                    ? (s === "all" ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : cfg.bg)
                    : "#fff",
                  color: isActive
                    ? (s === "all" ? "#fff" : cfg.color)
                    : "#64748b",
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {s === "all" ? "All" : cfg.label}
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: isActive
                    ? (s === "all" ? "rgba(255,255,255,.25)" : cfg.dot + "30")
                    : "#f1f5f9",
                  color: isActive ? (s === "all" ? "#fff" : cfg.color) : "#94a3b8",
                  borderRadius: 20, padding: "1px 6px",
                  minWidth: 18, textAlign: "center",
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Cards / empty state ──────────────────────────────── */}
        {filtered.length === 0 ? (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "64px 0", color: "#94a3b8",
            background: "#fff", borderRadius: 18,
            border: "1px solid #e8e8f0",
          }}>
            <div style={{ fontSize: 56, opacity: 0.2, marginBottom: 12 }}>⌂</div>
            <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>No properties found</p>
            <p style={{ fontSize: 12, margin: "6px 0 20px" }}>Try a different filter or add a new listing</p>
            <button
              onClick={() => navigate("/dashboard/addProperty")}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff", border: "none", borderRadius: 10,
                padding: "9px 20px", fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
              }}
            >
              + Add Property
            </button>
          </div>
        ) : (
          <div className="mp-grid">
            {filtered.map(post => (
              <PropertyCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
}