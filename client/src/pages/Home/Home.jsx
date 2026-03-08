import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaHome,
  FaBuilding,
  FaUsers,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import TestimonialCarousel from "../../components/common/TestimonialCarousel";
import Services from "../../components/common/Services";
import CTA from "../../components/common/CTA";

const Home = () => {
  const navigate = useNavigate();

  // State for search functionality
  const [activeTab, setActiveTab] = useState("buy");
  const [errors, setErrors] = useState({});
  const [searchData, setSearchData] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Validation Logic
    let newErrors = {};
    if (!searchData.city.trim()) newErrors.city = "City required";
    if (!searchData.minPrice) newErrors.minPrice = "Min Price required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Redirect to List Page with Query Params
    const queryParams = new URLSearchParams({
      type: activeTab,
      city: searchData.city,
      min: searchData.minPrice,
      max: searchData.maxPrice,
    }).toString();

    navigate(`/search-results?${queryParams}`);
  };

  return (
    <div className="font-sans text-slate-900 bg-white">
      {/* 1. Hero Section */}
      <section
        className="relative h-[85vh] flex items-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              Find Your <span className="text-blue-400">Perfect</span> Space.
            </h1>
            <p className="text-lg md:text-xl font-light mb-10 opacity-90">
              Verified properties and expert guidance at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Search & Stats Section */}
      <section className="relative z-30 -mt-20 px-6 max-w-6xl mx-auto">
        {/* Tab Selection: White Background for Active */}
        <div className="flex">
          <button
            onClick={() => setActiveTab("buy")}
            className={`px-12 py-4 font-bold rounded-t-xl transition-all border-t border-l border-r border-slate-200 ${
              activeTab === "buy"
                ? "bg-white text-slate-900"
                : "bg-slate-300 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab("rent")}
            className={`px-12 py-4 font-bold rounded-t-xl border-t border-r border-slate-200 transition-all ${
              activeTab === "rent"
                ? "bg-white text-slate-900"
                : "bg-slate-300 text-slate-500 hover:bg-slate-200"
            }`}
          >
            Rent
          </button>
        </div>

        {/* Search Input Container */}
        <div className="bg-white shadow-2xl border-2 border-slate-200 flex flex-col md:flex-row items-stretch rounded-b-xl md:rounded-tr-xl overflow-hidden">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 w-full">
            <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-slate-200">
              <input
                type="text"
                name="city"
                value={searchData.city}
                onChange={handleInputChange}
                placeholder="City"
                className={`w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400 ${errors.city ? "placeholder-red-400" : ""}`}
              />
              {errors.city && (
                <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                  {errors.city}
                </p>
              )}
            </div>
            <div className="px-6 py-5 border-b md:border-b-0 md:border-r border-slate-200">
              <input
                type="number"
                name="minPrice"
                value={searchData.minPrice}
                onChange={handleInputChange}
                placeholder="Min Price"
                className="w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400"
              />
              {errors.minPrice && (
                <p className="text-[10px] text-red-500 font-bold uppercase mt-1">
                  {errors.minPrice}
                </p>
              )}
            </div>
            <div className="px-6 py-5">
              <input
                type="number"
                name="maxPrice"
                value={searchData.maxPrice}
                onChange={handleInputChange}
                placeholder="Max Price"
                className="w-full bg-transparent focus:outline-none text-slate-700 font-medium placeholder-slate-400"
              />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="w-full md:w-32 bg-[#fbc02d] hover:bg-[#f9a825] text-white py-6 md:py-0 flex items-center justify-center transition-all active:scale-95"
          >
            <FaSearch className="text-2xl" />
          </button>
        </div>

        {/* Statistics Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 px-4 md:px-0">
          {[
            { label: "Years of Experience", value: "10+" },
            { label: "Awards Gained", value: "30+" },
            { label: "Property Ready", value: "100+" },
          ].map((stat, i) => (
            <div key={i}>
              <h3 className="text-5xl font-extrabold text-slate-900">
                {stat.value}
              </h3>
              <p className="text-slate-500 font-medium text-lg mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Real Estate Services */}
      <section className="py-24 px-6 lg:px-32 bg-[#fef7f6] mt-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-start">
          {/* Content Left */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-12">
              Discover the range of real estate{" "}
              <span className="text-[#f36c3a]">services</span> we offer
            </h2>

            <div className="space-y-10">
              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#f36c3a]">01</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Buy a home
                  </h4>
                  <p className="text-slate-600 leading-relaxed max-w-md">
                    Find your ideal home effortlessly with our expert guidance &
                    extensive property listings, ensuring a smooth and
                    satisfying home-buying experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#f36c3a]">02</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Rent a home
                  </h4>
                  <p className="text-slate-600 leading-relaxed max-w-md">
                    Find your perfect rental home with ease. Our service offers
                    personalized options and expert support to help you secure a
                    comfortable and ideal living space.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <span className="text-xl font-bold text-[#f36c3a]">03</span>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">
                    Property management
                  </h4>
                  <p className="text-slate-600 leading-relaxed max-w-md">
                    Expert property management to handle maintenance, tenant
                    relations, and financials, ensuring your property runs
                    smoothly and remains profitable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Right (Using Real Estate Themed Image) */}
          <div className="lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
              alt="Modern Real Estate"
              className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
            />
          </div>
        </div>
      </section>

      <TestimonialCarousel />
      <Services />
      <CTA />

      {/* Featured Properties Section */}
      <section className="py-24 px-6 lg:px-32 max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Our Curated Selection
            </h2>
            <p className="text-slate-500 mt-4 text-lg">
              Hand-picked properties featuring modern amenities and prime
              locations.
            </p>
          </div>
          <Link
            to="/list"
            className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all"
          >
            View All Properties <FaArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
              price: "$540,000",
              title: "Modern Skyline Villa",
            },
            {
              img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
              price: "$2,500/mo",
              title: "Luxury Penthouse",
            },
            {
              img: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
              price: "$120,000",
              title: "Urban Living Apartment",
            },
          ].map((item, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[2rem] mb-6 shadow-lg">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-sm font-bold shadow-sm">
                  {item.price}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-slate-500 font-medium">
                4 Beds • 3 Baths • 2,400 sqft • Swat, KPK
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
