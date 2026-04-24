// src/components/profile/PasswordSection.jsx
import { Field, PasswordInput, Toggle } from "./FormFields";

export default function PasswordSection({
  enabled,
  onToggle,
  password,
  confirm,
  passwordError,
  confirmError,
  onPasswordChange,
  onConfirmChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-50 p-5 flex flex-col gap-4">
      <Toggle checked={enabled} onChange={onToggle} label="Change Password" />

      <div className={`flex flex-col gap-3 pt-1 border-t border-slate-100 ${enabled ? "block" : "hidden"}`}>
        <Field label="New Password" error={passwordError}>
          <PasswordInput
            value={password}
            onCommit={onPasswordChange}
            placeholder="New password"
          />
        </Field>

        <Field label="Confirm Password" error={confirmError}>
          <PasswordInput
            value={confirm}
            onCommit={onConfirmChange}
            placeholder="Confirm password"
          />
        </Field>
      </div>
    </div>
  );
}