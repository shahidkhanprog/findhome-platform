import { MdOutlineEmail, MdArrowBack, MdRefresh } from "react-icons/md";
import ForgotField from "./ForgotField";
import OtpInput from "./OtpInput";
import Spinner from "./Spinner";

/**
 * OtpStep
 * -------
 * Step 1 of the ForgotPassword flow.
 * Shows the locked email, OTP boxes, resend timer, and verify button.
 *
 * Props:
 *   email        {string}
 *   otp          {string}
 *   onOtpChange  {function}  - updates OTP + clears errors
 *   onSubmit     {function}  - verify form submit handler
 *   onResend     {function}  - resend OTP handler
 *   onBack       {function}  - go back to email step
 *   error        {string}    - OTP field error
 *   loading      {boolean}
 *   resendTimer  {number}    - countdown seconds remaining
 *   btnClass     {string}    - primary button class string
 */
const OtpStep = ({
  email,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  onBack,
  error,
  loading,
  resendTimer,
  btnClass,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Locked email display */}
      <ForgotField
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
          onChange={onOtpChange}
          error={error}
          disabled={loading}
        />
      </div>

      {/* Resend row */}
      <div className="flex items-center justify-center gap-1 text-[12.5px]">
        <span className="text-slate-400">Didn't receive it?</span>
        {resendTimer > 0 ? (
          <span className="text-slate-400 font-semibold">
            Resend in {resendTimer}s
          </span>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-violet-600 font-semibold hover:text-violet-800 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <MdRefresh size={14} /> Resend Code
          </button>
        )}
      </div>

      {/* Verify button */}
      <button
        type="submit"
        disabled={loading || otp.replace(/\D/g, "").length < 6}
        className={btnClass}
      >
        {loading && <Spinner />}
        {loading ? "Verifying…" : "Verify Code"}
      </button>

      {/* Back link */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 text-[12.5px] text-slate-400 hover:text-slate-600 transition-colors mx-auto"
      >
        <MdArrowBack size={14} /> Back to email
      </button>
    </form>
  );
};

export default OtpStep;
