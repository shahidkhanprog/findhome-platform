import { useState, useEffect } from "react";
import { MdClose, MdEmail, MdPerson } from "react-icons/md";
import Avatar from "../common/Avatar";
import apiRequest from "../../lib/apiRequest";

export default function UserProfileDialog({ user: initialUser, onClose }) {
  if (!initialUser) return null;

  const [fullUser, setFullUser] = useState(initialUser);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    if (!initialUser?.id) return;
    const load = async () => {
      setFetchLoading(true);
      setFetchError("");
      try {
        const res = await apiRequest.get(`/users/${initialUser.id}`);
        setFullUser(res.data);
      } catch {
        setFetchError("Could not load user details.");
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [initialUser?.id]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-[fadeInScale_0.18s_ease-out]">
        <div className="h-1.5 w-full bg-gray-500" />
        <div className="flex justify-end px-4 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            aria-label="Close dialog"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3 px-6 pb-7 pt-1">
          <Avatar src={fullUser.avatar} name={fullUser.username} className="w-20 h-20" textClass="text-3xl" />
          <div className="text-center">
            <p className="text-lg font-bold text-slate-800">{fullUser.username}</p>
            <span className="inline-flex items-center gap-1 mt-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-gray-200">
              <MdPerson size={10} />
              {fullUser.role ?? "USER"}
            </span>
          </div>
          {fetchLoading ? (
            <div className="h-4 w-44 bg-slate-100 rounded-full animate-pulse mt-1" />
          ) : fetchError ? (
            <p className="text-[11px] text-rose-400 mt-1">{fetchError}</p>
          ) : fullUser.email ? (
            <a
              href={`mailto:${fullUser.email}`}
              className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-gray-600 transition-colors mt-1 break-all text-center"
            >
              <MdEmail size={15} className="text-gray-400 flex-shrink-0" />
              {fullUser.email}
            </a>
          ) : (
            <p className="text-[12px] text-slate-400 mt-1 flex items-center gap-1.5">
              <MdEmail size={13} className="text-slate-300" />
              No email on record
            </p>
          )}
          <div className="w-full border-t border-slate-100 my-1" />
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-[13px] font-semibold transition-all"
          >
            Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}