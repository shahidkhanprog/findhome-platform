// pages/dashboard/SavedPosts.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdFavorite, MdFavoriteBorder, MdSearchOff } from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

import UnsaveModal from "../../../components/dashboard/UnsaveModal";
import SavedFilterBar from "../../../components/dashboard/SavedFilterBar";
import SavedPropertyCard from "../../../components/dashboard/SavedPropertyCard";
import SavedSkeletonCard from "../../../components/dashboard/SavedSkeletonCard";
import PaginationBar from "../../../components/dashboard/PaginationBar";
import { STATUS_CONFIG } from "../../../constants/dashboardConstants";

export default function SavedPosts() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [savedRecords, setSavedRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unsaveTarget, setUnsaveTarget] = useState(null);
  const [unsaveLoading, setUnsaveLoading] = useState(false);
  const [unsaving, setUnsaving] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // matches MyProperties grid

  const userId = currentUser?.userData?.id;

  useEffect(() => {
    if (!userId) return;
    const fetchSaved = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest.get("/saved-posts");
        const data = Array.isArray(res.data) ? res.data : res.data.savedPosts ?? [];
        setSavedRecords(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load saved properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [userId]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const posts = savedRecords.map((r) => r.post ?? r).filter(Boolean);
  const filtered = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDetails = (id) => navigate(`/dashboard/property/${id}`);
  const handleUnsaveClick = (post) => setUnsaveTarget(post);

  const handleUnsaveConfirm = async () => {
    if (!unsaveTarget) return;
    setUnsaveLoading(true);
    setUnsaving(unsaveTarget.id);
    try {
      await apiRequest.post(`/saved-posts/${unsaveTarget.id}`);
      setSavedRecords((rs) =>
        rs.filter((r) => {
          const pid = r.post?.id ?? r.postId ?? r.id;
          return pid !== unsaveTarget.id;
        })
      );
      setUnsaveTarget(null);
      // If the last item on a page is removed and current page becomes empty, go to previous page
      if (paginated.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove saved property.");
    } finally {
      setUnsaveLoading(false);
      setUnsaving(null);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 min-h-0"
      style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style>{`
        .sp-pills::-webkit-scrollbar { display: none; }
      `}</style>

      {unsaveTarget && (
        <UnsaveModal
          post={unsaveTarget}
          onConfirm={handleUnsaveConfirm}
          onCancel={() => setUnsaveTarget(null)}
          loading={unsaveLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-800 leading-tight">Saved Properties</h2>
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
              : `${totalItems} propert${totalItems !== 1 ? "ies" : "y"} saved`}
          </p>
        </div>
        <button
          onClick={() => navigate("/list")}
          className="inline-flex items-center gap-1.5 bg-gray-900 text-white border-none rounded-xl px-4 py-2.5 text-[13px] font-semibold cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md shadow-violet-200 transition-all"
        >
          <MdFavoriteBorder size={16} />
          <span className="hidden sm:inline">Browse More</span>
          <span className="sm:hidden">Browse</span>
        </button>
      </div>

      {/* Filter bar */}
      {!loading && posts.length > 0 && (
        <SavedFilterBar posts={posts} filter={filter} setFilter={setFilter} />
      )}

      {/* Error */}
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

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SavedSkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty or grid */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-2xl gap-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
              {posts.length === 0 ? (
                <MdFavoriteBorder size={32} className="text-rose-300" />
              ) : (
                <MdSearchOff size={32} className="text-rose-300" />
              )}
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
                className="mt-1 inline-flex items-center gap-1.5 bg-gray-900 text-white border-none rounded-xl px-5 py-2.5 text-[13px] font-semibold cursor-pointer shadow-md shadow-violet-200 transition-all"
              >
                <MdFavoriteBorder size={16} />
                Browse Listings
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((post) => (
                <SavedPropertyCard
                  key={post.id}
                  post={post}
                  onDetails={handleDetails}
                  onUnsave={handleUnsaveClick}
                  unsaving={unsaving}
                />
              ))}
            </div>
            {/* Pagination Bar */}
            <PaginationBar
              currentPage={safePage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              totalItems={totalItems}
            />
          </>
        )
      )}
    </div>
  );
}