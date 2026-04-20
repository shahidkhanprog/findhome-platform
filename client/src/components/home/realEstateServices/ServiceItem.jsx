import React from "react";

const ServiceItem = ({ number, icon: Icon, title, description, highlight }) => (
  <div className="flex gap-4 sm:gap-6 group">
    <div className="flex flex-col items-center gap-2 pt-1">
      <span className="text-base sm:text-xl font-extrabold text-[#f36c3a] leading-none">
        {number}
      </span>
      <div className="w-px flex-1 bg-[#f36c3a]/20 min-h-[2rem]" />
    </div>
    <div className="pb-2">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <Icon className="text-[#f36c3a] text-xl" />
        <h4 className="text-base sm:text-lg font-bold text-slate-900">{title}</h4>
      </div>
      <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mb-2">
        {description}
      </p>
      <span className="inline-block bg-[#f36c3a]/10 text-[#f36c3a] text-xs font-semibold px-3 py-1 rounded-full">
        ✦ {highlight}
      </span>
    </div>
  </div>
);

export default ServiceItem;