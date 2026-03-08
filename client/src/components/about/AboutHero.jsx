// AboutHero.jsx - Parallax hero with headline and establishment year
import React from "react";

const AboutHero = () => {
  return (
    <section
      className="relative h-[70vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/aboutHero.png')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <span className="text-[#f36c3a] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
          Est. 2016
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          Redefining the Standard of{" "}
          <span className="text-[#f36c3a]">Modern Living</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto">
          A legacy built on discipline, responsibility, and the pursuit of
          long-term stability across Pakistan's real estate market.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;