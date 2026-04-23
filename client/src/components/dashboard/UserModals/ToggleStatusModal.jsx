import { MdToggleOn, MdToggleOff } from "react-icons/md";

export default function ToggleStatusModal({ user, onConfirm, onCancel, loading }) {
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