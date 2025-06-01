import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './CreateTripPage.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DIFFICULTY_OPTIONS = [
  { value: 0, label: 'Легко' },
  { value: 1, label: 'Помірно' },
  { value: 2, label: 'Важко' },
  { value: 3, label: 'Екстремально' },
];

function CreateTripPage() {
  const navigate = useNavigate();
  const [routePoints, setRoutePoints] = useState([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      maxParticipants: '',
      difficulty: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Назва обовʼязкова'),
      startTime: Yup.date().required('Початкова дата обовʼязкова'),
      endTime: Yup.date()
        .min(Yup.ref('startTime'), 'Кінцева дата повинна бути пізнішою за початкову')
        .required('Кінцева дата обовʼязкова'),
      maxParticipants: Yup.number()
        .required('Максимальна кількість учасників обовʼязкова')
        .min(1, 'Має бути хоча б один учасник'),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          maxParticipants: parseInt(values.maxParticipants),
          difficulty: parseInt(values.difficulty),
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
          routePoints: routePoints.map((point, idx) => ({
            latitude: point.lat,
            longitude: point.lng,
            name: point.name,
            description: point.description,
            order: parseInt(point.order),
          })),
        };

        await axiosInstance.post('/travel-groups', payload);
        alert('Подорож створено!');
        navigate('/');
      } catch (error) {
        console.error('Помилка створення подорожі:', error);
        alert('Помилка при створенні подорожі');
      }
    },
  });

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const name = prompt('Назва точки маршруту:');
        const description = prompt('Опис точки:');
        const order = prompt('Порядковий номер (order):');
        if (name && order) {
          setRoutePoints((prev) => [
            ...prev,
            { lat, lng, name, description, order },
          ]);
        }
      },
    });
    return null;
  }

  return (
    <div className="create-trip-wrapper">
      <form onSubmit={formik.handleSubmit} className="create-trip-form">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Назад
        </button>
        <h1 className="form-title">Створити нову подорож</h1>

        <div className="form-group">
          <label>Назва подорожі</label>
          <input
            type="text"
            name="title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="form-error">{formik.errors.title}</p>
          )}
        </div>

        <div className="form-group">
          <label>Опис</label>
          <textarea
            name="description"
            rows="3"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
        </div>

        <div className="form-group">
          <label>Початок</label>
          <input
            type="datetime-local"
            name="startTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startTime}
          />
          {formik.touched.startTime && formik.errors.startTime && (
            <p className="form-error">{formik.errors.startTime}</p>
          )}
        </div>

        <div className="form-group">
          <label>Завершення</label>
          <input
            type="datetime-local"
            name="endTime"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endTime}
          />
          {formik.touched.endTime && formik.errors.endTime && (
            <p className="form-error">{formik.errors.endTime}</p>
          )}
        </div>

        <div className="form-group">
          <label>Максимум учасників</label>
          <input
            type="number"
            name="maxParticipants"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.maxParticipants}
          />
          {formik.touched.maxParticipants && formik.errors.maxParticipants && (
            <p className="form-error">{formik.errors.maxParticipants}</p>
          )}
        </div>

        <div className="form-group">
          <label>Складність</label>
          <select
            name="difficulty"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.difficulty}
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Маршрут (натисніть на карту, щоб додати точки)</label>
          <MapContainer
            center={[48.3794, 31.1656]} // центр України
            zoom={6}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler />
            {routePoints.map((point, idx) => (
              <Marker key={idx} position={[point.lat, point.lng]} />
            ))}
          </MapContainer>
        </div>

        <div className="form-group">
          <label>Вибрані точки маршруту:</label>
          {routePoints.length === 0 ? (
            <p>Немає жодної точки</p>
          ) : (
            <ul className="route-points-list">
              {routePoints.map((p, i) => (
                <li key={i}>
                  {p.order}. {p.name} ({p.lat.toFixed(3)}, {p.lng.toFixed(3)})
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="form-submit">
          Створити подорож
        </button>
      </form>
    </div>
  );
}

export default CreateTripPage;
