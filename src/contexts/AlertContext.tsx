import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AlertaLicencia {
  nombre: string;
  fechaExpiracion: string;
  fechaFinAlerta: string;
  descripcion?: string;
  tipo?: 'licencia';
  id?: string;
  _id?: string;
}

interface AlertContextType {
  alerts: AlertaLicencia[];
  addAlert: (alert: AlertaLicencia) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  fetchAlerts: () => Promise<void>;
  removeAlert?: (id: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertaLicencia[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts when the provider mounts
  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/economic-alerts', { headers });
      
      if (response.data.status === 'success') {
        // The API might be returning alerts in a nested structure
        // Check if alerts are in response.data.data.alerts
        const alertsData = response.data.data.alerts || response.data.data || [];
        
        // Ensure we're setting an array
        const validAlerts = Array.isArray(alertsData) ? alertsData : [];
        console.log('Alerts fetched successfully:', validAlerts);
        setAlerts(validAlerts);
      } else {
        setError('Error al cargar las alertas');
        // Initialize with empty array on error
        setAlerts([]);
      }
    } catch (err: any) {
      console.error('Error fetching alerts:', err);
      setError(err.message || 'Error al cargar las alertas');
      // Initialize with empty array on error
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const addAlert = async (alert: AlertaLicencia): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const payload = {
        nombre: alert.nombre,
        fechaExpiracion: alert.fechaExpiracion,
        fechaFinAlerta: alert.fechaFinAlerta,
        descripcion: alert.descripcion || ''
      };
      
      const response = await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/economic-alerts', payload, { headers });
      
      if (response.data.status === 'success') {
        // Add the new alert to the state with the ID from the response if available
        const newAlert = {
          ...alert,
          id: response.data.data?.id || `temp-${Date.now()}`
        };
        
        // Fix: Ensure prevAlerts is always treated as an array
        setAlerts(prevAlerts => {
          const prevAlertsArray = Array.isArray(prevAlerts) ? prevAlerts : [];
          return [...prevAlertsArray, newAlert];
        });
        
        return true;
      } else {
        setError('Error al crear la alerta');
        return false;
      }
    } catch (err: any) {
      console.error('Error creating alert:', err);
      setError(err.message || 'Error al crear la alerta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add a function to remove alerts if needed
  const removeAlert = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      const response = await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/economic-alerts/${id}`, { headers });
      
      if (response.data.status === 'success') {
        // Remove the alert from the state
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id && alert._id !== id));
        return true;
      } else {
        setError('Error al eliminar la alerta');
        return false;
      }
    } catch (err: any) {
      console.error('Error removing alert:', err);
      setError(err.message || 'Error al eliminar la alerta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    alerts,
    addAlert,
    loading,
    error,
    fetchAlerts,
    removeAlert
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
