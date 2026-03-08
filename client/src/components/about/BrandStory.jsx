// BrandStory.jsx - Split section with image, story text, mission & vision cards
import React from "react";

const BrandStory = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-32">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

        {/* Left: Image with orange border accent */}
        <div className="lg:w-1/2 relative w-full">
          <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-full h-full border-2 border-[#f36c3a] rounded-2xl z-0" />
          <img
            src="/homeKey.png"
            alt="FindHome Real Estate Office"
            className="relative z-10 rounded-2xl shadow-2xl w-full h-72 sm:h-96 lg:h-[540px] object-cover"
          />
        </div>

        {/* Right: Story text + mission/vision */}
        <div className="lg:w-1/2 space-y-6 sm:space-y-8">
          {/* Label */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a]">
            Our Story
          </p>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            We Don't Just Sell Homes; We Build{" "}
            <span className="text-[#f36c3a]">Legacies</span>.
          </h2>

          {/* Body copy */}
          <p className="text-[#667085] text-sm sm:text-base lg:text-lg leading-relaxed">
            Our journey started with a simple realization: Pakistan's real
            estate market lacked a partner that valued responsibility over
            short-term gains. Buyers were misled by unverified listings,
            hidden charges, and agents with no accountability.
          </p>
          <p className="text-[#667085] text-sm sm:text-base lg:text-lg leading-relaxed">
            Since 2016, we have built a platform that fixes that — verified
            listings, transparent pricing, dedicated agents, and end-to-end
            legal support. From first-time buyers in Lahore to overseas
            investors in Islamabad, every client gets the same standard of care.
          </p>

          {/* Mission / Vision cards */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
            <div className="bg-[#fef7f6] p-5 sm:p-6 rounded-2xl border-l-4 border-[#f36c3a] flex-1">
              <h4 className="font-bold text-base sm:text-lg mb-1">Our Mission</h4>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                To provide world-class property solutions with complete
                transparency and zero hidden costs.
              </p>
            </div>
            <div className="bg-[#fef7f6] p-5 sm:p-6 rounded-2xl border-l-4 border-[#f36c3a] flex-1">
              <h4 className="font-bold text-base sm:text-lg mb-1">Our Vision</h4>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                To become Pakistan's most trusted real estate platform — known
                for integrity, accuracy, and client-first service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;