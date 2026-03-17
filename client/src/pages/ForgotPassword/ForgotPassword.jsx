// pages/auth/ForgotPassword.jsx
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineEmail,
  MdOutlineLock,
  MdCheckCircle,
  MdWarning,
  MdArrowBack,
  MdVisibility,
  MdVisibilityOff,
  MdRefresh,
} from "react-icons/md";

/* ─────────────────────────────────────────────────────────────────
   MOCK API HELPERS — replace these with your real API calls
───────────────────────────────────────────────────────────────── */
const mockCheckEmail = (email) =>
  new Promise((resolve) =>
    setTimeout(() => {
      // Simulate: "ahmad@example.com" exists in DB
      resolve({ exists: email.toLowerCase() === "ahmad@example.com" });
    }, 1200)
  );

const mockSendOtp = (email) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 900)
  );

const mockVerifyOtp = (email, otp) =>
  new Promise((resolve) =>
    setTimeout(() => {
      // Simulate correct OTP = "123456"
      resolve({ valid: otp === "123456" });
    }, 900)
  );

const mockResetPassword = (email, password) =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ success: true }), 1000)
  );

/* ─────────────────────────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────────────────────────── */
const STEPS = ["Email", "OTP", "New Password"];

function StepBar({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 transition-all duration-300",
                  done
                    ? "bg-violet-600 border-violet-600 text-white"
                    : active
                    ? "bg-white border-violet-600 text-violet-600"
                    : "bg-white border-slate-200 text-slate-400",
                ].join(" ")}
              >
                {done ? <MdCheckCircle size={16} /> : i + 1}
              </div>
              <span
                className={[
                  "text-[10px] font-semibold uppercase tracking-wide",
                  active ? "text-violet-600" : done ? "text-violet-400" : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-[2px] w-10 sm:w-14 mb-5 mx-1 rounded-full transition-all duration-500",
                  i < current ? "bg-violet-600" : "bg-slate-200",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   FIELD
───────────────────────────────────────────────────────────────── */
function Field({ label, type = "text", value, onChange, placeholder, disabled, icon: Icon, error, showToggle, isVisible, onToggleShow, inputRef, maxLength }) {
  const [focused, setFocused] = useState(false);
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          {Icon && <Icon size={13} className="text-slate-400" />}
          {label}
          {disabled && (
            <span className="ml-1 text-[10px] font-semibold bg-slate-100 text-slate-400 rounded px-1.5 py-px">
              locked
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type={inputType}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full px-3 py-2.5 text-[13.5px] font-medium rounded-xl outline-none transition-all border",
            showToggle ? "pr-10" : "",
            disabled
              ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
              : error
              ? "bg-red-50 text-slate-800 border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : focused
              ? "bg-violet-50/50 text-slate-800 border-violet-400 ring-2 ring-violet-100"
              : "bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300",
          ].join(" ")}
        />
        {showToggle && !disabled && (
          <button
            type="button"
            onClick={onToggleShow}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
          >
            {isVisible ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
          </button>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11.5px] text-red-500 font-medium">
          <MdWarning size={13} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   OTP INPUT (6 boxes)
───────────────────────────────────────────────────────────────── */
function OtpInput({ value, onChange, error, disabled }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        const next = [...digits];
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        inputs.current[i - 1]?.focus();
        const next = [...digits];
        next[i - 1] = "";
        onChange(next.join(""));
      }
      return;
    }
    if (e.key === "ArrowLeft" && i > 0) { inputs.current[i - 1]?.focus(); return; }
    if (e.key === "ArrowRight" && i < 5) { inputs.current[i + 1]?.focus(); return; }
  };

  const handleChange = (i, e) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    if (!ch) return;
    const next = [...digits];
    next[i] = ch;
    onChange(next.join(""));
    if (i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(6, "").slice(0, 6).trimEnd());
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            disabled={disabled}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKey(i, e)}
            className={[
              "w-11 h-12 sm:w-12 sm:h-13 text-center text-[18px] font-bold rounded-xl border-2 outline-none transition-all",
              disabled ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed" :
              error ? "bg-red-50 border-red-300 text-slate-800" :
              d ? "bg-violet-50 border-violet-500 text-violet-700" :
              "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
            ].join(" ")}
          />
        ))}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[11.5px] text-red-500 font-medium justify-center">
          <MdWarning size={13} /> {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
export default function ForgotPassword() {
  // ── Step: 0=email, 1=otp, 2=newpass, 3=done
  const [step, setStep] = useState(0);

  // ── Fields
  const [email, setEmail]       = useState("");
  const [otp, setOtp]           = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  // ── UI state
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});
  const [showNew, setShowNew]         = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const emailRef = useRef(null);

  // ── Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ── STEP 0: Check email in DB then send OTP ── */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Enter a valid email address.";
    if (Object.keys(errs).length) { setErrors(errs); emailRef.current?.focus(); return; }

    setLoading(true);
    setErrors({});
    try {
      const { exists } = await mockCheckEmail(email);
      if (!exists) {
        setErrors({ email: "No account found with this email address." });
        setLoading(false);
        return;
      }
      await mockSendOtp(email);
      setStep(1);
      setResendTimer(60);
    } catch {
      setErrors({ email: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  /* ── STEP 1: Verify OTP ── */
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const filled = otp.replace(/\D/g, "");
    if (filled.length < 6) { setErrors({ otp: "Enter the complete 6-digit code." }); return; }

    setLoading(true);
    setErrors({});
    try {
      const { valid } = await mockVerifyOtp(email, filled);
      if (!valid) { setErrors({ otp: "Incorrect code. Please try again." }); setLoading(false); return; }
      setStep(2);
    } catch {
      setErrors({ otp: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  /* ── STEP 1: Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setOtp("");
    setErrors({});
    await mockSendOtp(email);
    setResendTimer(60);
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
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setErrors({});
    try {
      await mockResetPassword(email, newPass);
      setStep(3);
    } catch {
      setErrors({ newPass: "Something went wrong. Please try again." });
    }
    setLoading(false);
  };

  /* ── Shared button classes ── */
  const btnBase = "w-full py-3 rounded-xl text-[14px] font-bold text-white border-none cursor-pointer transition-all hover:opacity-90 hover:-translate-y-px active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0";
  const btnPrimary = `${btnBase} bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-violet-200`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-violet-50 to-purple-50 px-4 py-8">
      <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl p-6 sm:p-8 w-full max-w-md">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200 mb-4">
            <MdOutlineLock size={26} color="white" />
          </div>
          <h2 className="text-[22px] font-extrabold text-slate-800 leading-tight">
            {step === 3 ? "Password Reset!" : "Forgot Password?"}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1.5 leading-relaxed">
            {step === 0 && "Enter your email and we'll send a verification code."}
            {step === 1 && <>We sent a 6-digit code to <span className="font-semibold text-slate-700">{email}</span></>}
            {step === 2 && "Create a strong new password for your account."}
            {step === 3 && "Your password has been updated successfully."}
          </p>
        </div>

        {/* ── Step bar (hidden on done) ── */}
        {step < 3 && <StepBar current={step} />}

        {/* ════════════════════════════
            STEP 0 — Email
        ════════════════════════════ */}
        {step === 0 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <Field
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              placeholder="ahmad@example.com"
              icon={MdOutlineEmail}
              error={errors.email}
              inputRef={emailRef}
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? <Spinner /> : null}
              {loading ? "Checking…" : "Send Reset Code"}
            </button>
          </form>
        )}

        {/* ════════════════════════════
            STEP 1 — OTP
        ════════════════════════════ */}
        {step === 1 && (
          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">

            {/* Email display (locked) */}
            <Field
              label="Email Address"
              value={email}
              disabled
              icon={MdOutlineEmail}
            />

            {/* OTP boxes */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Verification Code
              </label>
              <OtpInput
                value={otp}
                onChange={(v) => { setOtp(v); setErrors({}); }}
                error={errors.otp}
                disabled={loading}
              />
            </div>

            {/* Resend */}
            <div className="flex items-center justify-center gap-1 text-[12.5px]">
              <span className="text-slate-400">Didn't receive it?</span>
              {resendTimer > 0 ? (
                <span className="text-slate-400 font-semibold">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-violet-600 font-semibold hover:text-violet-800 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <MdRefresh size={14} /> Resend Code
                </button>
              )}
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className={btnPrimary}>
              {loading ? <Spinner /> : null}
              {loading ? "Verifying…" : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={() => { setStep(0); setOtp(""); setErrors({}); }}
              className="flex items-center justify-center gap-1.5 text-[12.5px] text-slate-400 hover:text-slate-600 transition-colors mx-auto"
            >
              <MdArrowBack size={14} /> Back to email
            </button>
          </form>
        )}

        {/* ════════════════════════════
            STEP 2 — New Password
        ════════════════════════════ */}
        {step === 2 && (
          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <Field
              label="New Password"
              value={newPass}
              onChange={(e) => { setNewPass(e.target.value); setErrors(prev => ({ ...prev, newPass: "" })); }}
              placeholder="Minimum 6 characters"
              icon={MdOutlineLock}
              error={errors.newPass}
              showToggle
              isVisible={showNew}
              onToggleShow={() => setShowNew(v => !v)}
            />
            <Field
              label="Confirm New Password"
              value={confirmPass}
              onChange={(e) => { setConfirmPass(e.target.value); setErrors(prev => ({ ...prev, confirmPass: "" })); }}
              placeholder="Repeat new password"
              icon={MdOutlineLock}
              error={errors.confirmPass}
              showToggle
              isVisible={showConfirm}
              onToggleShow={() => setShowConfirm(v => !v)}
            />

            {/* Password strength hint */}
            {newPass && <PasswordStrength password={newPass} />}

            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? <Spinner /> : null}
              {loading ? "Saving…" : "Reset Password"}
            </button>
          </form>
        )}

        {/* ════════════════════════════
            STEP 3 — Done
        ════════════════════════════ */}
        {step === 3 && (
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
        )}

        {/* ── Footer link ── */}
        {step < 3 && (
          <p className="text-center text-slate-400 mt-5 text-[12.5px]">
            Remember your password?{" "}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-800 transition-colors">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   PASSWORD STRENGTH INDICATOR
───────────────────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  const checks = [
    { label: "6+ characters", pass: password.length >= 6 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special character", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="flex flex-col gap-2 -mt-1">
      {/* Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={[
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < score ? colors[score] : "bg-slate-200",
            ].join(" ")}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(c => (
            <span
              key={c.label}
              className={[
                "text-[10.5px] font-medium flex items-center gap-1",
                c.pass ? "text-emerald-600" : "text-slate-400",
              ].join(" ")}
            >
              {c.pass ? "✓" : "○"} {c.label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={["text-[11px] font-bold flex-shrink-0", score >= 3 ? "text-emerald-600" : score === 2 ? "text-yellow-500" : "text-red-500"].join(" ")}>
            {labels[score]}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   SPINNER
───────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}