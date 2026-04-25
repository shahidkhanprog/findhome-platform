// src/components/property/LoginPromptModal.jsx
import { useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { FaHeart, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function LoginPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-1.5 w-full bg-orange-600 " />
        <div className="p-6">
          <div className="flex justify-end -mt-2">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
              <HiX size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
              <FaHeart className="text-rose-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Save this property?</h3>
            <p className="text-sm text-slate-500 mb-5">
              You need to be logged in to save properties to your favourites list.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleLogin}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold rounded-xl transition"
              >
                <FaSignInAlt size={14} /> Log in
              </button>
              <button
                onClick={handleSignup}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
              >
                <FaUserPlus size={14} /> Sign up
              </button>
            </div>
            <button
              onClick={onClose}
              className="mt-4 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}