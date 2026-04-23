// Profile.jsx
import { useState, useContext, useCallback } from "react";
import {
  MdOutlineEmail,
  MdOutlinePerson,
  MdError,
  MdVisibility,
  MdVisibilityOff,
  MdCheck,
  MdLock,
  MdCameraAlt,
  MdSave,
  MdWarning,
  MdPowerSettingsNew,
  MdPhone,
  MdDeleteForever,
  MdClose,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import UploadWidget from "../../../components/uploadWidgets/UploadWidget";
import { useNavigate } from "react-router-dom";

/* ------------------------------------------------------------------
   All sub-components are defined OUTSIDE Profile so they are never
   re-created on re-render → inputs keep focus correctly.
   Fully responsive with Tailwind CSS.
------------------------------------------------------------------ */

/* ---------- Field Wrapper ---------- */
function Field({ label, icon: Icon, error, children }) {
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

/* ---------- Plain Text Input ---------- */
function TextInput({ value, onChange, disabled, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 text-[13px] rounded-xl border transition-all outline-none
        ${
          disabled
            ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed"
            : "bg-white text-slate-800 border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
        }`}
    />
  );
}

/* ---------- Password Input with Show/Hide ---------- */
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 pr-10 text-[13px] rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all outline-none"
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
      </button>
    </div>
  );
}

/* ---------- Toggle Switch (Change Password) ---------- */
function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full"
    >
      <span className="text-[13px] font-semibold text-slate-700 flex items-center gap-2">
        <MdLock size={14} className="text-slate-400" /> {label}
      </span>
      <div
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? "bg-violet-600" : "bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

/* ---------- Avatar Card ---------- */
function AvatarSection({ avatar, username, memberYear, onAvatarChange }) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm shadow-violet-50 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-16 h-16 rounded-full object-cover border-4 border-violet-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl select-none">
              {username?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white">
            <MdCameraAlt size={11} className="text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="text-[15px] font-bold text-slate-800 truncate">
            {username || "Your Name"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Member since {memberYear}
          </p>
          <div className="mt-2">
            <UploadWidget
              uwConfig={{
                cloudName: "droah7qf8",
                uploadPreset: "FindHome",
                multiple: false,
                cropping: true,
                folder: "user_avatars",
                maxFileSize: 5000000,
                clientAllowedFormats: ["jpg", "jpeg", "png"],
              }}
              setAvatar={onAvatarChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Account Info Card ---------- */
function AccountSection({
  email,
  username,
  phone,
  usernameError,
  phoneError,
  onUsernameChange,
  onPhoneChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm shadow-violet-50 p-5 flex flex-col gap-4">
      <h3 className="text-[13px] font-bold text-slate-700">Account Info</h3>

      <Field label="Email" icon={MdOutlineEmail}>
        <TextInput value={email} disabled />
      </Field>

      <Field label="Username" icon={MdOutlinePerson} error={usernameError}>
        <TextInput
          value={username}
          onChange={onUsernameChange}
          placeholder="Enter username"
        />
      </Field>

      <Field label="Phone Number" icon={MdPhone} error={phoneError}>
        <TextInput
          value={phone}
          onChange={onPhoneChange}
          placeholder="e.g., +1 234 567 8900"
        />
      </Field>
    </div>
  );
}

/* ---------- Change Password Card ---------- */
function PasswordSection({
  enabled,
  onToggle,
  password,
  confirm,
  errors,
  onPasswordChange,
  onConfirmChange,
}) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm shadow-violet-50 p-5 flex flex-col gap-4">
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

/* ---------- Deactivate Account Card ---------- */
const DEACTIVATE_ITEMS = [
  {
    key: "listings",
    text: (
      <>
        Your <strong>property listings will be hidden</strong> from all search
        results
      </>
    ),
  },
  {
    key: "contact",
    text: (
      <>
        Other users <strong>cannot find or contact you</strong>
      </>
    ),
  },
  {
    key: "history",
    text: "Your saved properties and chat history will be paused",
  },
  {
    key: "reactivate",
    text: (
      <>
        You can <strong>reactivate at any time</strong> to restore everything
      </>
    ),
  },
];

function DeactivateSection({ isActive, onToggle, loading }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
        isActive ? "bg-white border-amber-100" : "bg-rose-50 border-rose-200"
      }`}
    >
      {/* Header button */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isActive ? "bg-amber-50" : "bg-rose-100"
            }`}
          >
            <MdPowerSettingsNew
              size={16}
              className={isActive ? "text-amber-500" : "text-rose-500"}
            />
          </div>
          <div className="text-left min-w-0">
            <p className="text-[13px] font-bold text-slate-700 truncate">
              {isActive ? "Deactivate Account" : "Account Deactivated"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {isActive
                ? "Temporarily hide your profile & listings"
                : "Your account is currently inactive"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden xs:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border ${
              isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-100 text-rose-600 border-rose-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          {expanded ? (
            <MdExpandLess size={18} className="text-slate-400" />
          ) : (
            <MdExpandMore size={18} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Status badge for xs screens */}
      <div className="xs:hidden px-4 pb-2 flex">
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
            isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-100 text-rose-600 border-rose-200"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Expanded / always-open when inactive */}
      {(expanded || !isActive) && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <div
            className={`rounded-xl p-4 border ${
              isActive
                ? "bg-amber-50 border-amber-200"
                : "bg-rose-100 border-rose-200"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <MdWarning
                size={16}
                className={`flex-shrink-0 mt-0.5 ${
                  isActive ? "text-amber-500" : "text-rose-500"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-[12px] font-bold mb-2 ${
                    isActive ? "text-amber-700" : "text-rose-700"
                  }`}
                >
                  {isActive
                    ? "What happens when you deactivate?"
                    : "Your account is currently deactivated"}
                </p>
                <ul
                  className={`text-[11px] space-y-1.5 list-disc list-inside ${
                    isActive ? "text-amber-600" : "text-rose-600"
                  }`}
                >
                  {DEACTIVATE_ITEMS.map((item) => (
                    <li key={item.key}>{item.text}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggle}
              disabled={loading}
              className={`mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60
                ${
                  isActive
                    ? "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white"
                    : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white"
                }`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <MdPowerSettingsNew size={14} />
              )}
              {loading
                ? "Please wait…"
                : isActive
                  ? "Yes, Deactivate My Account"
                  : "Reactivate My Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Custom Confirmation Modal ---------- */
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  loading,
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl p-5 sm:p-6 animate-in slide-in-from-bottom sm:fade-in sm:zoom-in duration-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MdDeleteForever size={16} className="text-red-500" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 -mr-1 rounded-lg hover:bg-slate-100"
          >
            <MdClose size={18} />
          </button>
        </div>

        <p className="text-[13px] text-slate-500 mb-5 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col-reverse sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-medium hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            {cancelText || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {confirmText || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Delete Account bullet items ---------- */
const DELETE_ITEMS = [
  {
    key: "account",
    text: (
      <>
        Your <strong>account will be permanently deleted</strong>
      </>
    ),
  },
  {
    key: "listings",
    text: (
      <>
        All <strong>property listings</strong> will be removed forever
      </>
    ),
  },
  {
    key: "chats",
    text: (
      <>
        All <strong>chats and messages</strong> will be erased
      </>
    ),
  },
  {
    key: "data",
    text: "You will lose access to saved properties and all data",
  },
];

/* ---------- Delete Account Card ---------- */
function DeleteAccountSection({ onDelete, loading, error }) {
  const [expanded, setExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => setShowConfirm(true);
  const handleConfirmDelete = () => {
    onDelete();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
        {/* Header button */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between p-4 sm:p-5 gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MdDeleteForever size={16} className="text-red-500" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[13px] font-bold text-slate-700 truncate">
                Delete Account
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                Permanently remove your account &amp; data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="hidden xs:inline-flex text-[10px] font-bold px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200 whitespace-nowrap">
              Irreversible
            </span>
            {expanded ? (
              <MdExpandLess size={18} className="text-slate-400" />
            ) : (
              <MdExpandMore size={18} className="text-slate-400" />
            )}
          </div>
        </button>

        {/* Badge on very small screens */}
        <div className="xs:hidden px-4 pb-2 flex">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">
            Irreversible
          </span>
        </div>

        {/* Expanded panel */}
        {expanded && (
          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <div className="rounded-xl p-4 border border-red-200 bg-red-50">
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-red-700 mb-2 flex items-center gap-1.5">
                  <MdWarning size={15} className="text-red-600 flex-shrink-0" />
                  Permanent action — this cannot be undone
                </p>
                <ul className="text-[11px] text-red-600 space-y-1.5 list-disc list-inside">
                  {DELETE_ITEMS.map((item) => (
                    <li key={item.key}>{item.text}</li>
                  ))}
                </ul>

                {/* ✅ Delete-specific error shown here */}
                {error && (
                  <p className="mt-3 text-[11px] text-red-700 bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex items-center gap-1.5">
                    <MdError size={12} className="flex-shrink-0" /> {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={loading}
                  className="mt-4 w-full py-2.5 rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors disabled:opacity-60"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <MdDeleteForever size={16} />
                  )}
                  {loading ? "Deleting…" : "Yes, Permanently Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Account Permanently"
        message="Are you absolutely sure? This will permanently delete your account, all property listings, chats, and saved data. This action cannot be undone."
        confirmText="Yes, Delete Forever"
        cancelText="Cancel"
        loading={loading}
      />
    </>
  );
}

/* ---------- Save Button ---------- */
function SaveButton({ status, onClick }) {
  const isSaved = status === "saved";
  const isLoading = status === "loading";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full py-3 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all
        ${
          isSaved
            ? "bg-emerald-500 text-white"
            : "bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white disabled:opacity-60"
        }`}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {isSaved && <MdCheck size={16} />}
      {!isLoading && !isSaved && <MdSave size={15} />}
      {isLoading ? "Saving…" : isSaved ? "Saved!" : "Save Changes"}
    </button>
  );
}

/* ------------------------------------------------------------------
   MAIN PROFILE PAGE
------------------------------------------------------------------ */
export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, UpdateUser, logout } = useContext(AuthContext);
  const user = currentUser?.userData ?? {};

  const [avatar, setAvatar] = useState(user.avatar ?? "");
  const [username, setUsername] = useState(user.username ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [isActive, setIsActive] = useState(user.isActive !== false);
  const [status, setStatus] = useState("idle");
  const [toggleLoading, setToggleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [deleteError, setDeleteError] = useState(""); // ✅ separate delete error
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  /* ── Username change: lowercase + no leading/trailing spaces ─── */
  // We allow the user to type freely but convert to lowercase instantly.
  // Leading/trailing spaces are stripped on blur and on save.
  const handleUsernameChange = useCallback((e) => {
    // Convert to lowercase dynamically; do NOT strip internal spaces while
    // the user is still typing (trimming mid-type feels jarring).
    // Leading spaces are removed immediately so the field never starts with a space.
    const raw = e.target.value.toLowerCase();
    // Remove leading spaces dynamically
    const cleaned = raw.replace(/^\s+/, "");
    setUsername(cleaned);
    // Clear username error as the user types
    setErrors((prev) => ({ ...prev, username: "" }));
  }, []);

  /* ── Phone change: trim leading spaces dynamically ───────────── */
  const handlePhoneChange = useCallback((e) => {
    const cleaned = e.target.value.replace(/^\s+/, "");
    setPhone(cleaned);
    setErrors((prev) => ({ ...prev, phone: "" }));
  }, []);

  const handlePasswordChange = useCallback(
    (e) => setPassword(e.target.value),
    [],
  );
  const handleConfirmChange = useCallback(
    (e) => setConfirm(e.target.value),
    [],
  );

  /* ── Validation (uses trimmed values) ───────────────────────── */
  const validate = useCallback(() => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();
    const e = { username: "", phone: "", password: "", confirm: "" };
    let ok = true;

    if (!trimmedUsername) {
      e.username = "Username cannot be empty";
      ok = false;
    } else if (trimmedUsername.includes(" ")) {
      // Username must not contain spaces
      e.username = "Username cannot contain spaces";
      ok = false;
    }

    if (trimmedPhone && !/^[\+\d\s\-\(\)]{5,20}$/.test(trimmedPhone)) {
      e.phone = "Enter a valid phone number";
      ok = false;
    }

    if (changePassword) {
      if (!password) {
        e.password = "Password is required";
        ok = false;
      } else if (password.length < 6) {
        e.password = "Min 6 characters";
        ok = false;
      }
      if (password !== confirm) {
        e.confirm = "Passwords do not match";
        ok = false;
      }
    }

    setErrors(e);
    return ok;
  }, [username, phone, password, confirm, changePassword]);

  /* ── Toggle password section ─────────────────────────────────── */
  const handleTogglePassword = useCallback((val) => {
    setChangePassword(val);
    if (!val) {
      setPassword("");
      setConfirm("");
      setErrors((e) => ({ ...e, password: "", confirm: "" }));
    }
  }, []);

  /* ── Save profile ────────────────────────────────────────────── */
  const handleSave = async () => {
    // Trim trailing spaces before validating & saving
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    // Sync trimmed values back to state so the UI reflects the clean value
    setUsername(trimmedUsername);
    setPhone(trimmedPhone);

    setApiError("");
    setErrors((e) => ({ ...e, username: "" }));

    // Re-run validation against trimmed values by updating state first
    // (validate() reads from state, so we pass trimmed values directly)
    const e = { username: "", phone: "", password: "", confirm: "" };
    let ok = true;

    if (!trimmedUsername) {
      e.username = "Username cannot be empty";
      ok = false;
    } else if (trimmedUsername.includes(" ")) {
      e.username = "Username cannot contain spaces";
      ok = false;
    }

    if (trimmedPhone && !/^[\+\d\s\-\(\)]{5,20}$/.test(trimmedPhone)) {
      e.phone = "Enter a valid phone number";
      ok = false;
    }

    if (changePassword) {
      if (!password) {
        e.password = "Password is required";
        ok = false;
      } else if (password.length < 6) {
        e.password = "Min 6 characters";
        ok = false;
      }
      if (password !== confirm) {
        e.confirm = "Passwords do not match";
        ok = false;
      }
    }

    setErrors(e);
    if (!ok) return;

    const userId = user.id;
    if (!userId) {
      setApiError("User ID missing");
      return;
    }

    const payload = {
      username: trimmedUsername,
      phone: trimmedPhone || null,
      ...(avatar && { avatar }),
      ...(changePassword && password && { password }),
    };

    try {
      setStatus("loading");
      const res = await apiRequest.put(`/users/${userId}`, payload);
      UpdateUser({ ...currentUser, userData: { ...user, ...res.data } });
      setStatus("saved");
      setPassword("");
      setConfirm("");
      setChangePassword(false);
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      const msg =
        err.response?.data?.message || "Update failed. Please try again.";

      // ✅ Username conflict → show error below username field
      if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, username: msg }));
        setStatus("error");
        return;
      }

      setApiError(msg);
      setStatus("error");
    }
  };

  /* ── Toggle active status ────────────────────────────────────── */
  const handleToggleActive = async () => {
    const userId = user.id;
    if (!userId) return;
    const next = !isActive;
    setToggleLoading(true);
    try {
      await apiRequest.put(`/users/${userId}`, { isActive: next });
      setIsActive(next);
      UpdateUser({ ...currentUser, userData: { ...user, isActive: next } });
    } catch {
      setApiError("Failed to update account status.");
    } finally {
      setToggleLoading(false);
    }
  };

  /* ── Permanent delete ────────────────────────────────────────── */
  const handleDeleteAccount = async () => {
    const userId = user.id;
    if (!userId) return;
    setDeleteError(""); // clear previous delete error
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/users/${userId}`);
      await logout();
      navigate("/");
    } catch (err) {
      // ✅ Error shown inside delete section, not generic apiError
      setDeleteError(
        err.response?.data?.message || "Failed to delete account.",
      );
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full px-3 py-5 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {/* Left column: main form */}
          <div className="lg:col-span-2 space-y-4">
            <AvatarSection
              avatar={avatar}
              username={username}
              memberYear={memberYear}
              onAvatarChange={setAvatar}
            />

            <AccountSection
              email={user.email ?? ""}
              username={username}
              phone={phone}
              usernameError={errors.username}
              phoneError={errors.phone}
              onUsernameChange={handleUsernameChange}
              onPhoneChange={handlePhoneChange}
            />

            <PasswordSection
              enabled={changePassword}
              onToggle={handleTogglePassword}
              password={password}
              confirm={confirm}
              errors={errors}
              onPasswordChange={handlePasswordChange}
              onConfirmChange={handleConfirmChange}
            />

            {/* General API error (not username conflict, not delete error) */}
            {apiError && (
              <div className="flex items-center gap-2 text-[12px] text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl">
                <MdError size={14} className="flex-shrink-0" /> {apiError}
              </div>
            )}

            <SaveButton status={status} onClick={handleSave} />
          </div>

          {/* Right column: deactivate + delete (sticky on large screens) */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <DeactivateSection
              isActive={isActive}
              onToggle={handleToggleActive}
              loading={toggleLoading}
            />
            <DeleteAccountSection
              onDelete={handleDeleteAccount}
              loading={deleteLoading}
              error={deleteError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}