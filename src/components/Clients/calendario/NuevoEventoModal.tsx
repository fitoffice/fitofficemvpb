import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, AlignLeft, Bell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Alert {
  type: 'email' | 'push' | 'sms' | 'popup';
  timeBeforeEvent: number;
}

interface NuevoEventoModalProps {
  onClose: () => void;
  onSave: (evento: any) => void;
  initialDate?: Date;
  initialEndDate?: Date;
  clientId?: string;
  trainerId?: string;
}

const TIPOS_EVENTO = [
  { id: 'TAREA_PROPIA', nombre: 'Tarea Propia', color: '#4F46E5' },
  { id: 'CITA_CON_CLIENTE', nombre: 'Cita con Cliente', color: '#059669' },
  { id: 'RUTINA_CLIENTE', nombre: 'Rutina de Cliente', color: '#DC2626' },
  { id: 'PAGO_CLIENTE', nombre: 'Pago de Cliente', color: '#7C3AED' },
  { id: 'ALARMA', nombre: 'Alarma', color: '#F59E0B' },
  { id: 'GENERAL', nombre: 'General', color: '#6B7280' }
];

const TIPOS_ALERTA = [
  { id: 'email', nombre: 'Email' },
  { id: 'push', nombre: 'Notificación Push' },
  { id: 'sms', nombre: 'SMS' },
  { id: 'popup', nombre: 'Popup' }
];

const TIEMPOS_ALERTA = [
  { value: 15, label: '15 minutos antes' },
  { value: 30, label: '30 minutos antes' },
  { value: 60, label: '1 hora antes' },
  { value: 120, label: '2 horas antes' },
  { value: 1440, label: '1 día antes' }
];

export default function NuevoEventoModal({ 
  onClose, 
  onSave, 
  initialDate,
  initialEndDate,
  clientId,
  trainerId
}: NuevoEventoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(format(initialDate || new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState(format(initialDate || new Date(), 'HH:mm'));
  const [endDate, setEndDate] = useState(format(initialEndDate || new Date(), 'yyyy-MM-dd'));
  const [endTime, setEndTime] = useState(format(initialEndDate || new Date(), 'HH:mm'));
  const [type, setType] = useState('GENERAL');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDate) {
      setStartDate(format(initialDate, 'yyyy-MM-dd'));
      setStartTime(format(initialDate, 'HH:mm'));
    }
    if (initialEndDate) {
      setEndDate(format(initialEndDate, 'yyyy-MM-dd'));
      setEndTime(format(initialEndDate, 'HH:mm'));
    }
  }, [initialDate, initialEndDate]);

  const handleAddAlert = () => {
    setAlerts([...alerts, { type: 'popup', timeBeforeEvent: 30 }]);
  };

  const handleRemoveAlert = (index: number) => {
    setAlerts(alerts.filter((_, i) => i !== index));
  };

  const handleUpdateAlert = (index: number, field: keyof Alert, value: string | number) => {
    const newAlerts = [...alerts];
    newAlerts[index] = { ...newAlerts[index], [field]: value };
    setAlerts(newAlerts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      // Datos para la API
      const eventData = {
        title,
        description,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        type,
        origin: clientId ? 'CLIENTE' : 'PROPIO',
        isWorkRelated: true,
        trainer: trainerId,
        client: clientId,
        alerts
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el evento');
      }

      const data = await response.json();
      
      // Formatear el evento para el calendario
      const eventoFormateado = {
        id: data.data.event._id,
        title: data.data.event.title,
        start: startDateTime,
        end: endDateTime,
        descripcion: description || type,
        color: TIPOS_EVENTO.find(t => t.id === type)?.color || '#4F46E5',
        categoria: type,
        subcategoria: '',
        cliente: clientId || 'N/A',
        ubicacion: 'Ubicación por Defecto',
        recordatorios: alerts.map(alert => `${alert.timeBeforeEvent} minutos antes`),
        notas: description || 'Sin notas'
      };

      onSave(eventoFormateado);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear el evento');
      console.error('Error al crear evento:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all animate-fadeIn">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Nuevo Evento
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200 hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                  required
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                  Tipo de Evento
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                >
                  {TIPOS_EVENTO.map(tipo => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-blue-500 transition-colors">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700/50 dark:border-gray-600 dark:text-white transition-all duration-200 hover:border-blue-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Alertas
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAlert}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-all duration-200 hover:scale-105"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Añadir Alerta
                  </button>
                </div>
                
                {alerts.map((alert, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-gray-100 dark:border-gray-600 hover:border-blue-500/50 transition-all duration-200">
                    <select
                      value={alert.type}
                      onChange={(e) => handleUpdateAlert(index, 'type', e.target.value as Alert['type'])}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    >
                      {TIPOS_ALERTA.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                    <select
                      value={alert.timeBeforeEvent}
                      onChange={(e) => handleUpdateAlert(index, 'timeBeforeEvent', parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all"
                    >
                      {TIEMPOS_ALERTA.map(tiempo => (
                        <option key={tiempo.value} value={tiempo.value}>{tiempo.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleRemoveAlert(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl border-2 border-red-100 dark:border-red-800/50">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl hover:from-blue-700 hover:to-blue-500 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}