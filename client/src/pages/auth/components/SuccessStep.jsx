import { Link } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";

/**
 * SuccessStep
 * -----------
 * Step 3 (done state) of the ForgotPassword flow.
 * Shows a success icon and a link back to login.
 */
const SuccessStep = () => {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-200">
        <MdCheckCircle size={34} color="white" />
      </div>
      <p className="text-[13px] text-slate-500 leading-relaxed">
        You can now sign in to your account using your new password.
      </p>
      <Link
        to="/login"
        className="w-full py-3 rounded-xl text-[14px] font-bold text-white text-center bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-violet-200 hover:opacity-90 transition-all"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default SuccessStep;
