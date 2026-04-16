// // src/components/list/PropertyCard.jsx
// import { Link } from "react-router-dom";
// import {
//   FaMapMarkerAlt, FaBed, FaBath,
//   FaRulerCombined, FaHeart, FaArrowRight,
// } from "react-icons/fa";

// const PropertyCard = ({ p, isFaved, onToggleFav }) => {
//   // Helper function to get the image URL
//   const getImageUrl = () => {
//     // Check if images array exists and has items
//     if (p.images && p.images.length > 0) {
//       return p.images[0];
//     }
//     // Check for single image field
//     if (p.image) {
//       return p.image;
//     }
//     // Fallback placeholder image
//     return "https://via.placeholder.com/600x400?text=No+Image+Available";
//   };

//   const imageUrl = getImageUrl();

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">

//       {/* ── Image Block ── */}
//       <div className="relative overflow-hidden bg-gray-100">
//         <img
//           src={imageUrl}
//           alt={p.title || "Property"}
//           className="w-full h-48 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
//           onError={(e) => {
//             // If image fails to load, show placeholder
//             e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
//             e.target.onerror = null; // Prevent infinite loop
//           }}
//           loading="lazy"
//         />

//         {/* For Rent / For Sale — top left */}
//         <div className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow
//           ${p.listingType === "rent" ? "bg-emerald-500" : "bg-blue-500"}`}>
//           {p.listingType === "rent" ? "For Rent" : "For Sale"}
//         </div>

//         {/* Property type — top right (offset for heart) */}
//         <div className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase shadow">
//           {p.type || p.property || "Property"}
//         </div>

//         {/* Favourite heart */}
//         <button
//           onClick={() => onToggleFav(p.id)}
//           aria-label={isFaved ? "Remove from favourites" : "Save property"}
//           className={`absolute top-3 right-3 p-1.5 rounded-full shadow transition-all duration-200 active:scale-90
//             ${isFaved
//               ? "bg-rose-500 text-white"
//               : "bg-white/90 backdrop-blur text-slate-300 hover:text-rose-400"
//             }`}
//         >
//           <FaHeart className="text-xs" />
//         </button>
//       </div>

//       {/* ── Card Body ── */}
//       <div className="flex flex-col flex-1 p-4 sm:p-5">

//         {/* Price */}
//         <p className="text-base sm:text-lg font-extrabold text-slate-900 mb-0.5">
//           PKR. {(p.price || 0).toLocaleString()}
//           {p.listingType === "rent" && (
//             <span className="text-xs font-medium text-slate-400">/mo</span>
//           )}
//         </p>

//         {/* Title — plain text, NOT a link */}
//         <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 line-clamp-1">
//           {p.title || "Untitled Property"}
//         </h3>

//         {/* Location — plain text */}
//         <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
//           <FaMapMarkerAlt className="text-[#f36c3a] shrink-0 text-xs" />
//           <span className="truncate">{p.location || p.city || "Location not specified"}</span>
//         </div>

//         {/* Specs row */}
//         <div className="flex items-center gap-3 text-slate-500 text-xs border-t border-slate-100 pt-3 mb-4">
//           {(p.beds || p.bedroom || p.bedrooms) > 0 && (
//             <>
//               <span className="flex items-center gap-1">
//                 <FaBed className="text-slate-400 shrink-0" /> {(p.beds || p.bedroom || p.bedrooms)} Beds
//               </span>
//               <span className="w-px h-3 bg-slate-200 shrink-0" />
//             </>
//           )}
          
//           {(p.baths || p.bathroom || p.bathrooms) > 0 && (
//             <>
//               <span className="flex items-center gap-1">
//                 <FaBath className="text-slate-400 shrink-0" /> {(p.baths || p.bathroom || p.bathrooms)} Baths
//               </span>
//               <span className="w-px h-3 bg-slate-200 shrink-0" />
//             </>
//           )}
          
//           <span className="flex items-center gap-1 truncate">
//             <FaRulerCombined className="text-slate-400 shrink-0" /> 
//             {p.area || (p.postDetails?.size ? `${p.postDetails.size} sqft` : "N/A")}
//           </span>
//         </div>

//         {/* ── View Details — ONLY navigating element on the card ── */}
//         <Link
//           to={`/property-detail/${p.id}`}
//           state={{ property: p }}
//           className="mt-auto w-full bg-slate-900 hover:bg-[#f36c3a] active:scale-95 text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
//         >
//           View Details
//           <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform duration-200" />
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default PropertyCard;
// src/components/list/PropertyCard.jsx
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import {
  FaMapMarkerAlt, FaBed, FaBath,
  FaRulerCombined, FaHeart, FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

// ── Login Prompt Modal (light & attractive) ─────────────────
const LoginPromptModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
        >
          <FaTimes size={18} />
        </button>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100 flex items-center justify-center">
          <FaHeart className="text-rose-500 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Login Required</h3>
        <p className="text-slate-500 text-sm mb-6">
          Please login or create an account to save properties to your favourites.
        </p>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="flex-1 border border-slate-200 hover:border-[#f36c3a] text-slate-700 font-bold py-2.5 rounded-xl transition"
          >
            Sign Up
          </Link>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-xs text-slate-400 hover:text-slate-500 transition"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};

const PropertyCard = ({ p, isFaved, onToggleFav }) => {
  const { currentUser } = useContext(AuthContext);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Helper to get image URL
  const getImageUrl = () => {
    if (p.images && p.images.length > 0) return p.images[0];
    if (p.image) return p.image;
    return "https://via.placeholder.com/600x400?text=No+Image+Available";
  };

  const imageUrl = getImageUrl();

  const handleFavClick = () => {
    if (!currentUser) {
      setShowLoginModal(true);
    } else {
      onToggleFav(p.id);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
        {/* Image Block */}
        <div className="relative overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={p.title || "Property"}
            className="w-full h-48 sm:h-52 object-cover hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Available";
              e.target.onerror = null;
            }}
            loading="lazy"
          />

          {/* For Rent / For Sale badge */}
          <div className={`absolute top-3 left-3 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow
            ${p.listingType === "rent" ? "bg-emerald-500" : "bg-blue-500"}`}>
            {p.listingType === "rent" ? "For Rent" : "For Sale"}
          </div>

          {/* Property type badge */}
          <div className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase shadow">
            {p.type || p.property || "Property"}
          </div>

          {/* Favourite heart button */}
          <button
            onClick={handleFavClick}
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

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <p className="text-base sm:text-lg font-extrabold text-slate-900 mb-0.5">
            PKR. {(p.price || 0).toLocaleString()}
            {p.listingType === "rent" && <span className="text-xs font-medium text-slate-400">/mo</span>}
          </p>
          <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 line-clamp-1">
            {p.title || "Untitled Property"}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
            <FaMapMarkerAlt className="text-[#f36c3a] shrink-0 text-xs" />
            <span className="truncate">{p.location || p.city || "Location not specified"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-xs border-t border-slate-100 pt-3 mb-4">
            {(p.beds || p.bedroom || p.bedrooms) > 0 && (
              <>
                <span className="flex items-center gap-1">
                  <FaBed className="text-slate-400 shrink-0" /> {(p.beds || p.bedroom || p.bedrooms)} Beds
                </span>
                <span className="w-px h-3 bg-slate-200 shrink-0" />
              </>
            )}
            {(p.baths || p.bathroom || p.bathrooms) > 0 && (
              <>
                <span className="flex items-center gap-1">
                  <FaBath className="text-slate-400 shrink-0" /> {(p.baths || p.bathroom || p.bathrooms)} Baths
                </span>
                <span className="w-px h-3 bg-slate-200 shrink-0" />
              </>
            )}
            <span className="flex items-center gap-1 truncate">
              <FaRulerCombined className="text-slate-400 shrink-0" /> 
              {p.area || (p.postDetails?.size ? `${p.postDetails.size} sqft` : "N/A")}
            </span>
          </div>
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

      {/* Login Modal */}
      <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
};

export default PropertyCard;