// // pages/dashboard/Queries.jsx
// import { useState, useEffect, useContext } from "react";
// import apiRequest from "../../../lib/apiRequest";
// import { AuthContext } from "../../../context/AuthContext";
// import {
//   MdAdminPanelSettings,
//   MdEmail,
//   MdClose,
//   MdPhone,
//   MdPerson,
//   MdSubject,
//   MdMessage,
//   MdAccessTime,
//   MdMarkEmailRead,
//   MdDeleteForever,
//   MdInbox,
//   MdSearch,
//   MdVerified,
//   MdChevronLeft,
//   MdChevronRight,
//   MdWarning,
// } from "react-icons/md";

// const PAGE_SIZE_OPTIONS = [10, 20, 30];

// /* ── Skeleton row ────────────────────────────────────────────── */
// function SkeletonRow() {
//   return (
//     <tr className="animate-pulse">
//       {[1, 2, 3, 4, 5].map((i) => (
//         <td key={i} className="px-4 py-3.5">
//           <div className="h-3 bg-slate-100 rounded w-3/4" />
//         </td>
//       ))}
//     </tr>
//   );
// }

// /* ── Toast ───────────────────────────────────────────────────── */
// function Toast({ toast }) {
//   if (!toast) return null;
//   return (
//     <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[13px] font-semibold
//       ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
//       {toast.msg}
//     </div>
//   );
// }

// /* ── Pagination ──────────────────────────────────────────────── */
// function PaginationBar({ currentPage, totalPages, pageSize, onPageChange, onPageSizeChange, totalItems }) {
//   if (totalItems === 0) return null;
//   const startItem = (currentPage - 1) * pageSize + 1;
//   const endItem   = Math.min(currentPage * pageSize, totalItems);

//   const getPageNumbers = () => {
//     if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (currentPage <= 3) return [1, 2, 3, 4, 5];
//     if (currentPage >= totalPages - 2)
//       return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
//     return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
//   };

//   return (
//     <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mt-2">
//       <div className="flex flex-col sm:flex-row items-center gap-4">
//         <span className="text-sm text-slate-600">
//           Showing <span className="font-semibold text-slate-900">{startItem}</span>
//           <span className="mx-1 text-slate-400">–</span>
//           <span className="font-semibold text-slate-900">{endItem}</span>
//           <span className="ml-1 text-slate-500 text-xs uppercase tracking-wider">of</span>
//           <span className="ml-1 font-semibold text-slate-900">{totalItems}</span>
//         </span>
//         <div className="flex items-center gap-2">
//           <label className="text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">Per page</label>
//           <select
//             value={pageSize}
//             onChange={(e) => onPageSizeChange(Number(e.target.value))}
//             className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 pl-3 pr-8 py-1.5 cursor-pointer"
//           >
//             {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//           </select>
//         </div>
//       </div>

//       <div className="flex items-center gap-1">
//         <button
//           onClick={() => onPageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//         >
//           <MdChevronLeft size={16} /><span className="hidden sm:inline">Prev</span>
//         </button>

//         <div className="flex items-center gap-1 mx-1">
//           {getPageNumbers().map((num) => (
//             <button
//               key={num}
//               onClick={() => onPageChange(num)}
//               className={`w-8 h-8 rounded-xl text-[12px] font-semibold border transition-all
//                 ${num === currentPage
//                   ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-sm shadow-violet-200"
//                   : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"}`}
//             >
//               {num}
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => onPageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
//         >
//           <span className="hidden sm:inline">Next</span><MdChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ── Detail Modal ────────────────────────────────────────────── */
// function DetailModal({ message, onClose }) {
//   if (!message) return null;

//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     return d.toLocaleString("en-PK", {
//       year: "numeric", month: "long", day: "numeric",
//       hour: "2-digit", minute: "2-digit", hour12: true,
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-2xl shadow-2xl border border-violet-100 w-full max-w-lg overflow-hidden">
//         {/* Header */}
//         <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
//         <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
//               <MdEmail size={16} className="text-violet-600" />
//             </div>
//             <h3 className="text-[14px] font-bold text-slate-800">Query Detail</h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
//           >
//             <MdClose size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-5 space-y-4">
//           {/* Row: Full Name */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
//               <MdPerson size={15} className="text-violet-500" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name</p>
//               <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.fullName}</p>
//             </div>
//           </div>

//           {/* Row: Email */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
//               <MdEmail size={15} className="text-blue-500" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
//               <a
//                 href={`mailto:${message.email}`}
//                 className="text-[13px] font-semibold text-blue-600 hover:underline mt-0.5 block"
//               >
//                 {message.email}
//               </a>
//             </div>
//           </div>

//           {/* Row: Phone */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
//               <MdPhone size={15} className="text-emerald-500" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Phone Number</p>
//               <p className="text-[13px] font-semibold text-slate-800 mt-0.5">
//                 {message.phone || <span className="text-slate-400 font-normal italic">Not provided</span>}
//               </p>
//             </div>
//           </div>

//           {/* Row: Subject */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
//               <MdSubject size={15} className="text-amber-500" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject</p>
//               <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.subject}</p>
//             </div>
//           </div>

//           {/* Row: Message */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
//               <MdMessage size={15} className="text-purple-500" />
//             </div>
//             <div className="flex-1">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Message</p>
//               <p className="text-[13px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3 border border-slate-100">
//                 {message.message}
//               </p>
//             </div>
//           </div>

//           {/* Row: Sent at */}
//           <div className="flex items-start gap-3">
//             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
//               <MdAccessTime size={15} className="text-slate-400" />
//             </div>
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sent At</p>
//               <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{formatDate(message.createdAt)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-colors"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── Delete Confirm Modal ────────────────────────────────────── */
// function DeleteModal({ message, onConfirm, onCancel, loading }) {
//   if (!message) return null;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 w-full max-w-sm">
//         <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
//           <MdWarning size={24} className="text-red-500" />
//         </div>
//         <h3 className="text-[15px] font-bold text-slate-800 mb-1">Delete Query?</h3>
//         <p className="text-[13px] text-slate-500 mb-5">
//           This will permanently remove the message from{" "}
//           <span className="font-semibold text-slate-700">{message.fullName}</span>. This cannot be undone.
//         </p>
//         <div className="flex gap-2">
//           <button
//             onClick={onCancel}
//             disabled={loading}
//             className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
//           >
//             {loading
//               ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               : <MdDeleteForever size={15} />}
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ── MAIN PAGE ───────────────────────────────────────────────── */
// export default function Queries() {
//   const { currentUser } = useContext(AuthContext);
//   const user    = currentUser?.userData ?? {};
//   const isAdmin = user?.role === "ADMIN";

//   const [messages,      setMessages]      = useState([]);
//   const [loading,       setLoading]       = useState(true);
//   const [error,         setError]         = useState("");
//   const [search,        setSearch]        = useState("");
//   const [unreadCount,   setUnreadCount]   = useState(0);
//   const [selectedMsg,   setSelectedMsg]   = useState(null); // for detail modal
//   const [deleteTarget,  setDeleteTarget]  = useState(null); // for delete modal
//   const [actionLoading, setActionLoading] = useState(false);
//   const [toast,         setToast]         = useState(null);
//   const [currentPage,   setCurrentPage]   = useState(1);
//   const [pageSize,      setPageSize]      = useState(10);

//   const showToast = (msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   /* ── Fetch all messages ────────────────────────────────────── */
//   useEffect(() => {
//     if (!isAdmin) return;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res  = await apiRequest.get("/contact");
//         const data = Array.isArray(res.data) ? res.data : [];
//         setMessages(data);
//         setUnreadCount(data.filter((m) => !m.isRead).length);
//       } catch (err) {
//         setError(err.response?.data?.message || "Failed to load messages.");
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [isAdmin]);

//   useEffect(() => { setCurrentPage(1); }, [search, pageSize]);

//   /* ── Open detail modal → mark as read ──────────────────────── */
//   const handleReadMore = async (msg) => {
//     setSelectedMsg(msg);

//     // Only call API + decrement if not already read
//     if (!msg.isRead) {
//       try {
//         await apiRequest.put(`/contact/${msg.id}/read`);
//         setMessages((prev) =>
//           prev.map((m) => m.id === msg.id ? { ...m, isRead: true } : m)
//         );
//         setUnreadCount((prev) => Math.max(0, prev - 1));
//         // Also update the selected message so modal reflects read state
//         setSelectedMsg((prev) => prev ? { ...prev, isRead: true } : prev);
//       } catch {
//         // silently fail — don't block the modal from opening
//       }
//     }
//   };

//   /* ── Delete message ─────────────────────────────────────────── */
//   const handleDelete = async () => {
//     if (!deleteTarget) return;
//     setActionLoading(true);
//     try {
//       await apiRequest.delete(`/contact/${deleteTarget.id}`);
//       const wasUnread = !deleteTarget.isRead;
//       setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
//       if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
//       showToast("Message deleted successfully.");
//     } catch (err) {
//       showToast(err.response?.data?.message || "Delete failed.", "error");
//     } finally {
//       setActionLoading(false);
//       setDeleteTarget(null);
//     }
//   };

//   /* ── Access guard ───────────────────────────────────────────── */
//   if (!isAdmin) {
//     return (
//       <div className="p-6 bg-white rounded-2xl border border-rose-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
//         <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
//           <MdAdminPanelSettings size={28} className="text-rose-400" />
//         </div>
//         <p className="text-sm font-bold text-slate-700">Access Denied</p>
//         <p className="text-xs text-slate-400">You are not authorized to view this page.</p>
//       </div>
//     );
//   }

//   /* ── Filter + paginate ─────────────────────────────────────── */
//   const filtered = messages.filter((m) =>
//     m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//     m.email?.toLowerCase().includes(search.toLowerCase()) ||
//     m.subject?.toLowerCase().includes(search.toLowerCase())
//   );
//   const totalItems = filtered.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//   const safePage   = Math.min(currentPage, totalPages);
//   const paginated  = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

//   const handlePageChange = (page) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const truncate = (str, n = 40) =>
//     str && str.length > n ? str.slice(0, n) + "…" : str;

//   return (
//     <div className="flex flex-col gap-4">
//       <Toast toast={toast} />

//       {/* ── Header ─────────────────────────────────────────────── */}
//       <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50 overflow-hidden">
//         <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
//         <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
//           <div className="flex items-center gap-3 flex-1">
//             <div className="relative w-11 h-11 flex-shrink-0">
//               <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
//                 <MdInbox size={22} className="text-violet-600" />
//               </div>
//               {/* ✅ Unread badge on the icon */}
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
//                   {unreadCount > 99 ? "99+" : unreadCount}
//                 </span>
//               )}
//             </div>
//             <div>
//               <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
//                 Contact Queries
//                 <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
//                   <MdVerified size={10} /> ADMIN
//                 </span>
//               </h2>
//               {!loading && (
//                 <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
//                   <span>{messages.length} total</span>
//                   {unreadCount > 0 && (
//                     <>
//                       <span className="text-slate-200">·</span>
//                       <span className="text-rose-500 font-bold flex items-center gap-1">
//                         <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
//                         {unreadCount} unread
//                       </span>
//                     </>
//                   )}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Search */}
//           <div className="relative sm:w-60">
//             <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search queries…"
//               className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-300 transition-all"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ── Table ──────────────────────────────────────────────── */}
//       <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50/80 overflow-hidden">
//         {error && (
//           <div className="px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
//             <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {error}
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="w-full min-w-[620px]">
//             <thead>
//               <tr className="bg-gradient-to-r from-violet-50/70 to-transparent border-b border-violet-100">
//                 {["S.No", "Full Name", "Subject", "Status", "Sent At", "Actions"].map((h) => (
//                   <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {loading
//                 ? [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
//                 : paginated.length === 0
//                   ? (
//                     <tr>
//                       <td colSpan={6} className="px-4 py-14 text-center">
//                         <div className="flex flex-col items-center gap-2">
//                           <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
//                             <MdInbox size={22} className="text-violet-300" />
//                           </div>
//                           <p className="text-sm font-bold text-slate-400">No queries found</p>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                   : paginated.map((msg, i) => {
//                     const globalIndex = (safePage - 1) * pageSize + i + 1;
//                     const isRead = msg.isRead;

//                     return (
//                       <tr
//                         key={msg.id}
//                         className={`border-b border-violet-50 transition-colors
//                           ${i === paginated.length - 1 ? "border-none" : ""}
//                           ${!isRead ? "bg-violet-50/40" : "hover:bg-slate-50/50"}`}
//                       >
//                         {/* S.No */}
//                         <td className="px-4 py-3.5 text-[12px] font-bold text-slate-300 w-10">
//                           {globalIndex}
//                         </td>

//                         {/* Full Name */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-2">
//                             {/* Unread dot */}
//                             {!isRead && (
//                               <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
//                             )}
//                             <span className={`text-[13px] font-semibold truncate max-w-[140px]
//                               ${!isRead ? "text-slate-800" : "text-slate-500"}`}>
//                               {msg.fullName}
//                             </span>
//                           </div>
//                         </td>

//                         {/* Subject */}
//                         <td className="px-4 py-3.5 text-[12px] text-slate-500 max-w-[180px]">
//                           {truncate(msg.subject, 35)}
//                         </td>

//                         {/* Status */}
//                         <td className="px-4 py-3.5">
//                           <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
//                             ${isRead
//                               ? "bg-slate-100 text-slate-400 border-slate-200"
//                               : "bg-violet-100 text-violet-700 border-violet-200"}`}>
//                             <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRead ? "bg-slate-300" : "bg-violet-500"}`} />
//                             {isRead ? "Read" : "Unread"}
//                           </span>
//                         </td>

//                         {/* Sent At */}
//                         <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
//                           {new Date(msg.createdAt).toLocaleDateString("en-PK", {
//                             day: "numeric", month: "short", year: "numeric",
//                           })}
//                         </td>

//                         {/* Actions */}
//                         <td className="px-4 py-3.5">
//                           <div className="flex items-center gap-1.5">
//                             {/* Read More */}
//                             <button
//                               onClick={() => handleReadMore(msg)}
//                               className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-[11px] font-bold border border-violet-100 hover:border-violet-300 transition-colors"
//                             >
//                               <MdMarkEmailRead size={13} />
//                               Read More
//                             </button>

//                             {/* Delete */}
//                             <button
//                               onClick={() => setDeleteTarget(msg)}
//                               className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100 hover:border-red-300"
//                               title="Delete"
//                             >
//                               <MdDeleteForever size={15} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//               }
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ── Pagination ─────────────────────────────────────────── */}
//       {!loading && (
//         <PaginationBar
//           currentPage={safePage}
//           totalPages={totalPages}
//           pageSize={pageSize}
//           onPageChange={handlePageChange}
//           onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
//           totalItems={totalItems}
//         />
//       )}

//       {/* ── Detail Modal ───────────────────────────────────────── */}
//       {selectedMsg && (
//         <DetailModal
//           message={selectedMsg}
//           onClose={() => setSelectedMsg(null)}
//         />
//       )}

//       {/* ── Delete Modal ───────────────────────────────────────── */}
//       {deleteTarget && (
//         <DeleteModal
//           message={deleteTarget}
//           onConfirm={handleDelete}
//           onCancel={() => setDeleteTarget(null)}
//           loading={actionLoading}
//         />
//       )}
//     </div>
//   );
// }

// pages/dashboard/Queries.jsx
import { useState, useEffect, useContext } from "react";
import apiRequest from "../../../lib/apiRequest";
import { AuthContext } from "../../../context/AuthContext";
import {
  MdAdminPanelSettings,
  MdEmail,
  MdClose,
  MdPhone,
  MdPerson,
  MdSubject,
  MdMessage,
  MdAccessTime,
  MdMarkEmailRead,
  MdDeleteForever,
  MdInbox,
  MdSearch,
  MdVerified,
  MdChevronLeft,
  MdChevronRight,
  MdWarning,
} from "react-icons/md";

const PAGE_SIZE_OPTIONS = [10, 20, 30];

/* ── Skeleton row ────────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3 bg-slate-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

/* ── Toast ───────────────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[13px] font-semibold
        ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}
    >
      {toast.msg}
    </div>
  );
}

/* ── Pagination ──────────────────────────────────────────────── */
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
  const endItem   = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-3 mt-2">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <span className="text-sm text-slate-600">
          Showing{" "}
          <span className="font-semibold text-slate-900">{startItem}</span>
          <span className="mx-1 text-slate-400">–</span>
          <span className="font-semibold text-slate-900">{endItem}</span>
          <span className="ml-1 text-slate-500 text-xs uppercase tracking-wider">of</span>
          <span className="ml-1 font-semibold text-slate-900">{totalItems}</span>
        </span>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-tight whitespace-nowrap">
            Per page
          </label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 pl-3 pr-8 py-1.5 cursor-pointer"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <MdChevronLeft size={16} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-8 h-8 rounded-xl text-[12px] font-semibold border transition-all
                ${num === currentPage
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white border-transparent shadow-sm shadow-violet-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
                }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <span className="hidden sm:inline">Next</span>
          <MdChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Detail Modal ────────────────────────────────────────────── */
function DetailModal({ message, onClose }) {
  if (!message) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-PK", {
      year:   "numeric",
      month:  "long",
      day:    "numeric",
      hour:   "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-violet-100 w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
              <MdEmail size={16} className="text-violet-600" />
            </div>
            <h3 className="text-[14px] font-bold text-slate-800">Query Detail</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {[
            {
              Icon: MdPerson,
              color: "violet",
              label: "Full Name",
              content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.fullName}</p>,
            },
            {
              Icon: MdEmail,
              color: "blue",
              label: "Email Address",
              content: (
                <a
                  href={`mailto:${message.email}`}
                  className="text-[13px] font-semibold text-blue-600 hover:underline mt-0.5 block"
                >
                  {message.email}
                </a>
              ),
            },
            {
              Icon: MdPhone,
              color: "emerald",
              label: "Phone Number",
              content: (
                <p className="text-[13px] font-semibold text-slate-800 mt-0.5">
                  {message.phone || (
                    <span className="text-slate-400 font-normal italic">Not provided</span>
                  )}
                </p>
              ),
            },
            {
              Icon: MdSubject,
              color: "amber",
              label: "Subject",
              content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.subject}</p>,
            },
            {
              Icon: MdMessage,
              color: "purple",
              label: "Message",
              content: (
                <p className="text-[13px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3 border border-slate-100">
                  {message.message}
                </p>
              ),
            },
            {
              Icon: MdAccessTime,
              color: "slate",
              label: "Sent At",
              content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{formatDate(message.createdAt)}</p>,
            },
          ].map(({ Icon, color, label, content }) => (
            <div key={label} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg bg-${color}-50 flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={15} className={`text-${color}-500`} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                {content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Confirm Modal ────────────────────────────────────── */
function DeleteModal({ message, onConfirm, onCancel, loading }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <MdWarning size={24} className="text-red-500" />
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 mb-1">Delete Query?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          This will permanently remove the message from{" "}
          <span className="font-semibold text-slate-700">{message.fullName}</span>. This cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <MdDeleteForever size={15} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ───────────────────────────────────────────────── */
/**
 * Props
 * ─────
 * onUnreadChange(count) — optional callback; called whenever the
 *   unread count changes so the parent layout can forward it to
 *   DashSidebar as badges.queries.
 */
export default function Queries({ onUnreadChange }) {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.userData?.role === "ADMIN";

  const [messages,      setMessages]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [selectedMsg,   setSelectedMsg]   = useState(null);
  const [deleteTarget,  setDeleteTarget]  = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast,         setToast]         = useState(null);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [pageSize,      setPageSize]      = useState(10);

  /* helper: keep unread count in sync + notify parent */
  const updateUnread = (count) => {
    setUnreadCount(count);
    onUnreadChange?.(count);
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Fetch all messages ──────────────────────────────────── */
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res  = await apiRequest.get("/contact");
        const data = Array.isArray(res.data) ? res.data : [];
        setMessages(data);
        updateUnread(data.filter((m) => !m.isRead).length);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  /* reset page on search/size change */
  useEffect(() => { setCurrentPage(1); }, [search, pageSize]);

  /* ── Mark as read ────────────────────────────────────────── */
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
      // silently fail — modal still opens
    }
  };

  /* ── Delete ──────────────────────────────────────────────── */
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

  /* ── Access guard ────────────────────────────────────────── */
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

  /* ── Filter + paginate ───────────────────────────────────── */
  const filtered   = messages.filter(
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

  const truncate = (str, n = 40) =>
    str && str.length > n ? str.slice(0, n) + "…" : str;

  return (
    <div className="flex flex-col gap-4">
      <Toast toast={toast} />

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50 overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            {/* Inbox icon with unread badge */}
            <div className="relative w-11 h-11 flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center">
                <MdInbox size={22} className="text-violet-600" />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                Contact Queries
                <span className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-200">
                  <MdVerified size={10} /> ADMIN
                </span>
              </h2>
              {!loading && (
                <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{messages.length} total</span>
                  {unreadCount > 0 && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-rose-500 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                        {unreadCount} unread
                      </span>
                    </>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative sm:w-60">
            <MdSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search queries…"
              className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-violet-100 shadow-md shadow-violet-50/80 overflow-hidden">
        {error && (
          <div className="px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="bg-gradient-to-r from-violet-50/70 to-transparent border-b border-violet-100">
                {["S.No", "Full Name", "Subject", "Status", "Sent At", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                        <MdInbox size={22} className="text-violet-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-400">No queries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((msg, i) => {
                  const globalIndex = (safePage - 1) * pageSize + i + 1;
                  const isRead      = msg.isRead;

                  return (
                    <tr
                      key={msg.id}
                      className={`border-b border-violet-50 transition-colors
                        ${i === paginated.length - 1 ? "border-none" : ""}
                        ${!isRead ? "bg-violet-50/40" : "hover:bg-slate-50/50"}`}
                    >
                      {/* S.No */}
                      <td className="px-4 py-3.5 text-[12px] font-bold text-slate-300 w-10">
                        {globalIndex}
                      </td>

                      {/* Full Name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {!isRead && (
                            <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                          )}
                          <span
                            className={`text-[13px] font-semibold truncate max-w-[140px]
                              ${!isRead ? "text-slate-800" : "text-slate-500"}`}
                          >
                            {msg.fullName}
                          </span>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="px-4 py-3.5 text-[12px] text-slate-500 max-w-[180px]">
                        {truncate(msg.subject, 35)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
                            ${isRead
                              ? "bg-slate-100 text-slate-400 border-slate-200"
                              : "bg-violet-100 text-violet-700 border-violet-200"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isRead ? "bg-slate-300" : "bg-violet-500"
                            }`}
                          />
                          {isRead ? "Read" : "Unread"}
                        </span>
                      </td>

                      {/* Sent At */}
                      <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleReadMore(msg)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 text-[11px] font-bold border border-violet-100 hover:border-violet-300 transition-colors"
                          >
                            <MdMarkEmailRead size={13} />
                            Read More
                          </button>
                          <button
                            onClick={() => setDeleteTarget(msg)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100 hover:border-red-300"
                          >
                            <MdDeleteForever size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      {!loading && (
        <PaginationBar
          currentPage={safePage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1); }}
          totalItems={totalItems}
        />
      )}

      {/* ── Modals ───────────────────────────────────────────── */}
      {selectedMsg && (
        <DetailModal message={selectedMsg} onClose={() => setSelectedMsg(null)} />
      )}
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