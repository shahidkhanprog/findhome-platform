import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation to single property page
import { FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt, FaHeart, FaSearch } from 'react-icons/fa';

const List = () => {
  const navigate = useNavigate();
  
  // 1. Professional Dummy Data
  const propertiesData = [
    {
      id: "prop-101",
      title: "Luxury Modern Villa",
      price: 850000,
      location: "Beverly Hills, CA",
      type: "Villa",
      beds: 4,
      baths: 3,
      sqft: 2500,
      image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      amenities: ["Pool", "Garage", "Garden"],
      tag: "For Sale"
    },
    {
      id: "prop-102",
      title: "Skyline Glass Penthouse",
      price: 1200000,
      location: "Manhattan, NY",
      type: "Apartment",
      beds: 3,
      baths: 2,
      sqft: 1800,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      amenities: ["Gym", "Elevator", "Smart Home"],
      tag: "New"
    },
    // Add more dummy objects here...
  ];

  // 2. Filter States
  const [filters, setFilters] = useState({
    location: "",
    maxPrice: 5000000,
    type: "Any",
    amenities: []
  });

  // Handle clicking a card to go to a single page
  const handleViewDetails = (id) => {
    // This passes the unique property ID to the URL
    navigate(`/property/${id}`);
  };

  return (
    <div className="bg-[#fef7f6] min-h-screen font-sans text-[#101828]">
      <div className="max-w-7xl mx-auto px-6 lg:px-32 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="lg:w-1/4 space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit sticky top-10">
          <h2 className="text-xl font-bold border-b pb-4">Filters</h2>
          
          {/* Location Search */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Location</label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search location..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-[#f36c3a]"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm font-bold">
              <span>Price Range</span>
              <span className="text-[#f36c3a]">${(filters.maxPrice / 1000).toFixed(0)}k</span>
            </div>
            <input 
              type="range" min="0" max="5000000" step="100000"
              className="w-full accent-[#f36c3a]"
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Amenities</label>
            <div className="grid grid-cols-1 gap-2">
              {["Pool", "Garage", "Garden", "Gym", "Smart Home"].map(amenity => (
                <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 accent-[#f36c3a]" />
                  <span className="text-slate-600 group-hover:text-[#f36c3a] transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Listing Grid */}
        <main className="lg:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {propertiesData.map((prop) => (
              <div 
                key={prop.id}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => handleViewDetails(prop.id)} // Pass ID to single page
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <span className="absolute top-5 left-5 bg-[#f36c3a] text-white px-4 py-1 rounded-full text-xs font-bold uppercase">{prop.tag}</span>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-[#f36c3a] transition-colors">{prop.title}</h3>
                    <p className="text-[#f36c3a] font-extrabold">${prop.price.toLocaleString()}</p>
                  </div>
                  <p className="flex items-center gap-2 text-[#667085] text-sm mb-6"><FaMapMarkerAlt className="text-[#f36c3a]" /> {prop.location}</p>
                  
                  <div className="flex justify-between py-4 border-t border-slate-50 text-[#667085] text-sm font-medium">
                    <span className="flex items-center gap-2"><FaBed /> {prop.beds} Beds</span>
                    <span className="flex items-center gap-2"><FaBath /> {prop.baths} Baths</span>
                    <span className="flex items-center gap-2"><FaRulerCombined /> {prop.sqft} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default List;