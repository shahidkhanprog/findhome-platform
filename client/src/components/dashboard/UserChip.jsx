import { MdPerson } from "react-icons/md";

export default function UserChip({ username, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-[10px] font-semibold rounded-full px-2.5 py-1 whitespace-nowrap hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm active:scale-95 transition-all cursor-pointer flex-shrink-0 w-[100%]"
      title={`View ${username}'s profile`}
    >
      <MdPerson size={11} />
      {username}
    </button>
  );
}