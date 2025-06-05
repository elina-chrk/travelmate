import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const TravelStatistics = () => {
  const { participationId } = useParams();
  const [stats, setStats] = useState(null);
  const [route, setRoute] = useState([]);

  useEffect(() => {
  axiosInstance.get(`/statistics/participation/${participationId}`)
    .then(res => {
      setStats(res.data);
    })
    .catch(err => {
      if (err.response?.status === 400) {
        setStats(null);
        console.warn("❌ Статистика не знайдена для participationId:", participationId);
      } else {
        console.error(err);
      }
    });

  // Завантаження треків — необов'язково, якщо нема статистики
  axiosInstance.get(`/participation/by-user/${participationId}/tracking`)
    .then(res => {
      const points = res.data.map(p => [p.latitude, p.longitude]);
      setRoute(points);
    })
    .catch(console.error);
}, [participationId]);


if (stats === null) {
  return <p>Статистика наразі недоступна або поїздка ще не завершена.</p>;
}

  const duration = formatDuration(stats.travelDuration);
  const avgSpeed = stats.distanceKm / (parseDurationToHours(stats.travelDuration));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Статистика подорожі</h2>
      <ul className="mb-6 space-y-2">
        <li><strong>Тривалість:</strong> {duration}</li>
        <li><strong>Відстань:</strong> {stats.distanceKm.toFixed(2)} км</li>
        <li><strong>Середній пульс:</strong> {stats.averageHeartRate.toFixed(0)} уд/хв</li>
        <li><strong>Середня швидкість:</strong> {avgSpeed.toFixed(2)} км/год</li>
      </ul>

      {route.length > 0 ? (
        <MapContainer center={route[0]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline positions={route} color="blue" />
        </MapContainer>
      ) : (
        <p className="text-gray-600">Маршрут недоступний.</p>
      )}
    </div>
  );
};

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