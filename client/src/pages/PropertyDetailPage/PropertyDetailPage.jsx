import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import {
  HiLocationMarker, HiStar, HiShare, HiCheckCircle,
  HiX, HiOutlineShieldCheck,
} from "react-icons/hi";

import {
  FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart,
  FaArrowLeft, FaPaperPlane, FaChevronLeft, FaChevronRight,
  FaCheck, FaPhoneAlt, FaWhatsapp,
} from "react-icons/fa";

// ── Helpers ───────────────────────────────────────────────────
const fmtTime = (d) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const fmtDateSep = (d) => {
  const diff = (Date.now() - d) / 1000;
  if (diff < 86400)  return "Today";
  if (diff < 172800) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

// ── Seed chat messages ────────────────────────────────────────
const SEED_MESSAGES = [
  {
    id: 1, from: "agent",
    text: "Hi! 👋 I'm Sarah. I'm available to answer any questions about this property, utilities, or move-in dates.",
    ts: new Date(Date.now() - 1000 * 60 * 18),
  },
  {
    id: 2, from: "user",
    text: "Hello Sarah! Is maintenance included in the monthly price?",
    ts: new Date(Date.now() - 1000 * 60 * 12),
  },
  {
    id: 3, from: "agent",
    text: "Yes! Basic maintenance and security are both included. No extra charges apply.",
    ts: new Date(Date.now() - 1000 * 60 * 10),
  },
];

// ── Fallback property ─────────────────────────────────────────
const FALLBACK = {
  id:          0,
  title:       "Modern Downtown Loft",
  location:    "New York, NY",
  price:       4200,
  listingType: "rent",
  type:        "Apartment",
  beds:        2,
  baths:       2,
  area:        "1,100 sqft",
  rating:      4.9,
  reviews:     124,
  image:       "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
  ],
  amenities: [
    "Free Wi-Fi", "Air Conditioning", "Swimming Pool",
    "Gym Access", "Parking Space", "24/7 Security",
  ],
  description:
    "Experience luxury living in the heart of the city. This modern loft features floor-to-ceiling windows, high-end stainless steel appliances, and a private balcony with stunning skyline views. Perfect for professionals seeking comfort and style.",
};

// ── Carousel Modal ────────────────────────────────────────────
const CarouselModal = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const len = images.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + len) % len), [len]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % len), [len]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next, onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.93)", animation: "fadeIn 0.2s ease" }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn        { from{opacity:0}                       to{opacity:1} }
        @keyframes carouselSlide { from{opacity:.3;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .carousel-img  { animation: carouselSlide .3s ease both }
        .no-scrollbar::-webkit-scrollbar { display:none }
        .no-scrollbar  { -ms-overflow-style:none; scrollbar-width:none }
      `}</style>

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 p-3 rounded-full text-white hover:bg-white/20 transition"
        style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)" }}
      >
        <HiX size={22} />
      </button>

      {/* Counter */}
      <p className="absolute top-6 left-1/2 -translate-x-1/2 text-white/60 text-[11px] font-black uppercase tracking-widest">
        {current + 1} / {len}
      </p>

      {/* Main image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ maxWidth: 960, borderRadius: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={current}
          src={images[current]}
          alt={`Photo ${current + 1}`}
          className="carousel-img w-full object-cover"
          style={{ height: "min(68vh,580px)", borderRadius: 16 }}
        />
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition"
          style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(8px)" }}
        >
          <FaChevronLeft size={14} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full text-white transition"
          style={{ background:"rgba(255,255,255,.12)", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(8px)" }}
        >
          <FaChevronRight size={14} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex gap-2.5 mt-5 overflow-x-auto no-scrollbar px-4"
        style={{ maxWidth: 960 }}
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
              width: 70, height: 50, borderRadius: 8,
              border:  i === current ? "2.5px solid #f36c3a" : "2.5px solid transparent",
              opacity: i === current ? 1 : 0.45,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ── Spec Item ─────────────────────────────────────────────────
const SpecItem = ({ icon, value, label }) => (
  <div className="flex items-center gap-3 sm:gap-4 min-w-[100px] sm:min-w-[120px]">
    <div className="p-3 sm:p-4 bg-white border border-slate-100 shadow-sm rounded-2xl text-[#f36c3a]">
      {icon}
    </div>
    <div>
      <p className="text-lg sm:text-xl font-black text-slate-900 leading-none mb-1">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  </div>
);

// ── Chat Drawer ───────────────────────────────────────────────
const ChatDrawer = ({ isOpen, onClose, property }) => {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [draft,    setDraft]    = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const sendToWS = useCallback(() => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "agent",
          text: "Thanks for reaching out! Let me check that for you and get back to you shortly.",
          ts: new Date(),
        },
      ]);
    }, 2200);
  }, []);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text, ts: new Date() },
    ]);
    setDraft("");
    sendToWS(text);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 380);
  }, [isOpen]);

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
        @keyframes msgIn        { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:.3} }
        .drawer-panel { animation: slideInRight .32s cubic-bezier(.22,1,.36,1) both }
        .msg-in       { animation: msgIn .22s ease both }
        .typing-dot   { animation: blink 1.3s ease-in-out infinite }
        .online-pulse { animation: blink 2s ease-in-out infinite }
        .chat-scroll::-webkit-scrollbar { display:none }
        .chat-scroll  { -ms-overflow-style:none; scrollbar-width:none }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

      {/* Panel */}
      <div className="drawer-panel relative w-full sm:max-w-md bg-[#f0f2f5] h-full shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-[#f36c3a] p-6 sm:p-8 text-white flex justify-between items-center rounded-bl-[2.5rem] sm:rounded-bl-[3rem]">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl shadow-inner border border-white/30">
                👩‍💼
              </div>
              <span
                className="online-pulse absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-400"
                style={{ border: "2.5px solid #f36c3a" }}
              />
            </div>
            <div>
              <p className="font-black text-lg sm:text-xl leading-tight">Sarah Jenkins</p>
              <p className="text-xs font-bold opacity-80 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full online-pulse" />
                Active now · Property Agent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition"
          >
            <HiX size={22} />
          </button>
        </div>

        {/* Property chip */}
        <div className="bg-[#f36c3a] px-5 sm:px-6 pb-4 sm:pb-5">
          <div className="bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center gap-3">
            <img
              src={property?.image || property?.images?.[0]}
              alt=""
              className="w-11 h-9 sm:w-12 rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="text-white text-xs font-black leading-tight line-clamp-1">
                {property?.title}
              </p>
              <p className="text-white/70 text-[10px] font-bold mt-0.5">
                ${property?.price?.toLocaleString()}
                {property?.listingType === "rent" ? "/mo" : ""} · {property?.beds}bd {property?.baths}ba
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 chat-scroll overflow-y-auto px-4 sm:px-5 py-4">
          {Object.entries(grouped).map(([date, msgs]) => (
            <React.Fragment key={date}>
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-300/70" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  {date}
                </span>
                <div className="flex-1 h-px bg-slate-300/70" />
              </div>

              {msgs.map((m, idx) => {
                const isUser   = m.from === "user";
                const nextSame = idx < msgs.length - 1 && msgs[idx + 1].from === m.from;
                return (
                  <div
                    key={m.id}
                    className={`msg-in flex ${isUser ? "justify-end" : "justify-start"} ${nextSame ? "mb-0.5" : "mb-3"}`}
                  >
                    <div className={`max-w-[78%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div
                        className="px-4 py-2.5 text-sm leading-relaxed font-medium"
                        style={{
                          background: isUser ? "#f36c3a" : "#ffffff",
                          color:      isUser ? "#fff"    : "#1a1d27",
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
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {fmtTime(m.ts)}
                          </span>
                          {isUser && <FaCheck size={9} className="text-green-500" />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="msg-in flex justify-start mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="px-4 py-3 flex gap-1.5 items-center bg-white"
                  style={{
                    borderRadius: "18px 18px 18px 5px",
                    border: "1px solid #e8eaed",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="typing-dot w-2 h-2 rounded-full bg-slate-400"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Sarah is typing…
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-[1.5rem] border border-slate-200 focus-within:border-[#f36c3a] focus-within:bg-white transition-all">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Your message..."
              className="flex-1 bg-transparent px-2 sm:px-3 outline-none text-slate-900 font-bold text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="p-3 sm:p-4 rounded-2xl transition active:scale-90"
              style={{
                background: draft.trim() ? "#f36c3a" : "#e2e8f0",
                color:      draft.trim() ? "#fff"    : "#94a3b8",
                cursor:     draft.trim() ? "pointer" : "not-allowed",
                boxShadow:  draft.trim() ? "0 4px 12px rgba(243,108,58,0.3)" : "none",
              }}
            >
              <FaPaperPlane size={16} />
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

// ── Main Property Detail Page ─────────────────────────────────
const PropertyDetailPage = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();

  const base = state?.property || {};
  const p = {
    ...FALLBACK,
    ...base,
    images: base.images?.length
      ? base.images
      : base.image
        ? [base.image, FALLBACK.images[1], FALLBACK.images[2], FALLBACK.images[3], FALLBACK.images[4]]
        : FALLBACK.images,
    amenities:   base.amenities   || FALLBACK.amenities,
    description: base.description || FALLBACK.description,
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSaved,    setIsSaved]    = useState(false);
  const [carousel,   setCarousel]   = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">

      {/* ── Nav Bar ─────────────────────────────────────────── */}
      <nav className="bg-white border-b sticky top-0 z-30 px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-[#f36c3a] transition text-sm sm:text-base"
          >
            <FaArrowLeft size={13} /> Back to Listings
          </button>
          <div className="flex gap-2 sm:gap-3">
            <button className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-full transition text-slate-600">
              <HiShare size={20} />
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 sm:p-2.5 hover:bg-slate-100 rounded-full transition"
            >
              {isSaved
                ? <FaHeart    className="text-red-500 text-xl" />
                : <FaRegHeart className="text-slate-600 text-xl" />
              }
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8">

        {/* ── Image Gallery Grid ───────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 sm:gap-4 rounded-2xl sm:rounded-[2rem] overflow-hidden h-56 sm:h-80 md:h-[500px] mb-4 sm:mb-6 shadow-xl">

          {/* Main large */}
          <div
            className="md:col-span-2 h-full overflow-hidden cursor-zoom-in group"
            onClick={() => setCarousel(0)}
          >
            <img
              src={p.images[0]}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              alt="Main"
            />
          </div>

          {/* Two stacked */}
          <div className="hidden md:grid grid-rows-2 gap-2 sm:gap-4 col-span-1 h-full">
            {[1, 2].map((i) => (
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
            ))}
          </div>

          {/* View more tile */}
          <div
            className="hidden md:block col-span-1 h-full relative group cursor-pointer overflow-hidden"
            onClick={() => setCarousel(3)}
          >
            <img
              src={p.images[3]}
              className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition duration-500"
              alt="More"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-xl sm:text-2xl font-bold">{p.images.length}+</span>
              <span className="text-xs sm:text-sm font-medium underline">Photos</span>
            </div>
          </div>
        </div>

        {/* Mobile: view all photos */}
        <button
          onClick={() => setCarousel(0)}
          className="md:hidden w-full mb-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 bg-white hover:border-[#f36c3a] hover:text-[#f36c3a] transition-all"
        >
          View all {p.images.length} photos
        </button>

        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* ── LEFT COLUMN ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">

            {/* Title block */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-orange-100 text-[#f36c3a] px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest">
                    {p.type}
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${
                    p.listingType === "rent"
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {p.listingType === "rent" ? "For Rent" : "For Sale"}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-3 leading-tight">
                  {p.title}
                </h1>
                <div className="flex items-center text-slate-500 gap-2">
                  <HiLocationMarker className="text-[#f36c3a] text-xl sm:text-2xl shrink-0" />
                  <span className="text-base sm:text-xl font-medium">{p.location}</span>
                </div>
              </div>

              {/* Rating card */}
              <div className="flex items-center gap-4 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm self-start shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-500 font-black text-xl sm:text-2xl">
                    <HiStar />
                    <span>{p.rating ?? FALLBACK.rating}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-tighter">
                    {p.reviews ?? FALLBACK.reviews} Reviews
                  </p>
                </div>
              </div>
            </div>

            {/* ── Mobile price + contact card ── */}
            <div className="lg:hidden bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-black text-slate-900">
                    ${p.price.toLocaleString()}
                  </span>
                  {p.listingType === "rent" && (
                    <span className="text-slate-400 font-bold text-base"> / mo</span>
                  )}
                </div>
                <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-xl text-xs font-black tracking-widest border border-green-100">
                  LIVE NOW
                </span>
              </div>

              {/* Mobile contact buttons — Link for internal, button for actions */}
              <div className="flex gap-3">
                <Link
                  to="tel:+923001234567"
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-[#f36c3a] text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <FaPhoneAlt className="text-xs" /> Call
                </Link>
                <Link
                  to="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <FaWhatsapp className="text-base" /> WhatsApp
                </Link>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex-1 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  Chat
                </button>
              </div>
            </div>

            {/* ── Specs bar ── */}
            <div className="flex gap-4 sm:gap-8 md:gap-10 py-6 sm:py-8 border-y border-slate-200 overflow-x-auto no-scrollbar">
              <SpecItem icon={<FaBed size={20} />}                value={p.beds}    label="Beds"    />
              <SpecItem icon={<FaBath size={18} />}               value={p.baths}   label="Baths"   />
              <SpecItem icon={<FaRulerCombined size={18} />}      value={p.area}    label="Area"    />
              <SpecItem icon={<HiOutlineShieldCheck size={22} />} value="Verified"  label="Safety"  />
            </div>

            {/* ── Description ── */}
            <section>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 sm:mb-4">
                The Space
              </h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg lg:pr-10">
                {p.description}
              </p>
            </section>

            {/* ── Amenities ── */}
            <section>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 sm:mb-6">
                Premium Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 sm:gap-y-6 gap-x-3 sm:gap-x-4">
                {p.amenities.map((item) => (
                  <div key={item} className="flex items-center gap-2 sm:gap-3 group cursor-default">
                    <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition shrink-0">
                      <HiCheckCircle className="text-green-500 text-lg sm:text-xl" />
                    </div>
                    <span className="text-slate-700 font-bold text-xs sm:text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Sticky Sidebar (desktop only) ─────────── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white p-6 xl:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-50 sticky top-28">

              {/* Price */}
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <div>
                  <span className="text-3xl xl:text-4xl font-black text-slate-900">
                    ${p.price.toLocaleString()}
                  </span>
                  {p.listingType === "rent" && (
                    <span className="text-slate-400 font-bold text-lg"> / mo</span>
                  )}
                </div>
                <div className="px-3 py-2 bg-green-50 text-green-600 rounded-2xl text-xs font-black tracking-widest border border-green-100">
                  LIVE NOW
                </div>
              </div>

              {/* Check-in & guests */}
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 bg-slate-50 border border-transparent rounded-2xl focus-within:border-[#f36c3a] focus-within:bg-white transition-all">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Check-in</p>
                  <input
                    type="date"
                    className="w-full bg-transparent outline-none text-slate-900 font-bold text-sm"
                  />
                </div>
                <div className="p-3 sm:p-4 bg-slate-50 border border-transparent rounded-2xl">
                  <p className="text-[10px] uppercase font-black text-slate-400 mb-1">Guests</p>
                  <select className="w-full bg-transparent outline-none text-slate-900 font-bold cursor-pointer text-sm">
                    <option>1 Resident</option>
                    <option>2 Residents</option>
                  </select>
                </div>
              </div>

              {/* Reserve + Chat buttons */}
              <button className="w-full py-4 xl:py-5 bg-[#f36c3a] text-white rounded-2xl font-black text-base xl:text-lg hover:shadow-xl hover:shadow-orange-200 transition active:scale-95 mb-3">
                Reserve Property
              </button>
              <button
                onClick={() => setIsChatOpen(true)}
                className="w-full py-4 xl:py-5 bg-slate-900 text-white rounded-2xl font-black text-base xl:text-lg hover:bg-slate-800 transition shadow-lg shadow-slate-200 mb-5"
              >
                Chat with Agent
              </button>

              {/* Direct contact — Link with to="tel:..." and to="https://..." */}
              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Direct Contact
                </p>
                <Link
                  to="tel:+923001234567"
                  className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:border-[#f36c3a] hover:text-[#f36c3a] text-slate-600 font-bold text-sm py-3 rounded-xl transition-all"
                >
                  <FaPhoneAlt className="text-xs" /> Call Agent
                </Link>
                <Link
                  to="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
                >
                  <FaWhatsapp className="text-base" /> WhatsApp Agent
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </main>

      {/* ── Mobile bottom sticky bar ─────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-slate-100 px-4 py-3 flex gap-3 shadow-2xl">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
        >
          Chat with Agent
        </button>
        <button className="flex-1 bg-[#f36c3a] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95">
          Reserve Property
        </button>
      </div>

      {/* ── Chat Drawer ──────────────────────────────────────── */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        property={p}
      />

      {/* ── Carousel Modal ───────────────────────────────────── */}
      {carousel !== null && (
        <CarouselModal
          images={p.images}
          startIndex={carousel}
          onClose={() => setCarousel(null)}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display:none }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none }
      `}</style>
    </div>
  );
};

export default PropertyDetailPage;