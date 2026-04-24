// src/components/profile/FormFields.jsx
import { useState, memo, useRef } from "react";
import { MdError, MdVisibility, MdVisibilityOff, MdLock } from "react-icons/md";

export function Field({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon size={12} />} {label}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-rose-500 flex items-center gap-1">
          <MdError size={11} /> {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = memo(function TextInput({ value, onChange, disabled, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 text-[13px] rounded-xl border transition-all outline-none
        ${disabled
          ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
          : "bg-white text-slate-800 border-slate-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        }`}
    />
  );
});

export const LocalTextInput = memo(function LocalTextInput({ initialValue, onCommit, placeholder, disabled }) {
  const [localValue, setLocalValue] = useState(initialValue);

  const handleBlur = () => {
    if (localValue !== initialValue) onCommit(localValue);
  };

  return (
    <input
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 text-[13px] rounded-xl border transition-all outline-none
        ${disabled
          ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
          : "bg-white text-slate-800 border-slate-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        }`}
    />
  );
});

export function PasswordInput({ value, onCommit, placeholder }) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  const toggleShow = () => {
    if (!inputRef.current) return;
    inputRef.current.type = inputRef.current.type === "password" ? "text" : "password";
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="password"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}  // ✅ local state only
        onBlur={() => onCommit(localValue)}               // ✅ commit on blur
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 pr-10 text-[13px] rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <MdVisibility size={16} className="show-icon" />
        <MdVisibilityOff size={16} className="hide-icon hidden" />
      </button>
    </div>
  );
}


export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full"
    >
      <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
        <MdLock size={14} className="text-slate-400" /> {label}
      </span>
      <div className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-gray-600" : "bg-slate-200"}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${checked ? "left-5" : "left-0.5"}`} />
      </div>
    </button>
  );
}