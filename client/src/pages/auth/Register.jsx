import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";

// Shared components & hook
import AuthCard from "./components/AuthCard";
import AuthInputField from "./components/AuthInputField";
import AuthSubmitButton from "./components/AuthSubmitButton";
import ApiErrorMessage from "./components/ApiErrorMessage";
import useRedirectIfLoggedIn from "./hooks/useRedirectIfLoggedIn";

const Register = () => {
  const navigate = useNavigate();

  // Redirect already-logged-in users to dashboard
  useRedirectIfLoggedIn();

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const refs = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleaned = value;
    if (name === "username") {
      cleaned = value.toLowerCase().replace(/^\s+/, "");
    } else if (name === "email") {
      cleaned = value.replace(/^\s+/, "");
    }

    setForm((prev) => ({ ...prev, [name]: cleaned }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = (trimmed) => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!trimmed.username) {
      newErrors.username = "Username is required";
    } else if (trimmed.username.length < 3) {
      newErrors.username = "Min 3 characters required";
    } else if (trimmed.username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces";
    }

    if (!trimmed.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(trimmed.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Min 6 characters required";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const trimmed = {
      username: form.username.trim().toLowerCase(),
      email: form.email.trim(),
    };

    // Sync trimmed values back so UI reflects clean values
    setForm((prev) => ({ ...prev, username: trimmed.username, email: trimmed.email }));

    const validationErrors = validate(trimmed);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      refs[firstError]?.current?.focus();
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      await apiRequest.post("/auth/register", {
        username: trimmed.username,
        email: trimmed.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      const { status, data } = err.response ?? {};
      const msg = data?.message || "Registration failed.";

      // Username taken → show error below username field
      if (status === 409 && data?.field === "username") {
        setErrors((prev) => ({ ...prev, username: msg }));
        refs.username?.current?.focus();
        setIsLoading(false);
        return;
      }

      // Email taken → show error below email field
      if (status === 409 && data?.field === "email") {
        setErrors((prev) => ({ ...prev, email: msg }));
        refs.email?.current?.focus();
        setIsLoading(false);
        return;
      }

      // Any other error → general banner
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      subtitle="Join the community"
      titleColor="text-gray-800"
    >
      <form onSubmit={handleRegister} className="space-y-5" noValidate>

        {/* Username */}
        <AuthInputField
          inputRef={refs.username}
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          error={errors.username}
          icon={<FaUser />}
        />

        {/* Email */}
        <AuthInputField
          inputRef={refs.email}
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={<FaEnvelope />}
        />

        {/* Password */}
        <AuthInputField
          inputRef={refs.password}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock />}
          isPassword
        />

        {/* Confirm Password */}
        <AuthInputField
          inputRef={refs.confirmPassword}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<FaLock />}
          isPassword
        />

        {/* API Error */}
        <ApiErrorMessage message={apiError} />

        {/* Submit */}
        <AuthSubmitButton
          isLoading={isLoading}
          label="Register"
          loadingLabel="Processing..."
        />
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default Register;