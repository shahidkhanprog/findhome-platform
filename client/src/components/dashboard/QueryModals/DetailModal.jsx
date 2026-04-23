import { MdClose, MdEmail, MdPerson, MdPhone, MdSubject, MdMessage, MdAccessTime } from "react-icons/md";

export default function DetailModal({ message, onClose }) {
  if (!message) return null;

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden">
        <div className="h-1 w-full bg-gray-600" />

        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <MdEmail size={16} className="text-gray-600" />
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

        <div className="p-5 space-y-4">
          {[
            { Icon: MdPerson, color: "gray", label: "Full Name", content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.fullName}</p> },
            { Icon: MdEmail, color: "blue", label: "Email Address", content: <a href={`mailto:${message.email}`} className="text-[13px] font-semibold text-blue-600 hover:underline mt-0.5 block">{message.email}</a> },
            { Icon: MdPhone, color: "emerald", label: "Phone Number", content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.phone || <span className="text-slate-400 font-normal italic">Not provided</span>}</p> },
            { Icon: MdSubject, color: "amber", label: "Subject", content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{message.subject}</p> },
            { Icon: MdMessage, color: "purple", label: "Message", content: <p className="text-[13px] text-slate-700 mt-0.5 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3 border border-slate-100">{message.message}</p> },
            { Icon: MdAccessTime, color: "slate", label: "Sent At", content: <p className="text-[13px] font-semibold text-slate-800 mt-0.5">{formatDate(message.createdAt)}</p> },
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

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-gray-600 hover:bg-gray-700 text-white text-[13px] font-semibold transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}