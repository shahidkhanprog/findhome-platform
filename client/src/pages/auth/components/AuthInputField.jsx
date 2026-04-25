import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * AuthInputField
 * --------------
 * Icon + input + inline error message — the repeated field pattern
 * used in Login and Register.
 *
 * Props:
 *   inputRef    {React.Ref}   - forwarded ref for focus management
 *   name        {string}      - input name attribute
 *   type        {string}      - input type (default: "text")
 *   placeholder {string}
 *   value       {string}
 *   onChange    {function}
 *   error       {string}      - validation error message
 *   icon        {ReactNode}   - icon element (e.g. <FaEnvelope />)
 *   isPassword  {boolean}     - shows show/hide toggle when true
 */
const AuthInputField = ({
  inputRef,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
  isPassword = false,
}) => {
  const [visible, setVisible] = useState(false);
  const inputType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div>
      <div
        className={`flex items-center border-2 rounded-lg px-3 py-2 transition-all ${
          error
            ? "border-red-500"
            : "border-gray-200 focus-within:border-blue-500"
        }`}
      >
        {/* Leading icon */}
        <span className="text-gray-400 mr-2">{icon}</span>

        <input
          ref={inputRef}
          name={name}
          type={inputType}
          placeholder={placeholder}
          className="w-full outline-none bg-transparent text-gray-700"
          value={value}
          onChange={onChange}
        />

        {/* Show / hide toggle for password fields */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="focus:outline-none"
          >
            {visible ? (
              <FaEyeSlash className="text-gray-400" />
            ) : (
              <FaEye className="text-gray-400" />
            )}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AuthInputField;