import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";
import { authEvents } from "../../lib/authEvents";
import { AuthContext } from "../../context/AuthContext";

// Shared components & hook
import AuthCard from "./components/AuthCard";
import AuthInputField from "./components/AuthInputField";
import AuthSubmitButton from "./components/AuthSubmitButton";
import ApiErrorMessage from "./components/ApiErrorMessage";
import useRedirectIfLoggedIn from "./hooks/useRedirectIfLoggedIn";

const Login = () => {
  const { UpdateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect already-logged-in users to dashboard
  useRedirectIfLoggedIn();

  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      refs[firstErrorField].current?.focus();
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const res = await apiRequest.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      UpdateUser(res.data);
      authEvents.login();
      navigate("/dashboard");
    } catch (err) {
      setApiError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Login" subtitle="Welcome back to FindHome">
      <form onSubmit={handleLogin} className="space-y-5" noValidate>

        {/* Email */}
        <AuthInputField
          inputRef={refs.email}
          name="email"
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={<FaEnvelope />}
        />

        {/* Password */}
        <AuthInputField
          inputRef={refs.password}
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={<FaLock />}
          isPassword
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-gray-600 text-sm">Remember me</span>
          </label>
          <Link to="/forgotpassword" className="text-blue-500 text-sm hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* API Error */}
        <ApiErrorMessage message={apiError} />

        {/* Submit */}
        <AuthSubmitButton
          isLoading={isLoading}
          label="Login"
          loadingLabel="Logging in..."
        />
      </form>

      <p className="text-center text-gray-500 mt-6 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Register
        </Link>
      </p>
    </AuthCard>
  );
};

export default Login;