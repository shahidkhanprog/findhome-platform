import React from "react";
import { FaHome, FaHandshake } from "react-icons/fa";
import TrustCard from "./TrustCard";

const SidePanel = () => (
  <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-24">
    <div className="relative">
      <img
        src="/homeKey.png"
        alt="Real Estate Professional Services"
        className="rounded-2xl shadow-2xl w-full object-cover h-56 sm:h-72 lg:h-[420px]"
      />
      {/* Experience badge */}
      <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-2xl shadow-xl px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3">
        <div className="bg-[#f36c3a]/10 p-2 sm:p-3 rounded-xl">
          <FaHome className="text-[#f36c3a] text-lg sm:text-xl" />
        </div>
        <div>
          <p className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-none">10+</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Years of Expertise</p>
        </div>
      </div>
      {/* Deals badge */}
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
    <TrustCard />
  </div>
);

export default SidePanel;