// RealEstateServices.jsx - Numbered service list with side image
import React from "react";

// Services data — add/remove services here without touching JSX
const SERVICES = [
  {
    number: "01",
    title: "Buy a home",
    description:
      "Find your ideal home effortlessly with our expert guidance & extensive property listings, ensuring a smooth and satisfying home-buying experience.",
  },
  {
    number: "02",
    title: "Rent a home",
    description:
      "Find your perfect rental home with ease. Our service offers personalized options and expert support to help you secure a comfortable and ideal living space.",
  },
  {
    number: "03",
    title: "Property management",
    description:
      "Expert property management to handle maintenance, tenant relations, and financials, ensuring your property runs smoothly and remains profitable.",
  },
];

const RealEstateServices = () => {
  return (
    <section className="py-24 px-6 lg:px-32 bg-[#fef7f6] mt-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">

        {/* Left: Numbered service list */}
        <div className="lg:col-span-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-12">
            Discover the range of real estate{" "}
            <span className="text-[#f36c3a]">services</span> we offer
          </h2>
          <div className="space-y-10">
            {SERVICES.map((service) => (
              <div key={service.number} className="flex gap-6">
                <span className="text-xl font-bold text-[#f36c3a]">{service.number}</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h4>
                  <p className="text-slate-600 leading-relaxed max-w-md">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Illustrative image */}
        <div className="lg:col-span-5">
          <img
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
            alt="Modern Real Estate"
            className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
          />
        </div>
      </div>
    </section>
  );
};

export default RealEstateServices;