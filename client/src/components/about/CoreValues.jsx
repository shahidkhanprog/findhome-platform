// CoreValues.jsx - Icon grid showing company values
import React from "react";
import {
  FaHandshake,
  FaBullseye,
  FaChartLine,
  FaUserShield,
  FaCheckCircle,
  FaBuilding,
} from "react-icons/fa";

// Values data — add/remove values here without touching layout
const VALUES = [
  {
    icon: <FaHandshake size={36} />,
    title: "Integrity",
    desc: "Every listing, deal, and document goes through a strict verification process. We never compromise on honesty — even when it costs us a sale.",
  },
  {
    icon: <FaBullseye size={36} />,
    title: "Discipline",
    desc: "Strict adherence to professional standards, legal compliance, and client commitments — every single time, without exception.",
  },
  {
    icon: <FaChartLine size={36} />,
    title: "Excellence",
    desc: "From our digital platform to in-person property visits, we obsess over quality at every touchpoint of your real estate journey.",
  },
  {
    icon: <FaUserShield size={36} />,
    title: "Client First",
    desc: "Every decision we make starts with one question: is this in our client's best interest? If not, we don't do it.",
  },
  {
    icon: <FaCheckCircle size={36} />,
    title: "Transparency",
    desc: "No hidden fees, no surprise charges, no ambiguous contracts. You will always know exactly what you are signing and paying for.",
  },
  {
    icon: <FaBuilding size={36} />,
    title: "Market Expertise",
    desc: "With 10+ years in Pakistan's real estate market, our team has the local knowledge to guide you toward the highest-value decisions.",
  },
];

// Individual value card
const ValueCard = ({ icon, title, desc }) => (
  <div className="bg-white p-7 sm:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col gap-4">
    <div className="text-[#f36c3a] group-hover:scale-110 transition-transform duration-300 w-fit">
      {icon}
    </div>
    <h4 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h4>
    <p className="text-[#667085] text-sm sm:text-base leading-relaxed">{desc}</p>
  </div>
);

const CoreValues = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-32 bg-[#fef7f6]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
            What Drives Us
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            The Pillars of Our{" "}
            <span className="text-[#f36c3a]">Success</span>
          </h2>
          <div className="w-16 h-1.5 bg-[#f36c3a] mx-auto rounded-full" />
        </div>

        {/* Values grid — 3 col desktop, 2 col tablet, 1 col mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {VALUES.map((v, i) => (
            <ValueCard key={i} icon={v.icon} title={v.title} desc={v.desc} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;