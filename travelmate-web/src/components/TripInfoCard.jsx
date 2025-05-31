import { CalendarDays, MapPin, Info, Users, Mountain } from "lucide-react";
import "./TripInfoCard.css";

function TripInfoCard({ title, description, startTime, endTime, status, difficulty, maxParticipants }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 0: return "trip-status-badge status-planned";
      case 1: return "trip-status-badge status-active";
      case 2: return "trip-status-badge status-completed";
      case 3: return "trip-status-badge status-cancelled";
      default: return "trip-status-badge";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return "Запланована";
      case 1: return "Активна";
      case 2: return "Завершена";
      case 3: return "Скасована";
      default: return "Невідомо";
    }
  };

  const getDifficultyLabel = (value) => {
    switch (value) {
      case 0: return "Легка";
      case 1: return "Середня";
      case 2: return "Важка";
      case 3: return "Екстремальна";
      default: return "Невідомо";
    }
  };

  return (
    <div className="trip-info-card">
      <h1 className="trip-title">
        <MapPin className="trip-icon" />
        {title}
      </h1>

      <p className="trip-description">
        <Info className="info-icon" />
        {description}
      </p>

      <p className="trip-dates">
        <CalendarDays className="calendar-icon" />
        {new Date(startTime).toLocaleDateString()} — {new Date(endTime).toLocaleDateString()}
      </p>

      <p className="trip-meta">
        <Users className="trip-meta-icon" />
        Максимум учасників: {maxParticipants}
      </p>

      <p className="trip-meta">
        <Mountain className="trip-meta-icon" />
        Екстремальність: {getDifficultyLabel(difficulty)}
      </p>

      <span className={getStatusClass(status)}>
        Статус: {getStatusLabel(status)}
      </span>
    </div>
  );
}

export default TripInfoCard;
