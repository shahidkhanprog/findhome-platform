import { Link, useNavigate } from "react-router-dom";
import { MdAddHome, MdLocationOn, MdOutlineHome, MdAdminPanelSettings, MdOpenInNew } from "react-icons/md";
import StatusBadge from "../common/StatusBadge";
import SkeletonRow from "../common/SkeletonRow";
import UserChip from "./UserChip";
import PaginationBar from "./PaginationBar";

export default function RecentListingsCard({
  loading,
  error,
  totalItems,
  showingAll,
  pagedPosts,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  openUserDialog,
}) {
  const navigate = useNavigate();

  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all ${showingAll ? "border border-gray-100 shadow-md shadow-gray-50/80" : "border border-slate-100 shadow-sm"}`}>
      {showingAll && <div className="h-0.5 w-full bg-gray-400" />}
      <div className={`flex items-center justify-between px-4 md:px-5 py-3.5 border-b ${showingAll ? "border-gray-50 bg-gray-200 to-transparent" : "border-gray-300"}`}>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] md:text-sm font-bold text-slate-800">Recent Listings</h3>
            {showingAll && (
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                <MdAdminPanelSettings size={10} />
                All Users
              </span>
            )}
          </div>
          {!loading && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              {totalItems} {showingAll ? "platform-wide" : ""} {totalItems === 1 ? "property" : "properties"} this week
            </p>
          )}
        </div>
        <Link to="/dashboard/myProperties" className="text-[12px] text-gray-600 font-semibold no-underline hover:text-gray-800 transition-colors whitespace-nowrap">
          View all →
        </Link>
      </div>

      {error && (
        <div className="px-4 md:px-5 py-4 text-[12px] text-rose-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading && <div>{[1, 2, 3, 4].map((i) => <SkeletonRow key={i} />)}</div>}

      {!loading && !error && totalItems === 0 && (
        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${showingAll ? "bg-gray-50" : "bg-slate-50"}`}>
            <MdOutlineHome size={26} className={showingAll ? "text-gray-300" : "text-slate-300"} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-500">No listings this week</p>
            <p className="text-xs text-slate-400 mt-1">
              {showingAll ? "No properties have been added this week." : "Add your first property to get started"}
            </p>
          </div>
          <Link to="/dashboard/addProperty" className="inline-flex items-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white no-underline rounded-xl px-4 py-2 text-[12px] font-semibold shadow-md shadow-gray-200 transition-all">
            <MdAddHome size={15} />
            Add Property
          </Link>
        </div>
      )}

      {!loading && !error && totalItems > 0 && (
        <div className="overflow-x-auto overflow-y-visible" style={{ WebkitOverflowScrolling: "touch" }}>
          <div className="min-w-[580px]">
            {pagedPosts.map((p, i) => {
              const type = p.property ?? p.type ?? "property";
              const postUser = p.user ?? null;
              const postedBy = postUser?.username ?? p.username ?? null;

              return (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-4 md:px-5 py-3 ${i < pagedPosts.length - 1 ? `border-b ${showingAll ? "border-gray-50" : "border-slate-50"}` : ""}`}
                >
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-slate-100">
                    {p.images?.length > 0 ? (
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement.classList.add("bg-gradient-to-br", "from-gray-100", "to-purple-100", "flex", "items-center", "justify-center");
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-purple-100 flex items-center justify-center text-gray-500">
                        <MdOutlineHome size={18} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">{p.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                      <MdLocationOn size={11} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{p.city}</span>
                      <span className="mx-0.5 flex-shrink-0">·</span>
                      <span className="capitalize flex-shrink-0">{type}</span>
                      <span className="mx-0.5 flex-shrink-0">·</span>
                      <span className="flex-shrink-0 font-medium text-slate-500">
                        {Number(p.price).toLocaleString('en-US', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 })}
                      </span>
                    </p>
                  </div>
                    <div className="flex-shrink-0 w-28 flex justify-center">
                      {showingAll && postedBy && <UserChip username={postedBy} onClick={() => openUserDialog(postUser)} />}
                    </div>

                  <div className="flex-shrink-0 w-24 flex justify-end">
                    <StatusBadge status={p.status} />
                  </div>

                  <div className="flex-shrink-0 w-7 flex justify-center">
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/property/${p.id}`)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-gray-500 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <MdOpenInNew size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="px-4 md:px-5 pb-4">
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                totalItems={totalItems}
              />
            </div>
          </div>
        </div>
      )
      }

      {
        !loading && totalItems > 0 && (
          <div className={`sm:hidden px-4 py-3 border-t ${showingAll ? "border-gray-50" : "border-slate-50"}`}>
            <Link to="/dashboard/myProperties" className="block text-center text-[12px] text-gray-600 font-semibold no-underline py-1">
              View all properties →
            </Link>
          </div>
        )
      }
    </div >
  );
}