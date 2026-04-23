import { MdFavoriteBorder } from "react-icons/md";

export default function UnsaveModal({ post, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full z-10 flex flex-col gap-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto">
          <MdFavoriteBorder size={24} className="text-rose-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Remove from Saved?</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            "<span className="text-slate-600 font-medium">{post?.title}</span>" will be removed from your saved list.
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
            {loading ? "Removing…" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}