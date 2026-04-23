import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaMapMarkedAlt,
  FaSearch,
  FaHandshake,
  FaUserShield,
  FaArrowRight,
} from "react-icons/fa";

const services = [
  {
    icon: <FaHome />,
    title: "Buy a Property",
    description:
      "Browse 100+ verified houses, apartments, and plots across Pakistan's top cities. Get expert guidance from shortlisting to final deed transfer.",
    link: "/list?type=buy",
    tag: "Most Popular",
    color: "blue",
  },
  {
    icon: <FaBuilding />,
    title: "Rent a Property",
    description:
      "Find tenant-ready homes, apartments, and commercial spaces with transparent lease terms. Every listing is landlord-verified before going live.",
    link: "/list?type=rent",
    tag: null,
    color: "orange",
  },
  {
    icon: <FaMapMarkedAlt />,
    title: "Search by Location",
    description:
      "Narrow down your search by city, society, or neighbourhood. Filter by DHA, Bahria Town, Gulberg, and 50+ housing schemes across Pakistan.",
    link: "/list",
    tag: null,
    color: "emerald",
  },
  {
    icon: <FaSearch />,
    title: "Smart Property Filters",
    description:
      "Search by price range, property type, size, and bedroom count. Save your search preferences and get notified when new matches are listed.",
    link: "/list",
    tag: null,
    color: "purple",
  },
  {
    icon: <FaUserShield />,
    title: "Verified Listings Only",
    description:
      "Every property is manually verified by our team before publishing. No duplicate ads, no fake listings — just trustworthy, accurate property data.",
    link: "/list",
    tag: "Trust & Safety",
    color: "rose",
  },
  {
    icon: <FaHandshake />,
    title: "Agent-Assisted Deals",
    description:
      "Connect with a dedicated property agent who manages viewings, negotiations, documentation, and registration on your behalf — end to end.",
    link: "/list",
    tag: null,
    color: "amber",
  },
];

// Tailwind color map per service — keeps classes static so Tailwind picks them up
const colorMap = {
  blue: { bg: "bg-blue-50", icon: "text-blue-500", pill: "bg-blue-100 text-blue-600", arrow: "text-blue-500 group-hover:text-blue-700" },
  orange: { bg: "bg-orange-50", icon: "text-[#f36c3a]", pill: "bg-orange-100 text-orange-600", arrow: "text-[#f36c3a] group-hover:text-orange-600" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", pill: "bg-emerald-100 text-emerald-600", arrow: "text-emerald-500 group-hover:text-emerald-700" },
  purple: { bg: "bg-purple-50", icon: "text-purple-500", pill: "bg-purple-100 text-purple-600", arrow: "text-purple-500 group-hover:text-purple-700" },
  rose: { bg: "bg-rose-50", icon: "text-rose-500", pill: "bg-rose-100 text-rose-600", arrow: "text-rose-500 group-hover:text-rose-700" },
  amber: { bg: "bg-amber-50", icon: "text-amber-500", pill: "bg-amber-100 text-amber-600", arrow: "text-amber-500 group-hover:text-amber-700" },
};

const Services = () => {
  return (
    <section className="py-16 sm:py-20 bg-slate-200 px-5 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
            What We Do
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Everything You Need to{" "}
            <span className="text-[#f36c3a]">Buy, Rent & Invest</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            FindHome is Pakistan's most complete real estate platform — verified listings,
            smart search, and dedicated agents all in one place.
          </p>
        </div>

        {/* ── Services Grid ── */}
        <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const c = colorMap[service.color];
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                {/* Optional tag pill */}
                {service.tag && (
                  <span className={`absolute top-5 right-5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.pill}`}>
                    {service.tag}
                  </span>
                )}

                {/* Icon */}
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${c.bg} flex items-center justify-center text-xl sm:text-2xl ${c.icon} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-5">
                  {service.description}
                </p>

                {/* CTA Link → always goes to /list */}
                <Link
                  to={service.link}
                  className={`inline-flex items-center gap-1.5 text-sm font-bold ${c.arrow} transition-all duration-200`}
                >
                  View Properties
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div className="mt-12 sm:mt-16 bg-[#fef7f6] border border-[#f36c3a]/20 rounded-2xl px-6 sm:px-10 py-7 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-1">
              Not sure where to start?
            </h3>
            <p className="text-slate-500 text-sm sm:text-base">
              Browse all available properties and filter by what matters most to you.
            </p>
          </div>
          <Link
            to="/list"
            className="shrink-0 bg-[#f36c3a] hover:bg-orange-600 active:scale-95 text-white font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all text-sm sm:text-base shadow-md shadow-orange-200 whitespace-nowrap"
          >
            Browse All Properties
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Services;