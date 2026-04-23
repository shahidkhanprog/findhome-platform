// components/dashboard/PropertyCard.jsx
import { useState, useEffect, useCallback } from "react";
import {
  MdLocationOn, MdEdit, MdDeleteOutline, MdKeyboardArrowDown,
  MdCheck, MdOpenInNew, MdSquareFoot, MdBed, MdBathtub,
  MdChevronLeft, MdChevronRight, MdImage, MdPerson, MdFavorite, MdFavoriteBorder
} from "react-icons/md";
import apiRequest from "../../lib/apiRequest";
import StatusBadge from "../common/StatusBadge";
import { STATUS_CONFIG, showRooms } from "../../constants/dashboardConstants";

// --- Listing Type Badge (internal to card) ---
const LISTING_TYPE_MAP = {
  buy: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sell: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  forsale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  rent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
  forrent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
};
function ListingTypeBadge({ type }) {
  if (!type) return null;
  const cfg = LISTING_TYPE_MAP[(type + "").toLowerCase().replace(/\s+/g, "")];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center ${cfg.bg} ${cfg.text} text-[10px] font-bold rounded-md px-2 py-0.5 whitespace-nowrap tracking-wide flex-shrink-0`}>
      {cfg.label}
    </span>
  );
}

// --- Save Button (Heart) ---
function SaveButton({ postId }) {
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!postId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiRequest.get(`/saved-posts/check/${postId}`);
        if (!cancelled) setSaved(res.data?.saved ?? false);
      } catch { /* ignore */ }
      finally { if (!cancelled) setChecking(false); }
    })();
    return () => { cancelled = true; };
  }, [postId]);

  const handleToggle = async (e) => {
    e.stopPropagation();
    if (toggling || checking) return;
    const prev = saved;
    setSaved(!prev);
    setToggling(true);
    try {
      const res = await apiRequest.post(`/saved-posts/${postId}`);
      setSaved(res.data?.saved ?? !prev);
    } catch { setSaved(prev); }
    finally { setToggling(false); }
  };

  return (
    <button onClick={handleToggle} disabled={checking || toggling}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-md border
        ${checking ? "bg-white/60 border-white/40 cursor-wait" : saved ? "bg-rose-500 border-rose-400 hover:bg-rose-600 shadow-rose-200" : "bg-white/80 border-white/60 hover:bg-white hover:scale-110"}
        ${toggling ? "scale-90" : ""}`}>
      {checking ? <span className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-transparent animate-spin" /> :
        saved ? <MdFavorite size={16} className="text-white" /> : <MdFavoriteBorder size={16} className="text-slate-500" />}
    </button>
  );
}

// --- Image Carousel ---
function ImageCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : 0;

  useEffect(() => { setCurrent(0); }, [images]);

  const prev = useCallback((e) => { e.stopPropagation(); setCurrent((c) => (c - 1 + total) % total); }, [total]);
  const next = useCallback((e) => { e.stopPropagation(); setCurrent((c) => (c + 1) % total); }, [total]);

  if (!hasImages) {
    return (
      <div className="relative h-44 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center gap-2">
          <MdImage size={40} className="text-violet-300" />
          <span className="text-[11px] text-violet-400 font-medium">No photos</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-44 overflow-hidden bg-slate-100">
      <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ width: `${total * 100}%`, transform: `translateX(calc(-${current} * (100% / ${total})))` }}>
        {images.map((url, i) => (
          <div key={i} className="relative flex-shrink-0 h-full" style={{ width: `calc(100% / ${total})` }}>
            <img src={url} alt={`${title} photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
      {total > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center backdrop-blur-sm z-10 shadow-md"><MdChevronLeft size={18} /></button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center backdrop-blur-sm z-10 shadow-md"><MdChevronRight size={18} /></button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
                className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- Main Property Card ---
export default function PropertyCard({ post, onEdit, onDelete, onStatusChange, onDetails, statusUpdating, isAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const bedroom = post.bedroom ?? post.bedrooms ?? 0;
  const bathroom = post.bathroom ?? post.bathrooms ?? 0;
  const area = post.postDetails?.size ?? post.area ?? 0;
  const property = post.property ?? post.category ?? "property";
  const listingType = post.type ?? post.listingType ?? null;
  const images = post.images ?? [];
  const ownerName = post.user?.username ?? post.user?.name ?? post.ownerName ?? null;
  const canShowRooms = showRooms(property);

  return (
    <div className="bg-slate-200/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-1 shadow-inner shadow-black/30 border border-slate-400">
      <div className="relative">
        <ImageCarousel images={images} title={post.title} />
        <div className="absolute top-3 left-3 z-10"><SaveButton postId={post.id} /></div>
        <div className="absolute top-3 right-3 z-10"><StatusBadge status={post.status} /></div>
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5">
          <span className="text-[10.5px] font-semibold capitalize bg-white/85 backdrop-blur-sm text-slate-700 rounded-lg px-2 py-0.5 border border-white/60 truncate max-w-[55%]">{property}</span>
          <ListingTypeBadge type={listingType} />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-1.5">
        {isAdmin && ownerName && (
          <div className="inline-flex items-center gap-1 self-start bg-violet-50 border border-violet-100 rounded-lg px-2 py-0.5 mb-0.5">
            <MdPerson size={11} className="text-blue-500" />
            <span className="text-[10.5px] text-blue-500 font-bold truncate max-w-[130px]">{ownerName}</span>
          </div>
        )}
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">{post.title}</h3>
        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-blue-500 flex-shrink-0" />
          <span className="truncate">{post.city}</span>
        </div>
        {(area > 0 || (canShowRooms && (bedroom > 0 || bathroom > 0))) && (
          <div className="flex items-center gap-3 pt-0.5 flex-wrap border-t border-gray-200 mt-2">
            {area > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-500"><MdSquareFoot size={13} />{area.toLocaleString()} sqft</span>}
            {canShowRooms && bedroom > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-500"><MdBed size={13} />{bedroom} bed</span>}
            {canShowRooms && bathroom > 0 && <span className="flex items-center gap-1 text-[11px] text-slate-500"><MdBathtub size={13} />{bathroom} bath</span>}
          </div>
        )}
        <p className="text-base font-extrabold text-blue-500 mt-auto pt-1.5 border-t border-gray-200">
          {Number(post.price).toLocaleString('en-US', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
        </p>
      </div>
      <div className="mx-4 border-t border-dashed border-slate-200" />
      <div className="p-3 flex items-center gap-2">
        <button onClick={() => onDetails?.(post.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-bold bg-gray-900 text-white rounded-xl shadow-sm">Preview</button>
        <button onClick={() => onEdit?.(post)} className="flex items-center justify-center gap-1 py-2 px-3 text-[12px] font-semibold bg-violet-50 text-violet-600 rounded-xl">Edit</button>
        <div className="relative">
          <button onClick={() => setMenuOpen(v => !v)} disabled={statusUpdating === post.id} className="flex items-center gap-0.5 py-2 px-2.5 text-[12px] font-semibold bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200 rounded-xl">
            <MdKeyboardArrowDown size={16} className={`transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute bottom-[calc(100%+6px)] right-0 z-50 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200 overflow-hidden min-w-[136px]">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide px-3 pt-2.5 pb-1">Change Status</p>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => { onStatusChange?.(post.id, key); setMenuOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium text-slate-700 ${post.status === key ? "bg-violet-50" : "hover:bg-slate-50"}`}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                    {post.status === key && <MdCheck size={13} className="ml-auto text-violet-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button onClick={() => onDelete?.(post)} className="flex items-center justify-center py-2 px-2.5 bg-gray-300 text-rose-500 border border-gray-600 rounded-xl"><MdDeleteOutline size={16} /></button>
      </div>
    </div>
  );
}