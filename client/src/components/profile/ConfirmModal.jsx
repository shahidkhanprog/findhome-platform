// src/components/profile/ConfirmModal.jsx
import { MdDeleteForever, MdClose } from "react-icons/md";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MdDeleteForever size={16} className="text-red-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 rounded-lg hover:bg-slate-100"
          >
            <MdClose size={18} />
          </button>
        </div>

        <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {confirmText || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}