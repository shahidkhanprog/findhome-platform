// src/components/profile/DeleteAccountSection.jsx
import { useState } from "react";
import { MdDeleteForever, MdWarning, MdError, MdExpandMore, MdExpandLess } from "react-icons/md";
import ConfirmModal from "./ConfirmModal";

const DELETE_ITEMS = [
  {
    key: "account",
    text: (
      <>
        Your <strong>account will be permanently deleted</strong>
      </>
    ),
  },
  {
    key: "listings",
    text: (
      <>
        All <strong>property listings</strong> will be removed forever
      </>
    ),
  },
  {
    key: "chats",
    text: (
      <>
        All <strong>chats and messages</strong> will be erased
      </>
    ),
  },
  {
    key: "data",
    text: "You will lose access to saved properties and all data",
  },
];

export default function DeleteAccountSection({ onDelete, loading, error }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-4 sm:p-5 gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MdDeleteForever size={16} className="text-red-500" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13px] font-bold text-slate-700 truncate">
                Delete Account
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Permanently remove your account &amp; data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden xs:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200 whitespace-nowrap">
              Irreversible
            </span>
            {expanded ? (
              <MdExpandLess size={18} className="text-slate-400" />
            ) : (
              <MdExpandMore size={18} className="text-slate-400" />
            )}
          </div>
        </button>

        <div className="xs:hidden px-4 pb-2 flex">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">
            Irreversible
          </span>
        </div>

        {expanded && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="rounded-xl p-4 border border-red-200 bg-red-50">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-red-700 mb-2 flex items-center gap-1.5">
                  <MdWarning size={15} className="text-red-600 flex-shrink-0" />
                  Permanent action — this cannot be undone
                </p>
                <ul className="text-[11px] text-red-600 space-y-1.5 list-disc list-inside">
                  {DELETE_ITEMS.map((item) => (
                    <li key={item.key}>{item.text}</li>
                  ))}
                </ul>

                {error && (
                  <p className="mt-3 text-[11px] text-red-700 bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <MdError size={12} className="flex-shrink-0" /> {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  className="mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <MdDeleteForever size={16} />
                  )}
                  {loading ? "Deleting…" : "Yes, Permanently Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account Permanently"
        message="Are you absolutely sure? This will permanently delete your account, all property listings, chats, and saved data. This action cannot be undone."
        confirmText="Yes, Delete Forever"
        cancelText="Cancel"
        loading={loading}
      />
    </>
  );
}