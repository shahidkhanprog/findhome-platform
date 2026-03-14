import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";

const Register = () => {
  const navigate = useNavigate();

  // State management
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Refs for focusing errors
  const refs = {
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  /**
   * Updates state on keystroke.
   * This makes the input "normal" and writable.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing again
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.username.trim()) newErrors.username = "Username is required";
    else if (form.username.trim().length < 3)
      newErrors.username = "Min 3 characters required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters required";

    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first field with error
      const firstError = Object.keys(validationErrors)[0];
      refs[firstError].current?.focus();
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      const res = await apiRequest.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setApiError(err.response.data.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-8">Join the community</p>

        <form onSubmit={handleRegister} className="space-y-5" noValidate>
          {/* Username Input */}
          <div>
            <div
              className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.username ? "border-red-500" : "border-gray-200 focus-within:border-blue-500"}`}
            >
              <FaUser className="text-gray-400 mr-2" />
              <input
                ref={refs.username}
                name="username"
                type="text"
                placeholder="Username"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <div
              className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.email ? "border-red-500" : "border-gray-200 focus-within:border-blue-500"}`}
            >
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                ref={refs.email}
                name="email"
                type="email"
                placeholder="Email Address"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div
              className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.password ? "border-red-500" : "border-gray-200 focus-within:border-blue-500"}`}
            >
              <FaLock className="text-gray-400 mr-2" />
              <input
                ref={refs.password}
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <div
              className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.confirmPassword ? "border-red-500" : "border-gray-200 focus-within:border-blue-500"}`}
            >
              <FaLock className="text-gray-400 mr-2" />
              <input
                ref={refs.confirmPassword}
                name="confirmPassword"
                type={confirmPasswordVisible ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }
              >
                {confirmPasswordVisible ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {apiError && (
            <p className="text-sm text-red-500 text-center font-medium">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {isLoading ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
