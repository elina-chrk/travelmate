import { CalendarDays, MapPin, Info } from "lucide-react";

function TripInfoCard({ title, description, startTime, endTime }) {
  return (
    <div className="bg-white border border-purple-200 rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
      <h1 className="text-3xl font-bold text-purple-700 mb-2 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-purple-500" />
        {title}
      </h1>

      <p className="text-gray-700 mb-4 flex items-start gap-2">
        <Info className="w-5 h-5 mt-1 text-purple-400" />
        {description}
      </p>

      <p className="text-gray-600 flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-purple-500" />
        {new Date(startTime).toLocaleDateString()} — {new Date(endTime).toLocaleDateString()}
      </p>
    </div>
  );
}

export default TripInfoCard;
