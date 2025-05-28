import { useNavigate } from "react-router-dom";
import PurpleButton from "./PurpleButton";
import './TripCard.css';
import SecondaryButton from "./ui/SecondaryButton";

function TripCard({ trip }) {
  const navigate = useNavigate();

  return (
    <div className="trip-card">
      <h3 className="trip-title">{trip.title}</h3>
      <p className="trip-info">Опис: {trip.description}</p>
      <p className="trip-info">
        Дата: {new Date(trip.startTime).toLocaleDateString()} –{" "}
        {new Date(trip.endTime).toLocaleDateString()}
      </p>
      <p className="trip-info">Максимум учасників: {trip.maxParticipants}</p>
      <p className="trip-info">Статус: {trip.status || "невідомо"}</p>

      <div className="trip-actions">
        <SecondaryButton onClick={() => navigate(`/trips/${trip.id}`)}>
          Переглянути деталі
        </SecondaryButton>
        <SecondaryButton onClick={() => navigate("/my-participations")} className="bg-purple-500 hover:bg-purple-600">
          Мої участі
        </SecondaryButton>
      </div>
    </div>
  );
}

export default TripCard;
