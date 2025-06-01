import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "./EditTripPage.css";

function EditTripPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    maxParticipants: 100,
    status: 0,
    difficulty: 0,
    routePoints: [], 
  });

  useEffect(() => {
    axiosInstance
      .get(`/travel-groups/${id}`)
      .then((res) => {
        const trip = res.data;
        setFormData({
          title: trip.title || "",
          description: trip.description || "",
          maxParticipants: trip.maxParticipants || 100,
          startTime: trip.startTime?.slice(0, 16),
          endTime: trip.endTime?.slice(0, 16),
          status: trip.status ?? 0,
          difficulty: trip.difficulty ?? 0,
          routePoints: trip.routePoints || [], // теж отримуємо
        });
      })
      .catch((err) => {
        console.error("Помилка при завантаженні подорожі", err);
        alert("Не вдалося завантажити дані");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "status" || name === "difficulty" || name === "maxParticipants"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PATCH для статусу
      await axiosInstance.patch(`/travel-groups/${id}/status`, {
        travelGroupId: id,
        status: formData.status,
      });

      // PUT з усіма полями, включаючи routePoints
      const payload = {
        id,
        title: formData.title,
        description: formData.description,
        maxParticipants: Number(formData.maxParticipants) || 100,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        difficulty: formData.difficulty,
        routePoints: formData.routePoints,
      };

      await axiosInstance.put(`/travel-groups/${id}`, payload);

      alert("Подорож оновлено!");
      navigate(`/trips/${id}`);
    } catch (err) {
      console.error("Помилка при оновленні:", err);
      alert("Не вдалося оновити подорож.");
    }
  };
  
  return (
    <div className="edit-trip-wrapper">
      <form onSubmit={handleSubmit} className="edit-trip-form">
        <h2 className="form-title">Редагувати подорож</h2>

        <div className="form-group">
          <label>Назва</label>
          <input name="title" value={formData.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Опис</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Максимальна кількість учасників</label>
          <input
            type="number"
            name="maxParticipants"
            min="1"
            value={formData.maxParticipants}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Початок</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Завершення</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Екстремальність</label>
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value={0}>Легка</option>
            <option value={1}>Середня</option>
            <option value={2}>Важка</option>
            <option value={3}>Екстремальна</option>
          </select>
        </div>

        <div className="form-group">
          <label>Статус</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value={0}>Запланована</option>
            <option value={1}>Активна</option>
            <option value={2}>Завершена</option>
            <option value={3}>Скасована</option>
          </select>
        </div>

        <button type="submit" className="form-submit">
          💾 Зберегти зміни
        </button>
      </form>
    </div>
  );
}

export default EditTripPage;
 