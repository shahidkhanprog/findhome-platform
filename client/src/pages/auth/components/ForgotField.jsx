import { useState } from "react";
import { MdWarning, MdVisibility, MdVisibilityOff } from "react-icons/md";

/**
 * ForgotField
 * -----------
 * Styled input field used inside the ForgotPassword flow.
 * Supports focus ring, error state, disabled/locked state, and password toggle.
 *
 * Props:
 *   label         {string}      - field label (uppercase small text)
 *   type          {string}      - input type (default: "text")
 *   value         {string}
 *   onChange      {function}
 *   placeholder   {string}
 *   disabled      {boolean}     - locks the field and shows a "locked" badge
 *   icon          {Component}   - MD icon component (e.g. MdOutlineEmail)
 *   error         {string}      - inline error message
 *   showToggle    {boolean}     - show password visibility toggle
 *   isVisible     {boolean}     - current visibility state (controlled)
 *   onToggleShow  {function}    - toggle handler
 *   inputRef      {React.Ref}
 *   maxLength     {number}
 */
const ForgotField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  icon: Icon,
  error,
  showToggle,
  isVisible,
  onToggleShow,
  inputRef,
  maxLength,
}) => {
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
};

export default ForgotField;
