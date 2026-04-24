// src/components/profile/SaveButton.jsx
import { MdSave, MdCheck } from "react-icons/md";

export default function SaveButton({ status, onClick }) {
  const isSaved = status === "saved";
  const isLoading = status === "loading";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all
        ${
          isSaved
            ? "bg-emerald-500 text-white"
            : "bg-gray-900 text-white disabled:opacity-60"
        }`}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {isSaved && <MdCheck size={16} />}
      {!isLoading && !isSaved && <MdSave size={15} />}
      {isLoading ? "Saving…" : isSaved ? "Saved!" : "Save Changes"}
    </button>
  );
}