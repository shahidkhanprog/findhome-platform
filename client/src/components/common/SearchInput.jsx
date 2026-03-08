import React, { useState } from "react";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

const CATEGORIES = ["All Types", "Apartment", "House", "Villa", "Townhouse"];

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("All Types");

  // Helper to trigger search with current values
  const triggerSearch = (query, cat) => {
    onSearch({ query, category: cat });
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setValue(val);
    triggerSearch(val, category);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    triggerSearch(value, cat);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3">
      {/* Text Search Input */}
      <div className="flex-[2] relative group">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f36c3a] transition-colors" />
        <input
          type="text"
          placeholder="Search by city (e.g. Austin) or home name..."
          value={value}
          onChange={handleTextChange}
          className="w-full p-4 pl-12 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f36c3a] focus:border-transparent outline-none transition-all text-slate-700 bg-white"
        />
      </div>

      {/* Category Dropdown */}
      <div className="flex-1 relative group">
        <HiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f36c3a] transition-colors text-lg" />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f36c3a] outline-none bg-white cursor-pointer appearance-none text-slate-700 transition-all"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {/* Custom Arrow Icon */}
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-xs" />
      </div>
    </div>
  );
};

export default SearchInput;