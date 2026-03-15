// src/pages/List/List.jsx
import { useState, useMemo } from "react";
import SearchInput from "../../components/common/SearchInput";
import PropertyCard from "../../components/list/PropertyCard";
import EmptyState from "../../components/list/EmptyState";
import Pagination from "../../components/list/Pagination";
import ListHeader from "../../components/list/ListHeader";
import { FaHeart } from "react-icons/fa";

const PROPERTIES = [
  { id: 1,  title: "Modern Downtown Loft",      location: "New York, NY",    price: 4200,    type: "Apartment", listingType: "rent", beds: 2, baths: 1, area: "850 sqft",   image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { id: 2,  title: "Suburban Family Home",       location: "Austin, TX",      price: 620000,  type: "House",     listingType: "sale", beds: 4, baths: 3, area: "2,400 sqft", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" },
  { id: 3,  title: "Beachfront Villa",           location: "Miami, FL",       price: 1250000, type: "Villa",     listingType: "sale", beds: 5, baths: 4, area: "4,200 sqft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80" },
  { id: 4,  title: "Cozy Studio Apartment",      location: "Chicago, IL",     price: 1800,    type: "Apartment", listingType: "rent", beds: 1, baths: 1, area: "480 sqft",   image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80" },
  { id: 5,  title: "Luxury Penthouse Suite",     location: "Los Angeles, CA", price: 8500,    type: "Apartment", listingType: "rent", beds: 3, baths: 2, area: "2,100 sqft", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80" },
  { id: 6,  title: "Mountain Retreat Cabin",     location: "Denver, CO",      price: 475000,  type: "House",     listingType: "sale", beds: 3, baths: 2, area: "1,600 sqft", image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80" },
  { id: 7,  title: "City View Condo",            location: "Seattle, WA",     price: 3100,    type: "Apartment", listingType: "rent", beds: 2, baths: 2, area: "950 sqft",   image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80" },
  { id: 8,  title: "Colonial Manor Estate",      location: "Boston, MA",      price: 980000,  type: "House",     listingType: "sale", beds: 6, baths: 5, area: "5,800 sqft", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80" },
  { id: 9,  title: "Lakeside Townhouse",         location: "Orlando, FL",     price: 2600,    type: "House",     listingType: "rent", beds: 3, baths: 2, area: "1,400 sqft", image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600&q=80" },
  { id: 10, title: "Desert Modern Villa",        location: "Phoenix, AZ",     price: 875000,  type: "Villa",     listingType: "sale", beds: 4, baths: 3, area: "3,100 sqft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { id: 11, title: "Uptown Studio Flat",         location: "Nashville, TN",   price: 1450,    type: "Apartment", listingType: "rent", beds: 1, baths: 1, area: "420 sqft",   image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&q=80" },
  { id: 12, title: "Riverside Executive Home",   location: "Portland, OR",    price: 710000,  type: "House",     listingType: "sale", beds: 5, baths: 4, area: "3,400 sqft", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80" },
];

const PER_PAGE = 6;

function List() {
  const [sort,       setSort]       = useState("newest");
  const [page,       setPage]       = useState(1);
  const [favourites, setFavourites] = useState([]);
  const [filters,    setFilters]    = useState({
    query: "", category: "All Types", listingType: "All",
  });

  const toggleFavourite = (id) =>
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Search & Filter Header ── */}
      <ListHeader
        filtered={filtered}
        favourites={favourites}
        filters={filters}
        sort={sort}
        page={page}
        totalPages={totalPages}
        PER_PAGE={PER_PAGE}
        onSearch={handleSearch}
        onSortChange={(val) => { setSort(val); setPage(1); }}
      />

      {/* ── Cards Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
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