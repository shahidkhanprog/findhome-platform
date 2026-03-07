import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import TextInput from "../../components/common/TextInput";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

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
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
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
        fieldRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        fieldRef.current.focus();
      }
      return;
    }

    console.log("Register submitted:", { ...form, role });
    // Registration logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">Join FindHome today</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name */}
          <TextInput
            icon={FaUser}
            value={form.name}
            onChange={handleChange}
            placeholder="John Doe"
            error={errors.name}
            inputRef={refs.name}
            name="name"
          />

          {/* Email */}
          <TextInput
            icon={FaEnvelope}
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            error={errors.email}
            inputRef={refs.email}
            name="email"
            type="email"
          />

          {/* Password */}
          <PasswordInput
            icon={FaLock}
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
            inputRef={refs.password}
            name="password"
            visible={passwordVisible}
            setVisible={setPasswordVisible}
          />

          {/* Confirm Password */}
          <PasswordInput
            icon={FaLock}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
            inputRef={refs.confirmPassword}
            name="confirmPassword"
            visible={confirmPasswordVisible}
            setVisible={setConfirmPasswordVisible}
          />

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
              <Button type="submit" text="Register" />
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
