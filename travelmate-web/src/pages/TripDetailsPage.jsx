import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import PurpleButton from '../components/PurpleButton';
import ParticipantCard from '../components/ParticipantCard';
import TripInfoCard from "../components/TripInfoCard";

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
      .catch((err) => {
        console.error("Помилка при завантаженні подорожі", err);
      });
  }, [id, userId]);

  const handleJoin = async () => {
    try {
      await axiosInstance.post(`/participation/${id}`);
      alert("Заявку подано!");
      const res = await axiosInstance.get(`/travel-groups/${id}`);
      setTrip(res.data);

      const participant = res.data.groupParticipationDtos?.find(u => u.userId === userId);
      setIsParticipant(!!participant && participant.status === 'Accepted');
      setIsPending(!!participant && participant.status === 'Pending');
    } catch (error) {
      console.error("Помилка приєднання:", error.response?.data || error);
      alert(error.response?.data?.message || "Не вдалося приєднатися до подорожі.");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Ви точно хочете вийти з подорожі?")) return;

    try {
      await axiosInstance.delete(`/participation/leave/${id}`);
      alert("Ви вийшли з подорожі.");
      navigate("/trips");
    } catch (error) {
      console.error("Помилка при виході:", error.response?.data || error);
      alert(error.response?.data?.message || "Не вдалося вийти з подорожі.");
    }
  };

  const handleDeleteTrip = async () => {
    if (!window.confirm("Підтвердити видалення подорожі?")) return;

    try {
      await axiosInstance.delete(`/travel-groups/${id}`);
      alert("Подорож успішно видалена.");
      navigate("/trips");
    } catch (error) {
      console.error("Помилка при видаленні:", error.response?.data || error);
      alert(error.response?.data?.message || "Не вдалося видалити подорож.");
    }
  };

  const handleChangeStatus = async (participationId, newStatus) => {
    try {
      await axiosInstance.patch(`/participation/${participationId}/status`, { status: newStatus });
      const res = await axiosInstance.get(`/travel-groups/${id}`);
      setTrip(res.data);
    } catch (error) {
      console.error("Помилка зміни статусу:", error);
      alert("Не вдалося змінити статус.");
    }
  };

  const handleRemoveParticipant = async (participationId) => {
    if (!window.confirm("Видалити учасника?")) return;

    try {
      await axiosInstance.delete(`/participation/${participationId}`);
      const res = await axiosInstance.get(`/travel-groups/${id}`);
      setTrip(res.data);
    } catch (error) {
      console.error("Помилка видалення:", error);
      alert("Не вдалося видалити учасника.");
    }
  };

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white border border-purple-200 rounded-xl shadow-lg">
      <TripInfoCard
  title={trip.title}
  description={trip.description}
  startTime={trip.startTime}
  endTime={trip.endTime}
/>

      {trip.groupParticipationDtos?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Учасники</h3>
          <ul className="space-y-3">
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

      <div className="mt-6 space-y-3">
        {!isParticipant && !isPending && !isOwner && (
          <PurpleButton onClick={handleJoin} className="w-full">
            Приєднатися
          </PurpleButton>
        )}

        {isPending && (
          <p className="text-yellow-600 font-medium">
            Очікується підтвердження організатором...
          </p>
        )}

        {isParticipant && !isOwner && (
          <PurpleButton onClick={handleLeave} className="w-full bg-purple-300 hover:bg-purple-400">
            Вийти з подорожі
          </PurpleButton>
        )}

        {isOwner && (
          <div className="flex gap-4">
            <PurpleButton onClick={() => navigate(`/trips/${trip.id}/edit`)} className="bg-yellow-400 hover:bg-yellow-500">
              ✏️ Редагувати
            </PurpleButton>
            <PurpleButton onClick={handleDeleteTrip} className="bg-red-500 hover:bg-red-600">
              🗑 Видалити
            </PurpleButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default TripDetailsPage;
