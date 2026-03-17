// import { useState, useRef } from "react";
// import { Avatar } from "./ui";
// import { INPUT_CLS, LABEL_CLS } from "../constants";

// export default function Profile({ user, onSave }) {
//   const [form, setForm]       = useState({ ...user });
//   const [preview, setPreview] = useState(user.avatar);
//   const [saved, setSaved]     = useState(false);
//   const fileRef = useRef();

//   const handleImageChange = e => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const url = URL.createObjectURL(file);
//     setPreview(url);
//     setForm(f => ({ ...f, avatar: url }));
//   };

//   const handleSave = () => {
//     onSave(form);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2000);
//   };

//   return (
//     <div className="max-w-xl">
//       <h2 className="text-lg font-semibold text-slate-800 mb-6">Profile Settings</h2>

//       <div className="bg-white rounded-2xl border border-slate-200 p-6">
//         {/* Avatar row */}
//         <div className="flex items-center gap-5 mb-6">
//           <div className="relative shrink-0">
//             <Avatar src={preview} name={form.username} size={72} />
//             <button
//               onClick={() => fileRef.current?.click()}
//               className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-indigo-700 transition-colors shadow"
//             >
//               ✎
//             </button>
//             <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//           </div>
//           <div className="min-w-0">
//             <p className="font-semibold text-slate-800 truncate">{form.username}</p>
//             <p className="text-sm text-slate-400">
//               {form.role} · Member since {new Date(form.createdAt).getFullYear()}
//             </p>
//             <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:underline mt-0.5">
//               Change profile picture
//             </button>
//           </div>
//         </div>

//         {/* Form fields */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {[{ label:"Username", key:"username" }, { label:"Email", key:"email" }].map(({ label, key }) => (
//             <div key={key}>
//               <label className={LABEL_CLS}>{label}</label>
//               <input
//                 type="text"
//                 value={form[key] || ""}
//                 onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
//                 className={INPUT_CLS}
//               />
//             </div>
//           ))}

//           <div>
//             <label className={LABEL_CLS}>New Password</label>
//             <input type="password" placeholder="Leave blank to keep" className={INPUT_CLS} />
//           </div>

//           <div>
//             <label className={LABEL_CLS}>Role</label>
//             <select
//               value={form.role}
//               onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
//               className={INPUT_CLS}
//             >
//               <option value="agent">Agent</option>
//               <option value="buyer">Buyer</option>
//               <option value="seller">Seller</option>
//             </select>
//           </div>
//         </div>

//         <button
//           onClick={handleSave}
//           className={`mt-6 w-full rounded-xl py-2.5 text-sm font-medium transition-all ${
//             saved ? "bg-emerald-500 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"
//           }`}
//         >
//           {saved ? "✓ Saved!" : "Save Profile"}
//         </button>
//       </div>
//     </div>
//   );
// }

// pages/dashboard/Profile.jsx
// ─────────────────────────────────────────────────────────────────
// User schema:  id · username · email · password · avatar · role · createdAt · updatedAt
// Editable:     username · password · avatar (profile picture)
// Read-only:    email (shown but disabled)
// Hidden:       id · role · createdAt · updatedAt
// ─────────────────────────────────────────────────────────────────
import { useState, useRef, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext"; // adjust path if needed

/* ─── Dummy user — swap with real AuthContext data ───────────────
   Shape matches your schema exactly. When you wire up real data,
   replace DUMMY_USER with:  const { currentUser } = useContext(AuthContext);
   and replace updateUser()  with your real update call / API request.
   ──────────────────────────────────────────────────────────────── */
const DUMMY_USER = {
  id:        "usr_01",
  username:  "ahmad_khan",
  email:     "ahmad@example.com",
  password:  "",                         // never pre-fill password
  avatar:    null,                       // null → show initials avatar
  role:      "User",
  createdAt: "2024-03-01T00:00:00.000Z",
  updatedAt: "2025-01-10T00:00:00.000Z",
};

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ src, name = "", size = 80 }) {
  const initials = name.slice(0, 2).toUpperCase() || "U";
  return src ? (
    <img src={src} alt={name} style={{
      width: size, height: size, borderRadius: "50%",
      objectFit: "cover", flexShrink: 0,
      border: "3px solid #ede9fe",
    }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700, color: "#fff",
      border: "3px solid #ede9fe", letterSpacing: 1,
    }}>
      {initials}
    </div>
  );
}

/* ─── Reusable field ─────────────────────────────────────────────── */
function Field({ label, type = "text", value, onChange, placeholder, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 600,
        color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
      }}>
        {label}
        {disabled && (
          <span style={{
            marginLeft: 8, fontSize: 10, fontWeight: 600,
            background: "#f1f5f9", color: "#94a3b8",
            borderRadius: 4, padding: "2px 6px", textTransform: "uppercase", letterSpacing: "0.05em",
          }}>locked</span>
        )}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 13px",
          fontSize: 14, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif",
          background: disabled ? "#f8fafc" : "#f8f7ff",
          border: `1.5px solid ${focused && !disabled ? "#6366f1" : "#e8e8f0"}`,
          borderRadius: 10, outline: "none",
          boxShadow: focused && !disabled ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
          color: disabled ? "#94a3b8" : "#1e1b4b",
          cursor: disabled ? "not-allowed" : "text",
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

/* ─── Profile page ───────────────────────────────────────────────── */
export default function Profile() {
  // ── When real data is ready, replace these two lines: ──────────
  // const { currentUser, updateUser } = useContext(AuthContext);
  // const source = currentUser;
  const source = DUMMY_USER; // ← remove this when using real data
  // ───────────────────────────────────────────────────────────────

  const [username, setUsername] = useState(source.username ?? "");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [preview,  setPreview]  = useState(source.avatar ?? null);
  const [status,   setStatus]   = useState("idle"); // idle | saved | error
  const fileRef = useRef();

  /* Avatar upload */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  /* Save */
  const handleSave = () => {
    if (password && password !== confirm) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
      return;
    }

    // Build only the fields your API accepts
    const payload = {
      username,
      avatar: preview,
      ...(password ? { password } : {}),
    };

    // ── Replace this comment with your real update call: ─────────
    // updateUser(payload);           // AuthContext updater
    // await apiUpdateUser(payload);  // API call
    console.log("Save profile →", payload);
    // ─────────────────────────────────────────────────────────────

    setPassword("");
    setConfirm("");
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2500);
  };

  const memberYear = source.createdAt
    ? new Date(source.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .prof-root  { font-family:'DM Sans',sans-serif; max-width:580px; display:flex; flex-direction:column; gap:18px; }
        .prof-root * { box-sizing:border-box; }
        .prof-card  { background:#fff; border:1px solid #e8e8f0; border-radius:18px; overflow:hidden; }
        .prof-card-title { padding:15px 22px; border-bottom:1px solid #f1f0f9; font-size:13px; font-weight:700; color:#1e1b4b; }
        .prof-card-body  { padding:22px; display:flex; flex-direction:column; gap:16px; }
        .save-btn {
          width:100%; padding:12px; border:none; border-radius:11px;
          font-size:14px; font-weight:600; cursor:pointer;
          font-family:'DM Sans',sans-serif; color:#fff;
          transition: opacity .15s, transform .1s;
        }
        .save-btn:hover  { opacity:.91; transform:translateY(-1px); }
        .save-btn:active { transform:translateY(0); }
      `}</style>

      <div className="prof-root">

        {/* ── Avatar card ──────────────────────────────────────── */}
        <div className="prof-card">
          <div className="prof-card-body" style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>

            {/* Photo + pencil */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <Avatar src={preview} name={username} size={80} />
              <button
                onClick={() => fileRef.current?.click()}
                title="Change photo"
                style={{
                  position: "absolute", bottom: 1, right: 1,
                  width: 26, height: 26, borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  border: "2px solid #fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#fff",
                  boxShadow: "0 2px 6px rgba(99,102,241,.4)",
                }}
              >✎</button>
              <input ref={fileRef} type="file" accept="image/*"
                style={{ display: "none" }} onChange={handleImageChange} />
            </div>

            {/* Name + meta */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1e1b4b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {username || "Your Name"}
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 10px", textTransform: "capitalize" }}>
                {source.role} · Member since {memberYear}
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  fontSize: 12, color: "#6366f1", fontWeight: 600,
                  background: "none", border: "none", cursor: "pointer",
                  padding: 0, fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Change profile picture →
              </button>
            </div>

            {/* Role badge */}
            <span style={{
              flexShrink: 0,
              background: "#ede9fe", color: "#6366f1",
              borderRadius: 20, fontSize: 11, fontWeight: 700,
              padding: "4px 12px", textTransform: "capitalize",
            }}>
              {source.role}
            </span>
          </div>
        </div>

        {/* ── Account info ─────────────────────────────────────── */}
        <div className="prof-card">
          <div className="prof-card-title">Account Information</div>
          <div className="prof-card-body">

            {/* Email — disabled, matches schema */}
            <Field
              label="Email Address"
              type="email"
              value={source.email}
              disabled
              placeholder="email@example.com"
            />

            {/* Username — editable */}
            <Field
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
            />

          </div>
        </div>

        {/* ── Change password ──────────────────────────────────── */}
        <div className="prof-card">
          <div className="prof-card-title">Change Password</div>
          <div className="prof-card-body">

            <Field
              label="New Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
            <Field
              label="Confirm New Password"
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat new password"
            />

            {status === "error" && (
              <p style={{
                fontSize: 12, color: "#ef4444", fontWeight: 600,
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "8px 12px", margin: 0,
              }}>
                ✕ Passwords don't match — please try again.
              </p>
            )}
          </div>
        </div>

        {/* ── Save button ──────────────────────────────────────── */}
        <button
          className="save-btn"
          onClick={handleSave}
          style={{
            background:
              status === "saved" ? "linear-gradient(135deg,#10b981,#059669)" :
              status === "error" ? "linear-gradient(135deg,#ef4444,#dc2626)" :
              "linear-gradient(135deg,#6366f1,#8b5cf6)",
          }}
        >
          {status === "saved" ? "✓ Changes Saved!" :
           status === "error" ? "✕ Fix errors above" :
           "Save Changes"}
        </button>

      </div>
    </>
  );
}