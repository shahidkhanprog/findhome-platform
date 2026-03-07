import React from "react";

const TextInput = ({ icon: Icon, value, onChange, placeholder, error, type = "text", inputRef }) => {
  return (
    <div className="relative flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
      {Icon && <Icon className="absolute left-3 text-gray-400" />}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3 focus:outline-none rounded-lg ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">{error}</p>}
    </div>
  );
};

export default TextInput;
// import React from "react";

// const TextInput = ({ name, value, onChange, placeholder, error, icon }) => (
//   <div className="relative">
//     {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
//     <input
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//         error ? "border-red-500" : "border-gray-300"
//       }`}
//     />
//     {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//   </div>
// );

// export default TextInput;