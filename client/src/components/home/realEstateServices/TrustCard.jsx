import React from "react";
import { TRUST_POINTS } from "./RealEstateServices.data";

const TrustCard = () => (
  <div className="mt-10 bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6">
    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
      Why clients choose us
    </p>
    {TRUST_POINTS.map((point, i) => (
      <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
        <span className="mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f36c3a]/10 flex items-center justify-center shrink-0">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f36c3a]" />
        </span>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{point}</p>
      </div>
    ))}
  </div>
);

export default TrustCard;