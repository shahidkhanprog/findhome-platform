import { useState, useRef, useContext } from "react";
import {MdOutlineModeEdit, MdOutlineEmail, MdOutlinePerson, MdOutlineLock, MdCheckCircle, MdError, MdWarning, MdVisibility, MdVisibilityOff,} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

/* ─── Avatar ─────────────────────────────────────────────────────── */
function Avatar({ src, name = "", size = 80 }) {
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover border-[3px] border-violet-100 flex-shrink-0"
        style={{ width: size, height: size }}
        onError={(e) => { e.currentTarget.style.display = "none"; }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 border-[3px] border-violet-100 select-none"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {letter}
    </div>
  );
}

/* ─── Field ──────────────────────────────────────────────────────── */
function Field({ label, type = "text", value, onChange, placeholder, disabled, icon: Icon, error, showToggle, onToggleShow, isVisible }) {
  const [focused, setFocused] = useState(false);
  const inputType = showToggle ? (isVisible ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
        {Icon && <Icon size={13} className="text-slate-400" />}
        {label}
        {disabled && (
          <span className="ml-1 text-[10px] font-semibold bg-slate-100 text-slate-400 rounded px-1.5 py-px">
            locked
          </span>
        )}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
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
          <MdWarning size={13} />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Card ───────────────────────────────────────────────────────── */
function Card({ title, children, headerRight }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-100">
      {title && (
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[13px] font-bold text-slate-700">{title}</h3>
          {headerRight}
        </div>
      )}
      <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

/* ─── Profile ────────────────────────────────────────────────────── */
export default function Profile() {
  const { currentUser, UpdateUser } = useContext(AuthContext);

  // Mirror the exact same unwrap pattern used in Navbar:
  // currentUser = { userData: { _id, username, email, avatar, role, createdAt, ... } }
  const user = currentUser?.userData ?? {};

  const [username, setUsername] = useState(user.username ?? "");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [preview,  setPreview]  = useState(user.avatar ?? null);

  const [status,   setStatus]   = useState("idle"); // "idle" | "loading" | "saved" | "error"
  const [apiError, setApiError] = useState("");

  const [changePassword, setChangePassword] = useState(false);
  const [showPassword,   setShowPassword]   = useState(false);
  const [showConfirm,    setShowConfirm]    = useState(false);

  const [errors, setErrors] = useState({ username: "", password: "", confirm: "" });

  const fileRef = useRef();

  /* ── Toggle change-password section ── */
  const handleToggleChangePassword = () => {
    const next = !changePassword;
    setChangePassword(next);
    if (!next) {
      setPassword("");
      setConfirm("");
      setShowPassword(false);
      setShowConfirm(false);
      setErrors((prev) => ({ ...prev, password: "", confirm: "" }));
    }
  };

  /* ── Validation ── */
  const validate = () => {
    const newErrors = { username: "", password: "", confirm: "" };
    let valid = true;

    if (!username.trim()) {
      newErrors.username = "Username cannot be empty.";
      valid = false;
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
      valid = false;
    } else if (!/^[a-zA-Z0-9_ ]+$/.test(username.trim())) {
      newErrors.username = "Only letters, numbers, spaces, and underscores allowed.";
      valid = false;
    }

    if (changePassword) {
      if (!password) {
        newErrors.password = "New password is required.";
        valid = false;
      } else if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
        valid = false;
      }
      if (!confirm) {
        newErrors.confirm = "Please confirm your new password.";
        valid = false;
      } else if (password && password !== confirm) {
        newErrors.confirm = "Passwords do not match.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  /* ── Avatar upload ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

 const handleSave = async () => {
    setApiError("");
    if (!validate()) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    const payload = {
      username: username.trim(),
      avatar: preview,
      ...(changePassword && password ? { password } : {}),
    };

    setStatus("loading");

    const userId = user.id;

    if (!userId) {
      setApiError("User ID not found. Please log out and log in again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    try {
      const res = await apiRequest.put(`/users/${userId}`, payload);

      const updatedUser = res.data; // ✅ axios — no res.ok, no res.json()

      UpdateUser({
        ...currentUser,
        userData: { ...user, ...updatedUser },
      });

      setPassword("");
      setConfirm("");
      setChangePassword(false);
      setShowPassword(false);
      setShowConfirm(false);
      setErrors({ username: "", password: "", confirm: "" });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.log("Error status:", err.response?.status);
      console.log("Error message:", err.response?.data);
      setApiError(err.response?.data?.message || err.message || "Something went wrong.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
};

  /* ── Clear field errors on change ── */
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };
  const handleConfirmChange = (e) => {
    setConfirm(e.target.value);
    if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: "" }));
  };

  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="flex flex-col gap-3 sm:gap-4 w-full max-w-[560px] px-0">

      {/* ── Avatar card ──────────────────────────────────────── */}
      <Card>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-shrink-0">
            <Avatar src={preview} name={username} size={72} />
            <button
              onClick={() => fileRef.current?.click()}
              title="Change photo"
              className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 border-2 border-white flex items-center justify-center cursor-pointer shadow-md shadow-violet-300 hover:scale-110 transition-transform"
            >
              <MdOutlineModeEdit size={12} color="white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="flex-1 min-w-0 flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <p className="text-[15px] font-bold text-slate-800 leading-tight">
                {username.trim() || "Your Name"}
              </p>
              <span className="bg-violet-50 text-violet-700 text-[11px] font-bold rounded-full px-2.5 py-0.5 capitalize">
                {user.role ?? "Member"}
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5 text-center sm:text-left">
              Member since {memberYear}
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-2 text-[12px] text-violet-600 font-semibold bg-transparent border-none cursor-pointer p-0 hover:text-violet-800 transition-colors"
            >
              Change profile picture →
            </button>
          </div>
        </div>
      </Card>

      {/* ── Account info ─────────────────────────────────────── */}
      <Card title="Account Information">
        <Field
          label="Email Address"
          type="email"
          value={user.email ?? ""}
          disabled
          icon={MdOutlineEmail}
          placeholder="email@example.com"
        />
        <Field
          label="Username"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Enter your username"
          icon={MdOutlinePerson}
          error={errors.username}
        />
      </Card>

      {/* ── Change password ──────────────────────────────────── */}
      <Card
        title="Password"
        headerRight={
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-[12px] font-semibold text-slate-500">
              {changePassword ? "Cancel" : "Change password"}
            </span>
            <div
              onClick={handleToggleChangePassword}
              className={[
                "relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0",
                changePassword ? "bg-gradient-to-r from-violet-600 to-purple-600" : "bg-slate-200",
              ].join(" ")}
            >
              <div
                className={[
                  "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                  changePassword ? "translate-x-4" : "translate-x-0.5",
                ].join(" ")}
              />
            </div>
          </label>
        }
      >
        {!changePassword ? (
          <div className="flex items-center gap-3 py-1">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <MdOutlineLock size={16} className="text-slate-400" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-700">Password is set</p>
              <p className="text-[11.5px] text-slate-400 mt-0.5">
                Toggle the switch to update your password.
              </p>
            </div>
          </div>
        ) : (
          <>
            <Field
              label="New Password *"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              icon={MdOutlineLock}
              error={errors.password}
              showToggle
              isVisible={showPassword}
              onToggleShow={() => setShowPassword((v) => !v)}
            />
            <Field
              label="Confirm New Password *"
              value={confirm}
              onChange={handleConfirmChange}
              placeholder="Repeat new password"
              icon={MdOutlineLock}
              error={errors.confirm}
              showToggle
              isVisible={showConfirm}
              onToggleShow={() => setShowConfirm((v) => !v)}
            />
            <p className="text-[11.5px] text-slate-400 -mt-1">
              * Both fields are required to update your password.
            </p>
          </>
        )}
      </Card>

      {/* ── API error banner ─────────────────────────────────── */}
      {apiError && (
        <p className="flex items-center gap-2 text-[12.5px] text-red-500 font-medium bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          <MdError size={15} />
          {apiError}
        </p>
      )}

      {/* ── Save button ──────────────────────────────────────── */}
      <button
        onClick={handleSave}
        disabled={status === "loading"}
        className={[
          "w-full py-3 rounded-xl text-[14px] font-bold text-white border-none cursor-pointer transition-all",
          "hover:opacity-90 hover:-translate-y-px active:translate-y-0",
          "disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0",
          status === "saved"
            ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-md shadow-emerald-200"
            : status === "error"
            ? "bg-gradient-to-r from-red-500 to-rose-500 shadow-md shadow-red-200"
            : "bg-gradient-to-r from-violet-600 to-purple-600 shadow-md shadow-violet-200",
        ].join(" ")}
      >
        <span className="flex items-center justify-center gap-2">
          {status === "saved" && <MdCheckCircle size={17} />}
          {status === "error" && <MdError size={17} />}
          {status === "loading"
            ? "Saving…"
            : status === "saved"
            ? "Changes Saved!"
            : status === "error"
            ? "Fix errors above"
            : "Save Changes"}
        </span>
      </button>

    </div>
  );
}