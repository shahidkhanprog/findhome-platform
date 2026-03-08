// AboutCTA.jsx - Final parallax CTA with two action buttons
import React from "react";
import { Link } from "react-router-dom";

const AboutCTA = () => {
  return (
    <section
      className="relative py-24 sm:py-32 flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url('/aboutCTA.png')`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-5 sm:px-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a]">
          Take the Next Step
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
          Ready to Find Your <br className="hidden sm:block" /> Next Chapter?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
          Whether you're buying, renting, or investing — our team is ready
          to guide you every step of the way.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
          <Link
            to="/list"
            className="bg-[#f36c3a] hover:bg-orange-600 active:scale-95 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-xl transition-all"
          >
            Browse Properties
          </Link>
          <Link
            to="/contact"
            className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-white hover:text-[#f36c3a] active:scale-95 transition-all"
          >
            Contact an Expert
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutCTA;