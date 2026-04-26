import { Link } from "react-router-dom";
import { FaPhoneAlt, FaSignInAlt, FaWhatsapp } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ContactButtons({ onChatClick }) {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Link to="tel:+923449885555" className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-[#f36c3a] text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all active:scale-95">
        <FaPhoneAlt size={11} /> Call
      </Link>
      <Link to="https://wa.me/923449885555" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all active:scale-95">
        <FaWhatsapp size={13} /> WhatsApp
      </Link>
      {(currentUser) ? (
        <button onClick={onChatClick} className="flex items-center justify-center gap-1.5 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all active:scale-95 cursor-pointer">
          Chat
        </button>
      ) : (
        <Link to="/login" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all active:scale-95 cursor-pointer">
          <FaSignInAlt size={13} /> Login to Chat
        </Link>
      )}
    </div>
  );
}