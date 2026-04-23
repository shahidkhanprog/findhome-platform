import { Link } from "react-router-dom";
import { MdAddHome, MdAdminPanelSettings, MdDomain, MdEmail, MdFilterList, MdPerson, MdVerified } from "react-icons/md";
import Avatar from "../common/Avatar";

export default function WelcomeCard({ user, isAdmin, loading, postsCount, showingAll, onToggleAdminView }) {
  return (
    <div className={`bg-white rounded-2xl overflow-hidden transition-all ${isAdmin ? "border border-gray-200 shadow-md shadow-gray-200" : "border border-slate-100 shadow-sm"}`}>
      {isAdmin && <div className="h-1 w-full bg-gray-500" />}
      <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar src={user?.avatar} name={user?.username} className="w-14 h-14 md:w-16 md:h-16" textClass="text-xl md:text-2xl" />
            {isAdmin && (
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center shadow ring-2 ring-white">
                <MdVerified size={12} className="text-white" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-base md:text-lg font-bold text-slate-800 truncate">{user?.username ?? "User"}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${isAdmin ? "bg-gray-100 text-gray-700 border-gray-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                {isAdmin ? <><MdAdminPanelSettings size={10} />{user?.role}</> : <><MdPerson size={10} />{user?.role}</>}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 mt-1.5">
              {user?.email && (
                <p className="text-[12px] text-slate-400 flex items-center gap-1.5 truncate">
                  <MdEmail size={12} className="flex-shrink-0 text-slate-300" />{user.email}
                </p>
              )}
              {!loading && (
                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <MdDomain size={12} className="flex-shrink-0 text-slate-300" />
                  {postsCount} {postsCount === 1 ? "listing" : "listings"}{showingAll ? " across all users" : " in your account"}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
          {isAdmin && (
            <button
              type="button"
              onClick={onToggleAdminView}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold border transition-all whitespace-nowrap w-full sm:w-auto ${
                showingAll ? "bg-gray-900 text-white border-gray-600 shadow-md shadow-gray-700" : "bg-white text-black border-black hover:bg-gray-50"
              }`}
            >
              <MdFilterList size={15} />
              {showingAll ? "Showing: All Users" : "Showing: My Listings"}
            </button>
          )}
          <Link
            to="/dashboard/addProperty"
            className="inline-flex items-center justify-center gap-1.5 bg-gray-900 text-white no-underline rounded-xl px-4 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-all shadow-md shadow-gray-700 w-full sm:w-auto"
          >
            <MdAddHome size={17} />
            Add Property
          </Link>
        </div>
      </div>
    </div>
  );
}