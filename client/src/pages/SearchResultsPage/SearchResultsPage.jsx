import { useState, useMemo } from "react";
import SearchInput from "../../components/common/SearchInput";

const PROPERTIES = [
  { id: 1, title: "Modern Downtown Loft", location: "New York, NY", price: 4200, type: "Apartment", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2, title: "Suburban Family Home", location: "Austin, TX", price: 620000, type: "House", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 3, title: "Beachfront Villa", location: "Miami, FL", price: 1250000, type: "Villa", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: 4, title: "Cozy Studio Apartment", location: "Chicago, IL", price: 1800, type: "Apartment", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80" },
  { id: 5, title: "Luxury Penthouse Suite", location: "Los Angeles, CA", price: 8500, type: "Apartment", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80" },
  { id: 6, title: "Mountain Retreat Cabin", location: "Denver, CO", price: 475000, type: "House", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80" },
  { id: 7, title: "Historic Brownstone", location: "Boston, MA", price: 890000, type: "House", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
  { id: 8, title: "Minimalist City Flat", location: "Seattle, WA", price: 2900, type: "Apartment", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
  { id: 9, title: "Gated Community Townhouse", location: "Phoenix, AZ", price: 385000, type: "Townhouse", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id: 10, title: "Waterfront Condo", location: "San Diego, CA", price: 3600, type: "Apartment", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80" },
];

const PER_PAGE = 6;

function SearchResultsPage() {
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ query: "", category: "All Types" });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filtering
  };

  const filtered = useMemo(() => {
    let list = [...PROPERTIES];

    // Filter by Category
    if (filters.category !== "All Types") {
      list = list.filter((p) => p.type === filters.category);
    }

    // Filter by Query (Title or Location)
    if (filters.query.trim()) {
      const term = filters.query.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [filters, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#fef7f6] pt-5">
      {/* SEARCH HEADER */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <SearchInput onSearch={handleSearch} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Found <strong className="text-slate-900">{filtered.length}</strong> properties
            </p>
            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="text-sm font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {paginated.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-[#f36c3a] uppercase">
                    {p.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{p.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{p.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#f36c3a]">${p.price.toLocaleString()}</span>
                    <button className="px-5 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold hover:bg-[#f36c3a] hover:text-white transition-colors">
                      View details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <h3 className="text-xl font-bold text-slate-700">No properties found</h3>
            <p className="text-slate-400">Try adjusting your search or category.</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center pb-16 gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                page === n ? "bg-[#f36c3a] text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100 hover:bg-orange-50"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResultsPage;