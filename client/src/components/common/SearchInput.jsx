import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-xl mx-auto"
    >
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="Search by city or property..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-2xl shadow-lg border border-gray-200 
        focus:ring-2 focus:ring-[#f36c3a] outline-none text-lg"
      />

      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#f36c3a] text-white 
        px-6 py-2 rounded-xl font-semibold hover:bg-[#d85b2e] transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchInput;