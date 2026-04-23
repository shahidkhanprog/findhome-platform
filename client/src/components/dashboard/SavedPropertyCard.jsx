import { MdFavorite, MdLocationOn, MdOpenInNew, MdSquareFoot, MdBed, MdBathtub, MdBookmarkRemove, MdPerson } from "react-icons/md";
import StatusBadge from "../common/StatusBadge";
import ListingTypeBadge from "../common/ListingTypeBadge";
import ImageCarousel from "../common/ImageCarousel";
import { showRooms } from "../../constants/dashboardConstants";

export default function SavedPropertyCard({ post, onDetails, onUnsave, unsaving }) {
  const bedroom = post.bedroom ?? post.bedrooms ?? 0;
  const bathroom = post.bathroom ?? post.bathrooms ?? 0;
  const area = post.postDetails?.size ?? post.area ?? 0;
  const property = post.property ?? post.category ?? "property";
  const listingType = post.type ?? post.listingType ?? null;
  const images = post.images ?? [];
  const ownerName = post.user?.username ?? post.user?.name ?? post.ownerName ?? null;
  const canShowRooms = showRooms(property);
  const isRemoving = unsaving === post.id;

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/80 shadow-sm shadow-slate-100 border border-slate-100">
      <div className="relative">
        <ImageCarousel images={images} title={post.title} />
        <button
          onClick={() => onUnsave(post)}
          disabled={isRemoving}
          className={[
            "absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm shadow-md border",
            isRemoving
              ? "bg-rose-300 border-rose-200 cursor-wait scale-90"
              : "bg-rose-500 border-rose-400 hover:bg-rose-600 hover:scale-105 shadow-rose-200",
          ].join(" ")}
        >
          {isRemoving ? (
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <MdFavorite size={16} className="text-white" />
          )}
        </button>
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={post.status} />
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-1.5">
          <span className="text-[10.5px] font-semibold capitalize bg-white/85 backdrop-blur-sm text-slate-700 rounded-lg px-2 py-0.5 border border-white/60 truncate max-w-[55%]">
            {property}
          </span>
          <ListingTypeBadge type={listingType} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-1.5">
        {ownerName && (
          <div className="inline-flex items-center gap-1 self-start bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5 mb-0.5">
            <MdPerson size={11} className="text-slate-400 flex-shrink-0" />
            <span className="text-[10.5px] font-semibold text-slate-500 leading-none truncate max-w-[130px]">
              {ownerName}
            </span>
          </div>
        )}
        <h3 className="text-[13.5px] font-bold text-slate-800 leading-snug line-clamp-2">{post.title}</h3>
        <div className="flex items-center gap-1 text-[11.5px] text-slate-400">
          <MdLocationOn size={13} className="text-violet-400 flex-shrink-0" />
          <span className="truncate">{post.city}</span>
        </div>
        {(area > 0 || (canShowRooms && (bedroom > 0 || bathroom > 0))) && (
          <div className="flex items-center gap-3 pt-0.5 flex-wrap">
            {area > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdSquareFoot size={13} className="text-slate-400" />
                {area.toLocaleString()} sqft
              </span>
            )}
            {canShowRooms && bedroom > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdBed size={13} className="text-slate-400" />
                {bedroom} bed
              </span>
            )}
            {canShowRooms && bathroom > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <MdBathtub size={13} className="text-slate-400" />
                {bathroom} bath
              </span>
            )}
          </div>
        )}
        <p className="text-base font-extrabold text-violet-600 mt-auto pt-1.5">
          {Number(post.price).toLocaleString("en-US", { style: "currency", currency: "PKR", maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="mx-4 border-t border-dashed border-slate-100" />
      <div className="p-3 flex items-center gap-2">
        <button
          onClick={() => onDetails(post.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold bg-gray-900 text-white rounded-xl border-none cursor-pointer transition-all shadow-sm shadow-violet-200"
        >
          <MdOpenInNew size={14} />
          Details
        </button>
        <button
          onClick={() => onUnsave(post)}
          disabled={isRemoving}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-[12px] font-semibold bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 rounded-xl cursor-pointer transition-colors disabled:opacity-50"
        >
          <MdBookmarkRemove size={15} />
          <span className="hidden min-[380px]:inline">Unsave</span>
        </button>
      </div>
    </div>
  );
}