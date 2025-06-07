import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapEditor.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Налаштування іконок Leaflet 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Компонент для обробки кліку по карті
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

// Основний компонент
function MapEditor({ points, setPoints }) {
  const safePoints = Array.isArray(points) ? points : [];

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

  const handleFieldChange = (id, field, value) => {
    setPoints((prev) =>
      Array.isArray(prev)
        ? prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        : []
    );
  };

  const handleDelete = (id) => {
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const center =
    safePoints.length > 0
      ? [safePoints[0].latitude, safePoints[0].longitude]
      : [50.4501, 30.5234]; // Київ за замовчуванням

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleAddPoint} />

        {safePoints.map((point, idx) => (
          <Marker key={point.id || idx} position={[point.latitude, point.longitude]}>
            <Popup>
              <div style={{ width: "180px" }}>
                <label>
                  Назва:
                  <input
                    type="text"
                    value={point.name}
                    onChange={(e) =>
                      handleFieldChange(point.id, "name", e.target.value)
                    }
                  />
                </label>
                <label>
                  Опис:
                  <input
                    type="text"
                    value={point.description}
                    onChange={(e) =>
                      handleFieldChange(point.id, "description", e.target.value)
                    }
                  />
                </label>
                <label>
                  Порядок:
                  <input
                    type="number"
                    value={point.order}
                    onChange={(e) =>
                      handleFieldChange(
                        point.id,
                        "order",
                        parseInt(e.target.value, 10)
                      )
                    }
                  />
                </label>
                <button
                  onClick={() => handleDelete(point.id)}
                  style={{
                    marginTop: "5px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  🗑 Видалити
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapEditor;
