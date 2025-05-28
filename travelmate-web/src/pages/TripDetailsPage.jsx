import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import PurpleButton from '../components/PurpleButton';
import ParticipantCard from '../components/ParticipantCard';
import TripInfoCard from "../components/TripInfoCard";
import './TripDetailsPage.css';

function TripDetailsPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/travel-groups/${id}`)
      .then((res) => {
        setTrip(res.data);
        const participant = res.data.groupParticipationDtos?.find(u => u.userId === userId);
        setIsParticipant(!!participant && participant.status === 'Accepted');
        setIsPending(!!participant && participant.status === 'Pending');
        setIsOwner(!!participant && participant.status === 'Accepted' && participant.isAdmin === true);
      })
      .catch((err) => console.error("Помилка при завантаженні подорожі", err));
  }, [id, userId]);

  const reloadTrip = async () => {
    const res = await axiosInstance.get(`/travel-groups/${id}`);
    setTrip(res.data);
  };

  const handleJoin = async () => {
    try {
      await axiosInstance.post(`/participation/${id}`);
      alert("Заявку подано!");
      reloadTrip();
    } catch (error) {
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

  const handleChangeStatus = async (pid, status) => {
    await axiosInstance.patch(`/participation/${pid}/status`, { status });
    reloadTrip();
  };

  const handleRemoveParticipant = async (pid) => {
    if (!window.confirm("Видалити учасника?")) return;
    await axiosInstance.delete(`/participation/${pid}`);
    reloadTrip();
  };

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div className="trip-details-wrapper">
      <button
        type="button"
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Назад
      </button>
      <TripInfoCard
        title={trip.title}
        description={trip.description}
        startTime={trip.startTime}
        endTime={trip.endTime}
      />

      {trip.groupParticipationDtos?.length > 0 && (
        <div className="participants-section">
          <h3 className="section-title">Учасники</h3>
          <ul className="participants-list">
            {trip.groupParticipationDtos.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                isOwner={isOwner}
                onApprove={() => handleChangeStatus(p.id, 1)}
                onReject={() => handleChangeStatus(p.id, 2)}
                onRemove={() => handleRemoveParticipant(p.id)}
              />
            ))}
          </ul>
        </div>
      )}

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
