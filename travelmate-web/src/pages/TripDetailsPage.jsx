import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import PurpleButton from "../components/PurpleButton";
import ParticipantCard from "../components/ParticipantCard";
import TripInfoCard from "../components/TripInfoCard";
import "./TripDetailsPage.css";
import ChatBox from "../components/ChatBox";

const STATUS_LABELS = {
  0: "Запланована",
  1: "Активна",
  2: "Завершена",
  3: "Скасована",
};

const PARTICIPATION_STATUS_LABELS = {
  0: "Очікує підтвердження",
  1: "Прийнято",
  2: "Відхилено",
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

      setIsParticipant(!!participant && participant.status === 1); // Accepted
      setIsPending(!!participant && participant.status === 0); // Pending
      setIsOwner(
        !!participant &&
          participant.status === 1 &&
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
    const myParticipation = trip.groupParticipationDtos.find(
      (p) => p.userId === userId && p.status === 1
    );

    if (!myParticipation) {
      alert("Ваша участь не знайдена або не активна.");
      return;
    }

    await axiosInstance.delete(`/participation/${myParticipation.id}`);
    alert("Ви вийшли з подорожі.");
    navigate("/trips");
  } catch (err) {
    console.error("❌ Помилка при виході з подорожі:", err);
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

      <TripInfoCard
        title={trip.title}
        description={trip.description}
        startTime={trip.startTime}
        endTime={trip.endTime}
        status={trip.status}
        difficulty={trip.difficulty}
        maxParticipants={trip.maxParticipants}
        routePoints={trip.routePoints}
      />

      {/* Учасники */}
      {trip.groupParticipationDtos?.some((p) => p.status !== 2) && (
        <div className="participants-section">
          <h3 className="section-title">Учасники</h3>
          <ul className="participants-list">
            {trip.groupParticipationDtos
              .filter((p) => p.status !== 2)
              .map((p) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  statusLabel={PARTICIPATION_STATUS_LABELS[p.status]}
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
        {(isParticipant || isOwner) && (
          <ChatBox tripId={trip.id} userId={userId} />
        )}{" "}
      </div>
    </div>
  );
}

export default TripDetailsPage;
