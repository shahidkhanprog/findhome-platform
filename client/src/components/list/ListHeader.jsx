import { useContext } from "react";
import SearchInput from "../common/SearchInput";
import { FaHeart, FaUndo } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";

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
  onReset,
  searchResetKey,
}) => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="bg-white border-b border-slate-100 shadow-sm pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">

        {/* Search + Reset row - unchanged */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchInput key={searchResetKey} onSearch={onSearch} />
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
            title="Reset all filters"
          >
            <FaUndo className="text-xs" />
            Reset
          </button>
        </div>

        {/* Results count + sort */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-xs sm:text-sm text-slate-500">
              <strong className="text-slate-900">{filtered.length}</strong> properties found
            </p>

            {/* Saved count only when logged in */}
            {currentUser && favourites.length > 0 && (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold px-2.5 py-1 rounded-full">
                <FaHeart className="text-[10px]" />
                {favourites.length} Saved
              </div>
            )}

            {filters.listingType !== "All" && (
              <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full">
                {filters.listingType === "rent" ? "For Rent" : "For Sale"}
              </span>
            )}
            {filters.category !== "All Types" && (
              <span className="bg-orange-50 text-[#f36c3a] text-xs font-bold px-2.5 py-1 rounded-full">
                {filters.category}
              </span>
            )}
          </div>

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

        {/* Page indicator - unchanged */}
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
};

export default ListHeader;