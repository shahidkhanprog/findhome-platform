// src/pages/PropertyDetailPage/PropertyDetailPage.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaHeart, FaRegHeart, FaArrowLeft, FaBed, FaBath, FaMapMarkerAlt,
  FaBolt, FaPaw, FaCheck, FaUserCircle,
} from "react-icons/fa";
import { HiLocationMarker, HiOutlineHome } from "react-icons/hi";
import { MdLocationCity, MdOutlineOtherHouses } from "react-icons/md";
import { GiHomeGarage } from "react-icons/gi";
import { TbRulerMeasure } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

import ImageCarouselModal from "../../components/property/ImageCarouselModal";
import ChatDrawer from "../../components/property/ChatDrawer";
import SpecCard from "../../components/property/SpecCard";
import DetailRow from "../../components/property/DetailRow";
import PropertyMap from "../../components/property/PropertyMap";
import PropertyGallery from "../../components/property/PropertyGallery";
import NearbyFacilities from "../../components/property/NearbyFacilities";
import AmenitiesList from "../../components/property/AmenitiesList";
import ContactButtons from "../../components/property/ContactButtons";
import LoginPromptModal from "../../components/property/LoginPromptModal"; // new

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const getPolicyLabel = (val, type) => {
  if (type === "utilities") {
    const map = { owner: "Owner Pays", tenant: "Tenant Pays", shared: "Shared" };
    return map[val] || val;
  }
  if (type === "pet") {
    const map = { allowed: "Pets Allowed", "not-allowed": "No Pets", "cats-only": "Cats Only", negotiable: "Negotiable" };
    return map[val] || val;
  }
  return val;
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false); // new

  // Fetch property data
  useEffect(() => {
    if (!id) {
      setError("No property ID provided.");
      setLoading(false);
      return;
    }
    const fetchProperty = async () => {
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        let data = res.data;
        if (res.data.post) data = res.data.post;
        else if (res.data.data) data = res.data.data;
        const normalized = {
          id: data.id,
          title: data.title || "Untitled Property",
          address: data.address || null,
          city: data.city || null,
          price: data.price || 0,
          listingType: data.listingType || "rent",
          property: data.property || "Property",
          status: data.status || "available",
          bedroom: data.bedroom ?? null,
          bathroom: data.bathroom ?? null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          images: data.images?.length ? data.images : (data.image ? [data.image] : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"]),
          description: data.postDetails?.desc || data.description || null,
          utilities: data.postDetails?.utilities || null,
          pet: data.postDetails?.pet || null,
          size: data.postDetails?.size ?? null,
          school: data.postDetails?.school ?? null,
          bus: data.postDetails?.bus ?? null,
          restaurant: data.postDetails?.restaurant ?? null,
          amenities: data.amenities?.length ? data.amenities : null,
          user: data.user || null,
          createdAt: data.createdAt ? new Date(data.createdAt) : null,
        };
        setProperty(normalized);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load property.");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  // Saved status (only for logged in users)
  useEffect(() => {
    if (!id || !currentUser) return;
    const checkSaved = async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${id}`);
        setIsSaved(res.data?.saved ?? false);
      } catch { /* ignore */ }
    };
    checkSaved();
  }, [id, currentUser]);

  const toggleSaved = () => {
    if (!currentUser) {
      setShowLoginModal(true);
      return;
    }
    const prev = isSaved;
    setIsSaved(!prev);
    (async () => {
      try {
        if (prev) await apiRequest.delete(`/saved-posts/${id}`);
        else await apiRequest.post(`/saved-posts/${id}`);
      } catch {
        setIsSaved(prev);
      }
    })();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-[#f36c3a]" /></div>;
  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center"><HiOutlineHome className="text-red-400 text-3xl" /></div>
          <h2 className="text-xl font-black text-slate-800 mt-4 mb-2">Unable to Load Property</h2>
          <p className="text-slate-500 text-sm">{error || "Property not found."}</p>
          <button onClick={() => navigate(-1)} className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#f36c3a] text-white rounded-2xl font-bold text-sm">Go Back</button>
        </div>
      </div>
    );
  }

  const p = property;
  const statusColor = {
    available: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
    sold: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
    rented: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
    pending: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  }[p.status] || { bg: "bg-slate-100", text: "text-slate-700", dot: "bg-slate-400" };

  const hasMap = p.latitude && p.longitude && !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude));

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center pt-[30px]">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 font-bold hover:text-[#f36c3a]"><FaArrowLeft size={12} /> Back</button>
          <button onClick={toggleSaved} className="p-2.5 hover:bg-slate-100 rounded-full transition">
            {currentUser && isSaved ? (
              <FaHeart className="text-red-500 text-xl" />
            ) : (
              <FaRegHeart className="text-slate-500 text-xl" />
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <PropertyGallery images={p.images} onImageClick={setCarouselIndex} />
        <button onClick={() => setCarouselIndex(0)} className="md:hidden w-full mb-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:border-[#f36c3a] hover:text-[#f36c3a]">View all {p.images.length} photos</button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-100 text-[#f36c3a] px-3 py-1.5 rounded-xl text-xs font-black uppercase">{p.property}</span>
              <span className="text-slate-300">/</span>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${p.listingType === "rent" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>For {p.listingType === "rent" ? "Rent" : "Sale"}</span>
              <span className="text-slate-300">/</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase ${statusColor.bg} ${statusColor.text}`}><span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />{p.status}</span>
            </div>

            {/* Title + location */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">{p.title}</h1>
              {p.city && <div className="flex items-center gap-2 text-slate-500"><MdLocationCity className="text-[#f36c3a] text-lg" /><span className="text-base font-semibold">{p.city}</span></div>}
              {p.address && <div className="flex items-center gap-2 text-slate-400"><HiLocationMarker className="text-[#f36c3a] text-lg" /><span className="text-sm font-medium">{p.address}</span></div>}
            </div>

            {/* Price + Contact */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Price</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-2xl sm:text-4xl font-black text-slate-900">{formatPKR(p.price)}</span>
                    {p.listingType === "rent" && <span className="text-slate-400 font-bold text-sm">/ month</span>}
                  </div>
                  {p.size && <p className="text-xs text-slate-400 font-semibold mt-1">Total Area: {p.size.toLocaleString()} sqft</p>}
                </div>
                {p.user && (
                  <div className="flex items-center gap-2 shrink-0">
                    {p.user.avatar ? <img src={p.user.avatar} alt={p.user.username} className="w-9 h-9 rounded-full object-cover border-2 border-[#f36c3a]" /> : <FaUserCircle className="text-slate-300 text-4xl" />}
                    <div><p className="text-[10px] text-slate-400 font-bold uppercase">Listed by</p><p className="text-xs sm:text-sm font-black text-slate-700 truncate max-w-[80px] sm:max-w-none">{p.user.username || "Owner"}</p></div>
                  </div>
                )}
              </div>
              <ContactButtons onChatClick={() => setIsChatOpen(true)} />
            </div>

            {/* Specs */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {p.bedroom !== null && <SpecCard icon={<FaBed />} value={p.bedroom} label="Bedrooms" />}
              {p.bathroom !== null && <SpecCard icon={<FaBath />} value={p.bathroom} label="Bathrooms" />}
              {p.size !== null && <SpecCard icon={<TbRulerMeasure />} value={`${p.size.toLocaleString()} sqft`} label="Total Area" />}
            </div>

            {p.description && <section className="space-y-3"><h3 className="text-xl sm:text-2xl font-black text-slate-900">Description</h3><p className="text-slate-600 leading-relaxed">{p.description}</p></section>}
            <NearbyFacilities school={p.school} bus={p.bus} restaurant={p.restaurant} />
            <AmenitiesList amenities={p.amenities} />
            {hasMap && <section className="space-y-4"><h3 className="text-xl sm:text-2xl font-black flex items-center gap-2"><FaMapMarkerAlt className="text-[#f36c3a]" /> Location on Map</h3><PropertyMap lat={p.latitude} lng={p.longitude} title={p.title} /></section>}
          </div>

          {/* Right sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {(p.utilities || p.pet || p.size || p.property || p.listingType || p.createdAt) && (
                <section className="space-y-3 mt-5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Property Details</h3>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-2">
                    <DetailRow icon={<FaBolt />} label="Utilities" value={p.utilities ? getPolicyLabel(p.utilities, "utilities") : null} />
                    <DetailRow icon={<FaPaw />} label="Pet Policy" value={p.pet ? getPolicyLabel(p.pet, "pet") : null} />
                    <DetailRow icon={<TbRulerMeasure />} label="Property Size" value={p.size ? `${p.size.toLocaleString()} sqft` : null} />
                    <DetailRow icon={<MdOutlineOtherHouses />} label="Property Type" value={p.property} />
                    <DetailRow icon={<GiHomeGarage />} label="Listing Type" value={p.listingType === "rent" ? "For Rent" : "For Sale"} />
                    {p.createdAt && <DetailRow icon={<FaCheck />} label="Listed On" value={p.createdAt.toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })} />}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </main>

      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} property={p} />
      {carouselIndex !== null && <ImageCarouselModal images={p.images} startIndex={carouselIndex} onClose={() => setCarouselIndex(null)} />}
      <LoginPromptModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}