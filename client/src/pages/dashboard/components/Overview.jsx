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
  MdClose,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function formatPrice(n) {
  if (!n && n !== 0) return "—";
  if (n >= 10_000_000) return `PKR ${(n / 10_000_000).toFixed(1)}cr`;
  if (n >= 100_000) return `PKR ${(n / 100_000).toFixed(0)}L`;
  return `PKR ${Number(n).toLocaleString()}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

const STATUS_CONFIG = {
  available: {
    label: "Available",
    dot: "bg-emerald-400",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  sold: {
    label: "Sold",
    dot: "bg-slate-400",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
  rented: {
    label: "Rented",
    dot: "bg-amber-400",
    text: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  pending: {
    label: "Pending",
    dot: "bg-blue-400",
    text: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
};

const STAT_STYLES = {
  violet: {
    value: "text-violet-600",
    iconBg: "bg-violet-100",
    iconText: "text-violet-500",
  },
  emerald: {
    value: "text-emerald-600",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-500",
  },
  slate: {
    value: "text-slate-600",
    iconBg: "bg-slate-100",
    iconText: "text-slate-500",
  },
  amber: {
    value: "text-amber-500",
    iconBg: "bg-amber-100",
    iconText: "text-amber-500",
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] ?? STATUS_CONFIG.available;
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} border ${s.border} text-[11px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap flex-shrink-0`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AVATAR
───────────────────────────────────────────────────────────────────────────── */
function Avatar({
  src,
  name = "",
  className = "w-12 h-12",
  textClass = "text-lg",
}) {
  const [imgError, setImgError] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100 shadow-sm`}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none shadow-sm`}
    >
      {letter}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────────────────────────────────────── */
function StatCard({ label, value, colorKey, Icon, loading, isAdminView }) {
  const s = STAT_STYLES[colorKey];
  return (
    <div
      className={`bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:shadow-lg transition-all duration-200
      ${isAdminView ? "border-violet-100 shadow-sm shadow-violet-50/80 hover:shadow-violet-100" : "border-slate-100 hover:shadow-slate-100"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium leading-tight">
          {label}
        </span>
        <span
          className={`w-8 h-8 rounded-[9px] flex items-center justify-center ${s.iconBg} ${s.iconText}`}
        >
          <Icon size={18} />
        </span>
      </div>
      {loading ? (
        <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse" />
      ) : (
        <span className={`text-3xl font-extrabold leading-none ${s.value}`}>
          {value}
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKELETON ROW
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   USER PROFILE DIALOG
   Opens when admin clicks a UserChip. Fetches the full user record (including
   email) by ID so the dialog always shows up-to-date information without
   navigating away from the current page.
───────────────────────────────────────────────────────────────────────────── */
function UserProfileDialog({ user: initialUser, onClose }) {
  if (!initialUser) return null;

  // Full user data — starts with what we already have, enriched after fetch
  const [fullUser, setFullUser] = useState(initialUser);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Fetch the complete user record as soon as the dialog mounts
  useEffect(() => {
    if (!initialUser?.id) return;
    const load = async () => {
      setFetchLoading(true);
      setFetchError("");
      try {
        const res = await apiRequest.get(`/users/${initialUser.id}`);
        setFullUser(res.data);
      } catch {
        setFetchError("Could not load user details.");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [initialUser?.id]);

  // Close when clicking the backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeInScale_0.18s_ease-out]">
        {/* Decorative header strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />

        {/* Close button */}
        <div className="flex justify-end px-4 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close dialog"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-3 px-6 pb-7 pt-1">
          {/* Avatar */}
          <Avatar
            src={fullUser.avatar}
            name={fullUser.username}
            className="w-20 h-20"
            textClass="text-3xl"
          />

          {/* Username + role */}
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">
              {fullUser.username}
            </p>
            <span className="inline-flex items-center gap-1 mt-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-violet-200">
              <MdPerson size={10} />
              {fullUser.role ?? "USER"}
            </span>
          </div>

          {/* Email — shown once fetched; loading skeleton while waiting */}
          {fetchLoading ? (
            <div className="h-4 w-44 bg-slate-100 rounded-full animate-pulse mt-1" />
          ) : fetchError ? (
            <p className="text-[11px] text-rose-400 mt-1">{fetchError}</p>
          ) : fullUser.email ? (
            <a
              href={`mailto:${fullUser.email}`}
              className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-violet-600 transition-colors mt-1 break-all text-center"
            >
              <MdEmail size={15} className="text-violet-400 flex-shrink-0" />
              {fullUser.email}
            </a>
          ) : (
            <p className="text-[12px] text-slate-400 mt-1 flex items-center gap-1.5">
              <MdEmail size={13} className="text-slate-300" />
              No email on record
            </p>
          )}

          {/* Divider */}
          <div className="w-full border-t border-slate-100 my-1" />

          {/* Close action */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>

      {/* Keyframe injected once via a style tag */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   USER CHIP
   Clicking opens the profile dialog instead of navigating away.
───────────────────────────────────────────────────────────────────────────── */
function UserChip({ username, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-1.5 bg-white border border-violet-200 text-violet-700 text-[10px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap hover:bg-violet-50 hover:border-violet-400 hover:shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0 w-[100%]"
      title={`View ${username}'s profile`}
    >
      <MdPerson size={11} />
      {username}
    </button>
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

  // Generate up to 5 visible page numbers centred around the current page
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
    /*
      Layout strategy:
      • Mobile  → two stacked rows:
          Row 1: "Showing X–Y of Z"  |  "Per page [5 ▾]"  (space-between, single line)
          Row 2: page buttons centred
      • sm+     → one row, left cluster | right page buttons
    */
    <div className="flex flex-col gap-2.5 bg-white border border-slate-200 rounded-2xl px-3 py-3 mt-2 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:gap-3">
      {/* ── Row 1: counter + page-size selector ── */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Results counter */}
        <p className="text-[12px] sm:text-sm text-slate-600 whitespace-nowrap leading-none">
          Showing{" "}
          <span className="font-semibold text-slate-900">{startItem}</span>
          <span className="mx-1 text-slate-400">–</span>
          <span className="font-semibold text-slate-900">{endItem}</span>{" "}
          <span className="text-slate-400 text-[10px] uppercase tracking-wider">
            of
          </span>{" "}
          <span className="font-semibold text-slate-900">{totalItems}</span>
        </p>

        {/* Page-size selector */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          {/* Label: shortened on mobile, full on sm+ */}
          <label
            htmlFor="page-size"
            className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-tight whitespace-nowrap select-none"
          >
            <span className="sm:hidden">Per page</span>
            <span className="hidden sm:inline">Items per page</span>
          </label>
          <div className="relative">
            <select
              id="page-size"
              name="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-[12px] sm:text-sm rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 pl-2.5 pr-6 py-1.5 transition-all cursor-pointer hover:border-slate-300"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Prev / page numbers / Next ── */}
      <div className="flex items-center justify-center gap-1 sm:justify-end">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <MdChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1 mx-1">
          {/* First page + ellipsis when window doesn't start at 1 */}
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
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-sm shadow-violet-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600",
              ].join(" ")}
            >
              {num}
            </button>
          ))}

          {/* Last page + ellipsis when window doesn't end at totalPages */}
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
          className="flex items-center gap-0.5 sm:gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   OVERVIEW PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function Overview() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const user = currentUser?.userData ?? {};
  const userId = user?.id;
  const isAdmin = user?.role === "ADMIN";

  // Admin toggle: show all users' posts vs only own posts
  const [adminViewAll, setAdminViewAll] = useState(true);

  // Listings data
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // User profile dialog state (null = closed, object = user data to display)
  const [dialogUser, setDialogUser] = useState(null);

  /* ── Fetch posts ── */
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint =
          isAdmin && adminViewAll ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);
        setPosts(res.data);
        setCurrentPage(1); // reset to page 1 whenever source changes
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, isAdmin, adminViewAll]);

  /* ── Derived values ── */
  const showingAll = isAdmin && adminViewAll;

  // Posts added in the last 7 days (used for the "Recent Listings" section)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentPosts = posts.filter((p) => new Date(p.createdAt) >= oneWeekAgo);

  // Pagination
  const totalItems = recentPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pagedPosts = recentPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Summary stats (from ALL posts, not just the current page)
  const stats = [
    {
      label: showingAll ? "Total Properties" : "Total Listings",
      value: posts.length,
      colorKey: "violet",
      Icon: MdOutlineHome,
    },
    {
      label: "Available",
      value: posts.filter((p) => p.status === "available").length,
      colorKey: "emerald",
      Icon: MdCheckCircleOutline,
    },
    {
      label: "Sold",
      value: posts.filter((p) => p.status === "sold").length,
      colorKey: "slate",
      Icon: MdHighlightOff,
    },
    {
      label: "Rented",
      value: posts.filter((p) => p.status === "rented").length,
      colorKey: "amber",
      Icon: MdOutlineAccessTime,
    },
  ];

  /* ── Handlers ── */
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Open user dialog — receives the post's embedded user object
  const openUserDialog = (postUser) => {
    setDialogUser(postUser ?? null);
  };

  /* ── Render ── */
  return (
    <div className="flex flex-col gap-4 md:gap-5">
      {/* ── USER PROFILE DIALOG ── */}
      {dialogUser && (
        <UserProfileDialog
          user={dialogUser}
          onClose={() => setDialogUser(null)}
        />
      )}

      {/* ── WELCOME / PROFILE CARD ── */}
      <div
        className={`bg-white rounded-2xl overflow-hidden transition-all
        ${isAdmin ? "border border-violet-100 shadow-md shadow-violet-50" : "border border-slate-100 shadow-sm"}`}
      >
        {isAdmin && (
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
        )}
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <Avatar
                src={user?.avatar}
                name={user?.username}
                className="w-14 h-14 md:w-16 md:h-16"
                textClass="text-xl md:text-2xl"
              />
              {isAdmin && (
                <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center shadow ring-2 ring-white">
                  <MdVerified size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-base md:text-lg font-bold text-slate-800 truncate">
                  {user?.username ?? "User"}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
                  ${isAdmin ? "bg-violet-100 text-violet-700 border-violet-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                >
                  {isAdmin ? (
                    <>
                      <MdAdminPanelSettings size={10} />
                      {user?.role}
                    </>
                  ) : (
                    <>
                      <MdPerson size={10} />
                      {user?.role}
                    </>
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1.5">
                {user?.email && (
                  <p className="text-[12px] text-slate-400 flex items-center gap-1.5 truncate">
                    <MdEmail
                      size={12}
                      className="flex-shrink-0 text-slate-300"
                    />
                    {user.email}
                  </p>
                )}
                {!loading && (
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <MdDomain
                      size={12}
                      className="flex-shrink-0 text-slate-300"
                    />
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
                onClick={() => setAdminViewAll((v) => !v)}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all whitespace-nowrap w-full sm:w-auto
                  ${
                    adminViewAll
                      ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200 hover:bg-violet-700"
                      : "bg-white text-violet-600 border-violet-200 hover:bg-violet-50 hover:border-violet-400"
                  }`}
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

      {/* ── DATA SCOPE LABEL (admin only) ── */}
      {isAdmin && (
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg border
            ${showingAll ? "bg-violet-50 text-violet-600 border-violet-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}
          >
            {showingAll ? (
              <>
                <MdAdminPanelSettings size={13} />
                Platform-wide data
              </>
            ) : (
              <>
                <MdPerson size={13} />
                Your listings only
              </>
            )}
          </div>
        </div>
      )}

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => (
          <StatCard
            key={s.label}
            {...s}
            loading={loading}
            isAdminView={showingAll}
          />
        ))}
      </div>

      {/* ── RECENT LISTINGS CARD ── */}
      <div
        className={`bg-white rounded-2xl overflow-hidden transition-all
        ${showingAll ? "border border-violet-100 shadow-md shadow-violet-50/80" : "border border-slate-100 shadow-sm"}`}
      >
        {showingAll && (
          <div className="h-0.5 w-full bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400" />
        )}

        {/* Card header */}
        <div
          className={`flex items-center justify-between px-4 md:px-5 py-3.5 border-b
          ${showingAll ? "border-violet-50 bg-gradient-to-r from-violet-50/70 to-transparent" : "border-slate-100"}`}
        >
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[13px] md:text-sm font-bold text-slate-800">
                Recent Listings
              </h3>
              {showingAll && (
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                  <MdAdminPanelSettings size={10} />
                  All Users
                </span>
              )}
            </div>
            {!loading && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                {totalItems} {showingAll ? "platform-wide" : ""}{" "}
                {totalItems === 1 ? "property" : "properties"} this week
              </p>
            )}
          </div>
          <Link
            to="/dashboard/myProperties"
            className="text-[12px] text-violet-600 font-semibold no-underline hover:text-violet-800 transition-colors whitespace-nowrap"
          >
            View all →
          </Link>
        </div>

        {/* Error state */}
        {error && (
          <div className="px-4 md:px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && totalItems === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${showingAll ? "bg-violet-50" : "bg-slate-50"}`}
            >
              <MdOutlineHome
                size={26}
                className={showingAll ? "text-violet-300" : "text-slate-300"}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-500">
                No listings this week
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {showingAll
                  ? "No properties have been added this week."
                  : "Add your first property to get started"}
              </p>
            </div>
            <Link
              to="/dashboard/addProperty"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white no-underline rounded-xl px-4 py-2 text-[12px] font-semibold shadow-md shadow-violet-200 transition-all"
            >
              <MdAddHome size={15} />
              Add Property
            </Link>
          </div>
        )}

        {/* Listing rows — horizontally scrollable on small screens */}
        {!loading && !error && totalItems > 0 && (
          <div
            className="overflow-x-auto overflow-y-visible"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* min-w keeps all columns aligned across every row */}
            <div className="min-w-[580px]">
              {pagedPosts.map((p, i) => {
                const type = p.property ?? p.type ?? "property";
                const postUser = p.user ?? null; // full user object from API
                const postedBy = postUser?.username ?? p.username ?? null;

                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 px-4 md:px-5 py-3
                      ${i < pagedPosts.length - 1 ? `border-b ${showingAll ? "border-violet-50" : "border-slate-50"}` : ""}`}
                  >
                    {/* Thumbnail — fixed width */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-slate-100">
                      {p.images?.length > 0 ? (
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.add(
                              "bg-gradient-to-br",
                              "from-violet-100",
                              "to-purple-100",
                              "flex",
                              "items-center",
                              "justify-center",
                            );
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-violet-500">
                          <MdOutlineHome size={18} />
                        </div>
                      )}
                    </div>

                    {/* Title + location / type / price — fills remaining space */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <MdLocationOn
                          size={11}
                          className="text-violet-400 flex-shrink-0"
                        />
                        <span className="truncate">{p.city}</span>
                        <span className="mx-0.5 flex-shrink-0">·</span>
                        <span className="capitalize flex-shrink-0">{type}</span>
                        <span className="mx-0.5 flex-shrink-0">·</span>
                        <span className="flex-shrink-0 font-medium text-slate-500">
                          {formatPrice(p.price)}
                        </span>
                      </p>
                    </div>

                    {/* Username column — fixed width; clicking opens dialog, not a page nav */}
                    <div className="flex-shrink-0 w-28 flex justify-center">
                      {showingAll && postedBy && (
                        <UserChip
                          username={postedBy}
                          onClick={() => openUserDialog(postUser)}
                        />
                      )}
                    </div>

                    {/* Status badge — fixed width */}
                    <div className="flex-shrink-0 w-24 flex justify-end">
                      <StatusBadge status={p.status} />
                    </div>

                    {/* Open-in-new icon — the only element that navigates away */}
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
              {/* Pagination bar — shown below the listing rows when there is data */}
              {!loading && !error && totalItems > 0 && (
                <div className="px-4 md:px-5 pb-4">
                  <PaginationBar
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    totalItems={totalItems}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile footer link */}
        {!loading && totalItems > 0 && (
          <div
            className={`sm:hidden px-4 py-3 border-t ${showingAll ? "border-violet-50" : "border-slate-50"}`}
          >
            <Link
              to="/dashboard/myProperties"
              className="block text-center text-[12px] text-violet-600 font-semibold no-underline py-1"
            >
              View all properties →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
