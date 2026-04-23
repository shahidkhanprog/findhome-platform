// pages/dashboard/Users.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import { MdAdminPanelSettings } from "react-icons/md";

import Toast from "../../../components/common/Toast";
import PaginationBar from "../../../components/dashboard/PaginationBar";
import UserHeader from "../../../components/dashboard/UserHeader";
import UserTable from "../../../components/dashboard/UserTable";
import EditRoleModal from "../../../components/dashboard/UserModals/EditRoleModal";
import ToggleStatusModal from "../../../components/dashboard/UserModals/ToggleStatusModal";
import DeleteUserModal from "../../../components/dashboard/UserModals/DeleteUserModal";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export default function Users() {
  const { currentUser } = useContext(AuthContext);
  const user = currentUser?.userData ?? {};
  const isAdmin = user?.role === "ADMIN";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [toggleTarget, setToggleTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        const res = await apiRequest.get("/users");
        const data = Array.isArray(res.data) ? res.data : (res.data.users ?? []);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

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

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-4">
      <Toast toast={toast} />

      <UserHeader users={users} loading={loading} search={search} setSearch={setSearch} />

      {error && (
        <div className="px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2 bg-white rounded-2xl border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />{error}
        </div>
      )}

      <UserTable
        loading={loading}
        paginated={paginated}
        safePage={safePage}
        pageSize={pageSize}
        currentUser={user}
        onEdit={setEditTarget}
        onToggle={setToggleTarget}
        onDelete={setDeleteTarget}
      />

      {!loading && (
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={s => { setPageSize(s); setCurrentPage(1); }}
          totalItems={totalItems}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      )}

      {toggleTarget && (
        <ToggleStatusModal
          user={toggleTarget}
          onConfirm={handleToggle}
          onCancel={() => setToggleTarget(null)}
          loading={actionLoading}
        />
      )}

      {editTarget && (
        <EditRoleModal
          user={editTarget}
          onSave={handleEdit}
          onCancel={() => setEditTarget(null)}
          loading={actionLoading}
        />
      )}

      {deleteTarget && (
        <DeleteUserModal
          user={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}