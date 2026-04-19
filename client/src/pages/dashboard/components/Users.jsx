// pages/dashboard/Users.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import {
  MdAdminPanelSettings, MdPerson, MdEdit,
  MdSearch, MdDomain, MdVerified, MdClose, MdCheck,
  MdChevronLeft, MdChevronRight, MdToggleOn, MdToggleOff,
  MdOutlineHome, MdDeleteForever, MdWarning,
} from "react-icons/md";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

function getPostCount(u) {
  if (typeof u._count?.posts === "number") return u._count.posts;
  if (typeof u.postCount === "number") return u.postCount;
  if (typeof u._count?.Post === "number") return u._count.Post;
  if (Array.isArray(u.posts)) return u.posts.length;
  if (Array.isArray(u.Post)) return u.Post.length;
  return 0;
}

function Avatar({ src, name = "", className = "w-9 h-9", textClass = "text-sm" }) {
  const [err, setErr] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src && !err)
    return (
      <img
        src={src} alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-violet-100`}
        onError={() => setErr(true)}
      />
    );
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none`}>
      {letter}
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[13px] font-semibold transition-all
      ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
      {toast.type === "error" ? <MdClose size={15} /> : <MdCheck size={15} />}
      {toast.msg}
    </div>
  );
}

function EditModal({ user, onSave, onCancel, loading }) {
  const [role, setRole] = useState(user?.role ?? "USER");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-violet-100 p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-5">
          <Avatar src={user?.avatar} name={user?.username} />
          <div>
            <p className="text-[14px] font-bold text-slate-800">{user?.username}</p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
        </div>

        <label className="block text-[12px] font-semibold text-slate-600 mb-1.5">Role</label>
        <div className="flex gap-2 mb-5">
          {["USER", "ADMIN"].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2.5 rounded-xl border text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5
                ${role === r
                  ? "bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-300"}`}
            >
              {r === "ADMIN" ? <MdAdminPanelSettings size={13} /> : <MdPerson size={13} />}
              {r}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ role })}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <MdCheck size={15} />}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleModal({ user, onConfirm, onCancel, loading }) {
  const willActivate = user?.isActive === false;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl shadow-xl border p-6 w-full max-w-sm
        ${willActivate ? "border-emerald-100" : "border-amber-100"}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4
          ${willActivate ? "bg-emerald-50" : "bg-amber-50"}`}>
          {willActivate
            ? <MdToggleOn size={26} className="text-emerald-500" />
            : <MdToggleOff size={26} className="text-amber-500" />}
        </div>

        <h3 className="text-[15px] font-bold text-slate-800 mb-1">
          {willActivate ? "Activate User?" : "Deactivate User?"}
        </h3>
        <p className="text-[13px] text-slate-500 mb-5">
          {willActivate
            ? <><span className="font-semibold text-slate-700">{user?.username}</span>'s access will be restored.</>
            : <><span className="font-semibold text-slate-700">{user?.username}</span> will be blocked from logging in.</>}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5
              ${willActivate ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : willActivate ? <MdToggleOn size={16} /> : <MdToggleOff size={16} />}
            {willActivate ? "Activate" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PaginationBar({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, totalItems }) {
  if (totalItems === 0) return null;
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mt-2">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <span className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{startItem}</span>
          <span className="mx-1 text-slate-400">–</span>
          <span className="font-semibold text-slate-900">{endItem}</span>
          <span className="ml-1 text-slate-500 text-xs uppercase tracking-wider">of</span>
          <span className="ml-1 font-semibold text-slate-900">{totalItems}</span>
        </span>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">Per page</label>
          <div className="relative">
            <select
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
              className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 pl-3 pr-8 py-1.5 cursor-pointer"
            >
              {PAGE_SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <MdChevronLeft size={16} /><span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1 mx-1">
          {pageNumbers[0] > 1 && (
            <>
              <button onClick={() => onPageChange(1)} className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">1</button>
              {pageNumbers[0] > 2 && <span className="text-slate-400 text-[12px] px-0.5">…</span>}
            </>
          )}
          {pageNumbers.map(num => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-8 h-8 rounded-xl text-[12px] font-semibold border transition-all
                ${num === currentPage
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-sm shadow-violet-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"}`}
            >
              {num}
            </button>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-slate-400 text-[12px] px-0.5">…</span>}
              <button onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">{totalPages}</button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline">Next</span><MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function Users() {
  const { currentUser } = useContext(AuthContext);
  const user    = currentUser?.userData ?? {};
  const isAdmin = user?.role === "ADMIN";

  const [users, setUsers]                 = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [search, setSearch]               = useState("");
  const [toggleTarget, setToggleTarget]   = useState(null);
  const [editTarget, setEditTarget]       = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);  // user pending deletion
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]                 = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]       = useState(10);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res  = await apiRequest.get("/users");
        const data = Array.isArray(res.data) ? res.data : (res.data.users ?? []);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  useEffect(() => { setCurrentPage(1); }, [search, pageSize]);

  /* ── Toggle active / inactive ──────────────────────────────────── */
  const handleToggle = async () => {
    if (!toggleTarget) return;
    setActionLoading(true);
    const willActivate = toggleTarget.isActive === false;
    try {
      await apiRequest.put(`/users/${toggleTarget.id}`, { isActive: willActivate });
      setUsers(prev =>
        prev.map(u => u.id === toggleTarget.id ? { ...u, isActive: willActivate } : u)
      );
      showToast(`${toggleTarget.username} ${willActivate ? "activated" : "deactivated"}.`);
    } catch {
      showToast("Action failed.", "error");
    } finally {
      setActionLoading(false);
      setToggleTarget(null);
    }
  };

  /* ── Edit role ──────────────────────────────────────────────────── */
  const handleEdit = async (data) => {
    setActionLoading(true);
    try {
      const res = await apiRequest.put(`/users/${editTarget.id}`, data);
      setUsers(prev =>
        prev.map(u => u.id === editTarget.id ? { ...u, ...res.data } : u)
      );
      showToast(`${editTarget.username} updated.`);
    } catch {
      showToast("Update failed.", "error");
    } finally {
      setActionLoading(false);
      setEditTarget(null);
    }
  };

  /* ── Delete user ────────────────────────────────────────────────── */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiRequest.delete(`/users/${deleteTarget.id}`);
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      showToast(`${deleteTarget.username} deleted successfully.`);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  /* ── Access guard ───────────────────────────────────────────────── */
  if (!isAdmin) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
          <MdAdminPanelSettings size={28} className="text-rose-400" />
        </div>
        <p className="text-sm font-bold text-slate-700">Access Denied</p>
        <p className="text-xs text-slate-400">You are not authorized to view this page.</p>
      </div>
    );
  }

  const filtered   = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-4">

      <Toast toast={toast} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
              <MdAdminPanelSettings size={22} className="text-violet-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                User Management
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                  <MdVerified size={10} /> ADMIN
                </span>
              </h2>
              {!loading && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MdDomain size={11} className="text-slate-300" />
                  {users.length} registered {users.length === 1 ? "user" : "users"}
                </p>
              )}
            </div>
          </div>

          <div className="relative sm:w-60">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users…"
              className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50/80 overflow-hidden">
        {error && (
          <div className="px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="bg-gradient-to-r from-violet-50/70 to-transparent border-b border-violet-100">
                {["#", "User", "Properties", "Email", "Role", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? [1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} />)
                : paginated.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-14 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                            <MdPerson size={22} className="text-violet-300" />
                          </div>
                          <p className="text-sm font-bold text-slate-400">No users found</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : paginated.map((u, i) => {
                    const postCount   = getPostCount(u);
                    const globalIndex = (safePage - 1) * pageSize + i + 1;
                    const isActive    = u.isActive !== false;
                    const isSelf      = u.id === user?.id;

                    return (
                      <tr
                        key={u.id}
                        className={`border-b border-violet-50 transition-colors
                          ${i === paginated.length - 1 ? "border-none" : ""}
                          ${!isActive ? "bg-slate-50/60" : "hover:bg-violet-50/30"}`}
                      >
                        {/* # */}
                        <td className="px-4 py-3.5 text-[12px] font-bold text-slate-300 w-10">
                          {globalIndex}
                        </td>

                        {/* User */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative">
                              <Avatar src={u.avatar} name={u.username} />
                              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
                                ${isActive ? "bg-emerald-400" : "bg-slate-300"}`}
                              />
                            </div>
                            <span className={`text-[13px] font-semibold truncate max-w-[120px]
                              ${isActive ? "text-slate-700" : "text-slate-400"}`}>
                              {u.username}
                              {isSelf && (
                                <span className="ml-1.5 text-[9px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full border border-violet-200">
                                  You
                                </span>
                              )}
                            </span>
                          </div>
                        </td>

                        {/* Properties */}
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-700 border border-violet-100 text-[11px] font-bold px-2.5 py-1 rounded-full">
                            <MdOutlineHome size={11} />
                            {postCount}
                          </span>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3.5 text-[12px] text-slate-500 truncate max-w-[160px]">
                          {u.email}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
                            ${u.role === "ADMIN"
                              ? "bg-violet-100 text-violet-700 border-violet-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                            {u.role === "ADMIN"
                              ? <MdAdminPanelSettings size={11} />
                              : <MdPerson size={11} />}
                            {u.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
                            ${isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-100 text-slate-400 border-slate-200"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-400" : "bg-slate-300"}`} />
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {/* Edit role */}
                            <button
                              onClick={() => setEditTarget(u)}
                              className="w-8 h-8 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-600 flex items-center justify-center transition-colors border border-violet-100 hover:border-violet-300"
                              title="Edit role"
                            >
                              <MdEdit size={15} />
                            </button>

                            {/* Toggle active */}
                            <button
                              onClick={() => !isSelf && setToggleTarget(u)}
                              disabled={isSelf}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border disabled:opacity-30 disabled:cursor-not-allowed
                                ${isActive
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-500 border-amber-100 hover:border-amber-300"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100 hover:border-emerald-300"}`}
                              title={isSelf ? "Cannot change your own status" : isActive ? "Deactivate" : "Activate"}
                            >
                              {isActive ? <MdToggleOff size={17} /> : <MdToggleOn size={17} />}
                            </button>

                            {/* Delete — disabled for self */}
                            <button
                              onClick={() => !isSelf && setDeleteTarget(u)}
                              disabled={isSelf}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100 hover:border-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                              title={isSelf ? "Cannot delete your own account here" : "Delete user"}
                            >
                              <MdDeleteForever size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      {!loading && (
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={s => { setPageSize(s); setCurrentPage(1); }}
          totalItems={totalItems}
        />
      )}

      {/* ── Toggle Modal ─────────────────────────────────────────── */}
      {toggleTarget && (
        <ToggleModal
          user={toggleTarget}
          onConfirm={handleToggle}
          onCancel={() => setToggleTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* ── Edit Modal ───────────────────────────────────────────── */}
      {editTarget && (
        <EditModal
          user={editTarget}
          onSave={handleEdit}
          onCancel={() => setEditTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <MdWarning size={24} className="text-red-500" />
            </div>

            <h3 className="text-[15px] font-bold text-slate-800 mb-1">Delete User?</h3>
            <p className="text-[13px] text-slate-500 mb-1">
              You are about to permanently delete{" "}
              <span className="font-semibold text-slate-700">{deleteTarget.username}</span>.
            </p>
            <ul className="text-[11px] text-red-500 space-y-1 mb-5 list-disc list-inside">
              <li>All their property listings will be removed</li>
              <li>All chats and messages will be erased</li>
              <li>This action cannot be undone</li>
            </ul>

            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                {actionLoading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <MdDeleteForever size={15} />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}