import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './TravelStatistics.css';

const TravelStatistics = () => {
  const { participationId } = useParams();
  const [stats, setStats] = useState(null);
  const [routepoints, setRoute] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/statistics/participation/${participationId}`)
      .then(res => {
        const data = res.data;
        setStats(data);

        // Отримуємо точки маршруту прямо з routePoints
        const points = data.routePoints?.map(p => [p.latitude, p.longitude]) || [];
        setRoute(points);
      })
      .catch(err => {
        if (err.response?.status === 400) {
          setStats(null);
          console.warn("❌ Статистика не знайдена для participationId:", participationId);
        } else {
          console.error(err);
        }
      });
  }, [participationId]);

  if (stats === null) {
    return (
      <div className="stats-wrapper">
        <h2 className="stats-title">📊 Статистика подорожі</h2>
        <p className="map-unavailable">Статистика наразі недоступна або поїздка ще не завершена.</p>
      </div>
    );
  }

  const duration = formatDuration(stats.travelDuration);
  const avgSpeed = parseDurationToHours(stats.travelDuration) > 0
    ? stats.distanceKm / parseDurationToHours(stats.travelDuration)
    : 0;

  return (
    <div className="stats-wrapper">
      <h2 className="stats-title">📊 Статистика подорожі</h2>

      <div className="stats-card">
        <Stat label="Тривалість" value={duration} />
        <Stat label="Відстань" value={`${stats.distanceKm.toFixed(2)} км`} />
        <Stat label="Середній пульс" value={`${stats.averageHeartRate.toFixed(0)} уд/хв`} />
        <Stat label="Середня швидкість" value={`${avgSpeed.toFixed(2)} км/год`} />
      </div>

      <div>
        <h3 className="stats-map-title">🗺️ Пройдений маршрут</h3>
        {routepoints.length > 0 ? (
          <div className="map-container">
            <MapContainer center={routepoints[0]} zoom={14} style={{ height: '400px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polyline positions={routepoints} color="#3b82f6" />
            </MapContainer>
          </div>
        ) : (
          <p className="map-unavailable">Маршрут недоступний.</p>
        )}
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="stat-item">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
);

export default TravelStatistics;

// Допоміжні функції
function formatDuration(durationString) {
  const [hours, minutes] = durationString.split(':');
  return `${parseInt(hours)} год ${parseInt(minutes)} хв`;
}

function parseDurationToHours(durationString) {
  const [h, m, s] = durationString.split(':').map(Number);
  return h + m / 60 + s / 3600;
}


/*
import React from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './TravelStatistics.css';

const TravelStatistics = () => {
  const stats = {
    travelDuration: '04:35:12',
    distanceKm: 12.4,
    averageHeartRate: 112,
  };

  const route = [
    [49.8419, 24.0315],
    [49.8425, 24.0330],
    [49.8432, 24.0348],
    [49.8441, 24.0372],
    [49.8449, 24.0400],
    [49.8457, 24.0435],
  ];

  const duration = formatDuration(stats.travelDuration);
  const avgSpeed = stats.distanceKm / parseDurationToHours(stats.travelDuration);

  return (
    <div className="stats-wrapper">
      <h2 className="stats-title">📊 Статистика подорожі</h2>

      <div className="stats-card">
        <Stat label="Тривалість" value={duration} />
        <Stat label="Відстань" value={`${stats.distanceKm.toFixed(2)} км`} />
        <Stat label="Середній пульс" value={`${stats.averageHeartRate.toFixed(0)} уд/хв`} />
        <Stat label="Середня швидкість" value={`${avgSpeed.toFixed(2)} км/год`} />
      </div>

      <div>
        <h3 className="stats-map-title">🗺️ Пройдений маршрут</h3>
        <div className="map-container">
          <MapContainer center={route[0]} zoom={14} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline positions={route} color="#3b82f6" />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="stat-item">
    <span className="stat-label">{label}</span>
    <span className="stat-value">{value}</span>
  </div>
);

export default TravelStatistics;

// Допоміжні функції
function formatDuration(durationString) {
  const [hours, minutes] = durationString.split(':');
  return `${parseInt(hours)} год ${parseInt(minutes)} хв`;
}

function parseDurationToHours(durationString) {
  const [h, m, s] = durationString.split(':').map(Number);
  return h + m / 60 + s / 3600;
}
*/