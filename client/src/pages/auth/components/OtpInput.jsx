import { useRef } from "react";
import { MdWarning } from "react-icons/md";

/**
 * OtpInput
 * --------
 * Six individual digit boxes for OTP entry.
 * Supports keyboard navigation (arrows, backspace) and paste.
 *
 * Props:
 *   value    {string}   - current OTP string (up to 6 digits)
 *   onChange {function} - called with updated OTP string
 *   error    {string}   - inline error message shown below boxes
 *   disabled {boolean}  - disables all boxes during loading
 */
const OtpInput = ({ value, onChange, error, disabled }) => {
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
    if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
      return;
    }
    if (e.key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
      return;
    }
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
              disabled
                ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed"
                : error
                ? "bg-red-50 border-red-300 text-slate-800"
                : d
                ? "bg-violet-50 border-violet-500 text-violet-700"
                : "bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-400 focus:ring-2 focus:ring-violet-100",
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
};

export default OtpInput;
