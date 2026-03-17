// pages/dashboard/PropertyDetail.jsx
// Renders at: /dashboard/property/:id
// Shows full details for a single property.
// Uses the same DUMMY_POSTS — swap with real API call when ready.
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
} from "react-icons/md";

// Import shared data + helpers from MyProperties
// When using real data, replace these imports with your API/context
import { DUMMY_POSTS, formatPrice, StatusBadge, STATUS_CONFIG } from "./MyProperties";

/* ─── Detail row component ───────────────────────────────────────── */
function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-violet-500" />
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
  if (!value) return null;
  return (
    <div className="flex flex-col items-center gap-1.5 bg-violet-50 rounded-xl p-3 flex-1">
      <Icon size={20} className="text-violet-500" />
      <span className="text-[15px] font-extrabold text-slate-800 leading-none">{value}</span>
      <span className="text-[10px] text-slate-400 font-medium">{label}</span>
    </div>
  );
}

/* ─── PropertyDetail ─────────────────────────────────────────────── */
export default function PropertyDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  // Replace with real API call: const { data: post } = useQuery(['post', id], () => fetchPost(id))
  const post = DUMMY_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <MdOutlineHome size={32} className="text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-500">Property not found</p>
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

  const cfg = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.available;

  return (
    <div className="flex flex-col gap-5 max-w-3xl">

      {/* ── Back + page title ─────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/myProperties")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 transition-all cursor-pointer flex-shrink-0"
        >
          <MdArrowBack size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-[15px] font-extrabold text-slate-800 leading-tight truncate">
            Property Details
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">ID: #{post.id}</p>
        </div>

        {/* Edit shortcut */}
        <button
          onClick={() => navigate("/dashboard/addProperty", { state: { post } })}
          className="ml-auto inline-flex items-center gap-1.5 bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-100 rounded-xl px-4 py-2 text-[12.5px] font-semibold cursor-pointer transition-colors flex-shrink-0"
        >
          <MdEdit size={15} />
          Edit
        </button>
      </div>

      {/* ── Hero image card ───────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm shadow-slate-100">

        {/* Banner */}
        <div className="relative h-48 sm:h-56 bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center overflow-hidden">
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-violet-200/30" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-purple-200/20" />
          <MdOutlineHome size={72} className="text-violet-400/50 relative z-10" />

          {/* Status */}
          <div className="absolute top-4 right-4">
            <StatusBadge status={post.status} />
          </div>
        </div>

        {/* Title + city */}
        <div className="p-5 border-b border-slate-50">
          <h2 className="text-lg font-extrabold text-slate-800 leading-snug">
            {post.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5 text-[12.5px] text-slate-400">
            <MdLocationOn size={14} className="text-violet-400 flex-shrink-0" />
            <span>{post.city}, Pakistan</span>
          </div>
        </div>

        {/* Price + stat badges */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Asking Price</p>
              <p className="text-2xl font-extrabold text-violet-600 leading-tight mt-0.5">
                {formatPrice(post.price)}
              </p>
            </div>
            <span className={`text-[12px] font-bold ${cfg.bg} ${cfg.text} rounded-full px-3 py-1.5`}>
              {cfg.label}
            </span>
          </div>

          {/* Quick stats */}
          <div className="flex gap-2">
            {post.area > 0 && (
              <StatBadge icon={MdSquareFoot} value={`${post.area.toLocaleString()}`} label="sqft" />
            )}
            {post.bedrooms > 0 && (
              <StatBadge icon={MdBed} value={post.bedrooms} label="Bedrooms" />
            )}
            {post.bathrooms > 0 && (
              <StatBadge icon={MdBathtub} value={post.bathrooms} label="Bathrooms" />
            )}
          </div>
        </div>
      </div>

      {/* ── Description ──────────────────────────────────────── */}
      {post.description && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
          <h3 className="text-[13px] font-bold text-slate-700 mb-2.5">Description</h3>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {post.description}
          </p>
        </div>
      )}

      {/* ── Property details card ─────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100">
        <h3 className="text-[13px] font-bold text-slate-700 mb-1">Property Information</h3>

        <DetailRow icon={MdCategory}      label="Property Type" value={post.type}    />
        <DetailRow icon={MdLocationOn}    label="City"          value={post.city}    />
        <DetailRow icon={MdAttachMoney}   label="Price"         value={formatPrice(post.price)} />
        {post.area > 0 && (
          <DetailRow icon={MdSquareFoot}  label="Area"          value={`${post.area.toLocaleString()} sqft`} />
        )}
        {post.bedrooms > 0 && (
          <DetailRow icon={MdBed}         label="Bedrooms"      value={post.bedrooms} />
        )}
        {post.bathrooms > 0 && (
          <DetailRow icon={MdBathtub}     label="Bathrooms"     value={post.bathrooms} />
        )}
        {post.postedDate && (
          <DetailRow
            icon={MdCalendarToday}
            label="Listed On"
            value={new Date(post.postedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          />
        )}
      </div>

      {/* ── Bottom actions ───────────────────────────────────── */}
      <div className="flex gap-3 pb-4">
        <button
          onClick={() => navigate("/dashboard/myProperties")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-[13px] font-semibold cursor-pointer transition-colors"
        >
          <MdArrowBack size={16} />
          Back
        </button>
        <button
          onClick={() => navigate("/dashboard/addProperty", { state: { post } })}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-none text-[13px] font-semibold cursor-pointer transition-all shadow-md shadow-violet-200"
        >
          <MdEdit size={16} />
          Edit Property
        </button>
      </div>

    </div>
  );
}