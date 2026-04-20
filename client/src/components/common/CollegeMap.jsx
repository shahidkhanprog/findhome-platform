import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon not showing in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CollegeMap = () => {
  // Your college coordinates
  const position = [34.79184848843911, 72.28902743306786];

  return (
    <MapContainer
      center={position}
      zoom={15}               // adjust zoom level as needed
      scrollWheelZoom={false}
      touchZoom={false}
      style={{ height: '100%', width: '100%' }}
      // or set fixed height: style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <Marker position={position}>
        <Popup>
          Our College <br /> 
          Coordinates: 34.7918, 72.2890
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default CollegeMap;