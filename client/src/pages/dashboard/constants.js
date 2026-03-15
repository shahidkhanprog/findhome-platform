/* ─── Mock Data ─────────────────────────────────────────────────────────────── */
export const MOCK_USER = {
  id: "u1", username: "ahmad_khan", email: "ahmad@example.com",
  avatar: null, role: "agent", createdAt: "2024-01-15",
};

export const MOCK_POSTS = [
  { id:"p1", userId:"u1", title:"Modern 3BR Apartment in Blue Area", price:25000000,
    images:[], address:"House 12, Street 5, Blue Area", city:"Islamabad",
    bedroom:3, bathroom:2, latitude:"33.7294", longitude:"73.0931",
    listingType:"rent", property:"apartment", status:"available",
    createdAt:"2025-01-10", desc:"Spacious apartment with modern amenities.", size:1800 },
  { id:"p2", userId:"u1", title:"5 Marla House in DHA Phase 2", price:45000000,
    images:[], address:"Block D, DHA Phase 2", city:"Lahore",
    bedroom:4, bathroom:3, latitude:"31.4697", longitude:"74.4079",
    listingType:"sale", property:"house", status:"sold",
    createdAt:"2025-02-20", desc:"Prime location house with solar system.", size:2250 },
  { id:"p3", userId:"u1", title:"Commercial Shop in Saddar", price:8500000,
    images:[], address:"Main Saddar Road, Shop 4", city:"Peshawar",
    bedroom:0, bathroom:1, latitude:"34.0058", longitude:"71.5249",
    listingType:"rent", property:"commercial", status:"rented",
    createdAt:"2025-03-05", desc:"High footfall commercial space.", size:400 },
];

/* ─── Status Config ─────────────────────────────────────────────────────────── */
export const STATUS_CONFIG = {
  available: { label:"Available", bg:"bg-emerald-100 text-emerald-700", dot:"bg-emerald-500" },
  sold:      { label:"Sold",      bg:"bg-slate-100 text-slate-500",     dot:"bg-slate-400"  },
  rented:    { label:"Rented",    bg:"bg-amber-100 text-amber-700",     dot:"bg-amber-500"  },
  pending:   { label:"Pending",   bg:"bg-blue-100 text-blue-700",       dot:"bg-blue-500"   },
};

/* ─── Nav Items ─────────────────────────────────────────────────────────────── */
export const NAV_ITEMS = [
  { id:"overview",   label:"Overview",      icon:"⊞" },
  { id:"properties", label:"My Properties", icon:"⌂" },
  { id:"add",        label:"Add Property",  icon:"＋" },
  { id:"saved",      label:"Saved Posts",   icon:"♡" },
  { id:"messages",   label:"Messages",      icon:"✉", badge:2 },
  { id:"profile",    label:"Profile",       icon:"◯" },
];

/* ─── Property type colours ─────────────────────────────────────────────────── */
export const PROP_COLORS = {
  apartment: "bg-violet-100 text-violet-700",
  house:     "bg-teal-100 text-teal-700",
  commercial:"bg-orange-100 text-orange-700",
  land:      "bg-lime-100 text-lime-700",
};

/* ─── Shared CSS helpers ────────────────────────────────────────────────────── */
export const INPUT_CLS  = "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition";
export const LABEL_CLS  = "block text-xs font-medium text-slate-500 mb-1.5";