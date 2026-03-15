// RealEstateServices.jsx - Professional real estate services section
import React from "react";
import { FaHome, FaKey, FaClipboardList, FaHandshake, FaChartLine, FaSearchLocation } from "react-icons/fa";

// Services data — each entry maps to a numbered service card
const SERVICES = [
  {
    number: "01",
    icon: <FaSearchLocation className="text-[#f36c3a] text-xl" />,
    title: "Find & Buy a Property",
    description:
      "Whether you're a first-time buyer or seasoned investor, we guide you through every step — from shortlisting verified properties to final deed transfer. Get access to 100+ premium listings across Pakistan's top cities.",
    highlight: "Zero brokerage surprises. Full legal support included.",
  },
  {
    number: "02",
    icon: <FaKey className="text-[#f36c3a] text-xl" />,
    title: "Rent with Confidence",
    description:
      "Browse tenant-ready homes, apartments, and commercial spaces with transparent rental terms. Our team verifies every listing and landlord so you move in knowing exactly what you're getting.",
    highlight: "Lease drafting & tenant verification handled for you.",
  },
  {
    number: "03",
    icon: <FaClipboardList className="text-[#f36c3a] text-xl" />,
    title: "Property Management",
    description:
      "Own property but don't have time to manage it? We handle tenant sourcing, rent collection, maintenance coordination, and monthly reporting — maximizing your ROI with zero stress on your end.",
    highlight: "Trusted by 500+ landlords across KPK & Punjab.",
  },
  {
    number: "04",
    icon: <FaChartLine className="text-[#f36c3a] text-xl" />,
    title: "Real Estate Investment Advisory",
    description:
      "Our market analysts help you identify high-growth areas, evaluate plot potential, and time your investment for maximum returns. Whether it's DHA, Bahria, or emerging housing societies — we know the market.",
    highlight: "Data-driven insights. Personalized investment roadmap.",
  },
  {
    number: "05",
    icon: <FaHandshake className="text-[#f36c3a] text-xl" />,
    title: "Legal & Documentation Support",
    description:
      "From registry and mutation to NOC verification and sale agreements — our legal experts ensure every document is airtight. Never worry about fraudulent transfers or title disputes again.",
    highlight: "SECP-compliant. Trusted legal panel on standby.",
  },
];

const RealEstateServices = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-32 bg-[#fef7f6] mt-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

        {/* ── Left Column: Service List ── */}
        <div className="lg:col-span-7 order-2 lg:order-1">

          {/* Section Label */}
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-3">
            What We Offer
          </p>

          {/* Section Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
            End-to-End Real Estate{" "}
            <span className="text-[#f36c3a]">Services</span>{" "}
            You Can Trust
          </h2>

          {/* Supporting line */}
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
            From finding your first home to managing a full property portfolio —
            we cover every stage of your real estate journey with expertise and transparency.
          </p>

          {/* Service Items */}
          <div className="space-y-8 sm:space-y-10">
            {SERVICES.map((service) => (
              <div
                key={service.number}
                className="flex gap-4 sm:gap-6 group"
              >
                {/* Number */}
                <div className="flex flex-col items-center gap-2 pt-1">
                  <span className="text-base sm:text-xl font-extrabold text-[#f36c3a] leading-none">
                    {service.number}
                  </span>
                  {/* Vertical connector line */}
                  <div className="w-px flex-1 bg-[#f36c3a]/20 min-h-[2rem]" />
                </div>

                {/* Content */}
                <div className="pb-2">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    {service.icon}
                    <h4 className="text-base sm:text-lg font-bold text-slate-900">
                      {service.title}
                    </h4>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-md mb-2">
                    {service.description}
                  </p>

                  {/* Highlight pill */}
                  <span className="inline-block bg-[#f36c3a]/10 text-[#f36c3a] text-xs font-semibold px-3 py-1 rounded-full">
                    ✦ {service.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Sticky Image + Trust Card ── */}
        <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">

          {/* Main Image */}
          <div className="relative">
            <img
              src="/homeKey.png"
              alt="Real Estate Professional Services"
              className="rounded-2xl shadow-2xl w-full object-cover h-56 sm:h-72 lg:h-[420px]"
            />

            {/* Floating experience badge */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
              <div className="bg-[#f36c3a]/10 p-2 sm:p-3 rounded-xl">
                <FaHome className="text-[#f36c3a] text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none">10+</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Years of Expertise</p>
              </div>
            </div>

            {/* Floating deals badge */}
            <div className="absolute -top-4 -right-3 sm:-right-5 bg-white rounded-2xl shadow-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
              <div className="bg-emerald-50 p-2 sm:p-3 rounded-xl">
                <FaHandshake className="text-emerald-500 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none">1,200+</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Deals Closed</p>
              </div>
            </div>
          </div>

          {/* Trust Card below image */}
          <div className="mt-10 bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Why clients choose us
            </p>
            {[
              "Verified listings — no fake or duplicate ads",
              "Dedicated agent assigned to every client",
              "End-to-end legal documentation support",
              "Transparent pricing with zero hidden charges",
            ].map((point, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <span className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f36c3a]/10 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f36c3a]" />
                </span>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RealEstateServices;