import React, { useEffect, useState } from 'react';
import { useEmergencyCalls } from '../hooks/useEmergencyCalls';

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
        setActiveCall(call);
      } catch (err) {
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
      // Можна тут замінити на реальні координати через Geolocation API
      const latitude = 50.4501; 
      const longitude = 30.5234;

      const newCall = await createEmergencyCall({
        travelGroupId,
        latitude,
        longitude,
        emergencyType: 'Медична допомога',
        comment: 'Потрібна термінова допомога',
      });
      setActiveCall(newCall);
    } catch (err) {
      setError('Не вдалося створити тривожний виклик');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveCall = async () => {
    if (!activeCall) return;
    setLoading(true);
    setError(null);
    try {
      await resolveEmergencyCall(activeCall.id);
      setActiveCall(null);
    } catch (err) {
      setError('Не вдалося закрити тривожний виклик');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      {loading && <p>Завантаження...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !activeCall && (
        <button
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
          }}
          onClick={handleCreateCall}
        >
          🚨 Створити тривожний виклик
        </button>
      )}

      {!loading && activeCall && (
        <div>
          <p><b>Активний тривожний виклик:</b> {activeCall.emergencyType}</p>
          <p><i>{activeCall.comment}</i></p>
          <button
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              position: 'absolute',
              top: '10px',
              right: '10px',
            }}
            onClick={handleResolveCall}
          >
            Закрити виклик
          </button>
        </div>
      )}
    </div>
  );
}

export default EmergencyCall;
