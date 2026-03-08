// FeaturedProperties.jsx - Curated property cards grid with hover effects
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

const PROPERTIES = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    price: "PKR 2.8 Crore",
    title: "Modern Skyline Villa",
    type: "For Sale",
    beds: 5,
    baths: 4,
    area: "10 Marla",
    location: "DHA Phase 6, Lahore",
    tag: "Featured",
    tagColor: "bg-blue-500",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    price: "PKR 85,000/mo",
    title: "Luxury Penthouse Apartment",
    type: "For Rent",
    beds: 3,
    baths: 3,
    area: "2,200 sqft",
    location: "Bahria Town, Islamabad",
    tag: "New",
    tagColor: "bg-emerald-500",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
    price: "PKR 95 Lakh",
    title: "Contemporary Family Home",
    type: "For Sale",
    beds: 4,
    baths: 3,
    area: "7 Marla",
    location: "Gulberg III, Lahore",
    tag: "Hot Deal",
    tagColor: "bg-[#f36c3a]",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    price: "PKR 1.5 Crore",
    title: "Farmhouse with Private Garden",
    type: "For Sale",
    beds: 6,
    baths: 5,
    area: "1 Kanal",
    location: "Chak Shehzad, Islamabad",
    tag: "Premium",
    tagColor: "bg-purple-500",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=600&q=80",
    price: "PKR 45,000/mo",
    title: "Modern Studio Apartment",
    type: "For Rent",
    beds: 1,
    baths: 1,
    area: "850 sqft",
    location: "F-10 Markaz, Islamabad",
    tag: "New",
    tagColor: "bg-emerald-500",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=600&q=80",
    price: "PKR 3.2 Crore",
    title: "Executive Corner House",
    type: "For Sale",
    beds: 5,
    baths: 4,
    area: "1 Kanal",
    location: "Bahria Phase 8, Rawalpindi",
    tag: "Featured",
    tagColor: "bg-blue-500",
  },
];

// ── Individual Property Card ──────────────────────────────────
// Card itself is NOT a link — only the "View Details" button navigates
const PropertyCard = ({ item, isFaved, onToggleFav }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col overflow-hidden">

    {/* ── Image Block ─────────────────────────────── */}
    <div className="relative overflow-hidden">
      <img
        src={item.img}
        alt={item.title}
        className="w-full h-52 sm:h-56 object-cover"
      />

      {/* Category tag — top left */}
      <div className={`absolute top-3 left-3 ${item.tagColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow`}>
        {item.tag}
      </div>

      {/* ── Favourite heart button — top right ──
          Clicking adds/removes from favourites, does NOT navigate */}
      <button
        onClick={() => onToggleFav(item.id)}
        aria-label={isFaved ? "Remove from favourites" : "Add to favourites"}
        className={`absolute top-3 right-3 p-2 rounded-full shadow transition-all duration-200 active:scale-90
          ${isFaved
            ? "bg-rose-500 text-white"
            : "bg-white/90 backdrop-blur text-slate-300 hover:text-rose-400"
          }`}
      >
        <FaHeart className="text-sm" />
      </button>

      {/* For Sale / For Rent pill — bottom left */}
      <div className={`absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow
        ${item.type === "For Sale"
          ? "bg-blue-100 text-blue-700"
          : "bg-emerald-100 text-emerald-700"
        }`}>
        {item.type}
      </div>
    </div>

    {/* ── Card Body ───────────────────────────────── */}
    <div className="flex flex-col flex-1 p-5">

      {/* Price */}
      <p className="text-lg font-extrabold text-slate-900 mb-1">{item.price}</p>

      {/* Title — plain text, NOT clickable */}
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2 line-clamp-1">
        {item.title}
      </h3>

      {/* Location — plain text, NOT clickable */}
      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-4">
        <FaMapMarkerAlt className="text-[#f36c3a] shrink-0 text-xs" />
        <span className="truncate">{item.location}</span>
      </div>

      {/* ── Specs Row ── */}
      <div className="flex items-center gap-3 sm:gap-4 text-slate-500 text-xs border-t border-slate-100 pt-4 mb-5">
        <span className="flex items-center gap-1.5">
          <FaBed className="text-slate-400 shrink-0" />
          {item.beds} Beds
        </span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="flex items-center gap-1.5">
          <FaBath className="text-slate-400 shrink-0" />
          {item.baths} Baths
        </span>
        <span className="w-px h-3 bg-slate-200" />
        <span className="flex items-center gap-1.5">
          <FaRulerCombined className="text-slate-400 shrink-0" />
          {item.area}
        </span>
      </div>

      {/* ── View Details Button ──
          This is the ONLY clickable/navigating element on the card */}
      <Link
        to="/list"
        className="mt-auto w-full text-center bg-slate-900 hover:bg-[#f36c3a] active:scale-95 text-white text-sm font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        View Details
        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  </div>
);

// ── Main Section ─────────────────────────────────────────────
const FeaturedProperties = () => {
  // Track which property IDs are saved as favourites
  const [favourites, setFavourites] = useState([]);

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-20 bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* ── Section Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
              Hand-Picked For You
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Featured Properties
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-lg">
              Verified listings across Pakistan's top cities — updated daily.
            </p>
          </div>

          {/* Favourites counter badge */}
          <div className="flex items-center gap-4">
            {favourites.length > 0 && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold px-3 py-2 rounded-full">
                <FaHeart className="text-rose-500 text-xs" />
                {favourites.length} Saved
              </div>
            )}
            <Link
              to="/list"
              className="inline-flex items-center gap-2 text-[#f36c3a] font-bold text-sm sm:text-base hover:gap-3 transition-all"
            >
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {PROPERTIES.map((item) => (
            <PropertyCard
              key={item.id}
              item={item}
              isFaved={favourites.includes(item.id)}
              onToggleFav={toggleFavourite}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-12 text-center">
          <Link
            to="/list"
            className="inline-flex items-center gap-2 bg-[#f36c3a] hover:bg-orange-600 active:scale-95 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-orange-200 text-sm sm:text-base"
          >
            Browse All Properties <FaArrowRight className="text-xs" />
          </Link>
          <p className="text-slate-400 text-xs mt-3">
            100+ verified listings · Updated daily · No hidden fees
          </p>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProperties;