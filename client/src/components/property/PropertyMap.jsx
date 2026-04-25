import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PropertyMap({ lat, lng, title }) {
  const position = [parseFloat(lat), parseFloat(lng)];
  return (
    <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%", zIndex: 0 }} scrollWheelZoom={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
        <Marker position={position}>
          <Popup>{title}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}