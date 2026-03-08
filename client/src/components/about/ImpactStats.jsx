// ImpactStats.jsx - Parallax background stats strip with key company metrics
import React from "react";

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "30+", label: "Awards Gained" },
  { value: "500+", label: "Happy Clients" },
  { value: "100+", label: "Ready Properties" },
];

const ImpactStats = () => {
  return (
    <section
      className="relative py-20 sm:py-28 px-5 sm:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/buildings.png')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay so text stays readable over any image */}
      <div className="absolute inset-0 bg-[#101828]/60" />

      {/* Content sits above overlay */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <h2 className="text-center text-2xl sm:text-3xl font-bold uppercase tracking-widest text-[#f36c3a] mb-10 sm:mb-14">
          Our Impact in Numbers
        </h2>
        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
          {STATS.map((stat, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
                {stat.value}
              </h3>
              <div className="w-8 h-0.5 bg-[#f36c3a] mx-auto rounded-full" />
              <p className="text-[#f36c3a] font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
