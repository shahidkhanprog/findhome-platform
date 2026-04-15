// pages/dashboard/MyProperties.jsx
import { useState, useEffect, useContext, useCallback } from "react";
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
  MdChevronLeft,
  MdChevronRight,
  MdImage,
  MdPerson,
  MdAdminPanelSettings,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

/* ─────────────────────────────────────────────────────────────────────────────
   PROPERTY TYPE CONFIG
   Defines which stat chips are shown per type.
   land / plot / agricultural → area only
   apartment / house / villa / commercial → all three
   Extend as needed.
───────────────────────────────────────────────────────────────────────────── */
const TYPES_WITHOUT_ROOMS = new Set([
  "land",
  "plot",
  "agricultural",
  "farm",
  "industrial",
  "vacant",
]);

function showRooms(type = "") {
  return !TYPES_WITHOUT_ROOMS.has(type.toLowerCase().trim());
}

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

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE BUTTON (Heart)
   
   Behaviour:
   • On mount: checks /api/saved-posts/check/:postId for initial saved state.
   • On click: calls POST /api/saved-posts/:postId (toggle) then flips local state.
   • Optimistic UI — state flips instantly; reverts on API error.
   • While the toggle request is in-flight the button is disabled (prevents
     double-clicks) but the heart already shows the new state.
   • Admins see the heart too — they can also bookmark properties.
   
   CSS note: the `heart-beat` keyframe is injected once via the <style> tag
   already present in MyProperties — we add it there below.
───────────────────────────────────────────────────────────────────────────── */
function SaveButton({ postId }) {
  const [saved, setSaved]       = useState(false);
  const [checking, setChecking] = useState(true);   // true while initial check loads
  const [toggling, setToggling] = useState(false);  // true during toggle request

  // ── Initial check ────────────────────────────────────────────────
  useEffect(() => {
    if (!postId) return;
    let cancelled = false;

    const check = async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${postId}`);
        if (!cancelled) setSaved(res.data?.saved ?? false);
      } catch {
        // silently ignore — default to unsaved
      } finally {
        if (!cancelled) setChecking(false);
      }
    };

    check();
    return () => { cancelled = true; };
  }, [postId]);

  // ── Toggle handler ───────────────────────────────────────────────
  const handleToggle = async (e) => {
    e.stopPropagation(); // don't bubble to card / carousel clicks
    if (toggling || checking) return;

    const prev = saved;
    setSaved(!prev);      // optimistic flip
    setToggling(true);

    try {
      const res = await apiRequest.post(`/saved-posts/${postId}`);
      // Sync with server truth in case it differs
      setSaved(res.data?.saved ?? !prev);
    } catch (err) {
      console.error("Save toggle failed:", err);
      setSaved(prev);     // revert on error
    } finally {
      setToggling(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={checking || toggling}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={[
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
        "backdrop-blur-sm shadow-md border",
        // While checking we show a muted neutral state
        checking
          ? "bg-white/60 border-white/40 cursor-wait"
          : saved
            ? "bg-rose-500 border-rose-400 hover:bg-rose-600 shadow-rose-200"
            : "bg-white/80 border-white/60 hover:bg-white hover:scale-110",
        toggling ? "scale-90" : "",
      ].join(" ")}
    >
      {checking ? (
        // Tiny pulse ring while loading initial state
        <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
      ) : saved ? (
        <MdFavorite
          size={16}
          className={`text-white transition-transform duration-150 ${toggling ? "scale-75" : "heart-beat"}`}
        />
      ) : (
        <MdFavoriteBorder size={16} className="text-slate-500" />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CAROUSEL
   • Auto-scroll REMOVED — user controls only via arrows / dots.
   • Arrows are always visible when total > 1.
───────────────────────────────────────────────────────────────────────────── */
function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);

  const hasImages = images && images.length > 0;
  const total     = hasImages ? images.length : 0;

  // Reset to first slide whenever the images prop changes (card re-use)
  useEffect(() => { setCurrent(0); }, [images]);

  const prev = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  const next = useCallback((e) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % total);
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
      {/* ── Slides ── */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          width: `${total * 100}%`,
          transform: `translateX(calc(-${current} * (100% / ${total})))`,
        }}
      >
        {images.map((url, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 h-full"
            style={{ width: `calc(100% / ${total})` }}
          >
            <img
              src={url}
              alt={`${title} photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

      {/* ── Navigation — only rendered when multiple images exist ── */}
      {total > 1 && (
        <>
          {/* Prev arrow */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 shadow-md"
            aria-label="Previous image"
          >
            <MdChevronLeft size={18} />
          </button>

          {/* Next arrow */}
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10 shadow-md"
            aria-label="Next image"
          >
            <MdChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Counter badge */}
          <span className="absolute top-2.5 left-3 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm z-10">
            {current + 1}/{total}
          </span>
        </>
      )}
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
function DeleteModal({ post, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
          <MdDeleteOutline size={24} className="text-rose-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Delete Property?</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            "<span className="text-slate-600 font-medium">{post?.title}</span>" will be permanently removed. This cannot be undone.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROPERTY CARD
   • isAdmin prop  →  renders "Added by" attribution chip
   • showRooms()   →  conditionally renders bed / bath based on property type
───────────────────────────────────────────────────────────────────────────── */
function PropertyCard({ post, onEdit, onDelete, onStatusChange, onDetails, statusUpdating, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Normalise field names
  const bedroom  = post.bedroom  ?? post.bedrooms  ?? 0;
  const bathroom = post.bathroom ?? post.bathrooms ?? 0;
  const area     = post.postDetails?.size ?? post.area ?? 0;
  const type     = post.property ?? post.type ?? "property";
  const images   = post.images ?? [];

  // Owner info (populated when admin fetches all posts — backend should include user relation)
  const ownerName = post.user?.username ?? post.user?.name ?? post.ownerName ?? null;

  const canShowRooms = showRooms(type);

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80 shadow-sm shadow-slate-100 border border-slate-100">

      {/* ── Image Carousel ── */}
      <div className="relative">
        <ImageCarousel images={images} title={post.title} />
        {/* Status badge — top right */}
        <div className="absolute bottom-3 right-3 z-10">
          <StatusBadge status={post.status} />
        </div>
        {/* Save / heart button — top left */}
        <div className="absolute top-3 right-3 z-10">
          <SaveButton postId={post.id} />
        </div>
        {/* Type chip — bottom left */}
        <span className="absolute bottom-3 left-3 text-[10.5px] font-semibold capitalize bg-white/80 backdrop-blur-sm text-slate-600 rounded-lg px-2 py-0.5 border border-white/60 z-10">
          {type}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="p-4 flex-1 flex flex-col gap-2">

        {/* Admin: "Added by" attribution */}
        {isAdmin && ownerName && (
          <div className="inline-flex items-center gap-1.5 self-start bg-violet-50 border border-violet-100 rounded-lg px-2 py-0.5">
            <MdPerson size={11} className="text-violet-500 flex-shrink-0" />
            <span className="text-[10.5px] font-semibold text-violet-600 leading-none">
              {ownerName}
            </span>
          </div>
        )}

        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">
          {post.title}
        </h3>

        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-violet-400 flex-shrink-0" />
          <span>{post.city}</span>
        </div>

        {/* Stats — conditional on type */}
        <div className="flex items-center gap-3 pt-0.5 flex-wrap">
          {area > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdSquareFoot size={13} className="text-slate-400" />
              <span>{area.toLocaleString()} sqft</span>
            </div>
          )}
          {canShowRooms && bedroom > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdBed size={13} className="text-slate-400" />
              <span>{bedroom} bed</span>
            </div>
          )}
          {canShowRooms && bathroom > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <MdBathtub size={13} className="text-slate-400" />
              <span>{bathroom} bath</span>
            </div>
          )}
          {/* Edge case: type is land-like AND no area — show a subtle label */}
          {!canShowRooms && area === 0 && (
            <span className="text-[11px] text-slate-400 italic">No dimensions listed</span>
          )}
        </div>

        <p className="text-base font-extrabold text-violet-600 mt-auto pt-1">
          {formatPrice(post.price)}
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-dashed border-slate-100" />

      {/* ── Actions ── */}
      <div className="p-3 flex items-center gap-2">

        {/* Details */}
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
            disabled={statusUpdating === post.id}
            className="flex items-center gap-0.5 py-2 px-2.5 text-[12px] font-semibold bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
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
          onClick={() => onDelete?.(post)}
          className="flex items-center justify-center py-2 px-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-xl cursor-pointer transition-colors"
        >
          <MdDeleteOutline size={16} />
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
        <div className="w-16 h-9 bg-slate-100 rounded-xl" />
        <div className="w-10 h-9 bg-slate-100 rounded-xl" />
        <div className="w-10 h-9 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MY PROPERTIES PAGE
   
   Role logic:
   ─ ADMIN  → GET /posts          (all properties; backend must include user relation)
   ─ USER   → GET /posts/user/:id (own properties only)
   
   The `isAdmin` flag is passed down to PropertyCard so it can render
   the "Added by" attribution chip.
───────────────────────────────────────────────────────────────────────────── */
export default function MyProperties() {
  const navigate        = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts]   = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // ── Derive role once ──────────────────────────────────────────────
  const userId  = currentUser?.userData?.id;
  const role    = currentUser?.userData?.role ?? currentUser?.role ?? "user";
  const isAdmin = role === "ADMIN" || role === "admin";

  /* ── Fetch posts based on role ───────────────────────────────────── */
  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        // Admin gets every post (with user relation populated by backend).
        // Regular user gets only their own posts.
        const endpoint = isAdmin ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);

        // Normalise: accept array directly or { posts: [...] } wrapper
        const data = Array.isArray(res.data) ? res.data : res.data.posts ?? [];
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.response?.data?.message || "Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, isAdmin]);

  /* ── Filter ──────────────────────────────────────────────────────── */
  const filtered = filter === "all" ? posts : posts.filter(p => p.status === filter);

  /* ── Handlers ────────────────────────────────────────────────────── */
  const handleEdit   = (post) => navigate("/dashboard/addProperty", { state: { post } });
  const handleDetails = (id)  => navigate(`/dashboard/property/${id}`);

  const handleDeleteClick   = (post) => setDeleteTarget(post);
  const handleDeleteCancel  = ()     => setDeleteTarget(null);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/posts/${deleteTarget.id}`);
      setPosts(ps => ps.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Failed to delete property.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setStatusUpdating(id);
    try {
      await apiRequest.put(`/posts/${id}`, { status });
      setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(null);
    }
  };

  /* ── Page title text ─────────────────────────────────────────────── */
  const pageTitle    = isAdmin ? "All Properties" : "My Properties";
  const emptyMessage = isAdmin ? "No listings found" : "No properties yet";
  const emptySubtext = isAdmin
    ? "No listings have been added to the platform yet"
    : "Add your first property listing to get started";

  /* ─────────────────────────────────────────────────────────────────── */
  return (
    <div
      className="flex flex-col gap-5"
      style={{ overflowY: "scroll", scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .mp-pills::-webkit-scrollbar { display: none; }
        .mp-root::-webkit-scrollbar  { display: none; }

        /* Heart pop animation — plays once when the heart turns red */
        @keyframes heartPop {
          0%   { transform: scale(1);    }
          30%  { transform: scale(1.45); }
          60%  { transform: scale(0.88); }
          100% { transform: scale(1);    }
        }
        .heart-beat {
          animation: heartPop 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>

      {/* ── Delete confirmation modal ─────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleteLoading}
        />
      )}

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">{pageTitle}</h2>
            {/* Admin indicator badge */}
            {isAdmin && (
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10.5px] font-bold rounded-full px-2 py-0.5">
                <MdAdminPanelSettings size={12} />
                Admin View
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading
              ? "Loading…"
              : `${posts.length} listing${posts.length !== 1 ? "s" : ""}${isAdmin ? " across all users" : " total"}`
            }
          </p>
        </div>

        {/* Only non-admins (or admins if desired) can add a property */}
        <button
          onClick={() => navigate("/dashboard/addProperty")}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md shadow-violet-200 transition-all"
        >
          <MdAddHome size={17} />
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Filter pills ─────────────────────────────────────────── */}
      {!loading && posts.length > 0 && (
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
      )}

      {/* ── Error state ──────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
            <MdDeleteOutline size={16} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-rose-500 underline mt-0.5"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Loading skeletons ─────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* ── Grid or empty state ──────────────────────────────────── */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
              <MdOutlineHome size={32} className="text-violet-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-600">
                {filter === "all"
                  ? emptyMessage
                  : `No ${STATUS_CONFIG[filter]?.label ?? filter} properties`}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {filter === "all"
                  ? emptySubtext
                  : "Try a different filter or add a new listing"}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={() => navigate("/dashboard/addProperty")}
                className="mt-1 inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none rounded-xl px-5 py-2.5 text-[13px] font-semibold cursor-pointer shadow-md shadow-violet-200 transition-all"
              >
                <MdAddHome size={16} />
                Add Property
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(post => (
              <PropertyCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                onDetails={handleDetails}
                statusUpdating={statusUpdating}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}