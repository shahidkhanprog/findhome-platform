import { useState } from "react";
import { Badge } from "./ui";
import { formatPrice } from "../utils";
import { STATUS_CONFIG, PROP_COLORS } from "../constants";

export default function PropertyCard({ post, onEdit, onDelete, onStatusChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statusOptions = ["available","sold","rented","pending"].filter(s => s !== post.status);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col w-full">
      {/* Image area */}
      <div className="h-44 bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center shrink-0">
        {post.images?.length
          ? <img src={post.images[0]} alt={post.title} className="w-full h-full object-cover" />
          : <div className="text-slate-300 text-5xl select-none">⌂</div>
        }
        <div className="absolute top-3 left-3"><Badge status={post.status} /></div>

        {/* Context menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-600 hover:bg-white transition-colors shadow-sm text-xs font-bold"
          >
            •••
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-lg z-30 min-w-[168px] overflow-hidden">
              <button
                onClick={() => { onEdit(post); setMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <span>✎</span> Edit Property
              </button>
              <div className="border-t border-slate-100 px-4 py-1.5">
                <p className="text-[11px] text-slate-400 uppercase tracking-wide font-medium mb-1">Change Status</p>
                {statusOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(post.id, s); setMenuOpen(false); }}
                    className="w-full text-left py-1.5 text-sm text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[s]?.dot}`} />
                    {STATUS_CONFIG[s]?.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-slate-100">
                <button
                  onClick={() => { onDelete(post.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                >
                  <span>⊗</span> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1 min-w-0">
            {post.title}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-md shrink-0 ml-1 ${PROP_COLORS[post.property] || "bg-slate-100 text-slate-600"}`}>
            {post.property}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1 min-w-0">
          <span className="shrink-0">◎</span>
          <span className="truncate">{post.address}, {post.city}</span>
        </p>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="font-bold text-indigo-600 text-sm shrink-0">{formatPrice(post.price)}</span>
          <span className={`text-xs px-2 py-0.5 rounded-md border font-medium shrink-0 ${
            post.listingType === "sale"
              ? "border-indigo-200 text-indigo-600 bg-indigo-50"
              : "border-teal-200 text-teal-600 bg-teal-50"
          }`}>
            For {post.listingType}
          </span>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
          {post.bedroom  > 0 && <span className="flex items-center gap-1 shrink-0">🛏 {post.bedroom} bed</span>}
          {post.bathroom > 0 && <span className="flex items-center gap-1 shrink-0">🚿 {post.bathroom} bath</span>}
          {post.size         && <span className="flex items-center gap-1 shrink-0">⊡ {post.size} sqft</span>}
        </div>
      </div>
    </div>
  );
}