// SearchBar.jsx - Handles Buy/Rent tab switching, inputs, validation & navigation
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import StatsSection from "./StatsSection";

const SearchBar = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("buy"); // "buy" or "rent"
  const [errors, setErrors] = useState({});
  const [searchData, setSearchData] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  // Update field value and clear its error on change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate then navigate to search results
  const handleSearch = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!searchData.city.trim()) newErrors.city = "City required";
    if (!searchData.minPrice) newErrors.minPrice = "Min Price required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const queryParams = new URLSearchParams({
      type: activeTab,
      city: searchData.city,
      min: searchData.minPrice,
      max: searchData.maxPrice,
    }).toString();
    navigate(`/search-results?${queryParams}`);
  };

  return (
    <section className="relative z-30 -mt-20 px-6 max-w-6xl mx-auto">

      {/* Buy / Rent Tab Switcher */}
      <div className="flex">
        {["buy", "rent"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-12 py-4 font-bold rounded-t-xl transition-all border-t border-l border-r border-slate-200 capitalize ${
              activeTab === tab
                ? "bg-white text-slate-900"
                : "bg-slate-300 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Inputs + Submit Button */}
      <div className="bg-white shadow-2xl border-2 border-slate-200 flex flex-col md:flex-row items-stretch rounded-b-xl md:rounded-tr-xl overflow-hidden">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 w-full">

          {/* City */}
          <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-slate-200">
            <input
              type="text"
              name="city"
              value={searchData.city}
              onChange={handleInputChange}
              placeholder="City"
              className={`w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400 ${
                errors.city ? "placeholder-red-400" : ""
              }`}
            />
            {errors.city && (
              <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                {errors.city}
              </p>
            )}
          </div>

          {/* Min Price */}
          <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-slate-200">
            <input
              type="number"
              name="minPrice"
              value={searchData.minPrice}
              onChange={handleInputChange}
              placeholder="Min Price"
              className="w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400"
            />
            {errors.minPrice && (
              <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                {errors.minPrice}
              </p>
            )}
          </div>

          {/* Max Price (optional) */}
          <div className="px-6 py-5">
            <input
              type="number"
              name="maxPrice"
              value={searchData.maxPrice}
              onChange={handleInputChange}
              placeholder="Max Price"
              className="w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400"
            />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full md:w-32 bg-[#fbc02d] hover:bg-[#f9a825] text-white py-6 md:py-0 flex items-center justify-center transition-all active:scale-95"
        >
          <FaSearch className="text-2xl" />
        </button>
      </div>
    </section>
  );
};

export default SearchBar;