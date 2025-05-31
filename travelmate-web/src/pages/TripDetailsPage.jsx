import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import PurpleButton from "../components/PurpleButton";
import ParticipantCard from "../components/ParticipantCard";
import TripInfoCard from "../components/TripInfoCard";
import "./TripDetailsPage.css";

const STATUS_OPTIONS = [
  { label: "Запланована", value: 0 },
  { label: "Активна", value: 1 },
  { label: "Завершена", value: 2 },
  { label: "Скасована", value: 3 },
];

const STATUS_BADGES = {
  0: "bg-yellow-100 text-yellow-800",
  1: "bg-green-100 text-green-800",
  2: "bg-gray-200 text-gray-700",
  3: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
  0: "Запланована",
  1: "Активна",
  2: "Завершена",
  3: "Скасована",
};

function TripDetailsPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id, userId]);

  const loadTrip = async () => {
    try {
      const res = await axiosInstance.get(`/travel-groups/${id}`);
      const data = res.data;
      setTrip(data);

      const participant = data.groupParticipationDtos?.find(
        (u) => u.userId === userId
      );
      setIsParticipant(!!participant && participant.status === "Accepted");
      setIsPending(!!participant && participant.status === "Pending");
      setIsOwner(
        !!participant &&
          participant.status === "Accepted" &&
          participant.isAdmin === true
      );
    } catch (err) {
      console.error("Помилка при завантаженні подорожі", err);
    }
  };

  const handleJoin = async () => {
    try {
      await axiosInstance.post(`/participation/${id}`);
      alert("Заявку подано!");
      loadTrip();
    } catch {
      alert("Не вдалося приєднатися до подорожі.");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Ви точно хочете вийти з подорожі?")) return;
    try {
      await axiosInstance.delete(`/participation/leave/${id}`);
      alert("Ви вийшли з подорожі.");
      navigate("/trips");
    } catch {
      alert("Не вдалося вийти з подорожі.");
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm("Підтвердити видалення подорожі?")) return;
    try {
      await axiosInstance.delete(`/travel-groups/${id}`);
      alert("Подорож видалена.");
      navigate("/trips");
    } catch {
      alert("Не вдалося видалити подорож.");
    }
  };

  const handleParticipantStatusChange = async (pid, status) => {
    try {
      await axiosInstance.put(`/participation/${pid}/status?status=${status}`);
      await loadTrip();
    } catch (err) {
      console.error("❌ Помилка зміни статусу учасника:", err);
      alert("Не вдалося змінити статус.");
    }
  };

  const handleRemoveParticipant = async (pid) => {
    if (!window.confirm("Видалити учасника?")) return;
    await axiosInstance.delete(`/participation/${pid}`);
    loadTrip();
  };

  const handleTripStatusChange = async (newStatus) => {
    try {
      await axiosInstance.patch(`/travel-groups/${id}/status`, {
        travelGroupId: id,
        status: parseInt(newStatus),
      });
      alert("Статус подорожі оновлено");
      loadTrip();
    } catch (err) {
      console.error("❌ Помилка оновлення статусу подорожі:", err);
      alert("Не вдалося оновити статус подорожі.");
    }
  };

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div className="trip-details-wrapper">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Назад
      </button>
      <Link to={`/travel/${trip.id}/emergency`} className="emergency-button">
        🚨 Тривога
      </Link>

      <TripInfoCard
        title={trip.title}
        description={trip.description}
        startTime={trip.startTime}
        endTime={trip.endTime}
        status={trip.status}
        difficulty={trip.difficulty}
        maxParticipants={trip.maxParticipants}
      />

      {/* Учасники */}
      {trip.groupParticipationDtos?.length > 0 && (
        <div className="participants-section">
          <h3 className="section-title">Учасники</h3>
          <ul className="participants-list">
            {trip.groupParticipationDtos.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                isOwner={isOwner}
                onApprove={() => handleParticipantStatusChange(p.id, 1)}
                onReject={() => handleParticipantStatusChange(p.id, 2)}
                onRemove={() => handleRemoveParticipant(p.id)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Дії */}
      <div className="actions-section">
        {!isParticipant && !isPending && !isOwner && (
          <PurpleButton onClick={handleJoin} className="btn-full">
            Приєднатися
          </PurpleButton>
        )}

        {isPending && (
          <p className="pending-text">
            Очікується підтвердження організатором...
          </p>
        )}

        {isParticipant && !isOwner && (
          <PurpleButton onClick={handleLeave} className="btn-leave">
            Вийти з подорожі
          </PurpleButton>
        )}

        {isOwner && (
          <div className="owner-actions">
            <PurpleButton onClick={() => navigate(`/trips/${trip.id}/edit`)}>
              ✏️ Редагувати
            </PurpleButton>
            <PurpleButton onClick={handleDeleteTrip} className="btn-delete">
              🗑 Видалити
            </PurpleButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetailsPage;
