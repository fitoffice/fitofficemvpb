import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from './src/contexts/ThemeContext';
import { Library, Clock, Dumbbell, Target, Plus, Star, X } from 'lucide-react';
import Button from './src/components/Common/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface VistaRutinasPredefinidasProps {
  planSemanal: any;
  updatePlan: (plan: any) => void;
  planning?: {
    plan: Array<{
      weekNumber: number;
      days: {
        [key: string]: {
          day: string;
          fecha: string;
          sessions: any[];
        };
      };
    }>;
  };
  semanaActual: number;
  onReload?: () => void;
  planningId?: string; // Añadida la propiedad planningId
}


interface Metric {
  type: string;
  value: string;
  _id: string;
}

interface Exercise {
  name: string;
  metrics: Metric[];
  notes: string;
  _id: string;
}

interface Routine {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const getStockImage = (index: number): string => {
  const stockImages = [
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1591258370814-01609b341790?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  ];
  return stockImages[index % stockImages.length];
};

const VistaRutinasPredefinidas: React.FC<VistaRutinasPredefinidasProps> = ({ 
  planSemanal, 
  updatePlan, 
  planning, 
  semanaActual,
  onReload,
  planningId // Añadido el parámetro planningId
}) => {  const { theme } = useTheme();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(semanaActual);
  const [selectedDay, setSelectedDay] = useState<string>('Lunes');

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/routines', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setRoutines(response.data.data);
      } else {
        throw new Error('Error al obtener las rutinas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las rutinas');
      console.error('Error fetching routines:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  const handleAddRoutine = (routine: Routine) => {
    console.log('🔵 Iniciando proceso de agregar rutina:', {
      routineId: routine._id,
      routineName: routine.name,
      exercises: routine.exercises.length
    });
    setSelectedRoutine(routine);
    setShowPopup(true);
  };

  const handleConfirmAdd = async () => {
    if (selectedRoutine && updatePlan && planSemanal) {
      console.log('🟢 Confirmando adición de rutina:', {
        routineId: selectedRoutine._id,
        routineName: selectedRoutine.name,
        selectedWeek,
        selectedDay,
        currentPlanSessions: planSemanal[selectedDay]?.sessions?.length || 0,
        planningId: planningId // Log del planningId recibido
      });

      try {
        // Obtener el token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        if (!planningId) {
          throw new Error('No se proporcionó un ID de planificación válido');
        }

        // Realizar la petición POST al endpoint para copiar la rutina usando el planningId recibido como prop
        const response = await axios.post(
          `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${selectedWeek}/days/${selectedDay}/copy-routine`,
          {
            routineId: selectedRoutine._id
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('🟢 Respuesta del servidor:', response.data);

        // Si la petición fue exitosa, actualizar el plan local
        if (response.status === 200 || response.status === 201) {
          // Recargar el plan actualizado o actualizar el estado local
          if (onReload) {
            console.log('🔄 Recargando datos del planning...');
            onReload();
          } else {
            // Actualización local (fallback)
            const updatedPlan = { ...planSemanal };
            if (!updatedPlan[selectedDay]) {
              updatedPlan[selectedDay] = { sessions: [] };
            }
            if (!updatedPlan[selectedDay].sessions) {
              updatedPlan[selectedDay].sessions = [];
            }
            
            // Añadir la rutina formateada al plan local (como fallback)
            const formattedRoutine = {
              _id: response.data.session?._id || selectedRoutine._id,
              name: selectedRoutine.name,
              tipo: 'Normal',
              exercises: selectedRoutine.exercises.map(exercise => ({
                _id: exercise._id,
                exercise: {
                  _id: exercise._id,
                  nombre: exercise.name,
                  grupoMuscular: [],
                  descripcion: exercise.notes || '',
                  equipo: [],
                  imgUrl: ''
                },
                sets: (exercise.metrics || []).map(metric => ({
                  _id: metric._id,
                  reps: metric.type === 'Repeticiones' ? parseInt(metric.value) : 0,
                  weight: metric.type === 'Peso' ? parseInt(metric.value) : 0,
                  rest: metric.type === 'Descanso' ? parseFloat(metric.value) : 0,
                  renderConfig: {
                    campo1: 'reps',
                    campo2: 'weight',
                    campo3: 'rest'
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })),
                createdAt: exercise.createdAt || new Date().toISOString(),
                updatedAt: exercise.updatedAt || new Date().toISOString()
              })),
              createdAt: selectedRoutine.createdAt,
              updatedAt: selectedRoutine.updatedAt
            };
            
            updatedPlan[selectedDay].sessions.push(formattedRoutine);
            updatePlan(updatedPlan);
          }
        }
      } catch (error) {
        console.error('❌ Error al copiar la rutina:', error);
        // Mostrar mensaje de error al usuario
        alert('Error al añadir la rutina. Por favor, inténtalo de nuevo.');
      }
      
      // Cerrar el popup independientemente del resultado
      setShowPopup(false);
      setSelectedRoutine(null);
    } else {
      console.warn('❌ No se pudo agregar la rutina:', {
        hasSelectedRoutine: !!selectedRoutine,
        hasUpdatePlan: !!updatePlan,
        hasPlanSemanal: !!planSemanal,
        hasPlanningId: !!planningId
      });
    }
  };
  if (loading) {
    return <div className="text-center p-8">Cargando rutinas...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className={`p-6 rounded-xl shadow-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Library className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Rutinas Predefinidas</h2>
          </div>
          <div className="flex space-x-4">
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todas las categorías</option>
              <option value="fuerza">Fuerza</option>
              <option value="hipertrofia">Hipertrofia</option>
              <option value="cardio">Cardio</option>
            </select>
            <select
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <option value="">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map((routine, index) => (
            <motion.div
              key={routine._id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl overflow-hidden shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${getStockImage(index)})` }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{routine.name}</h3>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {routine.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {routine.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5 text-gray-500" />
                    <span className="text-sm">{routine.exercises.length} ejercicios</span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex items-center space-x-1"
                    onClick={() => handleAddRoutine(routine)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Popup para seleccionar semana y día */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className={`relative p-6 rounded-xl shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } w-full max-w-md`}
            >
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-xl font-bold mb-4">Agregar Rutina al Plan</h3>
              <p className="mb-4">Selecciona la semana y el día para agregar la rutina: {selectedRoutine?.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Semana</label>
                  <select
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {planning?.plan.map((week) => (
                      <option key={week.weekNumber} value={week.weekNumber}>
                        Semana {week.weekNumber}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Día</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {planning?.plan[selectedWeek - 1]?.days && 
                      Object.entries(planning.plan[selectedWeek - 1].days).map(([dayName, dayData]) => (
                        <option key={dayName} value={dayName}>
                          {dayName}
                        </option>
                      ))
                    }
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPopup(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirmAdd}
                  >
                    Confirmar
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VistaRutinasPredefinidas;