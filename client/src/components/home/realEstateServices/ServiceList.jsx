import React from "react";
import ServiceItem from "./ServiceItem";
import { SERVICES } from "./RealEstateServices.data";

const ServiceList = () => (
  <div className="lg:col-span-7 order-2 lg:order-1">
    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-3">
      What We Offer
    </p>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
      End-to-End Real Estate <span className="text-[#f36c3a]">Services</span> You Can Trust
    </h2>
    <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
      From finding your first home to managing a full property portfolio — we cover every stage
      of your real estate journey with expertise and transparency.
    </p>
    <div className="space-y-8 sm:space-y-10">
      {SERVICES.map((service) => (
        <ServiceItem key={service.number} {...service} />
      ))}
    </div>
  </div>
);

export default ServiceList;