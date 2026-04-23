import { IC } from "../../constants/addPropertyConstants.jsx";

export default function Field({ label, required, error, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <IC.Alert className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}