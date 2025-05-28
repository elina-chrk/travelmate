import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./MyParticipationsPage.css";

function MyParticipationsPage() {
  const [participations, setParticipations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/participation/me")
      .then(async (res) => {
        const participationsRaw = res.data;

        const enhanced = await Promise.all(
          participationsRaw.map(async (p) => {
            try {
              const groupRes = await axiosInstance.get(`/travel-groups/${p.travelGroupId}`);
              return { ...p, travelGroup: groupRes.data };
            } catch (err) {
              console.error("❌ Не вдалося завантажити подорож:", p.travelGroupId);
              return { ...p, travelGroup: null };
            }
          })
        );

        setParticipations(enhanced);
      })
      .catch((err) => console.error("❌ Не вдалося завантажити участі", err));
  }, []);

  return (
    <div className="participations-wrapper">
      <button className="back-button" onClick={() => navigate("/")}>
        ← Назад
      </button>

      <h1 className="participations-title">Мої участі в подорожах</h1>

      {participations.length === 0 ? (
        <p className="no-participations">
          Ви ще не приєднувались до жодної подорожі.
        </p>
      ) : (
        <ul className="participation-list">
          {participations.map((p) => {
            const group = p.travelGroup;
            const title = group?.title || "Подорож";
            const date =
              group?.startTime && group?.endTime
                ? `${new Date(group.startTime).toLocaleDateString()} — ${new Date(group.endTime).toLocaleDateString()}`
                : "Дата невідома";

            return (
              <li key={p.id} className="participation-card">
                <h2 className="card-title">{title}</h2>
                <p className="card-dates">{date}</p>
                <p className="card-status">
                  Статус: <strong>{p.status}</strong>
                </p>
                <button
                  className="card-button"
                  onClick={() => navigate(`/trips/${p.travelGroupId}`)}
                >
                  Перейти до подорожі
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyParticipationsPage;
