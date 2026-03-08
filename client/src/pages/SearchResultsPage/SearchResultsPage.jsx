import { useState, useMemo } from "react";
import SearchInput from "../../components/common/SearchInput";

const PROPERTIES = [
  {
    id: 1,
    title: "Modern Downtown Loft",
    location: "New York, NY",
    price: 4200,
    beds: 2,
    baths: 2,
    sqft: 1100,
    type: "Apartment",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  },
  {
    id: 2,
    title: "Suburban Family Home",
    location: "Austin, TX",
    price: 620000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    type: "House",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
  },
  {
    id: 3,
    title: "Beachfront Villa",
    location: "Miami, FL",
    price: 1250000,
    beds: 5,
    baths: 4,
    sqft: 3800,
    type: "Villa",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  },
  {
    id: 4,
    title: "Cozy Studio Apartment",
    location: "Chicago, IL",
    price: 1800,
    beds: 0,
    baths: 1,
    sqft: 480,
    type: "Apartment",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  },
  {
    id: 5,
    title: "Luxury Penthouse Suite",
    location: "Los Angeles, CA",
    price: 8500,
    beds: 3,
    baths: 3,
    sqft: 2200,
    type: "Apartment",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  },
  {
    id: 6,
    title: "Mountain Retreat Cabin",
    location: "Denver, CO",
    price: 475000,
    beds: 3,
    baths: 2,
    sqft: 1600,
    type: "House",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&q=80",
  },
  {
    id: 7,
    title: "Historic Brownstone",
    location: "Boston, MA",
    price: 890000,
    beds: 3,
    baths: 2,
    sqft: 1900,
    type: "House",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  },
  {
    id: 8,
    title: "Minimalist City Flat",
    location: "Seattle, WA",
    price: 2900,
    beds: 1,
    baths: 1,
    sqft: 720,
    type: "Apartment",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  },
  {
    id: 9,
    title: "Gated Community Townhouse",
    location: "Phoenix, AZ",
    price: 385000,
    beds: 3,
    baths: 2,
    sqft: 1750,
    type: "Townhouse",
    status: "For Sale",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: 10,
    title: "Waterfront Condo",
    location: "San Diego, CA",
    price: 3600,
    beds: 2,
    baths: 2,
    sqft: 980,
    type: "Apartment",
    status: "For Rent",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Largest First", value: "sqft_desc" },
];

const PER_PAGE = 6;
const orange = "#f36c3a";

function SearchResultsPage() {
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...PROPERTIES];

    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (sort === "sqft_desc") list.sort((a, b) => b.sqft - a.sqft);

    return list;
  }, [searchQuery, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-[#fef7f6] pt-5">

      {/* TOP BAR */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col gap-3">

          <SearchInput onSearch={handleSearch} />

          <div className="flex items-center justify-between flex-wrap gap-3">

            <p className="text-sm text-slate-500">
              <strong className="text-slate-800">{filtered.length}</strong>{" "}
              properties found
            </p>

            <div className="flex items-center gap-3">

              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

            </div>
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {paginated.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-lg transition">

            <img
              src={p.image}
              alt={p.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />

            <div className="p-4">

              <h3 className="font-semibold text-lg">{p.title}</h3>

              <p className="text-gray-500 text-sm">{p.location}</p>

              <p className="text-orange-500 font-bold mt-2">
                ${p.price.toLocaleString()}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 pb-10">

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`px-4 py-2 rounded ${
              page === n ? "bg-orange-500 text-white" : "bg-white border"
            }`}
          >
            {n}
          </button>
        ))}

      </div>

    </div>
  );
}

export default SearchResultsPage;