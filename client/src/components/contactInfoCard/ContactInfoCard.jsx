import React from "react";
import * as FaIcons from "react-icons/fa";

const ContactInfoCard = ({ icon, title, text }) => {
  const IconComponent = FaIcons[icon];
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
      <div className="text-blue-600 text-2xl">
        <IconComponent />
      </div>
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
};

export default ContactInfoCard;