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

      const participant = res.data.userTravelGroups?.find(u => u.userId === userId)

      console.log("🔍 userId з токена:", userId)
      console.log("🔍 userTravelGroups:", res.data.userTravelGroups)
      console.log("🔍 Організатор знайдений:", participant)
      console.log("🔍 isAdmin:", participant?.isAdmin)

      setIsParticipant(!!participant && participant.status === 'Accepted')
      setIsPending(!!participant && participant.status === 'Pending')
      setIsOwner(!!participant && participant.isAdmin === true) 
    })
    .catch((err) => {
      console.error("Помилка при завантаженні подорожі", err)
    })
}, [id, userId])




  const handleJoin = async () => {
  try {
    await axiosInstance.post(`/participation/${id}`);
    alert("Заявку подано!");
    // Повторно завантажити деталі подорожі, щоб оновити статус
    const res = await axiosInstance.get(`/travel-groups/${id}`);
    setTrip(res.data);

    const participant = res.data.userTravelGroups?.find(u => u.userId === userId);
    setIsParticipant(!!participant && participant.status === 'Accepted');
    setIsPending(!!participant && participant.status === 'Pending');
  } catch (error) {
    console.error("Помилка приєднання:", error.response?.data || error);
    alert(error.response?.data?.message || "Не вдалося приєднатися до подорожі.");
  }
};

  if (!trip) return <p>Завантаження...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold">{trip.title}</h1>
      <p className="mt-2">{trip.description}</p>
      <p className="mt-2">Дата: {new Date(trip.startTime).toLocaleDateString()} – {new Date(trip.endTime).toLocaleDateString()}</p>

      {trip.userTravelGroups?.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Учасники:</h3>
          <ul className="list-disc ml-5">
            {isOwner && trip.userTravelGroups?.length > 0 && (
  <div className="mt-6">
    <h3 className="font-semibold mb-2">Заявки на участь / Учасники:</h3>
    <ul className="space-y-2">
      {trip.userTravelGroups.map((p) => (
        <li key={p.id} className="p-3 border rounded">
          <div className="flex justify-between items-center">
            <div>
              <p><strong>{p.user?.email || p.userId}</strong> — {p.status}</p>
              {p.isAdmin && <span className="text-sm text-gray-500">(Організатор)</span>}
            </div>

            {!p.isAdmin && (
              <div className="flex gap-2">
                {p.status === "Pending" && (
                  <>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded"
                      onClick={() => handleChangeStatus(p.id, 1)}
                    >
                      ✅ Прийняти
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded"
                      onClick={() => handleChangeStatus(p.id, 2)}
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

          </ul>
        </div>
      )}

      {/* 🟢 Кнопка приєднання */}
{!isParticipant && !isPending && !isOwner && (
  <button
    onClick={handleJoin}
    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    Приєднатися
  </button>
)}

{/* ⏳ Інформація про очікування заявки */}
{!isParticipant && isPending && (
  <p className="mt-4 text-yellow-600 font-semibold">
    Ви вже подали заявку на участь. Очікується підтвердження організатором.
  </p>
)}

{/* 🛠 Кнопка редагування, якщо користувач — організатор */}
{isOwner && (
  <button
    onClick={() => navigate(`/trips/${trip.id}/edit`)}
    className="ml-4 mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
  >
    Редагувати подорож
  </button>
)}
    </div>
  );
}

export default TripDetailsPage;
