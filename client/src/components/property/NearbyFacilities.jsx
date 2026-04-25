import { FaSchool, FaBus, FaUtensils } from "react-icons/fa";

export default function NearbyFacilities({ school, bus, restaurant }) {
  const hasAny = (school > 0) || (bus > 0) || (restaurant > 0);
  if (!hasAny) return null;

  return (
    <section className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900">Nearby Facilities</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {school > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
            <FaSchool className="text-blue-500 text-xl shrink-0" />
            <div><p className="font-black text-slate-800">{school}</p><p className="text-xs text-slate-500 font-medium">School{school !== 1 ? "s" : ""} nearby</p></div>
          </div>
        )}
        {bus > 0 && (
          <div className="flex items-center gap-3 bg-violet-50 border border-violet-100 p-4 rounded-2xl">
            <FaBus className="text-violet-500 text-xl shrink-0" />
            <div><p className="font-black text-slate-800">{bus}</p><p className="text-xs text-slate-500 font-medium">Bus Stop{bus !== 1 ? "s" : ""} nearby</p></div>
          </div>
        )}
        {restaurant > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
            <FaUtensils className="text-amber-500 text-xl shrink-0" />
            <div><p className="font-black text-slate-800">{restaurant}</p><p className="text-xs text-slate-500 font-medium">Restaurant{restaurant !== 1 ? "s" : ""} nearby</p></div>
          </div>
        )}
      </div>
    </section>
  );
}