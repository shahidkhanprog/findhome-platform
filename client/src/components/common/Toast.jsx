import { MdCheck, MdClose } from "react-icons/md";

export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[13px] font-semibold transition-all
      ${toast.type === "error" ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"}`}>
      {toast.type === "error" ? <MdClose size={15} /> : <MdCheck size={15} />}
      {toast.msg}
    </div>
  );
}