const LISTING_TYPE_MAP = {
  buy: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  sell: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  forsale: { label: "For Sale", bg: "bg-violet-600", text: "text-white" },
  rent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
  forrent: { label: "For Rent", bg: "bg-cyan-500", text: "text-white" },
};

export default function ListingTypeBadge({ type }) {
  if (!type) return null;
  const cfg = LISTING_TYPE_MAP[(type + "").toLowerCase().replace(/\s+/g, "")];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center ${cfg.bg} ${cfg.text} text-[10px] font-bold rounded-md px-2 py-0.5 whitespace-nowrap tracking-wide flex-shrink-0`}
    >
      {cfg.label}
    </span>
  );
}