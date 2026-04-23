import { MdAdminPanelSettings, MdDomain, MdVerified, MdSearch } from "react-icons/md";

export default function UserHeader({ users, loading, search, setSearch }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md shadow-gray-200 overflow-hidden">
      <div className="h-1 w-full bg-gray-400" />
      <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
            <MdAdminPanelSettings size={22} className="text-gray-600" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
              User Management
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                <MdVerified size={10} /> ADMIN
              </span>
            </h2>
            {!loading && (
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MdDomain size={11} className="text-slate-300" />
                {users.length} registered {users.length === 1 ? "user" : "users"}
              </p>
            )}
          </div>
        </div>

        <div className="relative sm:w-60">
          <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 placeholder:text-slate-300 transition-all"
          />
        </div>
      </div>
    </div>
  );
}