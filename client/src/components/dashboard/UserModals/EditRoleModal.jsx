import { useState } from "react";
import { MdAdminPanelSettings, MdPerson, MdCheck } from "react-icons/md";

function Avatar({ src, name = "", className = "w-9 h-9", textClass = "text-sm" }) {
  const [err, setErr] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src && !err)
    return (
      <img
        src={src}
        alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-gray-100`}
        onError={() => setErr(true)}
      />
    );
  return (
    <div className={`${className} rounded-full bg-gray-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none`}>
      {letter}
    </div>
  );
}

export default function EditRoleModal({ user, onSave, onCancel, loading }) {
  const [role, setRole] = useState(user?.role ?? "USER");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full max-w-sm">
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
                  ? "bg-gray-600 text-white border-gray-600 shadow-md shadow-gray-200"
                  : "bg-white text-slate-600 border-slate-200 hover:border-gray-300"}`}
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
            className="flex-1 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white text-[13px] font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
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