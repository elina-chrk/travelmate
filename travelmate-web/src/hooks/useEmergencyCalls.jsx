import axiosInstance from '../api/axiosInstance';
import { useCallback } from 'react';

export function useEmergencyCalls() {
  // Створити новий тривожний виклик
  const createEmergencyCall = useCallback(async ({ travelGroupId, latitude, longitude, emergencyType, comment }) => {
    try {
      const response = await axiosInstance.post('/api/emergency-calls', {
        travelGroupId,
        latitude,
        longitude,
        emergencyType,
        comment,
      });
      return response.data;
    } catch (error) {
      console.error('Помилка при створенні тривожного виклику:', error);
      throw error;
    }
  }, []);

  // Отримати активний тривожний виклик для певної подорожі
  const getActiveEmergencyCall = useCallback(async (travelGroupId) => {
    try {
      const response = await axiosInstance.get(`/api/emergency-calls/active/${travelGroupId}`);
      return response.data;
    } catch (error) {
      console.error('Помилка при отриманні активного тривожного виклику:', error);
      throw error;
    }
  }, []);

  // Закрити тривожний виклик
  const resolveEmergencyCall = useCallback(async (callId) => {
    try {
      const response = await axiosInstance.post(`/api/emergency-calls/${callId}/resolve`);
      return response.data;
    } catch (error) {
      console.error('Помилка при закритті тривожного виклику:', error);
      throw error;
    }
  }, []);

  return {
    createEmergencyCall,
    getActiveEmergencyCall,
    resolveEmergencyCall,
  };
}
