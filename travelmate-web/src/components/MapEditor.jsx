import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapEditor.css";
import { useState } from "react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Налаштування іконок
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

function MapEditor({ points, setPoints }) {
  const safePoints = Array.isArray(points) ? points : [];

  const [selectedPoint, setSelectedPoint] = useState(null); 

  const handleAddPoint = (coords) => {
    const newPoint = {
      id: crypto.randomUUID(),
      latitude: coords.latitude,
      longitude: coords.longitude,
      name: `Точка ${safePoints.length + 1}`,
      description: "",
      order: safePoints.length + 1,
    };
    setPoints([...safePoints, newPoint]);
  };

  const handleDelete = (id) => {
    setPoints(safePoints.filter((p) => p.id !== id));
    setSelectedPoint(null);
  };

  const handleFieldChange = (field, value) => {
  const updatedPoints = points.map((p) =>
    p.id === selectedPoint.id ? { ...p, [field]: value } : p
  );
  setPoints(updatedPoints);

  setSelectedPoint((prev) => ({ ...prev, [field]: value }));
};


  const center =
    safePoints.length > 0
      ? [safePoints[0].latitude, safePoints[0].longitude]
      : [50.4501, 30.5234]; // Київ

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="map">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleAddPoint} />
        {safePoints.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            eventHandlers={{
              click: () => setSelectedPoint(point),
            }}
          />
        ))}
      </MapContainer>

      {/* Редактор точки у модальному вікні */}
      {selectedPoint && (
        <div className="modal-backdrop" onClick={() => setSelectedPoint(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Редагування точки</h3>
            <label>
              Назва:
              <input
                type="text"
                value={selectedPoint.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </label>
            <label>
              Опис:
              <input
                type="text"
                value={selectedPoint.description}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </label>
            <label>
              Порядок:
              <input
                type="number"
                value={selectedPoint.order}
                onChange={(e) =>
                  handleFieldChange("order", parseInt(e.target.value, 10) || 1)
                }
              />
            </label>
            <div className="modal-buttons">
              <button onClick={() => handleDelete(selectedPoint.id)}>
                🗑 Видалити
              </button>
              <button onClick={() => setSelectedPoint(null)}>✖ Закрити</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapEditor;
