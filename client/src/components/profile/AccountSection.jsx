// src/components/profile/AccountSection.jsx
import { MdOutlineEmail, MdOutlinePerson, MdPhone } from "react-icons/md";
import { Field, LocalTextInput } from "./FormFields";

export default function AccountSection({
  email,
  username,
  phone,
  usernameError,
  phoneError,
  onUsernameCommit,   // renamed from onUsernameChange
  onPhoneCommit,      // renamed from onPhoneChange
}) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm shadow-violet-50 p-5 flex flex-col gap-4">
      <h3 className="text-[13px] font-bold text-slate-700">Account Info</h3>

      <Field label="Email" icon={MdOutlineEmail}>
        <LocalTextInput initialValue={email} disabled />
      </Field>

      <Field label="Username" icon={MdOutlinePerson} error={usernameError}>
        <LocalTextInput
          initialValue={username}
          onCommit={onUsernameCommit}
          placeholder="Enter username"
        />
      </Field>

      <Field label="Phone Number" icon={MdPhone} error={phoneError}>
        <LocalTextInput
          initialValue={phone}
          onCommit={onPhoneCommit}
          placeholder="e.g., +1 234 567 8900"
        />
      </Field>
    </div>
  );
}