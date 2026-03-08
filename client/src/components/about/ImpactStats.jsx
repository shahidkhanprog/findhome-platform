// ImpactStats.jsx - Dark background stats strip with key company metrics
import React from "react";

// Stats data — update numbers here without touching layout
const STATS = [
  { value: "10+",  label: "Years Experience"  },
  { value: "30+",  label: "Awards Gained"     },
  { value: "500+", label: "Happy Clients"     },
  { value: "100+", label: "Ready Properties"  },
];

const ImpactStats = () => {
  return (
    <section className="bg-[#101828] py-16 sm:py-20 px-5 sm:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Optional label */}
        <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-10 sm:mb-14">
          Our Impact in Numbers
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 text-center">
          {STATS.map((stat, i) => (
            <div key={i} className="space-y-2 sm:space-y-3">
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white">
                {stat.value}
              </h3>
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