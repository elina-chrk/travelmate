import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapComponent({ start, end }) {
  const center = [
    (start.lat + end.lat) / 2,
    (start.lng + end.lng) / 2,
  ];

  return (
    <MapContainer center={center} zoom={7} scrollWheelZoom={false} className="map" >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[start.lat, start.lng]}>
        <Popup>Початок маршруту</Popup>
      </Marker>
      <Marker position={[end.lat, end.lng]}>
        <Popup>Кінець маршруту</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapComponent;
