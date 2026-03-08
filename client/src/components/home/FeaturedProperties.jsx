// FeaturedProperties.jsx - Curated property cards grid with hover effects
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Property data — swap with API call (useEffect + fetch) when backend is ready
const PROPERTIES = [
  {
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    price: "$540,000",
    title: "Modern Skyline Villa",
  },
  {
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    price: "$2,500/mo",
    title: "Luxury Penthouse",
  },
  {
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
    price: "$120,000",
    title: "Urban Living Apartment",
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-24 px-6 lg:px-32 max-w-8xl mx-auto">

      {/* Header row */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Our Curated Selection
          </h2>
          <p className="text-slate-500 mt-4 text-lg">
            Hand-picked properties featuring modern amenities and prime locations.
          </p>
        </div>
        <Link
          to="/list"
          className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all"
        >
          View All Properties <FaArrowRight />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {PROPERTIES.map((item, index) => (
          <div key={index} className="group cursor-pointer">

            {/* Image with zoom on hover + price badge */}
            <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-lg">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                {item.price}
              </div>
            </div>

            {/* Title turns blue on hover */}
            <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            <p className="text-slate-500 font-medium">
              4 Beds • 3 Baths • 2,400 sqft • Swat, KPK
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProperties;