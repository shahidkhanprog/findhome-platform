import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaTag } from "react-icons/fa";
import { HiHome } from "react-icons/hi";

const CATEGORIES = ["All Types", "House", "Land", "Apartment", "Commercial"];
const LISTING_TYPES = ["All", "sale", "rent"];

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("All Types");
  const [listingType, setListingType] = useState("All");

  const triggerSearch = (query, cat, type) => {
    onSearch({
      query,
      category: cat,
      listingType: type,
    });
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setValue(val);
    triggerSearch(val, category, listingType);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setCategory(cat);
    triggerSearch(value, cat, listingType);
  };

  const handleListingChange = (e) => {
    const type = e.target.value;
    setListingType(type);
    triggerSearch(value, category, type);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3">

      {/* Search Input */}
      <div className="flex-[2] relative group">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f36c3a]" />
        <input
          type="text"
          placeholder="Search by city or property name..."
          value={value}
          onChange={handleTextChange}
          className="w-full p-4 pl-12 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f36c3a] outline-none"
        />
      </div>

      {/* Property Category */}
      <div className="flex-1 relative group">
        <HiHome className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f36c3a]" />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f36c3a] bg-white appearance-none"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
      </div>

      {/* Listing Type (Rent / Sale) */}
      <div className="flex-1 relative group">
        <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#f36c3a]" />
        <select
          value={listingType}
          onChange={handleListingChange}
          className="w-full p-4 pl-12 pr-10 border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#f36c3a] bg-white appearance-none"
        >
          <option value="All">All</option>
          <option value="sale">For Sale</option>
          <option value="rent">For Rent</option>
        </select>
        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
      </div>

    </div>
  );
};

export default SearchInput;