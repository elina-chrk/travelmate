import { CalendarDays, MapPin, Info } from "lucide-react";
import "./TripInfoCard.css";

function TripInfoCard({ title, description, startTime, endTime }) {
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
    </div>
  );
}

export default TripInfoCard;
