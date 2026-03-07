import { useState, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import TextInput from "../../components/textinput/TextInput";
import Button from "../../components/button/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const emailRef = useRef(null);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setErrors({});
  };

  const validate = () => {
    if (!email.trim()) return { email: "Email is required" };
    if (!/\S+@\S+\.\S+/.test(email)) return { email: "Email is invalid" };
    return {};
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll and focus
      if (validationErrors.email && emailRef.current) {
        emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        emailRef.current.focus();
      }
      return;
    }

    console.log("Forgot password submitted:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email and we'll send you a link to reset your password
        </p>

        {submitted ? (
          <div className="text-center text-green-600 font-medium">
            A password reset link has been sent to <strong>{email}</strong>.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              icon={FaEnvelope}
              value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              error={errors.email}
              name="email"
              inputRef={emailRef}
              type="email"
            />

            <Button type="submit">Send Reset Link</Button>
          </form>
        )}

        <p className="text-center text-gray-500 mt-4 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;