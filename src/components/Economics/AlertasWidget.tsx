import React, { useEffect, useState } from 'react';
import { AlertTriangle, Calendar, CheckCircle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface Alert {
  _id: string;
  nombre: string;
  tipo: string;
  fechaExpiracion: string;
  estado: string;
  contrato: string | null;
  trainer: Trainer;
  notas: string;
  fechaFinalizacion: string;
  createdAt: string;
  updatedAt: string;
}

interface AlertResponse {
  status: string;
  results: number;
  data: {
    alerts: Alert[];
  };
}

interface AlertasWidgetProps {
  isEditMode: boolean;
  onRemove?: (id: string) => void;
}

const AlertasWidget: React.FC<AlertasWidgetProps> = ({
  isEditMode,
  onRemove,
}) => {
  const { theme } = useTheme();
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/economic-alerts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener las alertas');
        }

        const data: AlertResponse = await response.json();
        // Filtrar alertas inválidas o sin trainer
        const validAlertas = data.data.alerts.filter(alert => 
          alert && typeof alert === 'object' && alert.trainer
        );
        setAlertas(validAlertas);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching alerts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  const getAlertStyles = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'finalizada':
        return 'bg-green-50 border-green-400 text-green-800';
      case 'pendiente':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
    }
  };

  const getIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activa':
        return <AlertTriangle className="text-yellow-500 w-6 h-6" />;
      case 'finalizada':
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case 'pendiente':
        return <Info className="text-blue-500 w-6 h-6" />;
      default:
        return <Info className="text-gray-500 w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className={`relative p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="flex items-center justify-center h-40">
          <p>Cargando alertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`relative p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg transition-all ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="flex items-center mb-5">
        <AlertTriangle className="text-yellow-500 w-7 h-7 animate-pulse mr-3" />
        <h3 className="text-xl font-bold text-yellow-600">
          Alertas Económicas
        </h3>
      </div>

      <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
        {alertas.filter(alerta => alerta && alerta.trainer).map((alerta) => (
          <div
            key={alerta._id}
            className={`p-5 rounded-lg border-l-4 shadow-sm hover:shadow-lg transform hover:scale-102 transition-transform duration-500 ${getAlertStyles(
              alerta.estado
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getIcon(alerta.estado)}
                <div>
                  <p className="text-lg font-medium">{alerta.nombre}</p>
                  <p className="text-sm">{alerta.notas}</p>
                  <div className="text-xs mt-1 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Expira: {new Date(alerta.fechaExpiracion).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Trainer: {alerta.trainer?.nombre || 'No asignado'}</span>
                  </div>
                </div>
              </div>
              {isEditMode && onRemove && (
                <button
                  onClick={() => onRemove(alerta._id)}
                  className="ml-3 p-1 rounded-full bg-red-50 hover:bg-red-200 transition"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total de alertas: {alertas.length}
      </div>
    </div>
  );
};

export default AlertasWidget;
