import { useState } from "react";

export default function Avatar({
  src,
  name = "",
  className = "w-12 h-12",
  textClass = "text-lg",
}) {
  const [imgError, setImgError] = useState(false);
  const letter = name.trim().charAt(0).toUpperCase() || "?";
  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} rounded-full object-cover flex-shrink-0 border-2 border-gray-100 shadow-sm`}
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div
      className={`${className} rounded-full bg-gradient-to-br from-gray-500 to-purple-600 flex items-center justify-center ${textClass} font-bold text-white flex-shrink-0 select-none shadow-sm`}
    >
      {letter}
    </div>
  );
}