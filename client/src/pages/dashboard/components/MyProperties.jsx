import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { STATUS_CONFIG } from "../constants";

export default function MyProperties({ posts, onEdit, onDelete, onStatusChange, onAddNew }) {
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = filterStatus === "all"
    ? posts
    : posts.filter(p => p.status === filterStatus);

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2 className="text-lg font-semibold text-slate-800 shrink-0">My Properties</h2>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0"
        >
          <span className="text-base leading-none">＋</span>
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {["all","available","sold","rented","pending"].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              filterStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "All" : STATUS_CONFIG[s]?.label}
            {s !== "all" && (
              <span className="ml-1.5 opacity-70">
                {posts.filter(p => p.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <div className="text-6xl mb-4 opacity-20">⌂</div>
          <p className="text-sm">No properties found</p>
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr))]">
          {filtered.map(post => (
            <PropertyCard
              key={post.id}
              post={post}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}