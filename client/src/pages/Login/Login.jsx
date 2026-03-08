import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import TextInput from "../../components/common/TextInput";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";


const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const refs = {
    email: useRef(null),
    password: useRef(null),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll and focus first invalid input
      const firstErrorField = Object.keys(validationErrors)[0];
      const fieldRef = refs[firstErrorField];
      if (fieldRef && fieldRef.current) {
        fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        fieldRef.current.focus();
      }
      return;
    }

    console.log("Login submitted:", form, "Remember Me:", rememberMe);
    // Add login logic here
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 px-4 pt-[70px] pb-[50px]">
      <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Login to FindHome
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <TextInput
            icon={FaEnvelope}
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            inputRef={refs.email}
            type="email"
            name="email"
          />

          {/* Password */}
          <PasswordInput
            icon={FaLock}
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            inputRef={refs.password}
            name="password"
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm">Remember me</span>
            </label>
            <Link to="/forgotpassword" className="text-blue-500 text-sm hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button type="submit" text="Login" />
        </form>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;