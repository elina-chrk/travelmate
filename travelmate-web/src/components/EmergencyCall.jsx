import React, { useEffect, useState } from 'react';
import { useEmergencyCalls } from '../hooks/useEmergencyCalls';
import { AlertTriangle, CheckCircle, MapPin } from 'lucide-react';
import './EmergencyCall.css';

function EmergencyCall({ travelGroupId }) {
  const { createEmergencyCall, getActiveEmergencyCall, resolveEmergencyCall } = useEmergencyCalls();
  const [activeCall, setActiveCall] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const call = await getActiveEmergencyCall(travelGroupId);
        console.log('Отриманий активний виклик:', call);
        setActiveCall(call);
      } catch (err) {
        console.error(err);
        setError('Не вдалося отримати активний виклик');
      } finally {
        setLoading(false);
      }
    };

    if (travelGroupId) {
      fetchActiveCall();
    }
  }, [travelGroupId, getActiveEmergencyCall]);

  const handleCreateCall = async () => {
    setLoading(true);
    setError(null);
    try {
      const latitude = 50.4501;
      const longitude = 30.5234;

      const newCall = await createEmergencyCall({
        travelGroupId,
        latitude,
        longitude,
        emergencyType: 'Медична допомога',
        comment: 'Потрібна термінова допомога!',
      });
      console.log('Створено виклик:', newCall);
      setActiveCall(newCall);
    } catch (err) {
      console.error(err);
      setError('Не вдалося створити тривожний виклик');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCall = async () => {
    if (!activeCall || !activeCall.id) {
      console.error('Відсутній ID виклику!');
      setError('Відсутній ID виклику для закриття.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await resolveEmergencyCall(activeCall.id);
      console.log('Виклик закрито');
      setActiveCall(null);
    } catch (err) {
      console.error(err);
      setError('Не вдалося закрити тривожний виклик');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emergency-wrapper">
      <div className="emergency-container">
        {loading && <p className="loading-text">Завантаження...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !activeCall && (
          <button
            className="create-button"
            onClick={handleCreateCall}
          >
            <AlertTriangle size={20} /> Створити тривожний виклик
          </button>
        )}

        {!loading && activeCall && (
          <div className="active-call">
            <div className="active-title">
              <AlertTriangle size={20} color="#dc2626" />
              <span>Активний тривожний виклик:</span>
            </div>
            <p><b>Тип:</b> {activeCall.emergencyType}</p>
            <p className="call-comment">{activeCall.comment}</p>
            <div className="call-location">
              <MapPin size={16} />
              <span>{activeCall.latitude}, {activeCall.longitude}</span>
            </div>
            <button
              className="resolve-button"
              onClick={handleResolveCall}
            >
              <CheckCircle size={18} /> Закрити виклик
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmergencyCall;
