import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Calendar as CalendarIcon, Mail, PlayCircle, CheckCircle, XCircle } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Button from '../Common/Button';

interface Props {
  onClose: () => void;
}

interface TipTemplate {
  id: string;
  titulo: string;
  contenido: string;
  categoria: string;
}

interface PlannedTip {
  id: string;
  templateId: string;
  fechaEnvio: string;
  estado: 'pendiente' | 'enviado' | 'fallido';
  mensaje?: string;
}

export function TipsPanel({ onClose }: Props) {
  const [config, setConfig] = useState({
    frecuencia: 'weekly',
    diasSemana: [] as string[],
    horaEnvio: '10:00',
    categoriasSeleccionadas: [] as string[],
    grupoObjetivo: 'all',
    asuntoPredeterminado: 'Consejos y Tips de la Semana 💪',
    trackearApertura: true,
    trackearClicks: true
  });

  const [plannedTips, setPlannedTips] = useState<PlannedTip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Ejemplo de categorías de consejos
  const categorias = [
    { id: 'nutricion', nombre: 'Nutrición', color: 'bg-green-100 text-green-800' },
    { id: 'ejercicio', nombre: 'Ejercicio', color: 'bg-blue-100 text-blue-800' },
    { id: 'bienestar', nombre: 'Bienestar', color: 'bg-purple-100 text-purple-800' },
    { id: 'motivacion', nombre: 'Motivación', color: 'bg-yellow-100 text-yellow-800' }
  ];

  // Ejemplo de plantillas de consejos
  const plantillasConsejos: TipTemplate[] = [
    {
      id: '1',
      titulo: 'Nutrición Saludable',
      contenido: 'Tips para una alimentación balanceada',
      categoria: 'nutricion'
    },
    {
      id: '2',
      titulo: 'Rutinas de Ejercicio',
      contenido: 'Ejercicios efectivos para hacer en casa',
      categoria: 'ejercicio'
    }
  ];

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const data = {
        tipo: 'consejos_periodicos',
        configuracion: {
          programacion: {
            frecuencia: config.frecuencia,
            diasSemana: config.diasSemana,
            horaEnvio: config.horaEnvio
          },
          contenido: {
            categorias: config.categoriasSeleccionadas,
            asuntoPredeterminado: config.asuntoPredeterminado
          },
          audiencia: {
            grupoObjetivo: config.grupoObjetivo
          },
          tracking: {
            apertura: config.trackearApertura,
            clicks: config.trackearClicks
          }
        }
      };

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la configuración');
      }

      onClose();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const loadPlannedTips = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      setIsLoading(true);
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/tips/planned', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar los consejos planificados');
      }

      const data = await response.json();
      setPlannedTips(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeTip = async (tipId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible');
        return;
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/tips/${tipId}/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al ejecutar el consejo');
      }

      // Actualizar el estado del consejo en la lista
      await loadPlannedTips();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para obtener los tips planificados para una fecha específica
  const getTipsForDate = (date: Date) => {
    return plannedTips.filter(tip => {
      const tipDate = new Date(tip.fechaEnvio);
      return tipDate.getDate() === date.getDate() &&
             tipDate.getMonth() === date.getMonth() &&
             tipDate.getFullYear() === date.getFullYear();
    });
  };

  // Función para formatear la fecha en el formato que espera la API
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadPlannedTips();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-amber-500" />
            <h2 className="text-xl font-semibold text-gray-900">
              Consejos Periódicos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Programación
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia
                  </label>
                  <select
                    value={config.frecuencia}
                    onChange={(e) => setConfig({...config, frecuencia: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="biweekly">Quincenal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                </div>

                {config.frecuencia === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Días de Envío
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((dia) => (
                        <button
                          key={dia}
                          onClick={() => {
                            const dias = config.diasSemana.includes(dia)
                              ? config.diasSemana.filter(d => d !== dia)
                              : [...config.diasSemana, dia];
                            setConfig({...config, diasSemana: dias});
                          }}
                          className={`w-8 h-8 rounded-full ${
                            config.diasSemana.includes(dia)
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {dia}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora de Envío
                  </label>
                  <input
                    type="time"
                    value={config.horaEnvio}
                    onChange={(e) => setConfig({...config, horaEnvio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Add the new Button component */}
                <Button
                  variant="create"
                  onClick={() => {
                    // Add your tip generation logic here
                    console.log('Generating tips...');
                  }}
                  className="w-full"
                >
                  Generar Consejos
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5 text-amber-500" />
                Configuración de Email
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto Predeterminado
                  </label>
                  <input
                    type="text"
                    value={config.asuntoPredeterminado}
                    onChange={(e) => setConfig({...config, asuntoPredeterminado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.trackearApertura}
                      onChange={(e) => setConfig({...config, trackearApertura: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Trackear aperturas</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.trackearClicks}
                      onChange={(e) => setConfig({...config, trackearClicks: e.target.checked})}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Trackear clicks</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-amber-500" />
                Categorías de Consejos
              </h3>
              <div className="space-y-3">
                {categorias.map((categoria) => (
                  <label
                    key={categoria.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={config.categoriasSeleccionadas.includes(categoria.id)}
                      onChange={(e) => {
                        const categorias = e.target.checked
                          ? [...config.categoriasSeleccionadas, categoria.id]
                          : config.categoriasSeleccionadas.filter(id => id !== categoria.id);
                        setConfig({...config, categoriasSeleccionadas: categorias});
                      }}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className={`ml-3 px-2 py-1 rounded-full text-sm ${categoria.color}`}>
                      {categoria.nombre}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Audiencia
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    checked={config.grupoObjetivo === 'all'}
                    onChange={() => setConfig({...config, grupoObjetivo: 'all'})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Todos los clientes</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    checked={config.grupoObjetivo === 'active'}
                    onChange={() => setConfig({...config, grupoObjetivo: 'active'})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Solo clientes activos</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    checked={config.grupoObjetivo === 'new'}
                    onChange={() => setConfig({...config, grupoObjetivo: 'new'})}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">Solo clientes nuevos (&lt; 30 días)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Nueva sección de Planificación y Ejecución con Calendario */}
          <div className="col-span-2 bg-gray-50 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-amber-500" />
              Planificación y Ejecución
            </h3>

            <div className="grid grid-cols-2 gap-6">
              {/* Columna del Calendario */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="calendar-container">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={({ date }) => {
                      const tipsForDate = getTipsForDate(date);
                      return tipsForDate.length > 0 ? (
                        <div className="dot-container">
                          <div className="h-2 w-2 bg-amber-500 rounded-full mx-auto mt-1" />
                        </div>
                      ) : null;
                    }}
                    className="w-full"
                  />
                </div>
                <style jsx>{`
                  .calendar-container {
                    width: 100%;
                  }
                  .calendar-container :global(.react-calendar) {
                    width: 100%;
                    border: none;
                    background: white;
                  }
                  .calendar-container :global(.react-calendar__tile--active) {
                    background: #f59e0b;
                    color: white;
                  }
                  .calendar-container :global(.react-calendar__tile--active:enabled:hover) {
                    background: #d97706;
                  }
                  .calendar-container :global(.react-calendar__tile--now) {
                    background: #fef3c7;
                  }
                  .dot-container {
                    position: relative;
                    height: 4px;
                  }
                `}</style>
              </div>

              {/* Columna de Tips Planificados */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Tips para {selectedDate.toLocaleDateString()}
                </h4>
                
                {isLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando consejos planificados...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getTipsForDate(selectedDate).length === 0 ? (
                      <p className="text-gray-600 text-center py-4">No hay consejos planificados para esta fecha</p>
                    ) : (
                      getTipsForDate(selectedDate).map((tip) => {
                        const template = plantillasConsejos.find(t => t.id === tip.templateId);
                        return (
                          <div key={tip.id} className="bg-white p-3 rounded-lg shadow-sm">
                            <div>
                              <h4 className="font-medium text-gray-900">{template?.titulo || 'Consejo sin título'}</h4>
                              <p className="text-sm text-gray-600">
                                Hora: {new Date(tip.fechaEnvio).toLocaleTimeString()}
                              </p>
                              {tip.mensaje && (
                                <p className="text-sm text-red-600 mt-1">{tip.mensaje}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {tip.estado === 'pendiente' && (
                                <button
                                  onClick={() => executeTip(tip.id)}
                                  className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                                >
                                  Ejecutar
                                </button>
                              )}
                              <span className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                                tip.estado === 'enviado' ? 'bg-green-100 text-green-800' :
                                tip.estado === 'fallido' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {tip.estado === 'enviado' ? <CheckCircle className="h-4 w-4" /> :
                                 tip.estado === 'fallido' ? <XCircle className="h-4 w-4" /> :
                                 <Clock className="h-4 w-4" />}
                                {tip.estado.charAt(0).toUpperCase() + tip.estado.slice(1)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  );
}
