import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';
import { 
  Calendar,
  CalendarDays,
  Layers,
  Plus,
  Pencil,
  Trash,
  ClipboardList,
  Search
} from 'lucide-react';
import ExerciseSelector from './ExerciseSelector';
import SesionEntrenamiento from './SesionEntrenamiento';

interface Exercise {
  _id: string;
  nombre: string;
  tipo: string;
  grupoMuscular: string[];
}

interface Set {
  reps: number;
  weight: number;
  rest: number;
  tempo: string;
  rpe: number;
  _id: string;
}

interface ExerciseWithSets {
  exercise: Exercise;
  sets: Set[];
  _id: string;
}

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas: number;
  exercises: ExerciseWithSets[];
}

interface Template {
  _id: string;
  nombre: string;
  descripcion: string;
  trainer: {
    _id: string;
    nombre: string;
    email: string;
  };
  totalWeeks: number;
  plan: Array<{
    weekNumber: number;
    days: Array<{
      dayNumber: number;
      sessions: Session[];
      _id: string;
    }>;
    _id: string;
  }>;
  isActive: boolean;
  difficulty: string;
  category: string;
  assignedClients: string[];
}

interface VistaComplejaProps {
  plantilla: any;
  semana: number;
  dia: number;
  selectedPeriod?: {
    start: number;
    end: number;
    color: string;
    name?: string;
  } | null;
  onPeriodSelect?: (period: any) => void;
  onPeriodUpdate?: (period: any) => void;
}

export const VistaCompleja: React.FC<VistaComplejaProps> = ({
  plantilla,
  semana,
  dia,
  selectedPeriod,
  onPeriodSelect,
  onPeriodUpdate
}) => {
  const { theme } = useTheme();
  const [diaSeleccionado, setDiaSeleccionado] = useState(dia);
  const [filtro, setFiltro] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState<'Normal' | 'Superset'>('Normal');
  const [sessionRounds, setSessionRounds] = useState<number>(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [showSesionEntrenamiento, setShowSesionEntrenamiento] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [editingStart, setEditingStart] = useState<number>(0);
  const [editingEnd, setEditingEnd] = useState<number>(0);
  const [exercisesData, setExercisesData] = useState<{[key: string]: Exercise}>({});

  // Estado local para los datos del ejercicio
  const [exerciseData, setExerciseData] = useState<{
    templateId: string;
    weekNumber: number;
    dayNumber: number;
    sessionId: string | null;
  }>({
    templateId: plantilla?._id || '',
    weekNumber: semana,
    dayNumber: diaSeleccionado,
    sessionId: null
  });

  // Define getSessions function before using it in useEffect
  const getSessions = (dia: number): Session[] => {
    console.log('VistaCompleja - Buscando sesiones para día:', dia);
    
    // First, check if we have a selected period and try to get sessions from there
    if (selectedPeriod?._id) {
      console.log('VistaCompleja - Buscando sesiones en el período seleccionado:', selectedPeriod.nombre);
      
      // Find the rango that matches the selected period
      const rango = plantilla?.rangos?.find(r => r._id === selectedPeriod._id);
      if (rango) {
        // Find the day in the rango
        const dayInRango = rango.days?.find(d => d.dayNumber === dia);
        if (dayInRango && dayInRango.sessions && dayInRango.sessions.length > 0) {
          console.log('VistaCompleja - Sesiones encontradas en el período para día ' + dia + ':', dayInRango.sessions);
          return dayInRango.sessions;
        }
      }
    }
    
    // If no sessions found in the period or no period selected, fall back to the plan structure
    if (!plantilla?.plan) {
      console.log('VistaCompleja - No hay plan disponible');
      return [];
    }
    
    const weekPlan = plantilla.plan.find(w => w.weekNumber === semana);
    if (!weekPlan) {
      console.log('VistaCompleja - No se encontró la semana:', semana);
      return [];
    }
    
    const dayPlan = weekPlan.days.find(d => d.dayNumber === dia);
    if (!dayPlan) {
      console.log('VistaCompleja - No se encontró el día:', dia);
      return [];
    }
    
    console.log('VistaCompleja - Sesiones encontradas en el plan para día ' + dia + ':', dayPlan.sessions);
    return dayPlan.sessions;
  };

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      if (!diaSeleccionado) return;
      
      const sessions = getSessions(diaSeleccionado);
      const exerciseIds = new Set<string>();
      
      // Collect all unique exercise IDs from all sessions
      sessions.forEach(session => {
        session.exercises?.forEach(ex => {
          if (typeof ex.exercise === 'string') {
            exerciseIds.add(ex.exercise);
          } else if (ex.exercise?._id) {
            exerciseIds.add(ex.exercise._id);
          }
        });
      });
      
      // Fetch details for each exercise ID
      const newExercisesData = { ...exercisesData };
      for (const exerciseId of exerciseIds) {
        // Skip if we already have this exercise's data
        if (newExercisesData[exerciseId]) continue;
        
        try {
          const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises/${exerciseId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.data) {
              newExercisesData[exerciseId] = result.data;
            }
          }
        } catch (error) {
          console.error(`Error fetching exercise ${exerciseId}:`, error);
        }
      }
      
      setExercisesData(newExercisesData);
    };
    
    fetchExerciseDetails();
  }, [diaSeleccionado, selectedPeriod, plantilla, semana, exercisesData]);

  // Actualizar datos cuando cambien las props o el día seleccionado
  useEffect(() => {
    if (plantilla?._id && semana && diaSeleccionado) {
      setExerciseData({
        templateId: plantilla._id,
        weekNumber: semana,
        dayNumber: diaSeleccionado,
        sessionId: selectedSessionId
      });
    }
  }, [plantilla?._id, semana, diaSeleccionado, selectedSessionId]);

  // Log de datos recibidos
  useEffect(() => {
    console.log('VistaCompleja - Datos actualizados:', {
      plantilla: {
        _id: plantilla?._id,
        nombre: plantilla?.nombre,
      },
      semana,
      dia,
      diaSeleccionado,
      exerciseData
    });
  }, [plantilla, semana, dia, diaSeleccionado, exerciseData]);

  const [selectedWeek, setSelectedWeek] = useState(semana);
  const [selectedDay, setSelectedDay] = useState(dia);
  useEffect(() => {
    console.log('VistaCompleja - Datos recibidos de PlantillaPage:', {
      plantilla: plantilla,
      plantillaId: plantilla?._id,
      plantillaNombre: plantilla?.nombre,
      semana,
      dia,
      diaSeleccionado,
      selectedPeriod,
      selectedPeriodId: selectedPeriod?._id,
      exerciseData
    });
  }, [plantilla, semana, dia, diaSeleccionado, selectedPeriod, exerciseData]);
  useEffect(() => {
    if (selectedPeriod) {
      // Cuando se selecciona un período, actualizamos la semana y día inicial
      setSelectedWeek(Math.floor((selectedPeriod.start - 1) / 7) + 1);
      setSelectedDay(selectedPeriod.start);
    }
  }, [selectedPeriod]);

  // Calcular el rango de días basado en el período seleccionado
  const getDiasDelPeriodo = () => {
    if (selectedPeriod) {
      // Crear un array con todos los días del período
      return Array.from(
        { length: selectedPeriod.end - selectedPeriod.start + 1 },
        (_, i) => selectedPeriod.start + i
      );
    }
    // Si no hay período seleccionado, mostrar los 7 días de la semana
    return Array.from({ length: 7 }, (_, i) => i + 1);
  };

  // Usar los días del período
  const dias = getDiasDelPeriodo();

  useEffect(() => {
    if (selectedPeriod) {
      setDiaSeleccionado(selectedPeriod.start);
    }
  }, [selectedPeriod]);

  const handleAddSession = async () => {
    console.log('VistaCompleja - Agregar sesión');
    
    // Check if we have all required data
    if (!plantilla?._id || !selectedPeriod?._id || !diaSeleccionado) {
      console.error('VistaCompleja - Faltan datos requeridos para crear sesión:', {
        templateId: plantilla?._id,
        rangoId: selectedPeriod?._id,
        dayNumber: diaSeleccionado
      });
      alert('No se puede crear la sesión: faltan datos necesarios');
      return;
    }
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Show the popup to get session details
      setShowSessionPopup(true);
    } catch (error) {
      console.error('VistaCompleja - Error al preparar la creación de sesión:', error);
      alert('Error al preparar la creación de sesión');
    }
  };

  const handleCreateSession = async () => {
    console.log('VistaCompleja - Crear sesión:', {
      sessionName,
      sessionType,
      sessionRounds
    });
    
    // Check if we have the template ID
    if (!plantilla?._id) {
      console.error('VistaCompleja - Falta ID de plantilla para crear sesión');
      alert('Error: No se pudo obtener el ID de la plantilla');
      return;
    }
    
    // Get the current week and day
    const currentWeek = Math.floor((diaSeleccionado - 1) / 7) + 1;
    const currentDayInWeek = ((diaSeleccionado - 1) % 7) + 1;
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Prepare request URL - use a different endpoint if no period is selected
      let url;
      if (selectedPeriod?._id) {
        // If we have a period ID, use the rangos endpoint
        url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${plantilla._id}/rangos/${selectedPeriod._id}/days/${diaSeleccionado}/sessions`;
      } else {
        // Otherwise, use the regular endpoint with week and day
        url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates/${plantilla._id}/weeks/${currentWeek}/days/${currentDayInWeek}/sessions`;
      }
      
      console.log('VistaCompleja - URL para crear sesión:', url);
      
      // Prepare request body
      const sessionData = {
        name: sessionName,
        tipo: sessionType,
        rondas: sessionType === 'Superset' ? sessionRounds : 1
      };
      
      // Send POST request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sessionData)
      });
      
      if (!response.ok) {
        throw new Error(`Error al crear la sesión: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('VistaCompleja - Sesión creada exitosamente:', data);
      
      // Close the popup and reset form
      setShowSessionPopup(false);
      setSessionName('');
      setSessionType('Normal');
      setSessionRounds(1);
      
      // Refresh the data (you might want to implement a more efficient way to update the UI)
      // For now, we'll just alert the user
      alert('Sesión creada exitosamente');
      
    } catch (error) {
      console.error('VistaCompleja - Error al crear la sesión:', error);
      alert(`Error al crear la sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };
  const handleAddExercise = (sessionId: string) => {
    console.log('VistaCompleja - Iniciando handleAddExercise:', {
      templateId: plantilla?._id,
      semana,
      diaSeleccionado,
      sessionId
    });

    if (!plantilla?._id || !semana || !diaSeleccionado || !sessionId) {
      console.error('VistaCompleja - Faltan datos requeridos:', {
        templateId: plantilla?._id,
        semana,
        diaSeleccionado,
        sessionId
      });
      return;
    }

    setSelectedSessionId(sessionId);
    setExerciseData({
      templateId: plantilla._id,
      weekNumber: semana,
      dayNumber: diaSeleccionado,
      sessionId: sessionId
    });
    setShowExerciseSelector(true);
  };

  const handleSelectExercise = (exerciseWithSets: ExerciseWithSets) => {
    console.log('VistaCompleja - Ejercicio seleccionado:', {
      exercise: exerciseWithSets,
      sessionId: selectedSessionId,
      templateId: plantilla?._id,
      weekNumber: semana,
      dayNumber: diaSeleccionado
    });
    
    // Close the exercise selector
    setShowExerciseSelector(false);
    
    // You might want to refresh the data here to show the newly added exercise
    // For now, we'll just show an alert
    alert(`Ejercicio "${exerciseWithSets.exercise.nombre}" añadido correctamente`);
  };
  const filteredSessions = (dia: number) => {
    const sessions = getSessions(dia);
    if (!filtro) return sessions;
    return sessions.filter(session =>
      session.name.toLowerCase().includes(filtro.toLowerCase()) ||
      session.exercises.some(ex => ex.exercise.nombre.toLowerCase().includes(filtro.toLowerCase()))
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('VistaCompleja - Eliminar sesión:', sessionId);
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const openDeleteModal = (sessionId: string) => {
    console.log('VistaCompleja - Abrir modal de eliminación:', sessionId);
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  const handleShowSesionEntrenamiento = (session: Session) => {
    console.log('VistaCompleja - Mostrar SesionEntrenamiento:', session);
    setShowSesionEntrenamiento(true);
    setSelectedSession(session);
  };

  const handleEditDurationStart = () => {
    if (selectedPeriod) {
      setEditingStart(selectedPeriod.start);
      setEditingEnd(selectedPeriod.end);
      setIsEditingDuration(true);
    }
  };

  const handleDurationSave = () => {
    if (selectedPeriod && onPeriodUpdate && editingStart <= editingEnd) {
      onPeriodUpdate({
        ...selectedPeriod,
        start: editingStart,
        end: editingEnd
      });
      setIsEditingDuration(false);
    }
  };

  // Array de colores para los diferentes períodos - sincronizado con PlantillaPageCalendario
  const periodColors = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  ];

  return (
    <div className="space-y-6 mt-10">  {/* Aumentado de mt-6 a mt-10 para más margen superior */}
      {selectedPeriod && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl"
          style={{ background: selectedPeriod.color || periodColors[0] }}
        >
          <div className="relative p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedPeriod.name || `Período ${Math.floor((selectedPeriod.start - 1) / 7) + 1}`}
                  </h3>
                  <p className="text-white/90">
                    Semanas {Math.floor((selectedPeriod.start - 1) / 7) + 1} - {Math.floor((selectedPeriod.end - 1) / 7) + 1}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <span className="text-white">
                    Días {selectedPeriod.start} - {selectedPeriod.end}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                  title="Editar nombre"
                >
                  <Pencil className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleEditDurationStart}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                  title="Editar duración"
                >
                  <Calendar className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal de edición de nombre */}
          {isEditingName && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Editar Nombre del Período
                </h3>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                  placeholder="Nombre del período"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setEditingName('');
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      if (onPeriodUpdate) {
                        onPeriodUpdate({
                          ...selectedPeriod,
                          name: editingName.trim() || `Período ${Math.floor((selectedPeriod.start - 1) / 7) + 1}`
                        });
                      }
                      setIsEditingName(false);
                      setEditingName('');
                    }}
                    className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white"
                  >
                    Guardar
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Modal de edición de duración */}
          {isEditingDuration && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Editar Duración del Período
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Día de inicio
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={editingStart}
                      onChange={(e) => setEditingStart(Math.max(1, Math.min(365, parseInt(e.target.value) || 1)))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Semana {Math.floor((editingStart - 1) / 7) + 1}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Día de fin
                    </label>
                    <input
                      type="number"
                      min={editingStart}
                      max="365"
                      value={editingEnd}
                      onChange={(e) => setEditingEnd(Math.max(editingStart, Math.min(365, parseInt(e.target.value) || editingStart)))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Semana {Math.floor((editingEnd - 1) / 7) + 1}
                    </p>
                  </div>

                  {editingStart > editingEnd && (
                    <p className="text-sm text-red-500">
                      El día de inicio debe ser menor o igual al día de fin
                    </p>
                  )}

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setIsEditingDuration(false)}
                      className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDurationSave}
                      disabled={editingStart > editingEnd}
                      className={`px-4 py-2 rounded-lg text-white ${
                        editingStart > editingEnd
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-violet-500 hover:bg-violet-600'
                      }`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}

      {/* Selector de días */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Días del Período
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {dias.map((diaNum) => {
            const semanaDelDia = Math.floor((diaNum - 1) / 7) + 1;
            const isSelected = diaSeleccionado === diaNum;
            
            return (
              <motion.div
                key={diaNum}
                onClick={() => setDiaSeleccionado(diaNum)}
                className={`
                  relative cursor-pointer group
                  ${isSelected ? 'z-10' : 'hover:z-10'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-200
                  ${isSelected 
                    ? 'bg-violet-500 shadow-lg shadow-violet-500/30'
                    : 'bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md dark:shadow-none'
                  }
                `} />
                <div className={`
                  relative p-3 rounded-xl border-2 transition-all duration-200
                  ${isSelected
                    ? 'border-violet-400'
                    : 'border-transparent group-hover:border-violet-200 dark:group-hover:border-violet-700'
                  }
                `}>
                  <div className="text-center">
                    <div className={`
                      text-2xl font-bold mb-1
                      ${isSelected ? 'text-white' : 'text-gray-700 dark:text-gray-200'}
                    `}>
                      {diaNum}
                    </div>
                    <div className={`
                      text-sm font-medium
                      ${isSelected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}
                    `}>
                      Día {diaNum}
                    </div>
                    <div className={`
                      text-xs
                      ${isSelected ? 'text-white/80' : 'text-gray-500 dark:text-gray-500'}
                    `}>
                      Semana {semanaDelDia}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Contenido del día seleccionado */}
      {diaSeleccionado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Sesiones del Día {diaSeleccionado}
            </h2>
            <Button
              variant="create"
              onClick={() => handleAddSession(diaSeleccionado)}
              className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white"
            >
              <Plus className="w-5 h-5" />
              Añadir Sesión
            </Button>
          </div>

          <div className="grid gap-4">
    {getSessions(diaSeleccionado).map((session) => (
      <motion.div
        key={session._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 dark:shadow-none"
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
                {session.name || `Sesión ${session.order}`}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.exercises?.length || 0} ejercicios
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => handleAddExercise(session._id)}
                className="flex items-center gap-1 bg-violet-500 hover:bg-violet-600 text-white"
              >
                <Plus className="w-4 h-4" />
                Añadir ejercicio
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleEditSession(session)}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <Pencil className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteSession(session._id)}
                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400"
              >
                <Trash className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
          
          {/* Exercise list */}
          {session.exercises && session.exercises.length > 0 && (
            <div className="mt-4 space-y-3">
              {session.exercises.map((exerciseItem) => {
                // Get the exercise ID (handle both string and object formats)
                const exerciseId = typeof exerciseItem.exercise === 'string' 
                  ? exerciseItem.exercise 
                  : exerciseItem.exercise?._id;
                
                // Get exercise details from our cached data
                const exerciseDetails = exerciseId ? exercisesData[exerciseId] : null;
                
                return (
                  <div 
                    key={exerciseItem._id} 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {exerciseDetails ? (
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-white">
                            {exerciseDetails.nombre}
                          </h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exerciseDetails.grupoMuscular.map((grupo, idx) => (
                              <span 
                                key={`${exerciseItem._id}-${idx}`}
                                className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {grupo}
                              </span>
                            ))}
                          </div>
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {exerciseItem.sets && exerciseItem.sets.length > 0 && (
                              <div className="flex items-center gap-3">
                                <span>{exerciseItem.sets.length} series</span>
                                <span>•</span>
                                <span>{exerciseItem.sets[0].reps} reps</span>
                                <span>•</span>
                                <span>{exerciseItem.sets[0].weight} kg</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={() => {/* TODO: Implement edit exercise */}}
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500"
                        >
                          <Pencil className="w-3 h-3" />
                          Editar
                        </Button>
                      </div>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400">
                        Cargando ejercicio...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>        </motion.div>
      )}

      {/* Modales y popups */}
      {showSessionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Sesión</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nombre de la sesión</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => {
                  console.log('VistaCompleja - Nombre de sesión:', e.target.value);
                  setSessionName(e.target.value);
                }}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre de la sesión"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de sesión</label>
              <select
                value={sessionType}
                onChange={(e) => {
                  console.log('VistaCompleja - Tipo de sesión:', e.target.value);
                  setSessionType(e.target.value as 'Normal' | 'Superset');
                }}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Normal">Normal</option>
                <option value="Superset">Superset</option>
              </select>
            </div>

            {sessionType === 'Superset' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Número de rondas</label>
                <input
                  type="number"
                  value={sessionRounds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1) {
                      console.log('VistaCompleja - Número de rondas:', value);
                      setSessionRounds(value);
                    }
                  }}
                  min="1"
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  console.log('VistaCompleja - Cancelar creación de sesión');
                  setShowSessionPopup(false);
                }}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSession}
                disabled={!sessionName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg`}>
            <h3 className="text-lg font-semibold mb-4">¿Estás seguro de que deseas eliminar esta sesión?</h3>
            <p className="mb-4">Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  console.log('VistaCompleja - Cancelar eliminación de sesión');
                  setIsDeleteModalOpen(false);
                }}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
            {showExerciseSelector && (
   <ExerciseSelector
   isOpen={showExerciseSelector}
   onClose={() => setShowExerciseSelector(false)}
   onSelectExercise={handleSelectExercise}
   templateId={plantilla._id}
   weekNumber={semana}
   dayNumber={diaSeleccionado}
   sessionId={selectedSessionId || ''}
   rangoId={selectedPeriod?._id}
/>      )}
    </div>
  );
};

export default VistaCompleja;
