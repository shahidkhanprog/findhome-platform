import { MdMarkEmailRead, MdDeleteForever } from "react-icons/md";

export default function QueryTableRow({ message, index, onReadMore, onDelete }) {
  const isRead = message.isRead;
  const truncate = (str, n = 40) => (str && str.length > n ? str.slice(0, n) + "…" : str);

  return (
    <tr className={`border-b border-gray-50 transition-colors ${!isRead ? "bg-gray-50/40" : "hover:bg-slate-50/50"}`}>
      <td className="px-4 py-3.5 text-[12px] font-bold text-slate-300 w-10">{index}</td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          {!isRead && <span className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" />}
          <span className={`text-[13px] font-semibold truncate max-w-[140px] ${!isRead ? "text-slate-800" : "text-slate-500"}`}>
            {message.fullName}
          </span>
        </div>
      </td>

      <td className="px-4 py-3.5 text-[12px] text-slate-500 max-w-[180px]">{truncate(message.subject, 35)}</td>

      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border
          ${isRead ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRead ? "bg-slate-300" : "bg-gray-500"}`} />
          {isRead ? "Read" : "Unread"}
        </span>
      </td>

      <td className="px-4 py-3.5 text-[11px] text-slate-400 whitespace-nowrap">
        {new Date(message.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
      </td>

      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onReadMore(message)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-100 hover:border-gray-300 transition-colors"
          >
            <MdMarkEmailRead size={13} />
            Read More
          </button>
          <button
            onClick={() => onDelete(message)}
            title="Delete"
            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors border border-red-100 hover:border-red-300"
          >
            <MdDeleteForever size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}