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
  MdPeople,
  MdPersonOutline,
} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS & HELPERS
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

export function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

const PAGE_SIZE_OPTIONS = [6, 12, 18, 24];

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS CONFIG (PROFESSIONAL REAL ESTATE COLOR SYSTEM)
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   LISTING TYPE CONFIG
───────────────────────────────────────────────────────────────────────────── */
const LISTING_TYPE_MAP = {
  buy: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sell: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  forsale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  rent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
  forrent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
};

function ListingTypeBadge({ type }) {
  if (!type) return null;
  const cfg = LISTING_TYPE_MAP[(type + "").toLowerCase().replace(/\s+/g, "")];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center ${cfg.bg} ${cfg.text} text-[10px] font-bold rounded-md px-2 py-0.5 whitespace-nowrap tracking-wide flex-shrink-0`}
    >
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE BUTTON (Heart)
───────────────────────────────────────────────────────────────────────────── */
function SaveButton({ postId }) {
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${postId}`);
        if (!cancelled) setSaved(res.data?.saved ?? false);
      } catch {
        /* default: unsaved */
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [postId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (toggling || checking) return;
    const prev = saved;
    setSaved(!prev);
    setToggling(true);
    try {
      const res = await apiRequest.post(`/saved-posts/${postId}`);
      setSaved(res.data?.saved ?? !prev);
    } catch {
      setSaved(prev);
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
        "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-md border",
        checking
          ? "bg-white/60 border-white/40 cursor-wait"
          : saved
            ? "bg-rose-500 border-rose-400 hover:bg-rose-600 shadow-rose-200"
            : "bg-white/80 border-white/60 hover:bg-white hover:scale-110",
        toggling ? "scale-90" : "",
      ].join(" ")}
    >
      {checking ? (
        <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" />
      ) : saved ? (
        <MdFavorite
          size={16}
          className={`text-white ${toggling ? "" : "heart-beat"}`}
        />
      ) : (
        <MdFavoriteBorder size={16} className="text-slate-500" />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   IMAGE CAROUSEL
───────────────────────────────────────────────────────────────────────────── */
function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : 0;

  useEffect(() => {
    setCurrent(0);
  }, [images]);

  const prev = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c - 1 + total) % total);
    },
    [total],
  );

  const next = useCallback(
    (e) => {
      e.stopPropagation();
      setCurrent((c) => (c + 1) % total);
    },
    [total],
  );

  if (!hasImages) {
    return (
      <div className="relative h-44 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-violet-200/40" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-200/30" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <MdImage size={40} className="text-violet-300" />
          <span className="text-[11px] text-violet-400 font-medium">
            No photos
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden bg-slate-100">
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
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10 shadow-md"
          >
            <MdChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center transition-all backdrop-blur-sm z-10 shadow-md"
          >
            <MdChevronRight size={18} />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Delete Confirm Modal ───────────────────────────────────────── */
function DeleteModal({ post, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
          <MdDeleteOutline size={24} className="text-rose-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Delete Property?</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            "<span className="text-slate-600 font-medium">{post?.title}</span>"
            will be permanently removed. This cannot be undone.
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
───────────────────────────────────────────────────────────────────────────── */
function PropertyCard({
  post,
  onEdit,
  onDelete,
  onStatusChange,
  onDetails,
  statusUpdating,
  isAdmin,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const bedroom = post.bedroom ?? post.bedrooms ?? 0;
  const bathroom = post.bathroom ?? post.bathrooms ?? 0;
  const area = post.postDetails?.size ?? post.area ?? 0;
  const property = post.property ?? post.category ?? "property";
  const listingType = post.type ?? post.listingType ?? null;
  const images = post.images ?? [];
  const ownerName =
    post.user?.username ?? post.user?.name ?? post.ownerName ?? null;
  const canShowRooms = showRooms(property);

  return (
    <div className="bg-slate-200/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-inner shadow-black/30 border border-slate-400">
      <div className="relative">
        <ImageCarousel images={images} title={post.title} />
        <div className="absolute top-3 left-3 z-10">
          <SaveButton postId={post.id} />
        </div>
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={post.status} />
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5">
          <span className="text-[10.5px] font-semibold capitalize bg-white/85 backdrop-blur-sm text-slate-700 rounded-lg px-2 py-0.5 border border-white/60 truncate max-w-[55%]">
            {property}
          </span>
          <ListingTypeBadge type={listingType} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-1.5">
        {isAdmin && ownerName && (
          <div className="inline-flex items-center gap-1 self-start bg-violet-50 border border-violet-100 rounded-lg px-2 py-0.5 mb-0.5">
            <MdPerson size={11} className="text-blue-500 flex-shrink-0" />
            <span className="text-[10.5px] text-blue-500 font-bold leading-none truncate max-w-[130px]">
              {ownerName}
            </span>
          </div>
        )}
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">{post.city}</span>
        </div>
        {(area > 0 || (canShowRooms && (bedroom > 0 || bathroom > 0))) && (
          <div className="flex items-center gap-3 pt-0.5 flex-wrap border-t border-gray-200 mt-2">
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
        <p className="text-base font-extrabold text-blue-500 mt-auto pt-1.5 border-t border-gray-200">
          {Number(post.price).toLocaleString('en-US', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
          })}
        </p>
      </div>

      <div className="mx-4 border-t border-dashed border-slate-200" />

      <div className="p-3 flex items-center gap-2">
        <button
          onClick={() => onDetails?.(post.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-bold bg-gray-900 text-white rounded-xl border-none cursor-pointer transition-all shadow-sm shadow-violet-200"
        >
          <MdOpenInNew size={14} />
          {/* Details */}
          Preview
        </button>
        <button
          onClick={() => onEdit?.(post)}
          className="flex items-center justify-center gap-1 py-2 px-3 text-[12px] font-semibold bg-violet-50 text-violet-600rounded-xl border-none cursor-pointer transition-colors"
        >
          <MdEdit size={14} />
          Edit
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            disabled={statusUpdating === post.id}
            className="flex items-center gap-0.5 py-2 px-2.5 text-[12px] font-semibold bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
          >
            <MdKeyboardArrowDown
              size={16}
              className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute bottom-[calc(100%+6px)] right-0 z-50 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200 overflow-hidden min-w-[136px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-3 pt-2.5 pb-1">
                  Change Status
                </p>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onStatusChange?.(post.id, key);
                      setMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium text-slate-700 border-none cursor-pointer transition-colors ${post.status === key ? "bg-violet-50" : "bg-white hover:bg-slate-50"}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`}
                    />
                    {cfg.label}
                    {post.status === key && (
                      <MdCheck size={13} className="ml-auto text-violet-600" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => onDelete?.(post)}
          className="flex items-center justify-center py-2 px-2.5 bg-gray-300 text-rose-500 border border-gray-600 rounded-xl cursor-pointer transition-colors"
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
   FILTER BAR
───────────────────────────────────────────────────────────────────────────── */
function FilterBar({
  allPosts,
  filter,
  setFilter,
  isAdmin,
  adminScope,
  setAdminScope,
  userId,
}) {
  const scopedPosts =
    isAdmin && adminScope === "mine"
      ? allPosts.filter((p) => p.userId === userId || p.user?.id === userId)
      : allPosts;

  const statusCount = (s) =>
    s === "all"
      ? scopedPosts.length
      : scopedPosts.filter((p) => p.status === s).length;

  return (
    <div className="flex flex-col gap-2.5">
      {isAdmin && (
        <div className="mp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
          <span className="flex-shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            View
          </span>
          <button
            onClick={() => {
              setAdminScope("all");
              setFilter("all");
            }}
            className={[
              "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border",
              adminScope === "all"
                ? "bg-blue-500 text-white border-transparent shadow-sm"
                : "bg-white text-slate-500 border-slate-200",
            ].join(" ")}
          >
            <MdPeople size={13} />
            All Users
            <span
              className={[
                "text-[10px] font-bold rounded-full px-1.5 py-px leading-none min-w-[18px] text-center",
                adminScope === "all"
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {allPosts.length}
            </span>
          </button>
          <button
            onClick={() => {
              setAdminScope("mine");
              setFilter("all");
            }}
            className={[
              "flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer border",
              adminScope === "mine"
                ? "bg-blue-500 text-white border-transparent shadow-sm"
                : "bg-white text-slate-500 border-slate-200",
            ].join(" ")}
          >
            <MdPersonOutline size={13} />
            Mine Only
            <span
              className={[
                "text-[10px] font-bold rounded-full px-1.5 py-px leading-none min-w-[18px] text-center",
                adminScope === "mine"
                  ? "bg-white/25 text-white"
                  : "bg-slate-100 text-slate-400",
              ].join(" ")}
            >
              {
                allPosts.filter(
                  (p) => p.userId === userId || p.user?.id === userId,
                ).length
              }
            </span>
          </button>
        </div>
      )}

      {allPosts.length > 0 && (
        <div className="mp-pills flex items-center gap-2 overflow-x-auto pb-0.5">
          {STATUS_KEYS.map((s) => {
            const isActive = filter === s;
            const cfg = STATUS_CONFIG[s];
            const count = statusCount(s);
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
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300",
                ].join(" ")}
              >
                {s === "all" ? "All" : cfg.label}
                <span
                  className={[
                    "text-[10px] font-bold rounded-full px-1.5 py-px leading-none min-w-[18px] text-center",
                    isActive
                      ? s === "all"
                        ? "bg-white/25 text-white"
                        : `${cfg.dot} text-white`
                      : "bg-slate-100 text-slate-400",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGINATION BAR
───────────────────────────────────────────────────────────────────────────── */
function PaginationBar({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
}) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to show (max 5 visible)
  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    // FIX: removed duplicate border-t, py-3, px-1, justify-between from the inner left div
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mt-2">
      {/* Left: Items info + page size selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Results Counter */}
        <div className="flex items-center text-sm text-slate-600">
          <span>
            Showing{" "}
            <span className="font-semibold text-slate-900">{startItem}</span>
            <span className="mx-1 text-slate-400">–</span>
            <span className="font-semibold text-slate-900">{endItem}</span>
            <span className="ml-1 text-slate-500 text-xs uppercase tracking-wider">
              of
            </span>
            <span className="ml-1 font-semibold text-slate-900">
              {totalItems}
            </span>
          </span>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="page-size"
            className="text-xs font-semibold text-slate-500 uppercase tracking-tight"
          >
            Items per page
          </label>

          <div className="relative group">
            <select
              id="page-size"
              name="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 block w-full pl-3 pr-8 py-1.5 transition-all cursor-pointer hover:border-slate-300"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {/* Custom Chevron */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Prev / page numbers / Next */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <MdChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {/* First page if not in range */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="text-slate-400 text-[12px] px-0.5">…</span>
              )}
            </>
          )}

          {pageNumbers.map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={[
                "w-8 h-8 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer",
                num === currentPage
                  ? "bg-gray-900 text-white border-transparent shadow-sm shadow-violet-200"
                  : "bg-white text-slate-600 border-slate-200",
              ].join(" ")}
            >
              {num}
            </button>
          ))}

          {/* Last page if not in range */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="text-slate-400 text-[12px] px-0.5">…</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MY PROPERTIES PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function MyProperties() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [adminScope, setAdminScope] = useState("all");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Pagination state
  // FIX 1: Changed default pageSize from 10 to 6 to match PAGE_SIZE_OPTIONS[0]
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const userId = currentUser?.userData?.id;
  const role = currentUser?.userData?.role ?? currentUser?.role ?? "user";
  const isAdmin = role === "ADMIN" || role === "admin";

  /* ── Fetch ──────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!userId) return;
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = isAdmin ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data.posts ?? []);
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, isAdmin]);

  /* ── Reset page when filter/scope/pageSize changes ─────────────── */
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, adminScope, pageSize]);

  /* ── Derived: scope → status → paginate ────────────────────────── */
  const scopedPosts =
    isAdmin && adminScope === "mine"
      ? posts.filter((p) => p.userId === userId || p.user?.id === userId)
      : posts;

  const filtered =
    filter === "all"
      ? scopedPosts
      : scopedPosts.filter((p) => p.status === filter);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleEdit = (post) =>
    navigate(`/dashboard/edit/${post.id}`);

  const handleDetails = (id) => navigate(`/dashboard/property/${id}`);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/posts/${deleteTarget.id}`);
      setPosts((ps) => ps.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setStatusUpdating(id);
    try {
      await apiRequest.put(`/posts/${id}`, { status });
      setPosts((ps) => ps.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handlePageChange = (page) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
    // Scroll to top of list smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /* ── Empty state copy ───────────────────────────────────────────── */
  const emptyTitle =
    isAdmin && adminScope === "mine"
      ? "You have no listings"
      : isAdmin
        ? "No listings on platform"
        : "No properties yet";

  const emptySub =
    filter !== "all"
      ? `No ${STATUS_CONFIG[filter]?.label ?? filter} properties in this view`
      : isAdmin && adminScope === "mine"
        ? "You haven't added any properties yet"
        : isAdmin
          ? "No listings have been created on the platform"
          : "Add your first property listing to get started";

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <div
      className="flex flex-col gap-4 min-h-0"
      style={{
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .mp-pills::-webkit-scrollbar { display: none; }
        @keyframes heartPop {
          0%   { transform: scale(1);    }
          30%  { transform: scale(1.45); }
          60%  { transform: scale(0.88); }
          100% { transform: scale(1);    }
        }
        .heart-beat { animation: heartPop 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both; }
      `}</style>

      {/* ── Delete modal ─────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">
              {isAdmin ? "Properties" : "My Properties"}
            </h2>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10.5px] font-bold rounded-full px-2 py-0.5 flex-shrink-0">
                <MdAdminPanelSettings size={12} />
                Admin
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {loading
              ? "Loading…"
              : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""} shown${posts.length !== filtered.length ? ` · ${posts.length} total` : ""}`}
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/addProperty")}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white border-none rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md shadow-violet-200 transition-all"
        >
          <MdAddHome size={17} />
          <span className="hidden sm:inline">Add Property</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* ── Filter bar ───────────────────────────────────────────── */}
      {!loading && (
        <FilterBar
          allPosts={posts}
          filter={filter}
          setFilter={setFilter}
          isAdmin={isAdmin}
          adminScope={adminScope}
          setAdminScope={setAdminScope}
          userId={userId}
        />
      )}

      {/* ── Error ────────────────────────────────────────────────── */}
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

      {/* ── Loading skeletons ────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* ── Grid / Empty ─────────────────────────────────────────── */}
      {!loading &&
        !error &&
        (filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-2xl gap-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center">
              <MdOutlineHome size={32} className="text-violet-300" />
            </div>
            <div className="text-center px-6">
              <p className="text-sm font-bold text-slate-600">{emptyTitle}</p>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[240px] mx-auto">
                {emptySub}
              </p>
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
          <>
            {/* Cards grid — only the current page slice */}
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((post) => (
                <PropertyCard
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                  onStatusChange={handleStatusChange}
                  onDetails={handleDetails}
                  statusUpdating={statusUpdating}
                  isAdmin={isAdmin}
                />
              ))}
            </div>

            {/* Pagination bar */}
            <PaginationBar
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              totalItems={totalItems}
            />
          </>
        ))}
    </div>
  );
}