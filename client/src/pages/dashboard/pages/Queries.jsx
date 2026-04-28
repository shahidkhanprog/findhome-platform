// pages/dashboard/Queries.jsx
import { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import apiRequest from "../../../lib/apiRequest";
import { AuthContext } from "../../../context/AuthContext";
import { MdAdminPanelSettings } from "react-icons/md";

import Toast from "../../../components/common/Toast";
import PaginationBar from "../../../components/dashboard/PaginationBar";
import QueryHeader from "../../../components/dashboard/QueryHeader";
import QueryTable from "../../../components/dashboard/QueryTable";
import DetailModal from "../../../components/dashboard/QueryModals/DetailModal";
import DeleteModal from "../../../components/dashboard/QueryModals/DeleteModal";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

export default function Queries() {
  const { currentUser } = useContext(AuthContext);
  const { onUnreadChange } = useOutletContext() ?? {};
  const isAdmin = currentUser?.userData?.role === "ADMIN";

  const [messages, setMessages]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");
  const [unreadCount, setUnreadCount]   = useState(0);
  const [selectedMsg, setSelectedMsg]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]               = useState(null);
  const [currentPage, setCurrentPage]   = useState(1);
  const [pageSize, setPageSize]         = useState(10);

  const updateUnread = (count) => {
    setUnreadCount(count);
    onUnreadChange?.(count);
  };

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
        const res = await apiRequest.get("/contact");
        const data = Array.isArray(res.data) ? res.data : [];
        setMessages(data);
        updateUnread(data.filter((m) => !m.isRead).length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, pageSize]);

  const handleReadMore = async (msg) => {
    setSelectedMsg(msg);
    if (msg.isRead) return;
    try {
      await apiRequest.put(`/contact/${msg.id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
      );
      updateUnread(Math.max(0, unreadCount - 1));
      setSelectedMsg((prev) => (prev ? { ...prev, isRead: true } : prev));
    } catch {
      // silently fail
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await apiRequest.delete(`/contact/${deleteTarget.id}`);
      const wasUnread = !deleteTarget.isRead;
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (wasUnread) updateUnread(Math.max(0, unreadCount - 1));
      showToast("Message deleted successfully.");
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

  const filtered = messages.filter(
    (m) =>
      m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase())
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

      <QueryHeader
        totalCount={messages.length}
        unreadCount={unreadCount}
        loading={loading}
        search={search}
        setSearch={setSearch}
      />

      {error && (
        <div className="px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2 bg-white rounded-2xl border border-gray-100">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {error}
        </div>
      )}

      <QueryTable
        loading={loading}
        paginated={paginated}
        safePage={safePage}
        pageSize={pageSize}
        onReadMore={handleReadMore}
        onDelete={setDeleteTarget}
      />

      {!loading && (
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          totalItems={totalItems}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
        />
      )}

      {selectedMsg && <DetailModal message={selectedMsg} onClose={() => setSelectedMsg(null)} />}
      {deleteTarget && (
        <DeleteModal
          message={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}
    </div>
  );
}