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
        });
      })
      .catch((err) => {
        console.error("Помилка при завантаженні подорожі", err);
        alert("Не вдалося завантажити дані");
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id,
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        maxParticipants: formData.maxParticipants || 100,
        endTime: new Date(formData.endTime).toISOString(),
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

        <button type="submit" className="form-submit">
          💾 Зберегти зміни
        </button>
      </form>
    </div>
  );
}

export default EditTripPage;
