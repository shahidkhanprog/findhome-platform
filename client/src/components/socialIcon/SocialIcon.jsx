import React from "react";
import * as FaIcons from "react-icons/fa";

const SocialIcon = ({ icon, link }) => {
  const IconComponent = FaIcons[icon];
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-500 hover:text-blue-600 text-xl transition"
    >
      <IconComponent />
    </a>
  );
};

export default SocialIcon;