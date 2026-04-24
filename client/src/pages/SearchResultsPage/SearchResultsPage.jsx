import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { FaArrowRight } from "react-icons/fa";

const PROPERTY_TYPES = ["All Types", "house", "apartment", "commercial", "land"];

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const [filters, setFilters] = useState({
    query: searchParams.get("city") || "",
    property: "All Types",
    listingType: searchParams.get("type") || "All",
    minPrice: searchParams.get("min") || "",
    maxPrice: searchParams.get("max") || "",
  });

  const PER_PAGE = 6;

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest.get("/posts/active");
        let data = [];
        if (Array.isArray(response.data)) data = response.data;
        else if (response.data.posts) data = response.data.posts;
        else if (response.data.data) data = response.data.data;
        setAllProperties(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load properties.");
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await apiRequest.get("/saved-posts");
        const savedIds = response.data.map((item) => item.postId || item.id);
        setFavourites(savedIds);
      } catch {
        setFavourites([]);
      }
    };
    fetchFavourites();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ query: "", property: "All Types", listingType: "All", minPrice: "", maxPrice: "" });
    setSort("newest");
    setPage(1);
    navigate("/search-results");
  };

  const toggleFavourite = async (id) => {
    const wasFaved = favourites.includes(id);
    setFavourites((prev) => (wasFaved ? prev.filter((f) => f !== id) : [...prev, id]));
    try {
      if (wasFaved) await apiRequest.delete(`/saved-posts/${id}`);
      else await apiRequest.post(`/saved-posts/${id}`);
    } catch {
      setFavourites((prev) => (wasFaved ? [...prev, id] : prev.filter((f) => f !== id)));
    }
  };

  const filtered = useMemo(() => {
    let list = [...allProperties];

    // Only show available properties
    // list = allProperties.filter(p => p.status === 'available');

    // listingType: "sale" or "rent" — from backend
    if (filters.listingType && filters.listingType !== "All") {
      list = list.filter(
        (p) => (p.listingType || "").toLowerCase() === filters.listingType.toLowerCase()
      );
    }

    // property: "house", "apartment", "commercial", "land"
    if (filters.property !== "All Types") {
      list = list.filter(
        (p) => (p.property || "").toLowerCase() === filters.property.toLowerCase()
      );
    }

    // query: search city or title
    if (filters.query.trim()) {
      const term = filters.query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(term) ||
          (p.city || "").toLowerCase().includes(term) ||
          (p.address || "").toLowerCase().includes(term)
      );
    }

    // price range
    if (filters.minPrice !== "") list = list.filter((p) => (p.price || 0) >= Number(filters.minPrice));
    if (filters.maxPrice !== "") list = list.filter((p) => (p.price || 0) <= Number(filters.maxPrice));

    // sort
    if (sort === "price_asc") list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sort === "price_desc") list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else list.sort((a, b) => (b.id || 0) - (a.id || 0));

    return list;
  }, [allProperties, filters, sort]);

  const savedCount = favourites.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // listingType badge color: "sale" = gray, "rent" = green
  const getListingBadgeColor = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "rent") return "bg-green-500";
    if (t === "sale") return "bg-gray-500";
    return "bg-blue-500";
  };

  const getListingLabel = (type) => {
    const t = (type || "").toLowerCase();
    if (t === "rent") return "FOR RENT";
    if (t === "sale") return "FOR SALE";
    return (type || "").toUpperCase();
  };

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* FILTER BAR */}
      <div className="bg-white border-b border-gray-200 shadow-sm" style={{paddingTop: '20px'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          {/* Search - full width */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              value={filters.query}
              onChange={(e) => handleFilterChange("query", e.target.value)}
              placeholder="Search by city or property name..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:bg-white transition placeholder-gray-400"
            />
          </div>

          {/* Row: Property Type + Listing Type + Reset */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {/* Property type */}
            <div className="relative col-span-1">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <select
                value={filters.property}
                onChange={(e) => handleFilterChange("property", e.target.value)}
                className="w-full pl-8 pr-6 py-2.5 text-xs border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 appearance-none cursor-pointer"
              >
                {PROPERTY_TYPES.map((c) => (
                  <option key={c} value={c}>{c === "All Types" ? "All Types" : capitalize(c)}</option>
                ))}
              </select>
              <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Listing type */}
            <div className="relative col-span-1">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 10V5a2 2 0 012-2z" />
              </svg>
              <select
                value={filters.listingType}
                onChange={(e) => handleFilterChange("listingType", e.target.value)}
                className="w-full pl-8 pr-6 py-2.5 text-xs border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 appearance-none cursor-pointer"
              >
                <option value="All">All</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
              <svg className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="col-span-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-700 border border-gray-500 rounded-md bg-gray-300 hover:bg-gray-300 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>

          {/* Price Range Row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500 font-medium whitespace-nowrap shrink-0">Price:</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px] font-bold">PKR</span>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                placeholder="Min"
                className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>
            <span className="text-gray-300 font-bold text-sm shrink-0">—</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[9px] font-bold">PKR</span>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                placeholder="Max"
                className="w-full pl-8 pr-2 py-2 text-xs border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
              />
            </div>
          </div>

          {/* Results count + Sort */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              <strong className="text-gray-900">{filtered.length}</strong> properties found
              {savedCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-red-500 font-semibold text-xs">
                  <svg className="w-3 h-3 fill-red-500" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  {savedCount} Saved
                </span>
              )}
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="pl-2 pr-7 py-2 text-xs border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-700 appearance-none cursor-pointer font-medium"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-10 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error && allProperties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-xl">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold">
              Try Again
            </button>
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((p) => {
              const isFaved = favourites.includes(p.id);
              // images is an array from backend
              const imgSrc = Array.isArray(p.images) ? p.images[0] : p.images || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80";
              const listingType = p.listingType || "";
              const propType = p.property || "";
              // size comes from postDetails — may be nested
              const size = p.postDetail?.size || p.postDetails?.size || p.size || null;

              return (
                <div key={p.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={imgSrc}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {listingType && (
                      <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-widest ${getListingBadgeColor(listingType)}`}>
                        {getListingLabel(listingType)}
                      </span>
                    )}
                    {propType && (
                      <span className="absolute top-3 right-10 bg-white/90 backdrop-blur text-gray-700 text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                        {capitalize(propType)}
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavourite(p.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <svg className={`w-4 h-4 transition-colors ${isFaved ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-400"}`} viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="text-xl font-bold text-gray-900 mb-0.5">
                      PKR. {(p.price || 0).toLocaleString()}
                      {listingType === "rent" && (
                        <span className="text-sm font-medium text-gray-500">/mo</span>
                      )}
                    </p>
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-1">{p.title}</h3>
                    {p.city && (
                      <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {p.city}
                      </p>
                    )}

                    {/* bedroom/bathroom/size — using correct field names from backend */}
                    {(p.bedroom || p.bathroom || size) && (
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 border-t border-gray-100 pt-3">
                        {p.bedroom > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10M21 7v10M3 12h18M3 7a2 2 0 012-2h14a2 2 0 012 2M3 17a2 2 0 002 2h14a2 2 0 002-2" />
                            </svg>
                            {p.bedroom} Beds
                          </span>
                        )}
                        {p.bathroom > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 12h16M4 12a2 2 0 01-2-2V6a2 2 0 012-2h4v8M4 12v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
                            </svg>
                            {p.bathroom} Baths
                          </span>
                        )}
                        {size && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            {size} sqft
                          </span>
                        )}
                      </div>
                    )}

                    <Link
                      to={`/posts/${p.id}`}
                      className="block w-full py-2.5 bg-gray-900 text-white text-center text-sm font-semibold rounded-lg hover:bg-gray-500 transition-colors duration-200"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">🏠</div>
            <h3 className="text-xl font-bold text-gray-700 mb-1">No properties found</h3>
            <p className="text-gray-400 text-sm mb-5">Try adjusting your filters or search term.</p>
            <button onClick={handleReset} className="px-5 py-2.5 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 transition">
              Clear Filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 items-center gap-2">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === 1}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                  page === n ? "bg-gray-500 text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={page === totalPages}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        )}
        {/* BROWSE MORE BUTTON */}
        {/* Bottom CTA */}
                <div className="mt-12 text-center">
                  <Link
                    to="/list"
                    className="inline-flex items-center gap-2 bg-gray-900 active:scale-95 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-gray-200 text-sm sm:text-base"
                  >
                    Browse All Properties <FaArrowRight className="text-xs" />
                  </Link>
                  <p className="text-slate-400 text-xs mt-3">
                    Fresh listings added daily.
                  </p>
                </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;