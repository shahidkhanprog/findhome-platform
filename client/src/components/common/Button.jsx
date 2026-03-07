// import React from "react";

// const Button = ({ children, type = "button", className, ...props }) => {
//   return (
//     <button
//       type={type}
//       className={`w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

import React from "react";

const Button = ({ type = "button", text }) => (
  <button
    type={type}
    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
  >
    {text}
  </button>
);

export default Button;