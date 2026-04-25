import { FaCheck, FaWifi, FaSnowflake, FaSwimmingPool, FaDumbbell, FaCar, FaShieldAlt, FaCouch, FaFire, FaTv, FaWater } from "react-icons/fa";

const AMENITY_ICONS = {
  "Free Wi-Fi": <FaWifi />,
  "Air Conditioning": <FaSnowflake />,
  "Swimming Pool": <FaSwimmingPool />,
  "Gym Access": <FaDumbbell />,
  "Parking Space": <FaCar />,
  "24/7 Security": <FaShieldAlt />,
  Furnished: <FaCouch />,
  Heating: <FaFire />,
  "Cable TV": <FaTv />,
  "Water Supply": <FaWater />,
};

export default function AmenitiesList({ amenities }) {
  if (!amenities || amenities.length === 0) return null;
  return (
    <section className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-black text-slate-900">Premium Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((item) => (
          <div key={item} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3.5 shadow-sm">
            <div className="p-2 bg-green-50 rounded-xl text-green-500 text-base shrink-0">
              {AMENITY_ICONS[item] || <FaCheck />}
            </div>
            <span className="text-slate-700 font-bold text-xs sm:text-sm">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}