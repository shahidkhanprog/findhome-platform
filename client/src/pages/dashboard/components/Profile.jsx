import { useState, useRef, useContext, useCallback } from "react";
import { MdOutlineEmail, MdOutlinePerson, MdError, MdVisibility, MdVisibilityOff,} from "react-icons/md";

import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import UploadWidget from "../../../components/uploadWidgets/UploadWidget";

export default function Profile() {
  const { currentUser, UpdateUser } = useContext(AuthContext);

  const user = currentUser?.userData ?? {};

  const [avatar, setAvatar] = useState(user.avatar);
  const [username, setUsername] = useState(user.username ?? "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [changePassword, setChangePassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [status, setStatus] = useState("idle");
  const [apiError, setApiError] = useState("");

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const fileRef = useRef();

  /* ───── Validation ───── */
  const validate = useCallback(() => {
    const e = { username: "", password: "", confirm: "" };
    let ok = true;

    if (!username.trim()) {
      e.username = "Username cannot be empty";
      ok = false;
    }

    if (changePassword) {
      if (!password) {
        e.password = "Password required";
        ok = false;
      }
      if (password !== confirm) {
        e.confirm = "Passwords do not match";
        ok = false;
      }
    }

    setErrors(e);
    return ok;
  }, [username, password, confirm, changePassword]);

  /* ───── Save ───── */
  const handleSave = async () => {
    setApiError("");

    if (!validate()) {
      setStatus("error");
      return;
    }

    const userId = user.id;
    if (!userId) {
      setApiError("User ID missing");
      return;
    }

    const payload = {
      username: username.trim(),
      avatar,
      ...(changePassword && password ? { password } : {}),
    };

    try {
      setStatus("loading");

      const res = await apiRequest.put(`/users/${userId}`, payload);

      UpdateUser({
        ...currentUser,
        userData: { ...user, ...res.data },
      });

      setStatus("saved");

      setPassword("");
      setConfirm("");
      setChangePassword(false);
      setShowPassword(false);
      setShowConfirm(false);

      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Update failed");
      setStatus("error");
    }
  };

  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();

  return (
    <div className="max-w-[560px] mx-auto flex flex-col gap-4">

      {/* ───────── AVATAR CARD ───────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <div className="flex flex-col sm:flex-row items-center gap-4">

          {/* Avatar */}
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                className="w-[72px] h-[72px] rounded-full object-cover border-4 border-violet-100"
              />
            ) : (
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {username?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="font-bold text-lg">{username || "Your Name"}</p>
            <p className="text-sm text-gray-500">Member since {memberYear}</p>

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
              setAvatar={setAvatar}
            />
          </div>
        </div>
      </div>

      {/* ───────── ACCOUNT ───────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MdOutlineEmail /> Email
        </div>
        <input
          value={user.email || ""}
          disabled
          className="w-full p-2 bg-gray-100 rounded-lg mb-3"
        />

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <MdOutlinePerson /> Username
        </div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username}</p>
        )}
      </div>

      {/* ───────── PASSWORD ───────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border">

        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setChangePassword((v) => !v)}
        >
          <span className="font-medium">Change Password</span>
          <div className={`w-10 h-5 rounded-full ${changePassword ? "bg-purple-600" : "bg-gray-300"}`}>
            <div
              className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-all ${
                changePassword ? "ml-5" : "ml-0.5"
              }`}
            />
          </div>
        </div>

        {changePassword && (
          <div className="mt-4 space-y-3">

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full p-2 border rounded-lg pr-10"
              />
              <button
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm password"
                className="w-full p-2 border rounded-lg pr-10"
              />
              <button
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? <MdVisibilityOff /> : <MdVisibility />}
              </button>

              {errors.confirm && (
                <p className="text-red-500 text-xs">{errors.confirm}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ───────── ERROR ───────── */}
      {apiError && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
          <MdError /> {apiError}
        </div>
      )}

      {/* ───────── SAVE BUTTON ───────── */}
      <button
        onClick={handleSave}
        disabled={status === "loading"}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold"
      >
        {status === "loading"
          ? "Saving..."
          : status === "saved"
          ? "Saved!"
          : "Save Changes"}
      </button>
    </div>
  );
}
