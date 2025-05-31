import { useParams } from 'react-router-dom';
import EmergencyCall from '../components/EmergencyCall';

function TravelEmergencyPage() {
  const { id: travelGroupId } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Тривожний виклик</h2>
      <EmergencyCall travelGroupId={travelGroupId} />
    </div>
  );
}

export default TravelEmergencyPage;
