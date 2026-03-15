import { Avatar, Badge } from "./ui";
import { formatPrice } from "../utils";

export default function Overview({ posts, user }) {
  const stats = [
    { label:"Total Listings", value:posts.length,                                     color:"text-indigo-600"  },
    { label:"Available",      value:posts.filter(p=>p.status==="available").length,   color:"text-emerald-600" },
    { label:"Sold",           value:posts.filter(p=>p.status==="sold").length,        color:"text-slate-600"   },
    { label:"Rented",         value:posts.filter(p=>p.status==="rented").length,      color:"text-amber-600"   },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome card */}
      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5">
        <Avatar src={user.avatar} name={user.username} size={56} />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-lg truncate">
            Welcome back, {user.username} 👋
          </p>
          <p className="text-sm text-slate-400 capitalize">{user.role} · {user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4">
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Recent listings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Recent Listings</h3>
        <div>
          {posts.slice(0, 4).map(p => (
            <div key={p.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0 gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
                  ⌂
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{p.title}</p>
                  <p className="text-xs text-slate-400">{p.city} · {formatPrice(p.price)}</p>
                </div>
              </div>
              <div className="shrink-0"><Badge status={p.status} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}