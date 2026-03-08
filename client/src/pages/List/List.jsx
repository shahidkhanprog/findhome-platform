// src/pages/List.js
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import SearchInput from "../../components/common/SearchInput";
import {
  FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined,
  FaHeart, FaArrowRight, FaHome, FaSearch
} from "react-icons/fa";

const PROPERTIES = [
  { id: 1,  title: "Modern Downtown Loft",      location: "New York, NY",    price: 4200,    type: "Apartment", listingType: "rent", beds: 2, baths: 1, area: "850 sqft",  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2,  title: "Suburban Family Home",       location: "Austin, TX",      price: 620000,  type: "House",     listingType: "sale", beds: 4, baths: 3, area: "2,400 sqft", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 3,  title: "Beachfront Villa",           location: "Miami, FL",       price: 1250000, type: "Villa",     listingType: "sale", beds: 5, baths: 4, area: "4,200 sqft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: 4,  title: "Cozy Studio Apartment",      location: "Chicago, IL",     price: 1800,    type: "Apartment", listingType: "rent", beds: 1, baths: 1, area: "480 sqft",  image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80" },
  { id: 5,  title: "Luxury Penthouse Suite",     location: "Los Angeles, CA", price: 8500,    type: "Apartment", listingType: "rent", beds: 3, baths: 2, area: "2,100 sqft", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80" },
  { id: 6,  title: "Mountain Retreat Cabin",     location: "Denver, CO",      price: 475000,  type: "House",     listingType: "sale", beds: 3, baths: 2, area: "1,600 sqft", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80" },
  { id: 7,  title: "City View Condo",            location: "Seattle, WA",     price: 3100,    type: "Apartment", listingType: "rent", beds: 2, baths: 2, area: "950 sqft",  image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
  { id: 8,  title: "Colonial Manor Estate",      location: "Boston, MA",      price: 980000,  type: "House",     listingType: "sale", beds: 6, baths: 5, area: "5,800 sqft", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
  { id: 9,  title: "Lakeside Townhouse",         location: "Orlando, FL",     price: 2600,    type: "House",     listingType: "rent", beds: 3, baths: 2, area: "1,400 sqft", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: 10, title: "Desert Modern Villa",        location: "Phoenix, AZ",     price: 875000,  type: "Villa",     listingType: "sale", beds: 4, baths: 3, area: "3,100 sqft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { id: 11, title: "Uptown Studio Flat",         location: "Nashville, TN",   price: 1450,    type: "Apartment", listingType: "rent", beds: 1, baths: 1, area: "420 sqft",  image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80" },
  { id: 12, title: "Riverside Executive Home",   location: "Portland, OR",    price: 710000,  type: "House",     listingType: "sale", beds: 5, baths: 4, area: "3,400 sqft", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80" },
];

const PER_PAGE = 6;

// ── Property Card ─────────────────────────────────────────────
const PropertyCard = ({ p, isFaved, onToggleFav }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">

    {/* Image */}
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

      {/* Property type — top right */}
      <div className="absolute top-3 right-12 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase shadow">
        {p.type}
      </div>

      {/* Favourite heart — far top right */}
      <button
        onClick={() => onToggleFav(p.id)}
        aria-label={isFaved ? "Remove from favourites" : "Save property"}
        className={`absolute top-3 right-3 p-1.5 rounded-full shadow transition-all duration-200 active:scale-90
          ${isFaved ? "bg-rose-500 text-white" : "bg-white/90 backdrop-blur text-slate-300 hover:text-rose-400"}`}
      >
        <FaHeart className="text-xs" />
      </button>
    </div>

    {/* Card Body */}
    <div className="flex flex-col flex-1 p-4 sm:p-5">

      {/* Price */}
      <p className="text-base sm:text-lg font-extrabold text-slate-900 mb-0.5">
        ${p.price.toLocaleString()}
        {p.listingType === "rent" && <span className="text-xs font-medium text-slate-400">/mo</span>}
      </p>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 line-clamp-1">
        {p.title}
      </h3>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-3">
        <FaMapMarkerAlt className="text-[#f36c3a] shrink-0 text-xs" />
        <span className="truncate">{p.location}</span>
      </div>

      {/* Specs */}
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

      {/* View Details button — only clickable element */}
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

// ── Empty State ───────────────────────────────────────────────
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

// ── Pagination ────────────────────────────────────────────────
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Build page number array — show max 5 pages with ellipsis
  const getPages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4 pb-16 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {getPages().map((n, i) =>
        n === "..." ? (
          <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
              page === n
                ? "bg-[#f36c3a] text-white shadow-md shadow-orange-200"
                : "bg-white text-slate-500 border border-slate-100 hover:bg-orange-50"
            }`}
          >
            {n}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 sm:px-4 h-10 rounded-xl font-bold text-sm border border-slate-100 bg-white text-slate-500 hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
};

// ── Main List Page ────────────────────────────────────────────
function List() {
  const [sort, setSort]       = useState("newest");
  const [page, setPage]       = useState(1);
  const [favourites, setFavourites] = useState([]);
  const [filters, setFilters] = useState({
    query: "", category: "All Types", listingType: "All",
  });

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...PROPERTIES];
    if (filters.listingType !== "All")
      list = list.filter((p) => p.listingType.toLowerCase() === filters.listingType.toLowerCase());
    if (filters.category !== "All Types")
      list = list.filter((p) => p.type === filters.category);
    if (filters.query.trim()) {
      const term = filters.query.toLowerCase().trim();
      list = list.filter(
        (p) => p.title.toLowerCase().includes(term) || p.location.toLowerCase().includes(term)
      );
    }
    if (sort === "price_asc")  list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filters, sort]);

  // Always exactly PER_PAGE (6) per page
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Search & Filter Header ── */}
      <div className="bg-white border-b border-slate-100 shadow-sm pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 space-y-3">
          <SearchInput onSearch={handleSearch} />

          {/* Results count + sort row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs sm:text-sm text-slate-500">
                <strong className="text-slate-900">{filtered.length}</strong> properties found
              </p>
              {/* Favourites badge */}
              {favourites.length > 0 && (
                <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold px-2.5 py-1 rounded-full">
                  <FaHeart className="text-[10px]" />
                  {favourites.length} Saved
                </div>
              )}
              {/* Active filter pills */}
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

            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
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

      {/* ── Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Always renders grid — EmptyState fills the single column when no results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paginated.length > 0
            ? paginated.map((p) => (
                <PropertyCard
                  key={p.id}
                  p={p}
                  isFaved={favourites.includes(p.id)}
                  onToggleFav={toggleFavourite}
                />
              ))
            : <EmptyState />
          }
        </div>

        {/* ── Pagination ── */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default List;