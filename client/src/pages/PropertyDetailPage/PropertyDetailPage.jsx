// src/pages/PropertyDetailPage.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { HiLocationMarker, HiShare, HiX, HiOutlineHome } from "react-icons/hi";
import {
  FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart,
  FaArrowLeft, FaPaperPlane, FaChevronLeft, FaChevronRight,
  FaCheck, FaPhoneAlt, FaWhatsapp, FaUserCircle,
  FaSchool, FaBus, FaUtensils, FaBolt, FaPaw,
  FaWifi, FaCar, FaSwimmingPool, FaDumbbell, FaShieldAlt,
  FaCouch, FaSnowflake, FaFire, FaTv, FaWater,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { MdLocationCity, MdMeetingRoom, MdOutlineOtherHouses } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { GiHomeGarage } from "react-icons/gi";

import apiRequest from "../../lib/apiRequest";

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmtTime = (d) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDateSep = (d) => {
  const diff = (Date.now() - d) / 1000;
  if (diff < 86400) return "Today";
  if (diff < 172800) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const formatPKR = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);

const AMENITY_ICONS = {
  "Free Wi-Fi": <FaWifi />,
  "Air Conditioning": <FaSnowflake />,
  "Swimming Pool": <FaSwimmingPool />,
  "Gym Access": <FaDumbbell />,
  "Parking Space": <FaCar />,
  "24/7 Security": <FaShieldAlt />,
  Furnished: <FaCouch />,
  Heating: <FaFire />,
  "Cable TV": <FaTv />,
  "Water Supply": <FaWater />,
};

const getPolicyLabel = (val, type) => {
  if (type === "utilities") {
    const map = {
      owner: "Owner Pays",
      tenant: "Tenant Pays",
      shared: "Shared",
    };
    return map[val] || val;
  }
  if (type === "pet") {
    const map = {
      allowed: "Pets Allowed",
      "not-allowed": "No Pets",
      "cats-only": "Cats Only",
      negotiable: "Negotiable",
    };
    return map[val] || val;
  }
  return val;
};

// ─── Carousel Modal ─────────────────────────────────────────────────────────

const CarouselModal = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const len = images.length;
  const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.95)", animation: "fadeIn .2s ease" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cSlide { from{opacity:.3;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .c-img { animation: cSlide .3s ease both }
        .noscroll::-webkit-scrollbar{display:none}
        .noscroll{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-3 rounded-full text-white hover:bg-white/20 transition"
        style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)" }}
      >
        <HiX size={22} />
      </button>

      <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/50 text-[11px] font-bold uppercase tracking-widest">
        {current + 1} / {len}
      </p>

      <div
        className="relative w-full overflow-hidden"
        style={{ maxWidth: 980, borderRadius: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Photo ${current + 1}`}
          className="c-img w-full object-cover"
          style={{ height: "min(70vh,600px)", borderRadius: 16 }}
        />
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition"
          style={{
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition"
          style={{
            background: "rgba(255,255,255,.12)",
            border: "1px solid rgba(255,255,255,.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      <div
        className="flex gap-2.5 mt-5 overflow-x-auto noscroll px-4"
        style={{ maxWidth: 980 }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            onClick={() => setCurrent(i)}
            alt=""
            className="flex-shrink-0 object-cover cursor-pointer transition-all duration-200"
            style={{
              width: 72,
              height: 52,
              borderRadius: 8,
              border: i === current ? "2.5px solid #f36c3a" : "2.5px solid transparent",
              opacity: i === current ? 1 : 0.45,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Spec Card ───────────────────────────────────────────────────────────────

const SpecCard = ({ icon, value, label }) => (
  <div className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm min-w-[90px]">
    <div className="text-[#f36c3a] text-xl">{icon}</div>
    <p className="text-base font-black text-slate-900 leading-none">{value}</p>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</p>
  </div>
);

// ─── Detail Row ──────────────────────────────────────────────────────────────

const DetailRow = ({ icon, label, value }) => {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 last:border-0">
      <span className="text-[#f36c3a] text-base shrink-0">{icon}</span>
      <span className="text-sm font-semibold text-slate-500 shrink-0 w-36">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
};

// ─── Chat Drawer ─────────────────────────────────────────────────────────────

const ChatDrawer = ({ isOpen, onClose, property }) => {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (property && messages.length === 0) {
      setMessages([
        {
          id: 1,
          from: "agent",
          text: `Hi! 👋 I'm the agent for "${property.title}". Feel free to ask any questions about this property.`,
          ts: new Date(Date.now() - 1000 * 60 * 18),
        },
      ]);
    }
  }, [property]);

  const simulateReply = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "agent",
          text: "Thank you for your message! I'll review your query and get back to you shortly.",
          ts: new Date(),
        },
      ]);
    }, 2200);
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text, ts: new Date() }]);
    setDraft("");
    simulateReply();
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 380); }, [isOpen]);

  const grouped = messages.reduce((acc, m) => {
    const key = fmtDateSep(m.ts);
    if (!acc[key]) acc[key] = [];
    acc[key].push(m);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <style>{`
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
        .drawer-panel { animation: slideInRight .32s cubic-bezier(.22,1,.36,1) both }
        .msg-in { animation: msgIn .22s ease both }
        .typing-dot { animation: blink 1.3s ease-in-out infinite }
        .online-pulse { animation: blink 2s ease-in-out infinite }
        .chat-scroll::-webkit-scrollbar { display:none }
        .chat-scroll { -ms-overflow-style:none; scrollbar-width:none }
      `}</style>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />
      <div className="drawer-panel relative w-full sm:max-w-md bg-[#f0f2f5] h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#f36c3a] p-6 text-white flex justify-between items-center rounded-bl-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl border border-white/30">
                👩‍💼
              </div>
              <span
                className="online-pulse absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400"
                style={{ border: "2.5px solid #f36c3a" }}
              />
            </div>
            <div>
              <p className="font-black text-lg leading-tight">Property Agent</p>
              <p className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full online-pulse" />
                Active now
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition">
            <HiX size={22} />
          </button>
        </div>

        {/* Property snippet */}
        <div className="bg-[#f36c3a] px-5 pb-4">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3">
            <img
              src={property?.images?.[0]}
              alt=""
              className="w-11 h-9 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="text-white text-xs font-black leading-tight line-clamp-1">{property?.title}</p>
              <p className="text-white/70 text-[10px] font-bold mt-0.5">
                {formatPKR(property?.price)}
                {property?.listingType === "rent" ? "/mo" : ""} · {property?.city}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 chat-scroll overflow-y-auto px-4 py-4">
          {Object.entries(grouped).map(([date, msgs]) => (
            <React.Fragment key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-300/70" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{date}</span>
                <div className="flex-1 h-px bg-slate-300/70" />
              </div>
              {msgs.map((m, idx) => {
                const isUser = m.from === "user";
                const nextSame = idx < msgs.length - 1 && msgs[idx + 1].from === m.from;
                return (
                  <div key={m.id} className={`msg-in flex ${isUser ? "justify-end" : "justify-start"} ${nextSame ? "mb-0.5" : "mb-3"}`}>
                    <div className={`max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className="px-4 py-2.5 text-sm leading-relaxed font-medium"
                        style={{
                          background: isUser ? "#f36c3a" : "#ffffff",
                          color: isUser ? "#fff" : "#1a1d27",
                          borderRadius: isUser
                            ? `18px 18px ${nextSame ? "5px" : "18px"} 18px`
                            : `18px 18px 18px ${nextSame ? "5px" : "18px"}`,
                          boxShadow: isUser
                            ? "0 2px 10px rgba(243,108,58,0.3)"
                            : "0 1px 3px rgba(0,0,0,0.08)",
                          border: isUser ? "none" : "1px solid #e8eaed",
                        }}
                      >
                        {m.text}
                      </div>
                      {!nextSame && (
                        <div className={`flex items-center gap-1 mt-1 ${isUser ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] text-slate-400 font-semibold">{fmtTime(m.ts)}</span>
                          {isUser && <FaCheck size={9} className="text-green-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          {isTyping && (
            <div className="msg-in flex justify-start mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="px-4 py-3 flex gap-1.5 items-center bg-white"
                  style={{ borderRadius: "18px 18px 18px 5px", border: "1px solid #e8eaed", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="typing-dot w-2 h-2 rounded-full bg-slate-400" style={{ animationDelay: `${i * 0.18}s` }} />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Agent is typing…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-[1.5rem] border border-slate-200 focus-within:border-[#f36c3a] focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 outline-none text-slate-900 font-bold text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="p-3 rounded-2xl transition active:scale-90"
              style={{
                background: draft.trim() ? "#f36c3a" : "#e2e8f0",
                color: draft.trim() ? "#fff" : "#94a3b8",
                cursor: draft.trim() ? "pointer" : "not-allowed",
                boxShadow: draft.trim() ? "0 4px 12px rgba(243,108,58,0.3)" : "none",
              }}
            >
              <FaPaperPlane size={15} />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-300 font-semibold mt-2 tracking-wide">
            Responses typically within a few minutes
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Property Map ─────────────────────────────────────────────────────────────

const PropertyMap = ({ lat, lng, title }) => {
  const position = [parseFloat(lat), parseFloat(lng)];

  return (
    <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={position}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [carousel, setCarousel] = useState(null);

  // ── Fetch property ──────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setError("No property ID provided.");
      setLoading(false);
      return;
    }

    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        let data = response.data;
        if (response.data.post) data = response.data.post;
        else if (response.data.data) data = response.data.data;

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
          images: data.images?.length
            ? data.images
            : data.image
              ? [data.image]
              : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"],
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
        console.error(err);
        setError(
          err.response?.data?.message ||
          "Something went wrong while fetching property details."
        );
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // ── Fetch saved status ──────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const checkSaved = async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${id}`);
        setIsSaved(res.data?.saved ?? false);
      } catch {
        // silently ignore
      }
    };
    checkSaved();
  }, [id]);

  const toggleSaved = async () => {
    const prev = isSaved;
    setIsSaved(!prev);
    try {
      if (prev) await apiRequest.delete(`/saved-posts/${id}`);
      else await apiRequest.post(`/saved-posts/${id}`);
    } catch {
      setIsSaved(prev);
    }
  };

  // ── Loading state ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#f36c3a] rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 font-semibold text-sm">Loading property details…</p>
        </div>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────
  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm space-y-5 p-8 bg-white rounded-3xl shadow-lg border border-slate-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <HiOutlineHome className="text-red-400 text-3xl" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Unable to Load Property</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              We couldn't retrieve this listing. Please go back and try again, or refresh the page.
            </p>
            {error && (
              <p className="mt-2 text-xs text-red-400 font-medium bg-red-50 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f36c3a] text-white rounded-2xl font-bold text-sm hover:bg-orange-600 transition-all active:scale-95 shadow-md shadow-orange-200"
          >
            <FaArrowLeft size={12} /> Go Back to Listings
          </button>
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

  const hasMap = p.latitude && p.longitude &&
    !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude));

  return (
    <div className="min-h-screen bg-slate-50 pb-28 font-sans">

      {/* ── Navigation Bar ─────────────────────────────────── */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center mt-18">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-[#f36c3a] transition text-sm"
          >
            <FaArrowLeft size={12} />
            Back to Listings
          </button>
          <div className="flex gap-2">
            {/* <button className="p-2.5 hover:bg-slate-100 rounded-full transition text-slate-500">
              <HiShare size={19} />
            </button> */}
            <button onClick={toggleSaved} className="p-2.5 hover:bg-slate-100 rounded-full transition">
              {isSaved ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-slate-500 text-xl" />
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ── Image Gallery ──────────────────────────────────── */}
        <div className="rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl mb-6">
          {/* Mobile: single image */}
          <div
            className="md:hidden h-56 sm:h-72 cursor-zoom-in overflow-hidden group"
            onClick={() => setCarousel(0)}
          >
            <img
              src={p.images[0]}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              alt="Main"
            />
          </div>

          {/* Desktop: grid layout */}
          <div className="hidden md:grid grid-cols-4 gap-2 h-[480px]">
            {/* Main large image */}
            <div
              className="col-span-2 overflow-hidden cursor-zoom-in group"
              onClick={() => setCarousel(0)}
            >
              <img
                src={p.images[0]}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                alt="Main"
              />
            </div>

            {/* Secondary images */}
            <div className="grid grid-rows-2 gap-2 col-span-1">
              {[1, 2].map((i) =>
                p.images[i] ? (
                  <div
                    key={i}
                    className="overflow-hidden cursor-zoom-in group"
                    onClick={() => setCarousel(i)}
                  >
                    <img
                      src={p.images[i]}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      alt={`View ${i}`}
                    />
                  </div>
                ) : (
                  <div key={i} className="bg-slate-200" />
                )
              )}
            </div>

            {/* 4th image with "more" overlay */}
            <div
              className="col-span-1 relative cursor-pointer overflow-hidden group"
              onClick={() => setCarousel(3)}
            >
              {p.images[3] ? (
                <>
                  <img
                    src={p.images[3]}
                    className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition duration-500"
                    alt="More"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-2xl font-black">{p.images.length}+</span>
                    <span className="text-sm font-semibold underline">Photos</span>
                  </div>
                </>
              ) : (
                <div className="bg-slate-300 h-full w-full" />
              )}
            </div>
          </div>
        </div>

        {/* Mobile "View all photos" button */}
        <button
          onClick={() => setCarousel(0)}
          className="md:hidden w-full mb-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:border-[#f36c3a] hover:text-[#f36c3a] transition-all"
        >
          View all {p.images.length} photos
        </button>

        {/* ── Two Column Layout ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* ── LEFT COLUMN ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Property type + listing type + status badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-100 text-[#f36c3a] px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest">
                {p.property}
              </span>
              <span className="text-slate-300 font-light">/</span>
              <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${p.listingType === "rent" ? "bg-violet-100 text-violet-700" : "bg-blue-100 text-blue-700"}`}>
                For {p.listingType === "rent" ? "Rent" : "Sale"}
              </span>
              <span className="text-slate-300 font-light">/</span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${statusColor.bg} ${statusColor.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusColor.dot}`} />
                {p.status}
              </span>
            </div>

            {/* Title + City + Address */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {p.title}
              </h1>
              {p.city && (
                <div className="flex items-center gap-2 text-slate-500">
                  <MdLocationCity className="text-[#f36c3a] text-lg shrink-0" />
                  <span className="text-base font-semibold">{p.city}</span>
                </div>
              )}
              {p.address && (
                <div className="flex items-center gap-2 text-slate-400">
                  <HiLocationMarker className="text-[#f36c3a] text-lg shrink-0" />
                  <span className="text-sm font-medium">{p.address}</span>
                </div>
              )}
            </div>

            {/* Price + Contact block */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {formatPKR(p.price)}
                    </span>
                    {p.listingType === "rent" && (
                      <span className="text-slate-400 font-bold text-base"> / month</span>
                    )}
                  </div>
                  {p.size && (
                    <p className="text-xs text-slate-400 font-semibold mt-1">
                      Total Area: {p.size.toLocaleString()} sqft
                    </p>
                  )}
                </div>

                {/* Listed by username */}
                {p.user && (
                  <div className="flex items-center gap-2 text-right">
                    {p.user.avatar ? (
                      <img
                        src={p.user.avatar}
                        alt={p.user.username}
                        className="w-9 h-9 rounded-full object-cover border-2 border-[#f36c3a]"
                      />
                    ) : (
                      <FaUserCircle className="text-slate-300 text-4xl" />
                    )}
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Listed by</p>
                      <p className="text-sm font-black text-slate-700">{p.user.username || "Owner"}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="tel:+923449885555"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#f36c3a] text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <FaPhoneAlt size={12} /> Call Now
                </Link>
                <Link
                  to="https://wa.me/923449885555"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <FaWhatsapp size={15} /> WhatsApp
                </Link>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex-1 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  Chat Here
                </button>
              </div>
            </div>

            {/* Specs row */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {p.bedroom !== null && (
                <SpecCard icon={<FaBed />} value={p.bedroom} label="Bedrooms" />
              )}
              {p.bathroom !== null && (
                <SpecCard icon={<FaBath />} value={p.bathroom} label="Bathrooms" />
              )}
              {p.size !== null && (
                <SpecCard
                  icon={<TbRulerMeasure />}
                  value={`${p.size.toLocaleString()} sqft`}
                  label="Total Area"
                />
              )}
            </div>

            {/* Description */}
            {p.description && (
              <section className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Description</h3>
                <p className="text-slate-600 leading-relaxed text-base">{p.description}</p>
              </section>
            )}



            {/* Nearby Facilities */}
            {(p.school > 0 || p.bus > 0 || p.restaurant > 0) && (
              <section className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Nearby Facilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {p.school > 0 && (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                      <FaSchool className="text-blue-500 text-xl shrink-0" />
                      <div>
                        <p className="font-black text-slate-800">{p.school}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          School{p.school !== 1 ? "s" : ""} nearby
                        </p>
                      </div>
                    </div>
                  )}
                  {p.bus > 0 && (
                    <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 p-4 rounded-2xl">
                      <FaBus className="text-violet-500 text-xl shrink-0" />
                      <div>
                        <p className="font-black text-slate-800">{p.bus}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Bus Stop{p.bus !== 1 ? "s" : ""} nearby
                        </p>
                      </div>
                    </div>
                  )}
                  {p.restaurant > 0 && (
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                      <FaUtensils className="text-amber-500 text-xl shrink-0" />
                      <div>
                        <p className="font-black text-slate-800">{p.restaurant}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Restaurant{p.restaurant !== 1 ? "s" : ""} nearby
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Amenities */}
            {p.amenities && p.amenities.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Premium Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {p.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm"
                    >
                      <div className="p-2 bg-green-50 rounded-xl text-green-500 text-base shrink-0">
                        {AMENITY_ICONS[item] || <FaCheck />}
                      </div>
                      <span className="text-slate-700 font-bold text-xs sm:text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Map */}
            {hasMap && (
              <section className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#f36c3a]" />
                  Location on Map
                </h3>
                <PropertyMap lat={p.latitude} lng={p.longitude} title={p.title} />
                {p.address && (
                  <p className="text-sm text-slate-400 font-medium flex items-center gap-2">
                    <HiLocationMarker className="text-[#f36c3a]" />
                    {p.address}{p.city ? `, ${p.city}` : ""}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* ── RIGHT COLUMN (sticky sidebar on desktop) ─────── */}
          <aside className="lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Property Details */}
              {(p.utilities || p.pet || p.size) && (
                <section className="space-y-3 mt-5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">Property Details</h3>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-2">
                    <DetailRow
                      icon={<FaBolt />}
                      label="Utilities"
                      value={p.utilities ? getPolicyLabel(p.utilities, "utilities") : null}
                    />
                    <DetailRow
                      icon={<FaPaw />}
                      label="Pet Policy"
                      value={p.pet ? getPolicyLabel(p.pet, "pet") : null}
                    />
                    <DetailRow
                      icon={<TbRulerMeasure />}
                      label="Property Size"
                      value={p.size ? `${p.size.toLocaleString()} sqft` : null}
                    />
                    <DetailRow
                      icon={<MdOutlineOtherHouses />}
                      label="Property Type"
                      value={p.property}
                    />
                    <DetailRow
                      icon={<GiHomeGarage />}
                      label="Listing Type"
                      value={p.listingType === "rent" ? "For Rent" : "For Sale"}
                    />
                    {p.createdAt && (
                      <DetailRow
                        icon={<FaCheck />}
                        label="Listed On"
                        value={p.createdAt.toLocaleDateString("en-PK", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      />
                    )}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* ── Chat Drawer ───────────────────────────────────── */}
      <ChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} property={p} />

      {/* ── Carousel Modal ────────────────────────────────── */}
      {carousel !== null && (
        <CarouselModal
          images={p.images}
          startIndex={carousel}
          onClose={() => setCarousel(null)}
        />
      )}

      <style>{`
        .noscroll::-webkit-scrollbar { display: none }
        .noscroll { -ms-overflow-style: none; scrollbar-width: none }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;