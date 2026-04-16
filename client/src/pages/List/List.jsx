// export default List;
import { useState, useEffect, useMemo } from "react";
import PropertyCard from "../../components/list/PropertyCard";
import EmptyState from "../../components/list/EmptyState";
import Pagination from "../../components/list/Pagination";
import ListHeader from "../../components/list/ListHeader";
import apiRequest from "../../lib/apiRequest";

function List() {
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [favourites, setFavourites] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    category: "All Types",
    listingType: "All",
  });
  
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResetKey, setSearchResetKey] = useState(0);

  const PER_PAGE = 6;

  // Fetch all properties once
  useEffect(() => {
    const fetchAllProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiRequest.get('/posts');
        let data = [];
        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.posts) {
          data = response.data.posts;
        } else if (response.data.data) {
          data = response.data.data;
        }
        setAllProperties(data);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError(err.response?.data?.message || "Failed to load properties.");
        setAllProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProperties();
  }, []);

  // Fetch favourites
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await apiRequest.get('/saved-posts');
        const savedIds = response.data.map(item => item.postId || item.id);
        setFavourites(savedIds);
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
        setFavourites([]);
      }
    };
    fetchFavourites();
  }, []);

  // Reset filters function
  const handleResetFilters = () => {
    setFilters({
      query: "",
      category: "All Types",
      listingType: "All",
    });
    setSort("newest");
    setPage(1);
    setSearchResetKey(prev => prev + 1);
  };
  
  // Client-side filtering & sorting
  const filteredProperties = useMemo(() => {
    let list = [...allProperties];
    
    if (filters.listingType !== "All") {
      list = list.filter(p => 
        (p.listingType || p.type || "").toLowerCase() === filters.listingType.toLowerCase()
      );
    }
    
    if (filters.category !== "All Types") {
      list = list.filter(p => 
        (p.type || p.property || "").toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.query.trim()) {
      const term = filters.query.toLowerCase().trim();
      list = list.filter(p => 
        (p.title || "").toLowerCase().includes(term) || 
        (p.location || p.city || "").toLowerCase().includes(term)
      );
    }
    
    if (sort === "price_asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sort === "price_desc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sort === "newest") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    
    return list;
  }, [allProperties, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / PER_PAGE));
  const paginatedProperties = filteredProperties.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const toggleFavourite = async (id) => {
    const wasFaved = favourites.includes(id);
    setFavourites(prev => 
      wasFaved ? prev.filter(f => f !== id) : [...prev, id]
    );
    try {
      if (wasFaved) {
        await apiRequest.delete(`/saved-posts/${id}`);
      } else {
        await apiRequest.post(`/saved-posts/${id}`);
      }
    } catch (err) {
      setFavourites(prev => 
        wasFaved ? [...prev, id] : prev.filter(f => f !== id)
      );
      console.error("Failed to toggle favourite:", err);
    }
  };

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading skeleton
  if (loading && allProperties.length === 0) {
    return (
      <div className="bg-slate-50 pb-12">
        <ListHeader
          filtered={[]}
          favourites={favourites}
          filters={filters}
          sort={sort}
          page={page}
          totalPages={totalPages}
          PER_PAGE={PER_PAGE}
          onSearch={handleSearch}
          onSortChange={setSort}
          onReset={handleResetFilters}
          searchResetKey={searchResetKey}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && allProperties.length === 0) {
    return (
      <div className="bg-slate-50 min-h-[400px] flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 pb-12">   {/* ← removed min-h-screen, added bottom padding */}
      <ListHeader
        filtered={filteredProperties}
        favourites={favourites}
        filters={filters}
        sort={sort}
        page={page}
        totalPages={totalPages}
        PER_PAGE={PER_PAGE}
        onSearch={handleSearch}
        onSortChange={setSort}
        onReset={handleResetFilters}
        searchResetKey={searchResetKey}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 auto-rows-min">
          {paginatedProperties.length > 0 ? (
            paginatedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                p={property}
                isFaved={favourites.includes(property.id)}
                onToggleFav={toggleFavourite}
              />
            ))
          ) : (
            !loading && <EmptyState />
          )}
        </div>

        {/* Pagination - always show (will handle single page internally) */}
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