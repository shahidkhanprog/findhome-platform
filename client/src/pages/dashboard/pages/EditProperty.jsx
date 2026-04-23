// pages/dashboard/EditProperty.jsx
//
// ─── ROUTE ───────────────────────────────────────────────────────────────────
// Add this to your router (e.g. App.jsx / routes.jsx):
//
//   import EditProperty from "./pages/dashboard/EditProperty";
//   ...
//   <Route path="/dashboard/edit/:postId" element={<EditProperty />} />
//
// ─── NAVIGATION FROM MyProperties ────────────────────────────────────────────
// In MyProperties.jsx change handleEdit to:
//
//   const handleEdit = (post) => navigate(`/dashboard/edit/${post.id}`);
//
// That's the only change needed in MyProperties — no more passing state.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import apiRequest from "../../../lib/apiRequest";
import UploadWidget from "../../../components/uploadWidgets/UploadWidget";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS  (identical to AddProperty — keep in sync)
───────────────────────────────────────────────────────────────────────────── */
const STEPS = [
  { label: "Photos",  desc: "Upload property photos"     },
  { label: "Basic",   desc: "Core listing information"   },
  { label: "Details", desc: "Property details & policies"},
  { label: "Nearby",  desc: "Nearby facilities"          },
];

const S_BG     = ["bg-white", "bg-slate-50/60", "bg-blue-50/25", "bg-amber-50/25"];
const S_ACCENT = ["bg-indigo-500", "bg-violet-500", "bg-teal-500", "bg-amber-500"];
const S_PAL    = [
  { ring: "ring-indigo-200", icon: "bg-indigo-100 text-indigo-600", num: "bg-indigo-600" },
  { ring: "ring-violet-200", icon: "bg-violet-100 text-violet-600", num: "bg-violet-600" },
  { ring: "ring-teal-200",   icon: "bg-teal-100   text-teal-600",   num: "bg-teal-600"   },
  { ring: "ring-amber-200",  icon: "bg-amber-100  text-amber-600",  num: "bg-amber-600"  },
];

// Which property types show bedrooms / bathrooms
const PROPERTY_HAS_BEDROOMS  = ["house", "apartment"];
const PROPERTY_HAS_BATHROOMS = ["house", "apartment", "commercial"];
// Which listing types show rent-only fields
const LISTING_IS_RENT        = ["rent"];

// All status options (edit can use all, not just available/pending)
const ALL_STATUSES = [
  { value: "available", label: "Available" },
  { value: "pending",   label: "Pending"   },
  { value: "sold",      label: "Sold"      },
  { value: "rented",    label: "Rented"    },
];

/* ─── Input class helpers ─────────────────────────────────────────── */
const OK      = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all placeholder:text-slate-300";
const ERR     = "w-full border border-red-300   rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-red-200   focus:border-red-400   transition-all placeholder:text-slate-300";
const CLS_DIS = "w-full border border-slate-100 rounded-xl px-3 py-2.5 text-sm text-slate-300 bg-slate-50/50 placeholder:text-slate-200 cursor-not-allowed";
const SEL     = "w-full border rounded-xl py-2.5 pr-9 text-sm appearance-none bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer";
const sc = (v, e) =>
  `${SEL} ${e || !v ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-slate-200 focus:ring-indigo-300 focus:border-indigo-400"} ${v ? "text-slate-800" : "text-slate-400"}`;

/* ─────────────────────────────────────────────────────────────────────────────
   SVG ICONS  (same set as AddProperty — no extra imports needed)
───────────────────────────────────────────────────────────────────────────── */
const IC = {
  Camera: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>),
  Home:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Clip:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>),
  Pin:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  Tag:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>),
  Dollar: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
  Build:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  Bed:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"/><path d="M22 8H2"/><path d="M22 4v16"/><rect x="6" y="4" width="4" height="4" rx="1"/><rect x="14" y="4" width="4" height="4" rx="1"/></svg>),
  Drop:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>),
  Nav:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>),
  Ruler:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3l-2.6-2.6-9.9 9.9 2.6 2.6a1 1 0 0 0 1.4 0l8.5-8.5a1 1 0 0 0 0-1.4z"/><path d="M2.7 8.7l2.6 2.6 9.9-9.9-2.6-2.6a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4z"/><line x1="8" y1="16" x2="10" y2="14"/><line x1="11" y1="13" x2="13" y2="11"/><line x1="14" y1="10" x2="16" y2="8"/></svg>),
  Zap:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Paw:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><circle cx="4" cy="8" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/></svg>),
  School: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>),
  Bus:    (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><circle cx="15" cy="18" r="2"/></svg>),
  Fork:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M16 2l6 6-3 3-6-6 3-3z"/><path d="m8.7 8.7-2 2.1-2.1-2-.6 5.5 2.6 2.6 5.5-.7-2-2z"/><path d="m2 22 7.5-7.5"/><path d="M17 7 7 17"/></svg>),
  Plus:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Minus:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Check:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
  Trash:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>),
  Upload: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>),
  Alert:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
  ChevD:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>),
  ChevR:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>),
  Lock:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
  ArrR:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  ArrL:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
  Save:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>),
  X:      (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  Image:  (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  Spinner:(p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>),
  Edit:   (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
};

const STEP_ICONS = [IC.Camera, IC.Home, IC.Clip, IC.Pin];

/* ─────────────────────────────────────────────────────────────────────────────
   FULL PAGE LOADING SKELETON
───────────────────────────────────────────────────────────────────────────── */
function PageSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto pb-10 animate-pulse">
      {/* Header */}
      <div className="mb-5 px-1">
        <div className="h-7 bg-slate-100 rounded-xl w-48 mb-2" />
        <div className="h-3 bg-slate-100 rounded-lg w-72" />
      </div>
      {/* Progress bar */}
      <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-3 mb-6 gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-9 bg-slate-100 rounded-xl" />
        ))}
      </div>
      {/* Step card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          <div>
            <div className="h-4 bg-slate-100 rounded-lg w-24 mb-1.5" />
            <div className="h-3 bg-slate-100 rounded-lg w-36" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={i <= 2 ? "col-span-2" : ""}>
              <div className="h-3 bg-slate-100 rounded w-20 mb-1.5" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
      {/* Nav */}
      <div className="flex gap-3 mt-5">
        <div className="w-24 h-10 bg-slate-100 rounded-xl" />
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-4 bg-slate-100 rounded-full" />)}
        </div>
        <div className="w-28 h-10 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────────────────────────── */
function ProgressBar({ current, completed, failed, visited, onNav }) {
  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-3 mb-6 overflow-x-auto">
      {STEPS.map((s, i) => {
        const done       = completed.has(i);
        const hasFailed  = failed.has(i) && !done;
        const wasVisited = visited.has(i) && !done && !hasFailed;
        const active     = current === i;
        const Icon       = STEP_ICONS[i];
        const p          = S_PAL[i];
        return (
          <div key={i} className="flex items-center flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onNav(i)}
              className={[
                "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium",
                "transition-all duration-200 w-full justify-center sm:justify-start cursor-pointer",
                active && done  ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                  : active      ? "bg-slate-50 text-slate-700 ring-1 ring-slate-200"
                  : done        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : hasFailed   ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : wasVisited  ? "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  :               "text-slate-400 hover:bg-slate-50",
              ].join(" ")}
            >
              <div className={[
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all",
                active && done  ? "bg-emerald-500 text-white"
                  : active      ? `${p.num} text-white`
                  : done        ? "bg-emerald-500 text-white"
                  : hasFailed   ? "bg-red-400 text-white"
                  : wasVisited  ? "bg-slate-300 text-white"
                  :               "bg-slate-100 text-slate-300",
              ].join(" ")}>
                {done        ? <IC.Check className="w-3 h-3" />
                  : hasFailed  ? <IC.X   className="w-3 h-3" />
                  : active     ? <Icon   className="w-3.5 h-3.5" />
                  :               <Icon  className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden sm:inline truncate">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <IC.ChevR className={`w-4 h-4 mx-1 shrink-0 ${done ? "text-emerald-400" : hasFailed ? "text-red-300" : "text-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STEP CARD
───────────────────────────────────────────────────────────────────────────── */
function StepCard({ stepIndex, children }) {
  const p = S_PAL[stepIndex];
  return (
    <div className={`relative ${S_BG[stepIndex]} border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm`}>
      <div className={`absolute left-0 top-5 bottom-5 w-[3px] rounded-r-full ${S_ACCENT[stepIndex]}`} />
      <div className="pl-5 pr-4 sm:pr-6 py-4 sm:py-5">
        <div className="flex items-start gap-3 mb-5">
          <div className={`relative shrink-0 w-10 h-10 rounded-xl ${p.icon} ring-1 ${p.ring} flex items-center justify-center`}>
            {(() => { const Icon = STEP_ICONS[stepIndex]; return <Icon className="w-5 h-5" />; })()}
            <span className={`absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full ${p.num} text-white text-[9px] font-bold flex items-center justify-center ring-[1.5px] ring-white`}>
              {stepIndex + 1}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">{STEPS[stepIndex].label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{STEPS[stepIndex].desc}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FIELD
───────────────────────────────────────────────────────────────────────────── */
function Field({ label, required, error, icon: Icon, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <IC.Alert className="w-3 h-3 shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SELECT FIELD
───────────────────────────────────────────────────────────────────────────── */
function Sel({ label, required, error, icon: Icon, value, onChange, fieldRef, placeholder, children }) {
  return (
    <Field label={label} required={required} error={error} icon={Icon}>
      <div className="relative">
        {Icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"><Icon className="w-4 h-4 text-slate-400" /></span>}
        <select ref={fieldRef} value={value} onChange={onChange} className={`${sc(value, !!error)} ${Icon ? "pl-9" : "pl-3"}`}>
          <option value="" disabled hidden>{placeholder || "Select…"}</option>
          {children}
        </select>
        <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${value ? "text-slate-400" : "text-red-400"}`}>
          <IC.ChevD className="w-4 h-4" />
        </span>
      </div>
      {!value && !error && <p className="text-[11px] text-slate-400 mt-1 pl-0.5">Please select an option</p>}
    </Field>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────────────────────────────────────── */
function Counter({ value, onChange, btnCls }) {
  const n = Math.max(0, parseInt(value, 10) || 0);
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => onChange(Math.max(0, n - 1))} disabled={n === 0}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btnCls}`}>
        <IC.Minus className="w-4 h-4" />
      </button>
      <span className="w-10 text-center text-xl font-bold text-slate-800 tabular-nums select-none">{n}</span>
      <button type="button" onClick={() => onChange(Math.min(99, n + 1))} disabled={n >= 99}
        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${btnCls}`}>
        <IC.Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PHOTO UPLOAD ZONE
───────────────────────────────────────────────────────────────────────────── */
function PhotoUploadZone({ images, onAdd, onRemove, error }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IC.Camera className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-700">Property Photos</span>
          <span className="text-red-400 text-xs">*</span>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
          images.length >= 4
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-red-50 text-red-600 border-red-200"
        }`}>
          {images.length} / 4 photos
        </span>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5 mb-4 flex items-start gap-2">
        <IC.Alert className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-700">
          At least <strong>4 photos</strong> are required. You can remove existing photos and upload new ones.
          Maximum 10 photos total.
        </p>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
              <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              {/* Remove button — always visible */}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 active:scale-95 transition-all z-10"
                title="Remove photo"
              >
                <IC.X className="w-3.5 h-3.5" />
              </button>
              <span className="absolute bottom-1 left-1.5 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                {i < 4 ? `★ ${i + 1}` : `${i + 1}`}
              </span>
              {i < 4 && (
                <span className="absolute top-1.5 left-1.5 bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded-md font-bold opacity-80">
                  REQ
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < 10 && (
        <UploadWidget
          uwConfig={{
            cloudName: "droah7qf8",
            uploadPreset: "FindHome",
            multiple: true,
            maxFiles: 10 - images.length,
            cropping: false,
            folder: "property_photos",
            maxFileSize: 8000000,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          }}
          setAvatar={onAdd}
          buttonLabel={
            images.length === 0
              ? "Upload Property Photos"
              : `Add More Photos (${10 - images.length} remaining)`
          }
          variant="block"
        />
      )}

      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
            images[i]
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-slate-50 text-slate-400 border-slate-200"
          }`}>
            {images[i] ? <IC.Check className="w-3 h-3" /> : <IC.Camera className="w-3 h-3" />}
            Photo {i + 1} ★
          </span>
        ))}
        {images.length > 4 && (
          <span className="text-[11px] text-slate-400 font-medium">+{images.length - 4} bonus photos</span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 mt-3">
          <IC.Alert className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════════════
   EDIT PROPERTY PAGE
   
   Flow:
   1. Mount → read :postId from URL params
   2. Fetch GET /posts/:postId (includes postDetails)
   3. Pre-populate all form state from API response
   4. Dependent fields hydrated correctly:
      - bedroom/bathroom shown only if property type requires them
      - utilities/pet shown only if listingType === "rent"
   5. On save → PUT /posts/:postId + PUT /posts/details/:postId
   6. On success → navigate back to /dashboard/myProperties
═════════════════════════════════════════════════════════════════════════════ */
export default function EditProperty() {
  const navigate        = useNavigate();
  const { postId }      = useParams();
  const { currentUser } = useContext(AuthContext);

  /* ── Loading / error state for initial data fetch ──────────────── */
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]     = useState("");

  /* ── Step progress ──────────────────────────────────────────────── */
  const [current, setCurrent]     = useState(0);
  const [completed, setCompleted] = useState(new Set());
  const [failed, setFailed]       = useState(new Set());
  const [visited, setVisited]     = useState(new Set([0]));

  /* ── Submit state ───────────────────────────────────────────────── */
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [submitError, setSubmitError]   = useState("");

  /* ── Form state ─────────────────────────────────────────────────── */
  const [form, setForm] = useState({
    title: "", price: "", address: "", city: "",
    bedroom: "", bathroom: "",
    latitude: "", longitude: "",
    listingType: "", property: "", status: "",
  });

  const [det, setDet] = useState({
    desc: "", utilities: "", pet: "", size: "",
    school: 0, bus: 0, restaurant: 0,
  });

  const [images, setImages] = useState([]);

  // Store the postDetails record id for PUT
  const [postDetailsId, setPostDetailsId] = useState(null);

  /* ─────────────────────────────────────────────────────────────────
     FETCH POST DATA ON MOUNT
     Expects API to return:
     {
       id, title, price, address, city, bedroom, bathroom,
       latitude, longitude, listingType (or type), property,
       status, images,
       postDetails: {
         id, desc, utilities, pet, size, school, bus, restaurant
       }
     }
  ───────────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      setFetchLoading(true);
      setFetchError("");
      try {
        const res  = await apiRequest.get(`/posts/${postId}`);
        const p    = res.data;
        const pd   = p.postDetails ?? {};

        /* ── Normalise listingType ────────────────────────────────
           DB might store as "type" (post.type) or "listingType".
           We always populate form.listingType.
        ─────────────────────────────────────────────────────────── */
        const listingType = p.listingType ?? p.type ?? "";

        setForm({
          title:       p.title       ?? "",
          price:       p.price       != null ? String(p.price) : "",
          address:     p.address     ?? "",
          city:        p.city        ?? "",
          // bedroom/bathroom: only trust DB value if the property type uses rooms.
          // This prevents stale 0s from confusing the "required" validation.
          bedroom:     PROPERTY_HAS_BEDROOMS.includes(p.property)
                         ? (p.bedroom  != null ? String(p.bedroom)  : "")
                         : "",
          bathroom:    PROPERTY_HAS_BATHROOMS.includes(p.property)
                         ? (p.bathroom != null ? String(p.bathroom) : "")
                         : "",
          latitude:    p.latitude  != null ? String(p.latitude)  : "",
          longitude:   p.longitude != null ? String(p.longitude) : "",
          listingType,
          property:    p.property ?? "",
          status:      p.status   ?? "",
        });

        setDet({
          desc:       pd.desc       ?? "",
          // utilities/pet: only hydrate if the listing type is "rent"
          utilities:  LISTING_IS_RENT.includes(listingType) ? (pd.utilities ?? "") : "",
          pet:        LISTING_IS_RENT.includes(listingType) ? (pd.pet       ?? "") : "",
          size:       pd.size != null ? String(pd.size) : "",
          school:     pd.school     ?? 0,
          bus:        pd.bus        ?? 0,
          restaurant: pd.restaurant ?? 0,
        });

        setImages(p.images ?? []);

        // Store postDetails.id for the update request
        if (pd.id) setPostDetailsId(pd.id);

        // Mark all steps as visited so the user can freely jump between them
        setVisited(new Set([0, 1, 2, 3]));

      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to load property. Please try again."
        );
      } finally {
        setFetchLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  /* ─── Derived booleans for conditional fields ──────────────────── */
  const showBedrooms   = PROPERTY_HAS_BEDROOMS.includes(form.property);
  const showBathrooms  = PROPERTY_HAS_BATHROOMS.includes(form.property);
  const showRentFields = LISTING_IS_RENT.includes(form.listingType);

  /* ─── Field helpers ────────────────────────────────────────────── */
  const [errors, setErrors] = useState({});
  const clr = (k) => setErrors(e => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  const sf  = (k, v) => { setForm(f  => ({ ...f, [k]: v })); clr(k); };
  const sd  = (k, v) => { setDet(d   => ({ ...d, [k]: v })); clr(k); };

  /* ─── Image helpers ────────────────────────────────────────────── */
  const addImage = useCallback((url) => {
    setImages(prev => {
      if (prev.includes(url)) return prev;
      if (prev.length >= 10)  return prev;
      return [...prev, url];
    });
  }, []);

  const removeImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  /* ─── Refs for focus-on-error ──────────────────────────────────── */
  const R = {
    images: useRef(null), title: useRef(null), price: useRef(null),
    city: useRef(null), address: useRef(null), listingType: useRef(null),
    property: useRef(null), status: useRef(null), bedroom: useRef(null),
    bathroom: useRef(null), latitude: useRef(null), longitude: useRef(null),
    desc: useRef(null), size: useRef(null), utilities: useRef(null),
    pet: useRef(null),
  };

  const focusFirst = useCallback((errs, keys) => {
    for (const k of keys) {
      if (errs[k] && R[k]?.current) {
        R[k].current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => R[k].current?.focus?.(), 280);
        return;
      }
    }
  }, []);

  /* ─── Validation (same rules as AddProperty) ───────────────────── */
  const validate = useCallback((s) => {
    const e = {};
    if (s === 0) {
      if (images.length < 4) e.images = `${images.length} of 4 required photos — please keep at least 4`;
    }
    if (s === 1) {
      if (!form.title.trim())     e.title       = "Property title is required";
      if (!form.price)            e.price       = "Price is required";
      if (!form.city.trim())      e.city        = "City is required";
      if (!form.address.trim())   e.address     = "Address is required";
      if (!form.listingType)      e.listingType = "Select a listing type";
      if (!form.property)         e.property    = "Select a property type";
      if (!form.status)           e.status      = "Select a listing status";
      if (showBedrooms  && !form.bedroom)  e.bedroom  = "Number of bedrooms is required";
      if (showBathrooms && !form.bathroom) e.bathroom = "Number of bathrooms is required";
      if (!form.latitude.trim())  e.latitude    = "Latitude is required";
      if (!form.longitude.trim()) e.longitude   = "Longitude is required";
    }
    if (s === 2) {
      if (!det.desc.trim())  e.desc = "Description is required";
      if (!det.size)         e.size = "Size is required";
      if (showRentFields && !det.utilities) e.utilities = "Select a utilities policy";
      if (showRentFields && !det.pet)       e.pet       = "Select a pet policy";
    }
    return e;
  }, [form, det, images, showBedrooms, showBathrooms, showRentFields]);

  const ORDER = {
    0: ["images"],
    1: ["title","price","city","address","listingType","property","status","bedroom","bathroom","latitude","longitude"],
    2: ["desc","size","utilities","pet"],
    3: [],
  };

  /* ─── Step navigation ──────────────────────────────────────────── */
  const handleNext = () => {
    const e = validate(current);
    setErrors(e);
    if (Object.keys(e).length) {
      setFailed(prev => new Set([...prev, current]));
      focusFirst(e, ORDER[current]);
      return;
    }
    setFailed(prev => { const n = new Set(prev); n.delete(current); return n; });
    setCompleted(prev => new Set([...prev, current]));
    if (current < 3) {
      const next = current + 1;
      setVisited(prev => new Set([...prev, next]));
      setCurrent(next);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNav = (i) => {
    setVisited(prev => new Set([...prev, i]));
    setCurrent(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ─────────────────────────────────────────────────────────────────
     SAVE CHANGES
     PUT /posts/:postId        — core post fields + images
     PUT /posts/details/:detId — postDetails fields
     
     Adjust the endpoints to match your actual backend routes.
     If your backend uses a single endpoint that handles both,
     merge the two calls into one.
  ───────────────────────────────────────────────────────────────── */
  const handleSave = async () => {
    // Validate final step before saving
    const e = validate(3);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitError("");
    setSubmitStatus("loading");

    try {
      // 1. Update core post
      await apiRequest.put(`/posts/${postId}`, {
        title:       form.title.trim(),
        price:       parseInt(form.price, 10),
        address:     form.address.trim(),
        city:        form.city.trim(),
        bedroom:     showBedrooms   ? parseInt(form.bedroom,  10) : 0,
        bathroom:    showBathrooms  ? parseInt(form.bathroom, 10) : 0,
        latitude:    form.latitude.trim(),
        longitude:   form.longitude.trim(),
        listingType: form.listingType,
        property:    form.property,
        status:      form.status,
        images,
      });

      // 2. Update post details
      //    If your backend uses /posts/:postId/details instead, update the URL below.
      const detailsEndpoint = postDetailsId
        ? `/posts/${postId}`
        : `/posts/${postId}`;

      await apiRequest.put(detailsEndpoint, {
        desc:       det.desc.trim(),
        utilities:  showRentFields ? det.utilities : null,
        pet:        showRentFields ? det.pet       : null,
        size:       parseInt(det.size, 10),
        school:     det.school,
        bus:        det.bus,
        restaurant: det.restaurant,
      });

      setSubmitStatus("success");
      setCompleted(prev => new Set([...prev, 3]));

      // Navigate back to my properties after a short delay
      setTimeout(() => navigate("/dashboard/myProperties"), 1400);

    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Failed to save changes. Please try again."
      );
      setSubmitStatus("error");
    }
  };

  /* ─── Input class helpers ──────────────────────────────────────── */
  const iCls     = (k) => errors[k] ? ERR : OK;
  const fieldErr = (k) => errors[k];

  /* ─────────────────────────────────────────────────────────────────
     RENDER — LOADING / ERROR STATES
  ───────────────────────────────────────────────────────────────── */
  if (fetchLoading) return <PageSkeleton />;

  if (fetchError) {
    return (
      <div className="w-full max-w-3xl mx-auto pb-10">
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-2xl gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
            <IC.Alert className="w-8 h-8 text-rose-400" />
          </div>
          <div className="text-center px-6">
            <p className="text-sm font-bold text-slate-700">Could not load property</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">{fetchError}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/dashboard/myProperties")}
              className="inline-flex items-center gap-1.5 border border-slate-200 text-slate-600 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              <IC.ArrL className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────
     MAIN RENDER
  ───────────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-3xl mx-auto pb-10">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="mb-5 px-1">
        <div className="flex items-center gap-2 mb-1">
          {/* Back link */}
          <button
            onClick={() => navigate("/dashboard/myProperties")}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors"
          >
            <IC.ArrL className="w-3.5 h-3.5" />
            My Properties
          </button>
          <span className="text-slate-200">/</span>
          <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]">
            {form.title || "Edit Property"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <IC.Edit className="w-4 h-4 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">
              Edit Property
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Fields marked <span className="text-red-400 font-medium">*</span> are required.
              Changes are saved when you click "Save Changes" on the last step.
            </p>
          </div>
        </div>

        {/* Post ID chip — useful for debugging / admin */}
        <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID</span>
          <span className="text-[11px] font-mono text-slate-500">{postId}</span>
        </div>
      </div>

      {/* ── Progress bar ────────────────────────────────────────── */}
      <ProgressBar
        current={current}
        completed={completed}
        failed={failed}
        visited={visited}
        onNav={handleNav}
      />

      {/* ════════════════════════════════════════════════════════════
          STEP 0 — PHOTOS
      ════════════════════════════════════════════════════════════ */}
      {current === 0 && (
        <StepCard stepIndex={0}>
          <PhotoUploadZone
            images={images}
            onAdd={addImage}
            onRemove={removeImage}
            error={errors.images}
          />
        </StepCard>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 1 — BASIC INFO
      ════════════════════════════════════════════════════════════ */}
      {current === 1 && (
        <StepCard stepIndex={1}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Title */}
            <div className="sm:col-span-2">
              <Field label="Property Title" required error={fieldErr("title")} icon={IC.Tag}>
                <input
                  ref={R.title} type="text" value={form.title}
                  onChange={e => sf("title", e.target.value)}
                  placeholder="e.g. Modern 3BR Apartment in Blue Area"
                  className={iCls("title")}
                />
              </Field>
            </div>

            {/* Price */}
            <Field label="Price (PKR)" required error={fieldErr("price")} icon={IC.Dollar}>
              <input
                ref={R.price} type="number" value={form.price}
                onChange={e => sf("price", e.target.value)}
                placeholder="e.g. 25000000"
                className={iCls("price")}
              />
            </Field>

            {/* City */}
            <Field label="City" required error={fieldErr("city")}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                  <IC.Pin className="w-4 h-4 text-slate-400" />
                </span>
                <input
                  ref={R.city} type="text" value={form.city}
                  onChange={e => sf("city", e.target.value)}
                  placeholder="e.g. Islamabad"
                  className={`${iCls("city")} pl-9`}
                />
              </div>
            </Field>

            {/* Address */}
            <div className="sm:col-span-2">
              <Field label="Full Address" required error={fieldErr("address")}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <IC.Pin className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    ref={R.address} type="text" value={form.address}
                    onChange={e => sf("address", e.target.value)}
                    placeholder="e.g. House 12, Street 5, Blue Area"
                    className={`${iCls("address")} pl-9`}
                  />
                </div>
              </Field>
            </div>

            {/* Listing Type */}
            <Sel
              label="Listing Type" required error={fieldErr("listingType")}
              fieldRef={R.listingType} value={form.listingType}
              onChange={e => {
                sf("listingType", e.target.value);
                // When switching away from rent, clear rent-only fields
                if (!LISTING_IS_RENT.includes(e.target.value)) {
                  sd("utilities", "");
                  sd("pet", "");
                }
              }}
              placeholder="Select listing type…"
            >
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </Sel>

            {/* Property Type */}
            <Sel
              label="Property Type" required icon={IC.Build} error={fieldErr("property")}
              fieldRef={R.property} value={form.property}
              onChange={e => {
                sf("property", e.target.value);
                // Clear bedroom/bathroom when switching to a non-room type
                if (!PROPERTY_HAS_BEDROOMS.includes(e.target.value))  sf("bedroom",  "");
                if (!PROPERTY_HAS_BATHROOMS.includes(e.target.value))  sf("bathroom", "");
              }}
              placeholder="Select property type…"
            >
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </Sel>

            {/* Status — all statuses available in edit (not just available/pending) */}
            <Sel
              label="Listing Status" required error={fieldErr("status")}
              fieldRef={R.status} value={form.status}
              onChange={e => sf("status", e.target.value)}
              placeholder="Select status…"
            >
              {ALL_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </Sel>

            {/* Bedrooms — only for house / apartment */}
            {showBedrooms && (
              <Field label="Bedrooms" required error={fieldErr("bedroom")} icon={IC.Bed}>
                <input
                  ref={R.bedroom} type="number" min="0" value={form.bedroom}
                  onChange={e => sf("bedroom", e.target.value)}
                  placeholder="e.g. 3"
                  className={iCls("bedroom")}
                />
              </Field>
            )}

            {/* Bathrooms — for house / apartment / commercial */}
            {showBathrooms && (
              <Field label="Bathrooms" required error={fieldErr("bathroom")} icon={IC.Drop}>
                <input
                  ref={R.bathroom} type="number" min="0" value={form.bathroom}
                  onChange={e => sf("bathroom", e.target.value)}
                  placeholder="e.g. 2"
                  className={iCls("bathroom")}
                />
              </Field>
            )}

            {/* Info badge when land is selected */}
            {form.property === "land" && (
              <div className="sm:col-span-2 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                <IC.Alert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700">
                  Land listings don't require bedroom or bathroom counts.
                </p>
              </div>
            )}

            {/* GPS separator */}
            <div className="sm:col-span-2 flex items-center gap-3 mt-1">
              <hr className="flex-1 border-slate-200" />
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shrink-0">
                <IC.Nav className="w-3.5 h-3.5" /> GPS Coordinates <span className="text-red-400">*</span>
              </span>
              <hr className="flex-1 border-slate-200" />
            </div>

            {/* Latitude */}
            <Field label="Latitude" required error={fieldErr("latitude")} icon={IC.Nav}>
              <input
                ref={R.latitude} type="text" value={form.latitude}
                onChange={e => sf("latitude", e.target.value)}
                placeholder="e.g. 33.7294"
                className={iCls("latitude")}
              />
            </Field>

            {/* Longitude */}
            <Field label="Longitude" required error={fieldErr("longitude")} icon={IC.Nav}>
              <input
                ref={R.longitude} type="text" value={form.longitude}
                onChange={e => sf("longitude", e.target.value)}
                placeholder="e.g. 73.0931"
                className={iCls("longitude")}
              />
            </Field>
          </div>
        </StepCard>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 2 — PROPERTY DETAILS
      ════════════════════════════════════════════════════════════ */}
      {current === 2 && (
        <StepCard stepIndex={2}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Description */}
            <div className="sm:col-span-2">
              <Field label="Description" required error={fieldErr("desc")}>
                <textarea
                  ref={R.desc} rows={4} value={det.desc}
                  onChange={e => sd("desc", e.target.value)}
                  placeholder="Describe the property — highlights, condition, renovations…"
                  className={`${errors.desc ? ERR : OK} resize-none`}
                />
              </Field>
            </div>

            {/* Size */}
            <Field label="Size (sqft)" required error={fieldErr("size")} icon={IC.Ruler}>
              <input
                ref={R.size} type="number" min="0" value={det.size}
                onChange={e => sd("size", e.target.value)}
                placeholder="e.g. 1800"
                className={iCls("size")}
              />
            </Field>

            {/* Rent-only fields */}
            {showRentFields ? (
              <>
                <Sel
                  label="Utilities Included" required icon={IC.Zap}
                  error={fieldErr("utilities")} fieldRef={R.utilities}
                  value={det.utilities}
                  onChange={e => sd("utilities", e.target.value)}
                  placeholder="Select utilities policy…"
                >
                  <option value="owner">Owner pays</option>
                  <option value="tenant">Tenant pays</option>
                  <option value="shared">Shared</option>
                </Sel>

                <Sel
                  label="Pet Policy" required icon={IC.Paw}
                  error={fieldErr("pet")} fieldRef={R.pet}
                  value={det.pet}
                  onChange={e => sd("pet", e.target.value)}
                  placeholder="Select pet policy…"
                >
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                  <option value="cats-only">Cats Only</option>
                  <option value="negotiable">Negotiable</option>
                </Sel>
              </>
            ) : form.listingType === "sale" ? (
              <div className="sm:col-span-2 flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-3.5 py-2.5">
                <IC.Alert className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                <p className="text-xs text-teal-700">
                  Utilities and pet policy are not applicable for sale listings.
                </p>
              </div>
            ) : null}
          </div>
        </StepCard>
      )}

      {/* ════════════════════════════════════════════════════════════
          STEP 3 — NEARBY + SAVE
      ════════════════════════════════════════════════════════════ */}
      {current === 3 && (
        <StepCard stepIndex={3}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { key: "school",     label: "Schools",     col: "blue",   Icon: IC.School, btn: "bg-blue-100   hover:bg-blue-200   text-blue-700"   },
              { key: "bus",        label: "Bus Stops",   col: "violet", Icon: IC.Bus,    btn: "bg-violet-100 hover:bg-violet-200 text-violet-700" },
              { key: "restaurant", label: "Restaurants", col: "orange", Icon: IC.Fork,   btn: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
            ].map(({ key, label, col, Icon, btn }) => (
              <div key={key} className={`bg-${col}-50 border border-${col}-100 rounded-xl p-4 flex sm:flex-col flex-row items-center sm:items-start gap-4`}>
                <div className="flex items-center gap-2.5 flex-1 sm:flex-none">
                  <div className={`w-9 h-9 rounded-xl bg-${col}-100 text-${col}-600 flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`text-sm font-semibold text-${col}-900 leading-tight`}>{label}</p>
                    <p className={`text-xs text-${col}-400`}>nearby</p>
                  </div>
                </div>
                <div className="shrink-0 sm:w-full flex sm:flex-col items-center sm:items-start gap-3">
                  <Counter value={det[key]} onChange={v => sd(key, v)} btnCls={btn} />
                  <div className="hidden sm:flex gap-1 flex-wrap min-h-[14px]">
                    {Array.from({ length: Math.min(det[key], 10) }, (_, i) => (
                      <div key={i} className={`w-2.5 h-2.5 rounded-full bg-${col}-400`} />
                    ))}
                    {det[key] > 10 && <span className={`text-[10px] text-${col}-500 self-center`}>+{det[key] - 10}</span>}
                    {det[key] === 0 && <span className={`text-[11px] text-${col}-300`}>None added</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Nearby summary */}
          {(det.school > 0 || det.bus > 0 || det.restaurant > 0) && (
            <div className="mt-4 flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-3.5 py-2.5 flex-wrap">
              <span className="text-xs text-slate-500 font-medium shrink-0">Nearby:</span>
              {det.school > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  <IC.School className="w-3.5 h-3.5" />{det.school} school{det.school !== 1 ? "s" : ""}
                </span>
              )}
              {det.bus > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                  <IC.Bus className="w-3.5 h-3.5" />{det.bus} bus stop{det.bus !== 1 ? "s" : ""}
                </span>
              )}
              {det.restaurant > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                  <IC.Fork className="w-3.5 h-3.5" />{det.restaurant} restaurant{det.restaurant !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
              <IC.Alert className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{submitError}</p>
            </div>
          )}

          {/* Submit success */}
          {submitStatus === "success" && (
            <div className="mt-4 flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
              <IC.Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700 font-medium">Changes saved! Redirecting…</p>
            </div>
          )}
        </StepCard>
      )}

      {/* ── Step navigation ─────────────────────────────────────── */}
      <div className="flex items-center gap-3 mt-5">

        {/* Back / Cancel */}
        {current === 0 ? (
          <button
            onClick={() => navigate("/dashboard/myProperties")}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-500 rounded-xl text-sm font-medium hover:bg-slate-50 active:scale-[.98] transition-all"
          >
            <IC.ArrL className="w-4 h-4" /> Cancel
          </button>
        ) : (
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 active:scale-[.98] transition-all"
          >
            <IC.ArrL className="w-4 h-4" /> Back
          </button>
        )}

        {/* Step dots */}
        <div className="flex-1 flex items-center justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current   ? "w-6 bg-indigo-600"
                : completed.has(i) ? "w-3 bg-emerald-400"
                : "w-3 bg-slate-200"
            }`} />
          ))}
        </div>

        {/* Next / Save */}
        {current < 3 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98]"
          >
            Next <IC.ArrR className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submitStatus !== "loading" && submitStatus !== "success" ? handleSave : undefined}
            disabled={submitStatus === "loading" || submitStatus === "success"}
            className={[
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm",
              submitStatus === "loading" ? "bg-indigo-400 text-white cursor-not-allowed"
              : submitStatus === "success" ? "bg-emerald-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[.98]",
            ].join(" ")}
          >
            {submitStatus === "loading"  && <IC.Spinner className="w-4 h-4 animate-spin" />}
            {submitStatus === "loading"  ? "Saving…"
              : submitStatus === "success" ? <><IC.Check className="w-4 h-4" /> Saved!</>
              : <>Save Changes <IC.Save className="w-4 h-4" /></>
            }
          </button>
        )}
      </div>
    </div>
  );
}