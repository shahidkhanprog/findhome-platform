import { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";
import { authEvents } from "../../lib/authEvents";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  // State management
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

 const { UpdateUser } = useContext(AuthContext);
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  /**
   * Handles input changes and clears errors as the user types.
   */
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
      // Focus the first field with an error
      const firstErrorField = Object.keys(validationErrors)[0];
      refs[firstErrorField].current?.focus();
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      // API call to your auth controller
       const res = await apiRequest.post("/auth/login", { 
        email: form.email,
        password: form.password,
      });

      // Optionally store user data in localStorage if needed

      UpdateUser(res.data); // Update context with user data

      authEvents.login(); // ← tells Navbar to re-render instantly
      navigate("/"); // Redirect to home on success
    } catch (err) {
      setApiError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-8">Welcome back to FindHome</p>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          {/* Email Input */}
          <div>
            <div className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus-within:border-blue-500'}`}>
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                ref={refs.email}
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div>
            <div className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${errors.password ? 'border-red-500' : 'border-gray-200 focus-within:border-blue-500'}`}>
              <FaLock className="text-gray-400 mr-2" />
              <input
                ref={refs.password}
                name="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-gray-700"
                value={form.password}
                onChange={handleChange}
              />
              <button 
                type="button" 
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="focus:outline-none"
              >
                {passwordVisible ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

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
            <Link to="/forgotpassword" class="text-blue-500 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* API Error Message */}
          {apiError && (
            <p className="text-sm text-red-500 text-center font-medium">{apiError}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-blue-300"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;