import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdOutlineHome,
  MdLocationOn,
  MdBed,
  MdBathtub,
  MdSquareFoot,
  MdCalendarToday,
  MdEdit,
  MdCategory,
  MdAttachMoney,
  MdChevronLeft,
  MdChevronRight,
  MdImage,
  MdElectricBolt,
  MdPets,
  MdAccountBalance,
  MdSchool,
  MdDirectionsBus,
  MdRestaurant,
  MdSell,
  MdHome,
} from "react-icons/md";

import { formatPrice, StatusBadge, STATUS_CONFIG } from "./MyProperties";
import apiRequest from "../../../lib/apiRequest";

/* ─── Image Carousel (full size) ────────────────────────────────── */
function HeroCarousel({ images, title }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const hasImages = images && images.length > 0;
  const total = hasImages ? images.length : 0;

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  if (!hasImages) {
    return (
      <div className="relative h-56 sm:h-64 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-violet-200/30" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-purple-200/20" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          <MdImage size={52} className="text-violet-300" />
          <span className="text-xs text-violet-400 font-medium">
            No photos uploaded
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-100 group">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${current * 100}%)`,
          width: `${total * 100}%`,
        }}
      >
        {images.map((url, i) => (
          <div
            key={i}
            className="flex-shrink-0 h-full"
            style={{ width: `${100 / total}%` }}
          >
            <img
              src={url}
              alt={`${title} photo ${i + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {total > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10"
          >
            <MdChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm z-10"
          >
            <MdChevronRight size={22} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
            {current + 1} / {total}
          </span>
        </>
      )}

      {/* Thumbnail strip — show only if >1 image */}
      {total > 1 && (
        <div className="absolute bottom-0 right-3 flex gap-1.5 pb-3 z-10">
          {images.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === current
                  ? "border-white scale-110 shadow-lg"
                  : "border-white/40 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
          {total > 5 && (
            <div className="w-10 h-10 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center text-white text-[10px] font-bold border-2 border-white/40">
              +{total - 5}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Detail row ─────────────────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value, accent = "violet" }) {
  if (!value && value !== 0) return null;
  const colors = {
    violet: "bg-violet-50 text-violet-500",
    teal: "bg-teal-50   text-teal-500",
    amber: "bg-amber-50  text-amber-500",
    blue: "bg-blue-50   text-blue-500",
    rose: "bg-rose-50   text-rose-500",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[accent]}`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide leading-none mb-0.5">
          {label}
        </p>
        <p className="text-[13.5px] font-semibold text-slate-700 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ─── Stat badge ─────────────────────────────────────────────────── */
function StatBadge({ icon: Icon, value, label }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 bg-violet-50 rounded-xl p-3 flex-1">
      <Icon size={20} className="text-violet-500" />
      <span className="text-[15px] font-extrabold text-slate-800 leading-none">
        {value}
      </span>
      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
    </div>
  );
}

/* ─── Nearby badge ───────────────────────────────────────────────── */
function NearbyBadge({ icon: Icon, count, label, colorCls }) {
  if (!count) return null;
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${colorCls}`}
    >
      <Icon size={15} />
      <span className="text-xs font-semibold">
        {count} {label}
        {count !== 1 ? "s" : ""}
      </span>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-5 max-w-3xl animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100" />
        <div className="flex-1">
          <div className="h-4 bg-slate-100 rounded w-32 mb-1" />
          <div className="h-3 bg-slate-100 rounded w-20" />
        </div>
        <div className="w-20 h-9 bg-slate-100 rounded-xl" />
      </div>
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
        <div className="h-56 bg-slate-100" />
        <div className="p-5 flex flex-col gap-3">
          <div className="h-5 bg-slate-100 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/3" />
          <div className="flex gap-2 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 h-16 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-slate-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-slate-50 rounded mb-1" />
        ))}
      </div>
    </div>
  );
}

/* ─── PropertyDetail ─────────────────────────────────────────────── */
export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ── Fetch single post ─────────────────────────────────────────── */
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiRequest.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.response?.data?.message || "Failed to load property.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  /* ── Loading ───────────────────────────────────────────────────── */
  if (loading) return <DetailSkeleton />;

  /* ── Error ─────────────────────────────────────────────────────── */
  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <MdOutlineHome size={32} className="text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-500">
          {error || "Property not found"}
        </p>
        <button
          onClick={() => navigate("/dashboard/myProperties")}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold border-none cursor-pointer transition-colors"
        >
          <MdArrowBack size={16} />
          Back to My Properties
        </button>
      </div>
    );
  }

  /* ── Normalise fields ──────────────────────────────────────────── */
  const det = post.postDetails ?? {};
  const images = post.images ?? [];
  const bedroom = post.bedroom ?? 0;
  const bathroom = post.bathroom ?? 0;
  const area = det.size ?? 0;
  const type = post.property ?? "property";
  const cfg = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.available;

  const utilitiesLabel = {
    owner: "Owner Pays",
    tenant: "Tenant Pays",
    shared: "Shared",
  };
  const petLabel = {
    allowed: "Allowed",
    "not-allowed": "Not Allowed",
    "cats-only": "Cats Only",
    negotiable: "Negotiable",
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      {/* ── Back + header ────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/myProperties")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all cursor-pointer flex-shrink-0"
        >
          <MdArrowBack size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-[15px] font-extrabold text-slate-800 leading-tight truncate">
            Property Details
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            ID: #{post.id}
          </p>
        </div>
        <button
          onClick={() =>
            navigate("/dashboard/addProperty", { state: { post } })
          }
          className="ml-auto inline-flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-100 rounded-xl px-4 py-2 text-[12.5px] font-semibold cursor-pointer transition-colors flex-shrink-0"
        >
          <MdEdit size={15} />
          Edit
        </button>
      </div>

      {/* ── Hero image carousel card ──────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-100">
        <HeroCarousel images={images} title={post.title} />

        {/* Title + location */}
        <div className="p-5 border-b border-slate-50">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-800 leading-snug flex-1">
              {post.title}
            </h2>
            <StatusBadge status={post.status} />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[12.5px] text-slate-400">
            <MdLocationOn size={14} className="text-violet-400 flex-shrink-0" />
            <span>
              {post.address}, {post.city}
            </span>
          </div>
        </div>

        {/* Price + stats */}
        <div className="p-5">
          <div className="mb-4">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
              Asking Price
            </p>
            <p className="text-2xl font-extrabold text-violet-600 leading-tight mt-0.5">
              {formatPrice(post.price)}
            </p>
          </div>

          <div className="flex gap-2">
            {area > 0 && (
              <StatBadge
                icon={MdSquareFoot}
                value={area.toLocaleString()}
                label="sqft"
              />
            )}
            {bedroom > 0 && (
              <StatBadge icon={MdBed} value={bedroom} label="Bedrooms" />
            )}
            {bathroom > 0 && (
              <StatBadge icon={MdBathtub} value={bathroom} label="Bathrooms" />
            )}
          </div>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────────────── */}
      {det.desc && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-2.5">
            Description
          </h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {det.desc}
          </p>
        </div>
      )}

      {/* ── Property information ──────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
        <h3 className="text-[13px] font-bold text-slate-700 mb-1">
          Property Information
        </h3>

        <DetailRow
          icon={MdCategory}
          label="Property Type"
          value={type}
          accent="violet"
        />
        <DetailRow
          icon={MdSell}
          label="Listing Type"
          value={post.listingType}
          accent="violet"
        />
        <DetailRow
          icon={MdLocationOn}
          label="City"
          value={post.city}
          accent="violet"
        />
        <DetailRow
          icon={MdHome}
          label="Full Address"
          value={post.address}
          accent="violet"
        />
        <DetailRow
          icon={MdAttachMoney}
          label="Price"
          value={formatPrice(post.price)}
          accent="violet"
        />
        {area > 0 && (
          <DetailRow
            icon={MdSquareFoot}
            label="Area"
            value={`${area.toLocaleString()} sqft`}
            accent="violet"
          />
        )}
        {bedroom > 0 && (
          <DetailRow
            icon={MdBed}
            label="Bedrooms"
            value={bedroom}
            accent="violet"
          />
        )}
        {bathroom > 0 && (
          <DetailRow
            icon={MdBathtub}
            label="Bathrooms"
            value={bathroom}
            accent="violet"
          />
        )}
        {post.createdAt && (
          <DetailRow
            icon={MdCalendarToday}
            label="Listed On"
            accent="violet"
            value={new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        )}
      </div>

      {/* ── Policies (from postDetails) ───────────────────────────── */}
      {(det.utilities || det.pet || det.income) && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-1">
            Policies & Requirements
          </h3>

          {det.utilities && (
            <DetailRow
              icon={MdElectricBolt}
              label="Utilities"
              value={utilitiesLabel[det.utilities] ?? det.utilities}
              accent="teal"
            />
          )}
          {det.pet && (
            <DetailRow
              icon={MdPets}
              label="Pet Policy"
              value={petLabel[det.pet] ?? det.pet}
              accent="amber"
            />
          )}
          {det.income && (
            <DetailRow
              icon={MdAccountBalance}
              label="Income Requirement"
              value={det.income}
              accent="blue"
            />
          )}
        </div>
      )}

      {/* ── Nearby ───────────────────────────────────────────────── */}
      {(det.school > 0 || det.bus > 0 || det.restaurant > 0) && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-3">
            Nearby Facilities
          </h3>
          <div className="flex flex-wrap gap-2">
            <NearbyBadge
              icon={MdSchool}
              count={det.school}
              label="School"
              colorCls="bg-blue-50 text-blue-700 border-blue-100"
            />
            <NearbyBadge
              icon={MdDirectionsBus}
              count={det.bus}
              label="Bus Stop"
              colorCls="bg-violet-50 text-violet-700 border-violet-100"
            />
            <NearbyBadge
              icon={MdRestaurant}
              count={det.restaurant}
              label="Restaurant"
              colorCls="bg-orange-50 text-orange-700 border-orange-100"
            />
          </div>
        </div>
      )}

      {/* ── GPS Coordinates ──────────────────────────────────────── */}
      {(post.latitude || post.longitude) && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-1">
            Location Coordinates
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                Latitude
              </p>
              <p className="text-[13px] font-semibold text-slate-700 font-mono mt-0.5">
                {post.latitude}
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                Longitude
              </p>
              <p className="text-[13px] font-semibold text-slate-700 font-mono mt-0.5">
                {post.longitude}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom actions ────────────────────────────────────────── */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => navigate("/dashboard/myProperties")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-semibold cursor-pointer transition-colors"
        >
          <MdArrowBack size={16} />
          Back
        </button>
        <button
          onClick={() =>
            navigate("/dashboard/addProperty", { state: { post } })
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none text-[13px] font-semibold cursor-pointer transition-all shadow-md shadow-violet-200"
        >
          <MdEdit size={16} />
          Edit Property
        </button>
      </div>
    </div>
  );
}
