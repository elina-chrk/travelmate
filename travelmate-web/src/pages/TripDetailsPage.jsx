import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

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
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold">{trip.title}</h1>
      <p className="mt-2">{trip.description}</p>
      <p className="mt-2">Дата: {new Date(trip.startTime).toLocaleDateString()} – {new Date(trip.endTime).toLocaleDateString()}</p>

      {trip.groupParticipationDtos?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Учасники подорожі:</h3>
          <ul className="list-disc ml-5 space-y-2">
            {trip.groupParticipationDtos.map((p) => (
              <li key={p.id} className="p-3 border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p><strong>{p.email || p.userId}</strong> — {p.status}</p>
                    {p.isAdmin && <span className="text-sm text-gray-500">(Організатор)</span>}
                  </div>

                  {isOwner && !p.isAdmin && (
                    <div className="flex gap-2">
                      {p.status === "Pending" && (
                        <>
                          <button
                            className="px-2 py-1 bg-green-600 text-white rounded"
                            onClick={() => handleChangeStatus(p.id, 1)} // 1 = Accepted
                          >
                            ✅ Прийняти
                          </button>
                          <button
                            className="px-2 py-1 bg-yellow-500 text-white rounded"
                            onClick={() => handleChangeStatus(p.id, 2)} // 2 = Rejected
                          >
                            ❌ Відмовити
                          </button>
                        </>
                      )}
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={() => handleRemoveParticipant(p.id)}
                      >
                        🚫 Видалити
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🟢 Приєднатися */}
      {!isParticipant && !isPending && !isOwner && (
        <button
          onClick={handleJoin}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Приєднатися
        </button>
      )}

      {/* ⏳ Очікує підтвердження */}
      {!isParticipant && isPending && (
        <p className="mt-4 text-yellow-600 font-semibold">
          Ви вже подали заявку. Очікується підтвердження організатором.
        </p>
      )}

      {/* 🔴 Вийти з подорожі */}
      {isParticipant && !isOwner && (
        <button
          onClick={handleLeave}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Вийти з подорожі
        </button>
      )}

      {/* 🛠 Редагувати */}
      {isOwner && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => navigate(`/trips/${trip.id}/edit`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            ✏️ Редагувати подорож
          </button>
          <button
            onClick={handleDeleteTrip}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🗑 Видалити подорож
          </button>
        </div>
      )}
    </div>
  );
}

export default TripDetailsPage;
