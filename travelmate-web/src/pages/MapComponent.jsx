import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from "react-leaflet";
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

function MapComponent({ routePoints = [], start, end }) {
  if (!start || !end) return null;

  const center = [
    (start.latitude + end.latitude) / 2,
    (start.longitude + end.longitude) / 2,
  ];

  // відсортовані точки за порядком
  const sortedPoints = [...routePoints].sort((a, b) => a.order - b.order);

  // координати для Polyline
  const routeLine = sortedPoints.map((point) => [point.latitude, point.longitude]);

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="map">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Лінія маршруту */}
        {routeLine.length > 1 && (
          <Polyline positions={routeLine} color="blue" weight={4} />
        )}

        {/* Точки маршруту */}
        {sortedPoints.map((point, idx) => (
          <Marker key={idx} position={[point.latitude, point.longitude]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div>
                <strong>№{point.order} – {point.name}</strong>
                <br />
                {point.description}
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapComponent;
