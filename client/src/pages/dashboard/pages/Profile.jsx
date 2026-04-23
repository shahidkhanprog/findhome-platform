// pages/dashboard/Profile.jsx
import { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdError } from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";

import AvatarSection from "../../../components/profile/AvatarSection";
import AccountSection from "../../../components/profile/AccountSection";
import PasswordSection from "../../../components/profile/PasswordSection";
import DeactivateSection from "../../../components/profile/DeactivateSection";
import DeleteAccountSection from "../../../components/profile/DeleteAccountSection";
import SaveButton from "../../../components/profile/SaveButton";

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
  const [deleteError, setDeleteError] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const memberYear = user.createdAt
    ? new Date(user.createdAt).getFullYear()
    : new Date().getFullYear();


  const handleUsernameCommit = useCallback((newValue) => {
    const trimmed = newValue.trim().toLowerCase();
    if (trimmed !== username) {
      setUsername(trimmed);
    }
    // Clear any username error when user commits a change
    if (errors.username) setErrors((prev) => ({ ...prev, username: "" }));
  }, [username, errors.username]);

  const handlePhoneCommit = useCallback((newValue) => {
    const trimmed = newValue.trim();
    if (trimmed !== phone) {
      setPhone(trimmed);
    }
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  }, [phone, errors.phone]);

  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
  const handleConfirmChange = useCallback((e) => setConfirm(e.target.value), []);

  const validate = useCallback(() => {
    const trimmedUsername = username.trim();
    const trimmedPhone = phone.trim();
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
    return ok;
  }, [username, phone, password, confirm, changePassword]);

  const handleTogglePassword = useCallback((val) => {
    setChangePassword(val);
    if (!val) {
      setPassword("");
      setConfirm("");
      setErrors((e) => ({ ...e, password: "", confirm: "" }));
    }
  }, []);

  const handleSave = async () => {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    setUsername(trimmedUsername);
    setPhone(trimmedPhone);
    setApiError("");
    setErrors((e) => ({ ...e, username: "" }));

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
      const msg = err.response?.data?.message || "Update failed. Please try again.";
      if (err.response?.status === 409) {
        setErrors((prev) => ({ ...prev, username: msg }));
        setStatus("error");
        return;
      }
      setApiError(msg);
      setStatus("error");
    }
  };

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

  const handleDeleteAccount = async () => {
    const userId = user.id;
    if (!userId) return;
    setDeleteError("");
    setDeleteLoading(true);
    try {
      await apiRequest.delete(`/users/${userId}`);
      await logout();
      navigate("/");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account.");
      setDeleteLoading(false);
    }
  };

  return (
    <div className="w-full px-3 py-5 sm:px-4 sm:py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
          {/* Left column */}
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
              onUsernameCommit={handleUsernameCommit}
              onPhoneCommit={handlePhoneCommit}
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

            {apiError && (
              <div className="flex items-center gap-2 text-[12px] text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl">
                <MdError size={14} className="flex-shrink-0" /> {apiError}
              </div>
            )}

            <SaveButton status={status} onClick={handleSave} />
          </div>

          {/* Right column */}
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