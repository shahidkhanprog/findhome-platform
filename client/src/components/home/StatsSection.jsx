// StatsSection.jsx - Displays company achievement statistics
import React from "react";

// Stats data — easy to update or fetch from an API later
const STATS = [
  { label: "Years of Experience", value: "10+" },
  { label: "Awards Gained",       value: "30+" },
  { label: "Property Ready",      value: "100+" },
];

const StatsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 px-4 md:px-0 max-w-6xl mx-auto">
      {STATS.map((stat, i) => (
        <div key={i} className="text-center">
          <h3 className="text-5xl font-extrabold text-slate-900">{stat.value}</h3>
          <p className="text-slate-500 font-medium text-lg mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;