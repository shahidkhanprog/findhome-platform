// export default function SavedPosts() {
//   return (
//     <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//       <div className="text-6xl mb-4 opacity-20">♡</div>
//       <p className="text-sm font-medium">No saved posts yet</p>
//       <p className="text-xs mt-1 opacity-70">Properties you save will appear here</p>
//     </div>
//   );
// }

// pages/dashboard/SavedPosts.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdLocationOn,
  MdOpenInNew,
  MdSquareFoot,
  MdBed,
  MdBathtub,
  MdChevronLeft,
  MdChevronRight,
  MdImage,
  MdPerson,
  MdBookmarkRemove,
  MdSearchOff,
} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS & HELPERS  (mirrors MyProperties — keep in sync)
───────────────────────────────────────────────────────────────────────────── */
const TYPES_WITHOUT_ROOMS = new Set([
  "land", "plot", "agricultural", "farm", "industrial", "vacant",
]);
function showRooms(type = "") {
  return !TYPES_WITHOUT_ROOMS.has(type.toLowerCase().trim());
}

function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000)    return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

/* ─── Status config (read-only display — no change action here) ──── */
export const STATUS_CONFIG = {
  available: {
    label: "Available",
    bg: "bg-emerald-500",
    text: "text-white",
    dot: "bg-emerald-400",
    border: "border-emerald-100",
  },

  sold: {
    label: "Sold",
    bg: "bg-rose-500",
    text: "text-white",
    dot: "bg-rose-400",
    border: "border-rose-100",
  },

  rented: {
    label: "Rented",
    bg: "bg-indigo-500",
    text: "text-white",
    dot: "bg-indigo-400",
    border: "border-indigo-100",
  },

  pending: {
    label: "Pending",
    bg: "bg-amber-500",
    text: "text-white",
    dot: "bg-amber-400",
    border: "border-amber-100",
  },
};
const STATUS_KEYS = ["all", "available", "sold", "rented", "pending"];

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─── Listing type badge (For Sale / For Rent) ───────────────────── */
const LISTING_TYPE_MAP = {
  buy:     { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sale:    { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sell:    { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  forsale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  rent:    { label: "For Rent", bg: "bg-cyan-500",   text: "text-white" },
  forrent: { label: "For Rent", bg: "bg-cyan-500",   text: "text-white" },
};
function ListingTypeBadge({ type }) {
  if (!type) return null;
  const cfg = LISTING_TYPE_MAP[(type + "").toLowerCase().replace(/\s+/g, "")];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center ${cfg.bg} ${cfg.text} text-[10px] font-bold rounded-md px-2 py-0.5 whitespace-nowrap tracking-wide flex-shrink-0`}>
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CAROUSEL  (manual only — no auto-scroll, identical to MyProperties)
───────────────────────────────────────────────────────────────────────────── */
function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;
  const total     = hasImages ? images.length : 0;

  useEffect(() => { setCurrent(0); }, [images]);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent(c => (c + 1) % total);
  }, [total]);

  if (!hasImages) {
    return (
      <div className="relative h-44 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-violet-200/40" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-200/30" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <MdImage size={40} className="text-violet-300" />
          <span className="text-[11px] text-violet-400 font-medium">No photos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden bg-slate-100">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ width: `${total * 100}%`, transform: `translateX(calc(-${current} * (100% / ${total})))` }}
      >
        {images.map((url, i) => (
          <div key={i} className="relative flex-shrink-0 h-full" style={{ width: `calc(100% / ${total})` }}>
            <img src={url} alt={`${title} photo ${i + 1}`}
              className="w-full h-full object-cover" loading="lazy"
              onError={e => { e.currentTarget.style.display = "none"; }} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

      {total > 1 && (
        <>
          <button onClick={prev} aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10 shadow-md">
            <MdChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10 shadow-md">
            <MdChevronRight size={18} />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
          {/* <span className="absolute top-2.5 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
            {current + 1}/{total}
          </span> */}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UNSAVE CONFIRM MODAL
   Same visual pattern as DeleteModal in MyProperties — consistent UX.
───────────────────────────────────────────────────────────────────────────── */
function UnsaveModal({ post, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
          <MdFavoriteBorder size={24} className="text-rose-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Remove from Saved?</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            "<span className="text-slate-600 font-medium">{post?.title}</span>" will be removed from your saved list.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-60">
            {loading ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVED PROPERTY CARD
   
   Identical image overlay layout to MyProperties:
   ┌──────────────────────────────────┐
   │ [❤ saved — click to unsave]  [● Status] │
   │                                          │
   │ [PropCategory]          [For Sale/Rent]  │
   └──────────────────────────────────────────┘
   
   Body: Listed by · Title · City · Stats · Price
   Footer: [Details]  [Remove from Saved]
   
   Key difference vs MyProperties card:
   • No Edit, no Status change dropdown — this is read-only browsing.
   • Heart is always red/filled (it's a saved-posts list).
   • "Listed by" shows the property owner (not the current user).
   • "Remove" button triggers unsave confirm modal.
───────────────────────────────────────────────────────────────────────────── */
function SavedPropertyCard({ post, onDetails, onUnsave, unsaving }) {
  // Normalise fields — same logic as MyProperties
  const bedroom     = post.bedroom  ?? post.bedrooms  ?? 0;
  const bathroom    = post.bathroom ?? post.bathrooms ?? 0;
  const area        = post.postDetails?.size ?? post.area ?? 0;
  const property    = post.property ?? post.category ?? "property";
  const listingType = post.type ?? post.listingType ?? null;
  const images      = post.images ?? [];
  // Owner = who listed the property (populated by backend join)
  const ownerName   = post.user?.username ?? post.user?.name ?? post.ownerName ?? null;
  const canShowRooms = showRooms(property);
  const isRemoving  = unsaving === post.id;

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80 shadow-sm shadow-slate-100 border border-slate-100">

      {/* ── Image + overlays ──────────────────────────────────────── */}
      <div className="relative">
        <ImageCarousel images={images} title={post.title} />

        {/* Top-left: filled heart — always red since it IS saved.
            Clicking it triggers the unsave flow. */}
        <button
          onClick={() => onUnsave(post)}
          disabled={isRemoving}
          aria-label="Remove from saved"
          className={[
            "absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-md border",
            isRemoving
              ? "bg-rose-300 border-rose-200 cursor-wait scale-90"
              : "bg-rose-500 border-rose-400 hover:bg-rose-600 hover:scale-105 shadow-rose-200",
          ].join(" ")}
        >
          {isRemoving
            ? <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
            : <MdFavorite size={16} className="text-white heart-static" />
          }
        </button>

        {/* Top-right: status badge */}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={post.status} />
        </div>

        {/* Bottom: property category + listing type */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5">
          <span className="text-[10.5px] font-semibold capitalize bg-white/85 backdrop-blur-sm text-slate-700 rounded-lg px-2 py-0.5 border border-white/60 truncate max-w-[55%]">
            {property}
          </span>
          <ListingTypeBadge type={listingType} />
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="p-4 flex-1 flex flex-col gap-1.5">

        {/* Listed by (property owner) */}
        {ownerName && (
          <div className="inline-flex items-center gap-1 self-start bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 mb-0.5">
            <MdPerson size={11} className="text-slate-400 flex-shrink-0" />
            <span className="text-[10.5px] font-semibold text-slate-500 leading-none truncate max-w-[130px]">
              {ownerName}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">
          {post.title}
        </h3>

        {/* City */}
        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-violet-400 flex-shrink-0" />
          <span className="truncate">{post.city}</span>
        </div>

        {/* Key stats — conditional on property type */}
        {(area > 0 || (canShowRooms && (bedroom > 0 || bathroom > 0))) && (
          <div className="flex items-center gap-3 pt-0.5 flex-wrap">
            {area > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdSquareFoot size={13} className="text-slate-400" />
                {area.toLocaleString()} sqft
              </span>
            )}
            {canShowRooms && bedroom > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdBed size={13} className="text-slate-400" />
                {bedroom} bed
              </span>
            )}
            {canShowRooms && bathroom > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdBathtub size={13} className="text-slate-400" />
                {bathroom} bath
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <p className="text-base font-extrabold text-violet-600 mt-auto pt-1.5">
          {formatPrice(post.price)}
        </p>
      </div>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <div className="mx-4 border-t border-dashed border-slate-100" />

      {/* ── Actions ───────────────────────────────────────────────── */}
      <div className="p-3 flex items-center gap-2">

        {/* Details — primary CTA */}
        <button
          onClick={() => onDetails(post.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold bg-gray-900 text-white rounded-xl border-none cursor-pointer transition-all shadow-sm shadow-violet-200"
        >
          <MdOpenInNew size={14} />
          Details
        </button>

        {/* Remove from saved */}
        <button
          onClick={() => onUnsave(post)}
          disabled={isRemoving}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-semibold bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
        >
          <MdBookmarkRemove size={15} />
          <span className="hidden min-[380px]:inline">Unsave</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Skeleton Card ──────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm animate-pulse">
      <div className="h-44 bg-slate-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-slate-100 rounded-lg w-24" />
        <div className="h-4 bg-slate-100 rounded-lg w-3/4" />
        <div className="h-3 bg-slate-100 rounded-lg w-1/3" />
        <div className="flex gap-3">
          <div className="h-3 bg-slate-100 rounded-lg w-16" />
          <div className="h-3 bg-slate-100 rounded-lg w-12" />
        </div>
        <div className="h-5 bg-slate-100 rounded-lg w-1/2 mt-2" />
      </div>
      <div className="mx-4 border-t border-slate-100" />
      <div className="p-3 flex gap-2">
        <div className="flex-1 h-9 bg-slate-100 rounded-xl" />
        <div className="w-24 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS FILTER BAR  (status pills only — no scope toggle needed here)
───────────────────────────────────────────────────────────────────────────── */
function FilterBar({ posts, filter, setFilter }) {
  const count = (s) =>
    s === "all" ? posts.length : posts.filter(p => p.status === s).length;

  return (
    <div className="sp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
      {STATUS_KEYS.map(s => {
        const isActive = filter === s;
        const cfg      = STATUS_CONFIG[s];
        return (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={[
              "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border",
              isActive
                ? s === "all"
                  ? "bg-blue-500 text-white border-transparent shadow-md shadow-violet-200"
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
              {count(s)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVED POSTS PAGE
   
   API used:
   • GET  /saved-posts              — fetch all saved posts for current user
   • POST /saved-posts/:postId      — toggle (unsave when already saved)
   
   Each saved record shape expected:
   {
     id:     "saveRecordId",
     postId: "postId",
     post: {
       id, title, city, price, status, type, property,
       bedroom, bathroom, area, images, postDetails,
       user: { username }        ← property owner
     }
   }
───────────────────────────────────────────────────────────────────────────── */
export default function SavedPosts() {
  const navigate        = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // savedRecords = raw API response items { id, postId, post }
  const [savedRecords, setSavedRecords] = useState([]);
  const [filter, setFilter]             = useState("all");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");

  // Unsave flow
  const [unsaveTarget, setUnsaveTarget]   = useState(null);   // post object
  const [unsaveLoading, setUnsaveLoading] = useState(false);
  const [unsaving, setUnsaving]           = useState(null);   // postId being removed (for per-card spinner)

  const userId = currentUser?.userData?.id;

  /* ── Fetch saved posts ──────────────────────────────────────────── */
  useEffect(() => {
    if (!userId) return;
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const res  = await apiRequest.get("/saved-posts");
        // Normalise: accept array of save records or { savedPosts: [...] }
        const data = Array.isArray(res.data) ? res.data : res.data.savedPosts ?? [];
        setSavedRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load saved properties.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  /* ── Derived: flatten save records → posts, then filter by status ─ */
  const posts = savedRecords
    .map(r => r.post ?? r)           // unwrap nested post if present
    .filter(Boolean);

  const filtered = filter === "all"
    ? posts
    : posts.filter(p => p.status === filter);

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleDetails = (id) => navigate(`/dashboard/property/${id}`);

  // Card heart / "Unsave" button click → open confirm modal
  const handleUnsaveClick = (post) => setUnsaveTarget(post);

  // Modal confirmed → call toggle API, remove from local state
  const handleUnsaveConfirm = async () => {
    if (!unsaveTarget) return;
    setUnsaveLoading(true);
    setUnsaving(unsaveTarget.id);
    try {
      await apiRequest.post(`/saved-posts/${unsaveTarget.id}`);
      // Remove the save record whose post matches
      setSavedRecords(rs =>
        rs.filter(r => {
          const pid = r.post?.id ?? r.postId ?? r.id;
          return pid !== unsaveTarget.id;
        })
      );
      setUnsaveTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove saved property.");
    } finally {
      setUnsaveLoading(false);
      setUnsaving(null);
    }
  };

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div
      className="flex flex-col gap-4 min-h-0"
      style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .sp-pills::-webkit-scrollbar { display: none; }
        @keyframes heartPop {
          0%   { transform: scale(1);    }
          30%  { transform: scale(1.45); }
          60%  { transform: scale(0.88); }
          100% { transform: scale(1);    }
        }
        .heart-beat   { animation: heartPop 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        .heart-static { /* no animation — always saved */ }
      `}</style>

      {/* ── Unsave confirm modal ──────────────────────────────────── */}
      {unsaveTarget && (
        <UnsaveModal
          post={unsaveTarget}
          onConfirm={handleUnsaveConfirm}
          onCancel={() => setUnsaveTarget(null)}
          loading={unsaveLoading}
        />
      )}

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">
              Saved Properties
            </h2>
            {/* Saved count badge */}
            {!loading && posts.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-rose-50 border border-rose-100 text-rose-500 text-[10.5px] font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                <MdFavorite size={11} />
                {posts.length}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading
              ? "Loading…"
              : `${filtered.length} propert${filtered.length !== 1 ? "ies" : "y"} shown${posts.length !== filtered.length ? ` · ${posts.length} saved` : ""}`
            }
          </p>
        </div>

        {/* Browse more — takes user to the listings/search page */}
        <button
          onClick={() => navigate("/list")}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white border-none rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md shadow-violet-200 transition-all"
        >
          <MdFavoriteBorder size={16} />
          <span className="hidden sm:inline">Browse More</span>
          <span className="sm:hidden">Browse</span>
        </button>
      </div>

      {/* ── Status filter pills ───────────────────────────────────── */}
      {!loading && posts.length > 0 && (
        <FilterBar posts={posts} filter={filter} setFilter={setFilter} />
      )}

      {/* ── Error ────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <MdFavoriteBorder size={16} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs text-rose-500 underline mt-0.5">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Loading skeletons ────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Grid / Empty ─────────────────────────────────────────── */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-2xl gap-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
              {posts.length === 0
                ? <MdFavoriteBorder size={32} className="text-rose-300" />
                : <MdSearchOff     size={32} className="text-rose-300" />
              }
            </div>
            <div className="text-center px-6">
              <p className="text-sm font-bold text-slate-600">
                {posts.length === 0
                  ? "No saved properties yet"
                  : `No ${STATUS_CONFIG[filter]?.label ?? filter} properties saved`}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[240px] mx-auto">
                {posts.length === 0
                  ? "Browse listings and tap the heart icon to save properties you like"
                  : "Try a different filter to see your other saved properties"}
              </p>
            </div>
            {posts.length === 0 && (
              <button
                onClick={() => navigate("/list")}
                className="mt-1 inline-flex items-center gap-1.5  bg-gray-900 text-white border-none rounded-xl px-5 py-2.5 text-[13px] font-semibold cursor-pointer shadow-md shadow-violet-200 transition-all"
              >
                <MdFavoriteBorder size={16} />
                Browse Listings
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(post => (
              <SavedPropertyCard
                key={post.id}
                post={post}
                onDetails={handleDetails}
                onUnsave={handleUnsaveClick}
                unsaving={unsaving}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}