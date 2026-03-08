// src/components/list/ListHeader.jsx
import SearchInput from "../common/SearchInput";
import { FaHeart } from "react-icons/fa";

const ListHeader = ({
  filtered,
  favourites,
  filters,
  sort,
  page,
  totalPages,
  PER_PAGE,
  onSearch,
  onSortChange,
}) => (
  <div className="bg-white border-b border-slate-100 shadow-sm pt-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">

      {/* Search input */}
      <SearchInput onSearch={onSearch} />

      {/* Results count + sort */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Count */}
          <p className="text-xs sm:text-sm text-slate-500">
            <strong className="text-slate-900">{filtered.length}</strong> properties found
          </p>

          {/* Saved badge */}
          {favourites.length > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold px-2.5 py-1 rounded-full">
              <FaHeart className="text-[10px]" />
              {favourites.length} Saved
            </div>
          )}

          {/* Active filter: listing type */}
          {filters.listingType !== "All" && (
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {filters.listingType === "rent" ? "For Rent" : "For Sale"}
            </span>
          )}

          {/* Active filter: category */}
          {filters.category !== "All Types" && (
            <span className="bg-orange-50 text-[#f36c3a] text-xs font-bold px-2.5 py-1 rounded-full">
              {filters.category}
            </span>
          )}
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer hover:border-[#f36c3a] transition-colors"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </select>
      </div>

      {/* Page indicator */}
      {totalPages > 1 && (
        <p className="text-xs text-slate-400">
          Page <strong className="text-slate-600">{page}</strong> of{" "}
          <strong className="text-slate-600">{totalPages}</strong> —
          showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
        </p>
      )}
    </div>
  </div>
);

export default ListHeader;