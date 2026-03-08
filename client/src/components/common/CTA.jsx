import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTA = () => {
  return (
    <section
      className="relative py-24 px-6 lg:px-20 bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c")', "background-attachment": "fixed"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative max-w-5xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Find Your Dream Home Today
        </h2>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Explore thousands of verified houses, apartments, and plots. 
          Join FindHome and start your journey to the perfect property.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link
            to="/properties"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
          >
            Browse Properties
            <FaArrowRight />
          </Link>

          <Link
            to="/register"
            className="bg-white text-gray-900 hover:bg-gray-200 px-8 py-4 rounded-lg font-semibold transition"
          >
            Create Account
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;