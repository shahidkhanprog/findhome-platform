// FeaturedProperties.jsx - Shows the 6 most recent properties
import React, { useState, useEffect, useContext, use } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHeart } from "react-icons/fa";
import apiRequest from "../../lib/apiRequest";
import PropertyCard from "../../components/list/PropertyCard";
import { AuthContext } from "../../context/AuthContext";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favourites, setFavourites] = useState([]);

  // Get current currentUser (if currentUser login than display saved posts count)
  const { currentUser } = useContext(AuthContext);

  // Fetch all properties and take the 6 most recent
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

        if (data.length === 0) {
          setError("No properties found.");
          setProperties([]);
        } else {
          // Sort by newest first (assuming higher id = newer, or use createdAt)
          const sorted = [...data].sort((a, b) => {
            // Prefer createdAt if available, fallback to id
            const aDate = a.createdAt ? new Date(a.createdAt) : a.id;
            const bDate = b.createdAt ? new Date(b.createdAt) : b.id;
            return bDate - aDate;
          });

          // Take first 3
          const firstThree = sorted.slice(0, 3);
          setProperties(firstThree);
        }
      } catch (err) {
        console.error("Failed to fetch featured properties:", err);
        setError(err.response?.data?.message || "Could not load featured properties.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Fetch saved favourites (same as list page)
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await apiRequest.get("/saved-posts");
        const savedIds = response.data.map(item => item.postId || item.id);
        setFavourites(savedIds);
      } catch (err) {
        console.error("Failed to fetch favourites:", err);
        setFavourites([]);
      }
    };
    fetchFavourites();
  }, []);

  // Toggle favourite (identical to list page)
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

  // Loading skeletons
  if (loading) {
    return (
      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">Newest For You</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">Featured Properties</h2>
              <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-lg">Fresh listings added recently across Pakistan.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-20 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-8">
            <p className="text-gray-500 font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-5 w-[100%] py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No properties
  if (!properties.length) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-20 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with new tagline */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#f36c3a] mb-2">
              Newest For You
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Featured Properties
            </h2>
            <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-lg">
              Fresh listings added recently across Pakistan.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(currentUser && favourites.length > 0) && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaHeart className="text-red-500" />
                {favourites.length} Saved
              </div>
            )}
            <Link
              to="/list"
              className="inline-flex items-center gap-2 text-[#f36c3a] font-bold text-sm sm:text-base hover:gap-3 transition-all"
            >
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>

        {/* Cards Grid - using the SAME PropertyCard component as list page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              p={property}
              isFaved={(currentUser && favourites.includes(property.id)) || false}
              onToggleFav={toggleFavourite}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/list"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-600 active:scale-95 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-gray-600 text-sm sm:text-base"
          >
            Browse All Properties <FaArrowRight className="text-xs" />
          </Link>
          <p className="text-slate-400 text-xs mt-3">
            Fresh listings added daily.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;