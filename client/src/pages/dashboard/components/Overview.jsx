// import { Avatar, Badge } from "./ui";
// import { formatPrice } from "../utils";

// export default function Overview({ posts, user }) {
//   const stats = [
//     { label:"Total Listings", value:posts.length,                                     color:"text-indigo-600"  },
//     { label:"Available",      value:posts.filter(p=>p.status==="available").length,   color:"text-emerald-600" },
//     { label:"Sold",           value:posts.filter(p=>p.status==="sold").length,        color:"text-slate-600"   },
//     { label:"Rented",         value:posts.filter(p=>p.status==="rented").length,      color:"text-amber-600"   },
//   ];

//   return (
//     <div className="space-y-5">
//       {/* Welcome card */}
//       <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5">
//         <Avatar src={user.avatar} name={user.username} size={56} />
//         <div className="min-w-0">
//           <p className="font-semibold text-slate-800 text-lg truncate">
//             Welcome back, {user.username} 👋
//           </p>
//           <p className="text-sm text-slate-400 capitalize">{user.role} · {user.email}</p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {stats.map(({ label, value, color }) => (
//           <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4">
//             <p className="text-xs text-slate-500 mb-1">{label}</p>
//             <p className={`text-2xl font-bold ${color}`}>{value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Recent listings */}
//       <div className="bg-white border border-slate-200 rounded-2xl p-5">
//         <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Listings</h3>
//         <div>
//           {posts.slice(0, 4).map(p => (
//             <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-3">
//               <div className="flex items-center gap-3 min-w-0 flex-1">
//                 <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
//                   ⌂
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
//                   <p className="text-xs text-slate-400">{p.city} · {formatPrice(p.price)}</p>
//                 </div>
//               </div>
//               <div className="shrink-0"><Badge status={p.status} /></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// pages/dashboard/Overview.jsx// pages/dashboard/Overview.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext"; // adjust path if needed

/* ── Dummy posts ─────────────────────────────────────────────────── */
// Replace `DUMMY_POSTS` with your real data source when ready.
// e.g. const { posts } = useContext(PostContext);
const DUMMY_POSTS = [
  { id: "1", title: "Modern 3BR Apartment in Blue Area", city: "Islamabad", price: 25000000, status: "available" },
  { id: "2", title: "5 Marla House in DHA Phase 2",      city: "Lahore",    price: 45000000, status: "sold"      },
  { id: "3", title: "Commercial Shop in Saddar",          city: "Peshawar",  price: 8500000,  status: "rented"   },
  { id: "4", title: "10 Marla Corner Plot",               city: "Karachi",   price: 32000000, status: "available"},
  { id: "5", title: "Studio Apartment near LUMS",         city: "Lahore",    price: 9500000,  status: "available"},
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

const STATUS_STYLES = {
  available: { bg: "#ecfdf5", color: "#059669", dot: "#10b981", label: "Available" },
  sold:      { bg: "#f8fafc", color: "#475569", dot: "#94a3b8", label: "Sold"      },
  rented:    { bg: "#fffbeb", color: "#b45309", dot: "#f59e0b", label: "Rented"    },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.available;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, borderRadius: 20,
      fontSize: 11, fontWeight: 600, padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function Avatar({ name = "", size = 48 }) {
  const initials = name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "U";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 700, color: "#fff", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #e8e8f0",
      borderRadius: 16, padding: "18px 20px",
      display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{label}</span>
        <span style={{
          width: 32, height: 32, borderRadius: 9,
          background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center",
          color, fontSize: 16,
        }}>{icon}</span>
      </div>
      <span style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</span>
    </div>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
export default function Overview() {
  const { currentUser } = useContext(AuthContext);

  // Swap DUMMY_POSTS with your real data when ready:
  // e.g. const { posts } = useContext(PostContext);
  const posts = DUMMY_POSTS;

  const stats = [
    { label: "Total Listings", value: posts.length,                                       color: "#6366f1", icon: "⌂" },
    { label: "Available",      value: posts.filter(p => p.status === "available").length,  color: "#10b981", icon: "✓" },
    { label: "Sold",           value: posts.filter(p => p.status === "sold").length,        color: "#64748b", icon: "⊙" },
    { label: "Rented",         value: posts.filter(p => p.status === "rented").length,      color: "#f59e0b", icon: "⌛" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .ov-root { font-family: 'DM Sans', sans-serif; display: flex; flex-direction: column; gap: 20px; }
        .ov-root * { box-sizing: border-box; }
        .ov-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 900px) { .ov-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .ov-stats { grid-template-columns: 1fr 1fr; } }
        .ov-row { transition: background 0.12s; border-radius: 10px; }
        .ov-row:hover { background: #fafafe; }
      `}</style>

      <div className="ov-root">

        {/* ── Welcome card ───────────────────────────────────── */}
        <div style={{
          background: "#fff", border: "1px solid #e8e8f0",
          borderRadius: 18, padding: "20px 24px",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <Avatar name={currentUser?.username} size={52} />

          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>
              Welcome back, {currentUser?.username ?? "User"} 👋
            </p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0", textTransform: "capitalize" }}>
              {currentUser?.role ?? "Member"} · {currentUser?.email ?? ""}
            </p>
          </div>

          <Link
            to="/dashboard/addProperty"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "#fff", textDecoration: "none", borderRadius: 10,
              padding: "9px 16px", fontSize: 13, fontWeight: 600,
              whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              width="14" height="14">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
            Add Property
          </Link>
        </div>

        {/* ── Stats ──────────────────────────────────────────── */}
        <div className="ov-stats">
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Recent listings ────────────────────────────────── */}
        <div style={{
          background: "#fff", border: "1px solid #e8e8f0",
          borderRadius: 18, padding: "20px 24px",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", marginBottom: 16,
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e1b4b", margin: 0 }}>
              Recent Listings
            </h3>
            <Link
              to="/dashboard/myProperties"
              style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}
            >
              View all →
            </Link>
          </div>

          <div>
            {posts.slice(0, 5).map((p, i) => (
              <div
                key={p.id}
                className="ov-row"
                style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 10px", gap: 12,
                  borderBottom: i < Math.min(posts.length, 5) - 1
                    ? "1px solid #f1f5f9" : "none",
                }}
              >
                {/* Icon + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#6366f1", fontSize: 17,
                  }}>⌂</div>

                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: "#1e1b4b",
                      margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>{p.title}</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>
                      {p.city} · {formatPrice(p.price)}
                    </p>
                  </div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  <StatusBadge status={p.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}