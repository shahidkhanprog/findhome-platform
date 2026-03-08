// src/components/list/EmptyState.jsx
import { FaSearch } from "react-icons/fa";

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-center">
    <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
      <FaSearch className="text-[#f36c3a] text-2xl" />
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-slate-700 mb-2">
      No properties found
    </h3>
    <p className="text-slate-400 text-sm max-w-sm">
      Try adjusting your search term, property type, or listing filter to see more results.
    </p>
  </div>
);

export default EmptyState;