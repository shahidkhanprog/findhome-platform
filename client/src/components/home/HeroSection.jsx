import React from "react";

const HeroSection = () => {
  return (
    <section
      className="relative h-[85vh] flex items-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage:
          'url("/homePage-hero-section.png")',
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Hero text */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            Find Your <span className="text-blue-400">Perfect</span> Space.
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 opacity-90">
            Verified properties and expert guidance at your fingertips.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
