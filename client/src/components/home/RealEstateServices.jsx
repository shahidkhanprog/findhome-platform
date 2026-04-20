import React from "react";
import ServiceList from "./realEstateServices/ServiceList";
import SidePanel from "./realEstateServices/SidePanel";

const RealEstateServices = () => (
  <section className="py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-32 bg-[#fef7f6] mt-10">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <ServiceList />
      <SidePanel />
    </div>
  </section>
);

export default RealEstateServices;