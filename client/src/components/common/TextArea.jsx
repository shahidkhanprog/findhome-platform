import React from "react";

const TextArea = ({ name, value, onChange, placeholder, error }) => {
  return (
    <div className="relative">
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={6}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default TextArea;