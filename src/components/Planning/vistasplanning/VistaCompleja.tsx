// src/components/VistaCompleja.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Plus, Calendar, AlertCircle, XCircle, Search, Trash2 } from 'lucide-react';
import Button from '../../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import SesionEntrenamiento from '../SesionEntrenamiento';
import { trainingVariants, Set } from '../trainingVariants';
import axios from 'axios';

interface Exercise {
  _id: string;
  name: string;
  sets: Set[];
}

// Add interface for fetched exercise data
interface ExerciseData {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
}

interface Session {
  _id?: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  rondas?: number;
  exercises: Exercise[];
}


interface DayPlan {
  id: string;
  sessions: Session[];
}

interface WeekPlan {
  [key: string]: DayPlan;
}

interface VistaComplejaProps {
  semanaActual: number;
  planSemanal: WeekPlan;
  updatePlan: (plan: WeekPlan) => void;
  onReload?: () => void;
  planningId: string;
  weekId?: string; // Add weekId prop
}

const VistaCompleja: React.FC<VistaComplejaProps> = ({
  semanaActual,
  planSemanal,
  updatePlan,
  onReload,
  planningId,
  weekId, // Add weekId parameter
}) => {
  console.log('VistaCompleja - weekId recibido:', weekId, 'tipo:', typeof weekId);
  console.log('VistaCompleja - semanaActual:', semanaActual, 'tipo:', typeof semanaActual);

  const { theme } = useTheme();
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lunes');
  const [filtro, setFiltro] = useState('');
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<0 | 1 | 2 | 3>(0);
  const [exerciseData, setExerciseData] = useState<Record<string, ExerciseData>>({});
  const [planningExercises, setPlanningExercises] = useState<ExerciseData[]>([]);

  const [showSessionPopup, setShowSessionPopup] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState<'Normal' | 'Superset'>('Normal');
  const [sessionRounds, setSessionRounds] = useState<number | undefined>(undefined);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const dias = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  useEffect(() => {
    const handleAddSessionEvent = () => {
      setShowSessionPopup(true);
    };

    window.addEventListener('addSession', handleAddSessionEvent as EventListener);

    return () => {
      window.removeEventListener('addSession', handleAddSessionEvent as EventListener);
    };
  }, []);
  const fetchPlanningExercises = async () => {
    console.log('🔄 Fetching planning exercises with planningId:', planningId);
    if (!planningId) {
      console.error('❌ No planningId provided to fetch exercises');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      console.log('🔑 Token found, making API request...');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/exercises`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`❌ Error response: ${response.status}`);
        throw new Error(`Error fetching planning exercises: ${response.status}`);
      }

      const data = await response.json();
      console.log('📋 Planning exercises data received:', data);
      
      if (data.ejercicios && Array.isArray(data.ejercicios)) {
        console.log(`✅ Found ${data.ejercicios.length} exercises in planning`);
        setPlanningExercises(data.ejercicios);
        
        // Create a map of exercise data by ID for quick lookup
        const exerciseMap: Record<string, ExerciseData> = {};
        data.ejercicios.forEach((exercise: ExerciseData) => {
          exerciseMap[exercise._id] = exercise;
          console.log(`📌 Added exercise to map: ${exercise.nombre} (${exercise._id})`);
        });
        
        setExerciseData(prevData => ({
          ...prevData,
          ...exerciseMap
        }));
      } else {
        console.error('❌ No exercises array found in response:', data);
      }
    } catch (error) {
      console.error('Error fetching planning exercises:', error);
    }
  };
  useEffect(() => {
    if (planningId) {
      console.log('🔄 PlanningId changed, fetching exercises...');
      fetchPlanningExercises();
    }
  }, [planningId]);
  const getExerciseName = (exerciseId: string): string => {
    console.log('🔍 Getting name for exercise ID:', exerciseId);
    
    // Check if we have it in our exerciseData state
    if (exerciseData[exerciseId]?.nombre) {
      console.log('✅ Found name in exerciseData:', exerciseData[exerciseId].nombre);
      return exerciseData[exerciseId].nombre;
    }
    
    // Check if we can find it in planningExercises
    const planningExercise = planningExercises.find(pe => pe._id === exerciseId);
    if (planningExercise?.nombre) {
      console.log('✅ Found name in planningExercises:', planningExercise.nombre);
      return planningExercise.nombre;
    }
    
    console.log('❌ Could not find exercise name, returning "Cargando..."');
    // Default fallback
    return 'Cargando...';
  };

  const handleAddSession = async (dia: string) => {
    console.log('🚀 Iniciando creación de sesión para el día:', dia);
    setShowSessionPopup(true);
  };

  const handleCreateSession = async () => {
    try {
      if (!sessionName.trim()) {
        console.warn('VistaCompleja: Nombre de sesión vacío');
        return;
      }

      console.log('🚀 Creating session with data:');
      console.log('Planning ID:', planningId);
      console.log('Week Number:', semanaActual);
      console.log('Selected Day:', diaSeleccionado);
      console.log('Session Name:', sessionName);
      console.log('Session Type:', sessionType);
      console.log('Session Rounds:', sessionRounds);

      const sessionData = {
        planningId: planningId,
        weekNumber: semanaActual,
        day: diaSeleccionado,
        sessionData: {
          name: sessionName,
          tipo: sessionType,
          rondas: sessionRounds
        }
      };

      console.log('📦 Complete session data being sent:', sessionData);

      const response = await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/session', sessionData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Server response:', response.data);

      if (response.data) {
        setShowSessionPopup(false);
        setSessionName('');
        setSessionType('Normal');
        setSessionRounds(undefined);
        
        // Refresh the planning data if onReload is provided
        if (onReload) {
          onReload();
        }
      }
    } catch (error) {
      console.error('❌ Error creating session:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  // Función para manejar la adición de un ejercicio
  const handleAddExercise = (dia: string, sessionId: string) => {
    console.log('Añadiendo ejercicio a la sesión:', sessionId);
    setShowExerciseSelector(true);
    setSelectedSessionId(sessionId);
  };

  // Función para manejar la selección de un ejercicio desde el selector
  const handleSelectExercise = (exercise: any) => {
    console.log('VistaCompleja: Ejercicio seleccionado:', exercise);
    if (!selectedSessionId) {
      console.warn('VistaCompleja: No hay sesión seleccionada');
      return;
    }

    const updatedPlan = { ...planSemanal };
    const dayPlan = updatedPlan[diaSeleccionado];
    const sessionIndex = dayPlan.sessions.findIndex(
      (session) => session._id === selectedSessionId
    );

    if (sessionIndex === -1) {
      console.error('VistaCompleja: No se encontró la sesión:', selectedSessionId);
      return;
    }

    // Verificar si el ejercicio ya existe en la sesión
    const exerciseExists = dayPlan.sessions[sessionIndex].exercises.some(
      (e) => e._id === exercise._id
    );

    if (exerciseExists) {
      console.warn('VistaCompleja: El ejercicio ya existe en esta sesión');
      return;
    }

    const newExercise = {
      _id: exercise._id,
      name: exercise.nombre || getExerciseName(exercise._id), // Use getExerciseName as fallback
      sets: [{
        id: Date.now().toString(),
        reps: 12,
        weight: 10,
        rest: 60
      }]
    };

    console.log('VistaCompleja: Nuevo ejercicio a agregar:', newExercise);
    dayPlan.sessions[sessionIndex].exercises.push(newExercise);
    console.log('VistaCompleja: Sesión actualizada:', dayPlan.sessions[sessionIndex]);

    updatePlan(updatedPlan);
    setShowExerciseSelector(false);
  };


  // Función para filtrar las sesiones según el criterio
  const filteredSessions = (dia: string) => {
    if (!filtro) return planSemanal[dia].sessions;
    return planSemanal[dia].sessions.filter(
      (session) =>
        session.name.toLowerCase().includes(filtro.toLowerCase()) ||
        session.exercises.some((exercise) =>
          exercise.name.toLowerCase().includes(filtro.toLowerCase())
        )
    );
  };

    // Add this useEffect to listen for the sessionDeleted event
  // Add this useEffect to listen for the sessionDeleted event
  useEffect(() => {
    const handleSessionDeleted = (event: CustomEvent) => {
      console.log('Session deleted event received:', event.detail);
      const { sessionId, day } = event.detail;
      
      // Update the plan using the updatePlan prop instead of trying to set state directly
      const updatedPlan = { ...planSemanal };
      if (updatedPlan[day]) {
        updatedPlan[day] = {
          ...updatedPlan[day],
          sessions: updatedPlan[day].sessions.filter(session => session._id !== sessionId)
        };
        
        // Call the updatePlan function from props
        updatePlan(updatedPlan);
        console.log('Plan actualizado después de eliminar sesión');
      }
    };

    // Add event listener for sessionDeleted
    window.addEventListener('sessionDeleted', handleSessionDeleted as EventListener);
    
    // Add event listener for reloadPlanning
    const handleReloadPlanning = () => {
      if (onReload) {
        console.log('Reloading planning data...');
        onReload();
      }
    };
    
    window.addEventListener('reloadPlanning', handleReloadPlanning);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('sessionDeleted', handleSessionDeleted as EventListener);
      window.removeEventListener('reloadPlanning', handleReloadPlanning);
    };
  }, [onReload, planSemanal, updatePlan]); // Añade planSemanal y updatePlan a las dependencias
  const handleDeleteSession = async (sessionId: string) => {
    console.log('Iniciando eliminación de sesión:', sessionId);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/session/${sessionId}`;
      console.log('URL de eliminación:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al eliminar la sesión');
      }

      const data = await response.json();
      console.log('Datos de la sesión eliminada:', data);
      
      // Cerrar el modal
      setIsDeleteModalOpen(false);
      setSessionToDelete(null);
      console.log('Modal cerrado y estado limpiado');
      
      // Recargar los datos
      if (onReload) {
        onReload();
      } else {
        console.log('No hay función onReload disponible');
      }
      
    } catch (error) {
      console.error('Error detallado al eliminar la sesión:', error);
      console.error('Tipo de error:', error instanceof Error ? 'Error nativo' : typeof error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }
  };

  const openDeleteModal = (sessionId: string) => {
    console.log('Abriendo modal de eliminación para sesión:', sessionId);
    setSessionToDelete(sessionId);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div id="week-navigation" className="w-full mb-4">
        {/* Navegación de semanas */}
        <div className="grid grid-cols-7 w-full">
          {dias.map((dia) => (
            <motion.div
              key={dia}
              onClick={() => setDiaSeleccionado(dia)}
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                diaSeleccionado === dia
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                  : 'bg-white hover:bg-gray-50 text-gray-800'
              } ${
                dia === 'Lunes' ? 'rounded-l-lg' : dia === 'Domingo' ? 'rounded-r-lg' : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-lg font-semibold text-center">{dia}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div id="content-area" className="space-y-4">
        {/* Contenido principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={diaSeleccionado}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-bold">{diaSeleccionado}</h2>
              </div>

              {/* Controles de filtrado y añadir sesión */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Filtrar..."
                    className={`pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all
                      ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300'
                      }`}
                  />
                </div>
                <Button
                  variant="create"
                  onClick={() => handleAddSession(diaSeleccionado)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Añadir Sesión</span>
                </Button>
              </div>
            </div>

<div className="space-y-">
  {filteredSessions(diaSeleccionado).map((session) => (
    <SesionEntrenamiento
      key={session._id}
      session={session}
      diaSeleccionado={diaSeleccionado}
      onDeleteSession={() =>
        openDeleteModal(session._id)
      }
      onAddExercise={() =>
        handleAddExercise(diaSeleccionado, session._id)
      }
      planSemanal={planSemanal}
      updatePlan={updatePlan}
      planningId={planningId}
      weekId={semanaActual.toString()} // Modificado para pasar siempre el número de semana como string
      selectedDay={diaSeleccionado}
      exerciseData={exerciseData} // Pass the exercise data to SesionEntrenamiento
      getExerciseName={getExerciseName} // Pass the function to get exercise names

    />
  ))}

  {filteredSessions(diaSeleccionado).length === 0 && (
    <div className="text-center py-8 text-gray-500">
      No hay sesiones programadas para este día
    </div>
  )}
</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div id="add-session-area" className="mt-4">
        <Button
          onClick={handleAddSession}
          className="w-full"
          variant="outline"
        >
          Añadir Sesión
        </Button>
      </div>

      {/* Popup para crear nueva sesión */}
      {showSessionPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h3 className="text-lg font-semibold mb-4">Crear Nueva Sesión</h3>
            
            {/* Nombre de la sesión */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Nombre de la sesión</label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                placeholder="Nombre de la sesión"
              />
            </div>

            {/* Tipo de sesión */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Tipo de sesión</label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value as 'Normal' | 'Superset')}
                className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
              >
                <option value="Normal">Normal</option>
                <option value="Superset">Superset</option>
              </select>
            </div>

            {/* Número de rondas (solo para Superset) */}
            {sessionType === 'Superset' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Número de rondas
                </label>
                <input
                  type="number"
                  value={sessionRounds || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : undefined;
                    if (value === undefined || value >= 1) {
                      setSessionRounds(value);
                    }
                  }}
                  min="1"
                  required
                  className={`w-full p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`}
                  placeholder="Número de rondas"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSessionPopup(false)}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSession}
                disabled={isCreatingSession || !sessionName.trim() || (sessionType === 'Superset' && !sessionRounds)}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCreatingSession ? 'Creando...' : 'Crear'}
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
                onClick={() => setIsDeleteModalOpen(false)}
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
    </>
  );
};

export default VistaCompleja;
