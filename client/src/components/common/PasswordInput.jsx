import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ icon: Icon, value, onChange, placeholder, error, inputRef }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
      {Icon && <Icon className="absolute left-3 text-gray-400" />}
      <input
        ref={inputRef}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-10 py-3 focus:outline-none rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />
      <span
        className="absolute right-3 cursor-pointer text-gray-500 hover:text-blue-500"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </span>
      {error && <p className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">{error}</p>}
    </div>
  );
};

export default PasswordInput;

// import React, { useState } from "react";
// import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// const PasswordInput = ({ name, value, onChange, placeholder, error }) => {
//   const [visible, setVisible] = useState(false);
//   return (
//     <div className="relative">
//       <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//       <input
//         type={visible ? "text" : "password"}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//           error ? "border-red-500" : "border-gray-300"
//         }`}
//       />
//       <span
//         className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-500"
//         onClick={() => setVisible(!visible)}
//       >
//         {visible ? <FaEyeSlash /> : <FaEye />}
//       </span>
//       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//     </div>
//   );
// };

// export default PasswordInput;