import { useState } from "react";
import { MdEdit, MdToggleOff, MdToggleOn, MdDeleteForever, MdAdminPanelSettings, MdPerson, MdOutlineHome } from "react-icons/md";

// Local Avatar (gray, not gradient)
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

export default function UserTableRow({ user, index, isSelf, onEdit, onToggle, onDelete }) {
  const postCount = (() => {
    if (typeof user._count?.posts === "number") return user._count.posts;
    if (typeof user.postCount === "number") return user.postCount;
    if (typeof user._count?.Post === "number") return user._count.Post;
    if (Array.isArray(user.posts)) return user.posts.length;
    if (Array.isArray(user.Post)) return user.Post.length;
    return 0;
  })();
  const isActive = user.isActive !== false;

  return (
    <tr className={`border-b border-gray-50 transition-colors ${!isActive ? "bg-slate-50/60" : "hover:bg-gray-50/30"}`}>
      <td className="px-4 py-3.5 text-[12px] font-bold text-slate-300 w-10">{index}</td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Avatar src={user.avatar} name={user.username} />
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white
              ${isActive ? "bg-emerald-400" : "bg-slate-300"}`} />
          </div>
          <span className={`text-[13px] font-bold truncate max-w-[120px] ${isActive ? "text-slate-700" : "text-slate-400"}`}>
            {user.username}
            {isSelf && (
              <span className="ml-1.5 text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full border border-gray-200">
                You
              </span>
            )}
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 border border-gray-100 text-[11px] font-bold px-2.5 py-1 rounded-full">
          <MdOutlineHome size={11} />
          {postCount}
        </span>
      </td>

      <td className="px-4 py-3.5 text-[12px] text-slate-500 truncate max-w-[160px]">{user.email}</td>

      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
          ${user.role === "ADMIN"
            ? "bg-gray-100 text-gray-700 border-gray-200"
            : "bg-slate-100 text-slate-500 border-slate-200"}`}>
          {user.role === "ADMIN" ? <MdAdminPanelSettings size={11} /> : <MdPerson size={11} />}
          {user.role}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
          ${isActive
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-slate-100 text-slate-400 border-slate-200"}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-emerald-400" : "bg-slate-300"}`} />
          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEdit(user)}
            className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 flex items-center justify-center transition-colors border border-gray-100 hover:border-gray-300"
            title="Edit role"
          >
            <MdEdit size={15} />
          </button>

          <button
            onClick={() => !isSelf && onToggle(user)}
            disabled={isSelf}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border disabled:opacity-30 disabled:cursor-not-allowed
              ${isActive
                ? "bg-amber-50 hover:bg-amber-100 text-amber-500 border-amber-100 hover:border-amber-300"
                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-100 hover:border-emerald-300"}`}
            title={isSelf ? "Cannot change your own status" : isActive ? "Deactivate" : "Activate"}
          >
            {isActive ? <MdToggleOff size={17} /> : <MdToggleOn size={17} />}
          </button>

          <button
            onClick={() => !isSelf && onDelete(user)}
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
}