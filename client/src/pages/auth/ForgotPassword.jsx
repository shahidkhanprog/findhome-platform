// pages/auth/ForgotPassword.jsx
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineLock } from "react-icons/md";
import apiRequest from "../../lib/apiRequest";

// Shared components & hook
import useRedirectIfLoggedIn from "./hooks/useRedirectIfLoggedIn";
import StepBar from "./components/StepBar";
import EmailStep from "./components/EmailStep";
import OtpStep from "./components/OtpStep";
import NewPasswordStep from "./components/NewPasswordStep";
import SuccessStep from "./components/SuccessStep";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // Redirect already-logged-in users to dashboard
  useRedirectIfLoggedIn();

  // ── Step: 0=email, 1=otp, 2=newpass, 3=done
  const [step, setStep] = useState(0);

  // ── Fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // ── UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [resendTimer, setResendTimer] = useState(0);

  const emailRef = useRef(null);

  // ── Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ── STEP 0: Send OTP ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      emailRef.current?.focus();
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await apiRequest.post("/auth/forgot-password", { email });
      setStep(1);
      setResendTimer(60);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setErrors({
        email:
          err?.response?.status === 404
            ? "No account found with this email address."
            : msg || "Something went wrong. Please try again.",
      });
    }
    setLoading(false);
  };

  /* ── STEP 1: Verify OTP ── */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const filled = otp.replace(/\D/g, "");
    if (filled.length < 6) {
      setErrors({ otp: "Enter the complete 6-digit code." });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await apiRequest.post("/auth/verify-otp", { email, otp: filled });
      setStep(2);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setErrors({
        otp:
          err?.response?.status === 400
            ? msg || "Incorrect or expired code. Please try again."
            : "Something went wrong. Please try again.",
      });
    }
    setLoading(false);
  };

  /* ── STEP 1: Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setOtp("");
    setErrors({});
    try {
      await apiRequest.post("/auth/forgot-password", { email });
      setResendTimer(60);
    } catch (err) {
      setErrors({ otp: "Failed to resend code. Please try again." });
    }
    setLoading(false);
  };

  /* ── STEP 2: Reset password ── */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPass) errs.newPass = "New password is required.";
    else if (newPass.length < 6) errs.newPass = "Password must be at least 6 characters.";
    if (!confirmPass) errs.confirmPass = "Please confirm your password.";
    else if (newPass && newPass !== confirmPass) errs.confirmPass = "Passwords do not match.";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await apiRequest.post("/auth/reset-password", { email, newPassword: newPass });
      setStep(3);
    } catch (err) {
      const msg = err?.response?.data?.message;
      setErrors({ newPass: msg || "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  // ── Shared primary button style
  const btnPrimary =
    "w-full py-3 rounded-xl text-[14px] font-bold text-white border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-violet-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-violet-50 to-purple-50 px-4 py-8">
      <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl p-6 sm:p-8 w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200 mb-4">
            <MdOutlineLock size={26} color="white" />
          </div>
          <h2 className="text-[22px] font-extrabold text-slate-800 leading-tight">
            {step === 3 ? "Password Reset!" : "Forgot Password?"}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
            {step === 0 && "Enter your email and we'll send a verification code."}
            {step === 1 && (
              <>
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-slate-700">{email}</span>
              </>
            )}
            {step === 2 && "Create a strong new password for your account."}
            {step === 3 && "Your password has been updated successfully."}
          </p>
        </div>

        {/* ── Step bar (hidden on done) ── */}
        {step < 3 && <StepBar current={step} />}

        {/* ── Step 0: Email ── */}
        {step === 0 && (
          <EmailStep
            email={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
            onSubmit={handleEmailSubmit}
            error={errors.email}
            loading={loading}
            btnClass={btnPrimary}
          />
        )}

        {/* ── Step 1: OTP ── */}
        {step === 1 && (
          <OtpStep
            email={email}
            otp={otp}
            onOtpChange={(v) => { setOtp(v); setErrors({}); }}
            onSubmit={handleOtpSubmit}
            onResend={handleResend}
            onBack={() => { setStep(0); setOtp(""); setErrors({}); }}
            error={errors.otp}
            loading={loading}
            resendTimer={resendTimer}
            btnClass={btnPrimary}
          />
        )}

        {/* ── Step 2: New Password ── */}
        {step === 2 && (
          <NewPasswordStep
            newPass={newPass}
            confirmPass={confirmPass}
            onNewPass={(e) => { setNewPass(e.target.value); setErrors((p) => ({ ...p, newPass: "" })); }}
            onConfirmPass={(e) => { setConfirmPass(e.target.value); setErrors((p) => ({ ...p, confirmPass: "" })); }}
            onSubmit={handlePasswordSubmit}
            errors={errors}
            loading={loading}
            btnClass={btnPrimary}
          />
        )}

        {/* ── Step 3: Done ── */}
        {step === 3 && <SuccessStep />}

        {/* ── Footer link ── */}
        {step < 3 && (
          <p className="text-center text-slate-400 mt-5 text-[12.5px]">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-violet-600 font-semibold hover:text-violet-800 transition-colors"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}