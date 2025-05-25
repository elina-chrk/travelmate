import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

function MyParticipationsPage() {
  const [participations, setParticipations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/participation/me")
      .then((res) => setParticipations(res.data))
      .catch((err) => console.error("❌ Не вдалося завантажити участі", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Мої участі в подорожах</h1>
      {participations.length === 0 ? (
        <p>Ви ще не приєднувались до жодної подорожі.</p>
      ) : (
        <ul className="space-y-4">
          {participations.map((p) => (
            <li key={p.id} className="p-4 border rounded">
              <h2 className="text-lg font-semibold">{p.travelGroup?.title || "Подорож"}</h2>
              <p>Статус: {p.status}</p>
              <button
                className="text-blue-600 underline mt-2"
                onClick={() => navigate(`/trips/${p.travelGroupId}`)}
              >
                Перейти до подорожі
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyParticipationsPage;
