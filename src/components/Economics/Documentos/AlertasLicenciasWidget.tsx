import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAlertContext } from '../../../contexts/AlertContext';

// Define the alert interface
interface AlertaLicencia {
  id?: string;
  _id?: string;
  nombre: string;
  fechaExpiracion: string;
  fechaFinAlerta: string;
  descripcion?: string;
  tipo?: 'licencia';
  estado?: string;
  notas?: string;
}

interface AlertasLicenciasWidgetProps {
  isEditMode?: boolean;
  onRemove?: (id: string) => void;
}

const AlertasLicenciasWidget: React.FC<AlertasLicenciasWidgetProps> = ({ 
  isEditMode = false, 
  onRemove 
}) => {
  const { theme } = useTheme();
  const { alerts, loading, error, fetchAlerts } = useAlertContext();

  // Fetch alerts when component mounts
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Add a console log to debug the alerts from context
  useEffect(() => {
    fetchAlerts();
    console.log('Alerts from context:', alerts);
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = parseISO(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';
      return format(date, 'PPP', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return 'Error en fecha';
    }
  };

  // Function to determine alert severity based on days remaining
  const getSeverity = (fechaExpiracion: string): 'high' | 'medium' | 'low' => {
    try {
      if (!fechaExpiracion) return 'medium'; // Default if no date is provided
      
      const today = new Date();
      const expirationDate = parseISO(fechaExpiracion);
      
      // Check if the date is valid
      if (isNaN(expirationDate.getTime())) return 'medium';
      
      const daysRemaining = differenceInDays(expirationDate, today);
      
      if (daysRemaining <= 7) return 'high';
      if (daysRemaining <= 30) return 'medium';
      return 'low';
    } catch (error) {
      console.error('Error parsing date:', fechaExpiracion, error);
      return 'medium'; // Default to medium if there's an error
    }
  };

  // Function to get color classes based on severity and theme
  const getSeverityClasses = (severity: 'high' | 'medium' | 'low') => {
    if (theme === 'dark') {
      return {
        high: 'bg-red-900/20 border-red-800 text-red-300',
        medium: 'bg-yellow-900/20 border-yellow-800 text-yellow-300',
        low: 'bg-green-900/20 border-green-800 text-green-300'
      }[severity];
    }
    
    return {
      high: 'bg-red-100 border-red-300 text-red-800',
      medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      low: 'bg-green-100 border-green-300 text-green-800'
    }[severity];
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`relative p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="flex items-center justify-center h-40">
          <p>Cargando alertas de licencias...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`relative p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="flex items-center justify-center h-40">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (alerts.length === 0) {
    return (
      <div className={`relative p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
        <div className="flex flex-col items-center justify-center h-32">
          <AlertTriangle className="w-10 h-10 mb-2 opacity-50" />
          <p className="mb-3">No hay alertas de licencias activas</p>
          <button 
            onClick={() => fetchAlerts()} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  // Render alerts
  return (
    <div
      className={`relative p-6 rounded-lg shadow-lg transition-all ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'
      }`}
    >
      <div className="flex items-center mb-5">
        <AlertTriangle className="text-yellow-500 w-7 h-7 animate-pulse mr-3" />
        <h3 className="text-xl font-bold text-yellow-600">
          Alertas de Licencias
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar"
      >
        {alerts.map((alerta, index) => {
          const severity = getSeverity(alerta.fechaExpiracion);
          const severityClasses = getSeverityClasses(severity);
          
          return (
            <motion.div
              key={alerta.id || alerta._id || index}
              variants={itemVariants}
              className={`p-5 rounded-lg border-l-4 shadow-sm hover:shadow-lg transform hover:scale-102 transition-transform duration-500 ${severityClasses}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {severity === 'high' ? (
                    <AlertTriangle className="text-red-500 w-6 h-6" />
                  ) : severity === 'medium' ? (
                    <AlertTriangle className="text-yellow-500 w-6 h-6" />
                  ) : (
                    <AlertTriangle className="text-green-500 w-6 h-6" />
                  )}
                  <div>
                    <p className="text-lg font-medium">{alerta.nombre}</p>
                    <p className="text-sm">{alerta.descripcion || alerta.notas || ''}</p>
                    <div className="text-xs mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Expira: {formatDate(alerta.fechaExpiracion)}</span>
                      <span>•</span>
                      <span>Fin de alerta: {formatDate(alerta.fechaFinAlerta)}</span>              
                    </div>
                  </div>
                </div>
                {isEditMode && onRemove && (
                  <button
                    onClick={() => onRemove(alerta.id || alerta._id || '')}
                    className="ml-3 p-1 rounded-full bg-red-50 hover:bg-red-200 transition"
                  >
                    <RefreshCw className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-4 text-sm text-gray-500">
        Total de alertas: {alerts.length}
      </div>
    </div>
  );
};

export default AlertasLicenciasWidget;