import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [role, setRole] = useState("buyer");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmPassword: useRef(null),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll and focus the first invalid input
      const firstErrorField = Object.keys(validationErrors)[0];
      const fieldRef = refs[firstErrorField];
      if (fieldRef && fieldRef.current) {
        fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        fieldRef.current.focus();
      }
      return;
    }

    console.log("Register submitted:", { ...form, role });
    // Registration logic
  };

  const inputWrapperClass =
    "relative flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition";

  const inputClass = (error) =>
    `w-full pl-10 pr-10 py-3 focus:outline-none rounded-lg ${
      error ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Join FindHome today</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <div className={inputWrapperClass}>
            <FaUser className="absolute left-3 text-gray-400" />
            <input
              ref={refs.name}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputClass(errors.name)}
            />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}

          {/* Email */}
          <div className={inputWrapperClass}>
            <FaEnvelope className="absolute left-3 text-gray-400" />
            <input
              ref={refs.email}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputClass(errors.email)}
            />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

          {/* Password */}
          <div className={inputWrapperClass}>
            <FaLock className="absolute left-3 text-gray-400" />
            <input
              ref={refs.password}
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass(errors.password)}
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-500 hover:text-blue-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          {/* Confirm Password */}
          <div className={inputWrapperClass}>
            <FaLock className="absolute left-3 text-gray-400" />
            <input
              ref={refs.confirmPassword}
              type={confirmPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={inputClass(errors.confirmPassword)}
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-500 hover:text-blue-500"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}

          {/* Role Selection */}
          <div className="flex space-x-2">
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg border transition ${
                role === "buyer"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setRole("buyer")}
            >
              Buyer / Renter
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg border transition ${
                role === "owner"
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setRole("owner")}
            >
              Property Owner
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;