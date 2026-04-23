// pages/dashboard/MyProperties.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdAddHome, MdOutlineHome, MdAdminPanelSettings, MdDeleteOutline } from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

// Reused shared components & constants
import PaginationBar from "../../../components/dashboard/PaginationBar";
import PropertyCard from "../../../components/dashboard/PropertyCard";
import FilterBar from "../../../components/dashboard/FilterBar";
import DeleteModal from "../../../components/dashboard/DeleteModal";
import SkeletonCard from "../../../components/dashboard/SkeletonCard";
import { STATUS_CONFIG, PAGE_SIZE_OPTIONS } from "../../../constants/dashboardConstants";

export default function MyProperties() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.userData?.id;
  const role = currentUser?.userData?.role ?? currentUser?.role ?? "user";
  const isAdmin = role === "ADMIN" || role === "admin";

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminScope, setAdminScope] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Fetch posts
  useEffect(() => {
    if (!userId) return;
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const endpoint = isAdmin ? "/posts" : `/posts/user/${userId}`;
        const res = await apiRequest.get(endpoint);
        setPosts(Array.isArray(res.data) ? res.data : (res.data.posts ?? []));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userId, isAdmin]);

  // Reset page on filter/scope/size change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, adminScope, pageSize]);

  // Filtering & pagination
  const scopedPosts = isAdmin && adminScope === "mine"
    ? posts.filter(p => p.userId === userId || p.user?.id === userId)
    : posts;
  const filtered = filter === "all" ? scopedPosts : scopedPosts.filter(p => p.status === filter);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  // Handlers
  const handleEdit = (post) => navigate(`/dashboard/edit/${post.id}`);
  const handleDetails = (id) => navigate(`/dashboard/property/${id}`);
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/posts/${deleteTarget.id}`);
      setPosts(ps => ps.filter(p => p.id !== deleteTarget.id));
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
      setPosts(ps => ps.map(p => p.id === id ? { ...p, status } : p));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status.");
    } finally {
      setStatusUpdating(null);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Empty state messages
  const emptyTitle = isAdmin && adminScope === "mine" ? "You have no listings" : isAdmin ? "No listings on platform" : "No properties yet";
  const emptySub = filter !== "all"
    ? `No ${STATUS_CONFIG[filter]?.label ?? filter} properties in this view`
    : isAdmin && adminScope === "mine" ? "You haven't added any properties yet" : isAdmin ? "No listings have been created" : "Add your first property listing";

  return (
    <div className="flex flex-col gap-4 min-h-0" style={{ overflowY: "auto", scrollbarWidth: "none" }}>
      <style>{`.mp-pills::-webkit-scrollbar { display: none; }`}</style>

      {deleteTarget && <DeleteModal post={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}

      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-extrabold text-slate-800">{isAdmin ? "Properties" : "My Properties"}</h2>
            {isAdmin && <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 text-[10.5px] font-bold rounded-full px-2 py-0.5"><MdAdminPanelSettings size={12} /> Admin</span>}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""} shown${posts.length !== filtered.length ? ` · ${posts.length} total` : ""}`}</p>
        </div>
        <button onClick={() => navigate("/dashboard/addProperty")} className="inline-flex items-center gap-1.5 bg-gray-900 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold shadow-md">
          <MdAddHome size={17} /><span className="hidden sm:inline">Add Property</span><span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Filter Bar */}
      {!loading && <FilterBar allPosts={posts} filter={filter} setFilter={setFilter} isAdmin={isAdmin} adminScope={adminScope} setAdminScope={setAdminScope} userId={userId} />}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3.5">
          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center"><MdDeleteOutline size={16} className="text-rose-500" /></div>
          <div><p className="text-sm font-semibold text-rose-700">{error}</p><button onClick={() => window.location.reload()} className="text-xs text-rose-500 underline">Try again</button></div>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty or Grid */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-slate-100 rounded-2xl gap-3">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center"><MdOutlineHome size={32} className="text-violet-300" /></div>
            <div className="text-center px-6"><p className="text-sm font-bold text-slate-600">{emptyTitle}</p><p className="text-xs text-slate-400 mt-1">{emptySub}</p></div>
            <button onClick={() => navigate("/dashboard/addProperty")} className="mt-1 inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl px-5 py-2.5 text-[13px] font-semibold shadow-md">Add Property</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map(post => (
                <PropertyCard key={post.id} post={post} onEdit={handleEdit} onDelete={setDeleteTarget} onStatusChange={handleStatusChange} onDetails={handleDetails} statusUpdating={statusUpdating} isAdmin={isAdmin} />
              ))}
            </div>
            <PaginationBar currentPage={safePage} totalPages={totalPages} pageSize={pageSize} onPageChange={handlePageChange} onPageSizeChange={handlePageSizeChange} totalItems={totalItems} />
          </>
        )
      )}
    </div>
  );
}