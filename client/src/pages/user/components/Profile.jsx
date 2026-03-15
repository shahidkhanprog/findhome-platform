import { useState, useRef } from "react";
import { Avatar } from "./ui";
import { INPUT_CLS, LABEL_CLS } from "../constants";

export default function Profile({ user, onSave }) {
  const [form, setForm]       = useState({ ...user });
  const [preview, setPreview] = useState(user.avatar);
  const [saved, setSaved]     = useState(false);
  const fileRef = useRef();

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm(f => ({ ...f, avatar: url }));
  };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Settings</h2>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        {/* Avatar row */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative shrink-0">
            <Avatar src={preview} name={form.username} size={72} />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-indigo-700 transition-colors shadow"
            >
              ✎
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-800 truncate">{form.username}</p>
            <p className="text-sm text-slate-400">
              {form.role} · Member since {new Date(form.createdAt).getFullYear()}
            </p>
            <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline mt-0.5">
              Change profile picture
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{ label:"Username", key:"username" }, { label:"Email", key:"email" }].map(({ label, key }) => (
            <div key={key}>
              <label className={LABEL_CLS}>{label}</label>
              <input
                type="text"
                value={form[key] || ""}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className={INPUT_CLS}
              />
            </div>
          ))}

          <div>
            <label className={LABEL_CLS}>New Password</label>
            <input type="password" placeholder="Leave blank to keep" className={INPUT_CLS} />
          </div>

          <div>
            <label className={LABEL_CLS}>Role</label>
            <select
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className={INPUT_CLS}
            >
              <option value="agent">Agent</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`mt-6 w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
            saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {saved ? "✓ Saved!" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}