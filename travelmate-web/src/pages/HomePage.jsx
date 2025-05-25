import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function HomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/travel-groups")
      .then((response) => {
        setTrips(response.data || []);
      })
      .catch((error) => {
        console.error("Не вдалося отримати список подорожей", error);
      });
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Усі подорожі</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/create-trip")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Створити нову подорож
          </button>
          <button
  onClick={() => navigate("/profile")}
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>
  Профіль
</button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Вийти
          </button>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Список подорожей:</h2>
      <ul className="space-y-3">
        {trips.length === 0 ? (
          <li>Наразі немає подорожей.</li>
        ) : (
          trips.map((trip) => (
            <li
              key={trip.id}
              className="border border-gray-300 rounded p-3 hover:shadow-md"
            >
              <h3 className="font-bold text-lg">{trip.title}</h3>
              <p>Опис: {trip.description}</p>
              <p>
                Дата: {new Date(trip.startTime).toLocaleDateString()} –{" "}
                {new Date(trip.endTime).toLocaleDateString()}
              </p>
              <p>Максимум учасників: {trip.maxParticipants}</p>
              <p>Статус: {trip.status ? trip.status : "невідомо"}</p>
              <button
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="text-blue-600 hover:underline mt-2"
              >
                Переглянути деталі
              </button>
              <button
                onClick={() => navigate("/my-participations")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Мої участі
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default HomePage;
