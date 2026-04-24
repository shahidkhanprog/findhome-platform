// src/components/profile/PasswordSection.jsx
import { Field, PasswordInput, Toggle } from "./FormFields";

export default function PasswordSection({
  enabled,
  onToggle,
  password,
  confirm,
  errors,
  onPasswordChange,
  onConfirmChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-50 p-5 flex flex-col gap-4">
      <Toggle checked={enabled} onChange={onToggle} label="Change Password" />

      {enabled && (
        <div className="flex flex-col gap-3 pt-1 border-t border-slate-100">
          <Field label="New Password" error={errors.password}>
            <PasswordInput
              value={password}
              onChange={onPasswordChange}
              placeholder="New password"
            />
          </Field>

          <Field label="Confirm Password" error={errors.confirm}>
            <PasswordInput
              value={confirm}
              onChange={onConfirmChange}
              placeholder="Confirm password"
            />
          </Field>
        </div>
      )}
    </div>
  );
}