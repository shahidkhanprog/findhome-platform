import { MdWarning, MdDeleteForever } from "react-icons/md";

export default function DeleteUserModal({ user, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 w-full max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <MdWarning size={24} className="text-red-500" />
        </div>

        <h3 className="text-[15px] font-bold text-slate-800 mb-1">Delete User?</h3>
        <p className="text-[13px] text-slate-500 mb-1">
          You are about to permanently delete{" "}
          <span className="font-semibold text-slate-700">{user?.username}</span>.
        </p>
        <ul className="text-[11px] text-red-500 space-y-1 mb-5 list-disc list-inside">
          <li>All their property listings will be removed</li>
          <li>All chats and messages will be erased</li>
          <li>This action cannot be undone</li>
        </ul>

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
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <MdDeleteForever size={15} />}
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
}