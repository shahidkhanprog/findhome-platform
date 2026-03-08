// src/components/list/PropertyCard.jsx
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt, FaBed, FaBath,
  FaRulerCombined, FaHeart, FaArrowRight,
} from "react-icons/fa";

const PropertyCard = ({ p, isFaved, onToggleFav }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">

    {/* ── Image Block ── */}
    <div className="relative overflow-hidden">
      <img
        src={p.image}
        alt={p.title}
        className="w-full h-48 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
      />

      {/* For Rent / For Sale — top left */}
      <div className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow
        ${p.listingType === "rent" ? "bg-emerald-500" : "bg-blue-500"}`}>
        {p.listingType === "rent" ? "For Rent" : "For Sale"}
      </div>

      {/* Property type — top right (offset for heart) */}
      <div className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase shadow">
        {p.type}
      </div>

      {/* Favourite heart */}
      <button
        onClick={() => onToggleFav(p.id)}
        aria-label={isFaved ? "Remove from favourites" : "Save property"}
        className={`absolute top-3 right-3 p-1.5 rounded-full shadow transition-all duration-200 active:scale-90
          ${isFaved
            ? "bg-rose-500 text-white"
            : "bg-white/90 backdrop-blur text-slate-300 hover:text-rose-400"
          }`}
      >
        <FaHeart className="text-xs" />
      </button>
    </div>

    {/* ── Card Body ── */}
    <div className="flex flex-col flex-1 p-4 sm:p-5">

      {/* Price */}
      <p className="text-base sm:text-lg font-extrabold text-slate-900 mb-0.5">
        ${p.price.toLocaleString()}
        {p.listingType === "rent" && (
          <span className="text-xs font-medium text-slate-400">/mo</span>
        )}
      </p>

      {/* Title — plain text, NOT a link */}
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 line-clamp-1">
        {p.title}
      </h3>

      {/* Location — plain text */}
      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
        <FaMapMarkerAlt className="text-[#f36c3a] shrink-0 text-xs" />
        <span className="truncate">{p.location}</span>
      </div>

      {/* Specs row */}
      <div className="flex items-center gap-3 text-slate-500 text-xs border-t border-slate-100 pt-3 mb-4">
        <span className="flex items-center gap-1">
          <FaBed className="text-slate-400 shrink-0" /> {p.beds} Beds
        </span>
        <span className="w-px h-3 bg-slate-200 shrink-0" />
        <span className="flex items-center gap-1">
          <FaBath className="text-slate-400 shrink-0" /> {p.baths} Baths
        </span>
        <span className="w-px h-3 bg-slate-200 shrink-0" />
        <span className="flex items-center gap-1 truncate">
          <FaRulerCombined className="text-slate-400 shrink-0" /> {p.area}
        </span>
      </div>

      {/* ── View Details — ONLY navigating element on the card ── */}
      <Link
        to={`/property-detail/${p.id}`}
        state={{ property: p }}
        className="mt-auto w-full bg-slate-900 hover:bg-[#f36c3a] active:scale-95 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        View Details
        <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    </div>
  </div>
);

export default PropertyCard;