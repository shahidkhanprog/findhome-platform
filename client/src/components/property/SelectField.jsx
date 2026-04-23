import { IC, sc } from "../../constants/addPropertyConstants.jsx";
import Field from "./Field";

export default function SelectField({ label, required, error, icon: Icon, value, onChange, fieldRef, placeholder, children }) {
  return (
    <Field label={label} required={required} error={error} icon={Icon}>
      <div className="relative">
        {Icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"><Icon className="w-4 h-4 text-slate-400" /></span>}
        <select ref={fieldRef} value={value} onChange={onChange} className={`${sc(value, !!error)} ${Icon ? "pl-9" : "pl-3"}`}>
          <option value="" disabled hidden>{placeholder || "Select…"}</option>
          {children}
        </select>
        <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${value ? "text-slate-400" : "text-red-400"}`}>
          <IC.ChevD className="w-4 h-4" />
        </span>
      </div>
      {!value && !error && <p className="text-[11px] text-slate-400 mt-1 pl-0.5">Please select an option</p>}
    </Field>
  );
}