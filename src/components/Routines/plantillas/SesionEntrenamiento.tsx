// src/components/SesionEntrenamiento.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  Target,
  ChevronDown,
  ChevronUp,
  Save,
  XCircle,
  Clock,
} from 'lucide-react';
import Button from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import EditSessionPopup from './EditSessionPopup';
import { trainingVariants } from './trainingVariants';
import type { Set } from './trainingVariants';
import axios from 'axios';
import ExerciseSelector from './ExerciseSelector';

interface Exercise {
  _id: string;
  exercise: {
    _id: string;
    nombre: string;
    grupoMuscular: string[];
    descripcion: string;
    equipo: string[];
    imgUrl: string;
  };
  sets: Set[];
  createdAt: string;
  updatedAt: string;
}

interface Set {
  _id: string;
  reps: { value: number; type: MeasureType };
  weight: { value: number; type: MeasureType };
  rest: { value: number; type: MeasureType };
  renderConfig?: {
    campo1: string;
    campo2: string;
    campo3: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Session {
  _id: string;
  name: string;
  tipo: 'Normal' | 'Superset';
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

interface SesionEntrenamientoProps {
  session: Session;
  onClose: () => void;
  onDeleteSession?: () => void;
  onAddExercise?: () => void;
  onShowSesionEntrenamiento?: () => void;
  planningId: string;
  weekNumber: number;
  selectedDay: string;
  templateId: string;
  dayNumber: number;
  sessionId: string;
}

const MEASURE_TYPES = {
  REPS: 'Repeticiones',
  WEIGHT: 'Peso',
  REST: 'Descanso',
  TEMPO: 'Tempo',
  RPE: 'Esfuerzo Percibido',
  RPM: 'Revoluciones por Minuto',
  RIR: 'Repeticiones en Reserva',
  TIME: 'Tiempo',
  SPEED: 'Velocidad',
  CADENCE: 'Cadencia',
  DISTANCE: 'Distancia',
  HEIGHT: 'Altura',
  CALORIES: 'Calorías',
  ROUND: 'Ronda'
} as const;

type MeasureType = keyof typeof MEASURE_TYPES;

const SesionEntrenamiento: React.FC<SesionEntrenamientoProps> = ({
  session,
  onClose,
  onDeleteSession,
  onAddExercise,
  onShowSesionEntrenamiento,
  planningId,
  weekNumber,
  selectedDay,
  templateId,
  dayNumber,
  sessionId,
}) => {
  const { theme } = useTheme();
  const [localSession, setLocalSession] = useState<Session>(session);
  const [ejerciciosExpandidos, setEjerciciosExpandidos] = useState(new Set<string>());
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(session.name);
  const [isEditingRounds, setIsEditingRounds] = useState(false);
  const [editedRounds, setEditedRounds] = useState(session.rondas || 0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  
  // Nuevo estado para mantener los tipos de medición seleccionados para cada set
  const [selectedTypes, setSelectedTypes] = useState<{
    [exerciseId: string]: {
      [setId: string]: {
        reps: MeasureType;
        weight: MeasureType;
        rest: MeasureType;
      }
    }
  }>({});

  // Función para obtener los tipos seleccionados para un set específico
  const getSelectedTypesForSet = (exerciseId: string, setId: string) => {
    return selectedTypes[exerciseId]?.[setId] || {
      reps: 'REPS',
      weight: 'WEIGHT',
      rest: 'REST'
    };
  };

  // Función para actualizar la configuración de renderizado en el backend
  const updateRenderConfig = async (
    exerciseId: string,
    setId: string,
    config: { campo1: string; campo2: string; campo3: string }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}/sets/${setId}/render-config`;
      
      await axios.patch(url, config, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Configuración de renderizado actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar la configuración de renderizado:', error);
    }
  };

  // Función para actualizar los tipos seleccionados
  const handleTypeChange = async (
    exerciseId: string,
    setId: string,
    campo: string,
    newType: MeasureType
  ) => {
    // Actualizar el estado local
    setSelectedTypes((prevTypes) => {
      const updatedTypes = { ...prevTypes };
      if (!updatedTypes[exerciseId]) {
        updatedTypes[exerciseId] = {};
      }
      if (!updatedTypes[exerciseId][setId]) {
        updatedTypes[exerciseId][setId] = {
          reps: 'REPS',
          weight: 'WEIGHT',
          rest: 'REST'
        };
      }
      updatedTypes[exerciseId][setId] = {
        ...updatedTypes[exerciseId][setId],
        [campo]: newType
      };
      return updatedTypes;
    });

    try {
      // Encontrar el ejercicio y el set actual
      const exercise = session.exercises.find(e => e._id === exerciseId);
      const set = exercise?.sets.find(s => s._id === setId);
      
      if (!set || !set.renderConfig) return;

      // Crear el nuevo renderConfig basado en el campo que se está cambiando
      const newRenderConfig = {
        ...set.renderConfig,
        [campo]: newType.toLowerCase()
      };

      // Enviar la petición PATCH al backend
      const response = await axios.patch(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}/sets/${setId}/render-config`,
        newRenderConfig
      );

      if (response.status === 200) {
        console.log('RenderConfig actualizado exitosamente:', response.data);
        
        // Actualizar el estado local de la sesión
        setLocalSession(prevSession => {
          const newSession = { ...prevSession };
          const exerciseIndex = newSession.exercises.findIndex(e => e._id === exerciseId);
          if (exerciseIndex !== -1) {
            const setIndex = newSession.exercises[exerciseIndex].sets.findIndex(s => s._id === setId);
            if (setIndex !== -1) {
              newSession.exercises[exerciseIndex].sets[setIndex].renderConfig = response.data.data.renderConfig;
            }
          }
          return newSession;
        });
      }
    } catch (error) {
      console.error('Error al actualizar el renderConfig:', error);
    }
  };

  // Función para obtener el valor basado en el tipo seleccionado y el renderConfig
  const getValueForType = (set: any, type: MeasureType) => {
    // Si el set tiene renderConfig, usamos esa configuración
    if (set.renderConfig) {
      // Encontrar qué campo (campo1, campo2, campo3) corresponde al tipo actual
      const campo = Object.entries(set.renderConfig).find(([_, value]) => value === type.toLowerCase())?.[0];
      if (campo) {
        // Obtener el valor correspondiente según el campo del renderConfig
        const propertyName = set.renderConfig[campo];
        return {
          value: set[propertyName] || 0,
          type: type
        };
      }
    }

    // Si no hay renderConfig o no se encuentra el tipo, usar el valor directo
    return {
      value: set[type.toLowerCase()] || 0,
      type: type
    };
  };

  // Función para obtener la estructura de datos del set basada en renderConfig
  const getSetStructuredData = (set: any) => {
    if (!set.renderConfig) {
      // Valores por defecto si no hay renderConfig
      return {
        campo1: { value: set.reps || 0, type: 'REPS' },
        campo2: { value: set.weight || 0, type: 'WEIGHT' },
        campo3: { value: set.rest || 0, type: 'REST' }
      };
    }

    const { campo1, campo2, campo3 } = set.renderConfig;
    
    return {
      campo1: {
        value: set[campo1] || 0,
        type: campo1.toUpperCase()
      },
      campo2: {
        value: set[campo2] || 0,
        type: campo2.toUpperCase()
      },
      campo3: {
        value: set[campo3] || 0,
        type: campo3.toUpperCase()
      }
    };
  };

  useEffect(() => {
    console.log('Session recibida:', session);
    console.log('Exercises:', session.exercises);
    setLocalSession(session);
  }, [session]);

  useEffect(() => {
    console.log('=== SesionEntrenamiento - Props Recibidas ===');
    console.table({
      'Session ID': session._id,
      'Session Name': session.name,
      'Planning ID': planningId,
      'Week Number': weekNumber,
      'Selected Day': selectedDay,
      'Template ID': templateId,
      'Day Number': dayNumber,
      'Session ID (prop)': sessionId,
    });
    console.log('Session Object:', session);
    console.log('=======================================');
  }, [session, planningId, weekNumber, selectedDay, templateId, dayNumber, sessionId]);

  useEffect(() => {
    if (showExerciseSelector) {
      console.log('=== SesionEntrenamiento - Abriendo ExerciseSelector ===');
      console.log('Datos pasados a ExerciseSelector:');
      console.table({
        'Template ID': templateId,
        'Week Number': weekNumber,
        'Day Number': dayNumber,
        'Session ID': sessionId,
      });
      console.log('==========================================');
    }
  }, [showExerciseSelector, templateId, weekNumber, dayNumber, sessionId]);

  const handleSaveSession = (updatedSession: Session) => {
    const updatedPlan: any = {
      ...session,
      name: updatedSession.name,
    };
    console.log('Plan actualizado:', updatedPlan);
  };

  const handleUpdateRounds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('Actualizando rondas para sesión:', session._id, 'Nuevas rondas:', editedRounds);

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/session/${session._id}/rounds`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rondas: editedRounds }),
      });

      console.log('Respuesta del servidor:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al actualizar las rondas');
      }

      // Actualizar el estado local
      setIsEditingRounds(false);
    } catch (error) {
      console.error('Error al actualizar las rondas:', error);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/session/${session._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onClose();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSelectExercise = async (exercise: any) => {
    console.log('SesionEntrenamiento - handleSelectExercise llamado:', exercise);
    try {
      console.log('Exercise recibido en handleSelectExercise:', exercise);
      
      const newExercise: Exercise = {
        _id: exercise._id,
        exercise: exercise,
        sets: exercise.sets.map((set: any) => {
          console.log('Set original:', set);
          return {
            _id: set._id || Date.now().toString(),
            reps: set.reps || { value: 0, type: 'REPS' },
            weight: set.weight || { value: 0, type: 'WEIGHT' },
            rest: set.rest || { value: 0, type: 'REST' },
            createdAt: set.createdAt || new Date().toISOString(),
            updatedAt: set.updatedAt || new Date().toISOString(),
          };
        }),
        createdAt: exercise.createdAt || new Date().toISOString(),
        updatedAt: exercise.updatedAt || new Date().toISOString(),
      };

      console.log('Nuevo ejercicio formateado:', newExercise);

      setLocalSession(prev => {
        const newSession = {
          ...prev,
          exercises: [...prev.exercises, newExercise]
        };
        console.log('Nueva sesión local:', newSession);
        return newSession;
      });

      setEjerciciosExpandidos(prev => {
        const newSet = new Set(prev);
        newSet.add(exercise._id);
        return newSet;
      });

      setShowExerciseSelector(false);
    } catch (error) {
      console.error('Error al agregar el ejercicio:', error);
    }
  };

  const handleAddSet = async (exerciseId: string) => {
    try {
      const exercise = localSession.exercises.find(e => e._id === exerciseId);
      if (!exercise) return;

      const newSet: Set = {
        _id: Date.now().toString(),
        reps: { value: 12, type: 'REPS' },
        weight: { value: 10, type: 'WEIGHT' },
        rest: { value: 60, type: 'REST' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Nuevo set a añadir:', newSet);

      // Hacer la petición a la API para añadir el set
      const response = await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}/sets`,
        newSet
      );

      if (response.status === 200 || response.status === 201) {
        console.log('Respuesta de la API al añadir set:', response.data);
        
        setLocalSession(prev => {
          const newSession = {
            ...prev,
            exercises: prev.exercises.map(e => 
              e._id === exerciseId 
                ? { ...e, sets: [...e.sets, newSet] }
                : e
            )
          };
          console.log('Nueva sesión después de añadir set:', newSession);
          return newSession;
        });
      }
    } catch (error) {
      console.error('Error al agregar el set:', error);
    }
  };

  const handleDeleteSet = async (exerciseId: string, setId: string) => {
    try {
      const exercise = localSession.exercises.find(e => e._id === exerciseId);
      if (!exercise || exercise.sets.length <= 1) return; // No permitir eliminar el último set

      const updatedSets = exercise.sets.filter(set => set._id !== setId);
      await updatePlanningExercise(exerciseId, updatedSets);

      // Actualizar el estado local después de la actualización exitosa
      setLocalSession(prev => ({
        ...prev,
        exercises: prev.exercises.map(e => 
          e._id === exerciseId ? { ...e, sets: updatedSets } : e
        )
      }));
    } catch (error) {
      console.error('Error al eliminar el set:', error);
    }
  };

  const getDefaultLabel = (type: string) => {
    switch (type) {
      case 'REPS':
        return 'Repeticiones';
      case 'WEIGHT':
        return 'Peso';
      case 'REST':
        return 'Descanso';
      default:
        return MEASURE_TYPES[type as keyof typeof MEASURE_TYPES];
    }
  };

  const getMeasureUnit = (measureType: MeasureType): string => {
    switch (measureType) {
      case 'WEIGHT':
        return 'kg';
      case 'REPS':
        return 'reps';
      case 'REST':
        return 'seg';
      case 'TIME':
        return 'min';
      case 'SPEED':
        return 'km/h';
      case 'RPM':
        return 'rpm';
      case 'DISTANCE':
        return 'm';
      case 'HEIGHT':
        return 'cm';
      case 'CALORIES':
        return 'kcal';
      default:
        return '';
    }
  };

  const isCategoryInUse = (set: Set, newType: MeasureType, currentField: keyof Set) => {
    const categories = {
      reps: set.reps.type,
      weight: set.weight.type,
      rest: set.rest.type
    };
    
    // Excluimos la categoría actual que estamos editando
    const { [currentField]: _, ...otherCategories } = categories;
    
    return Object.values(otherCategories).includes(newType);
  };

  const handleSetChange = async (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    try {
      const exercise = localSession.exercises.find(e => e._id === exerciseId);
      if (!exercise) return;

      const set = exercise.sets.find(s => s._id === setId);
      if (!set) return;

      // Si estamos cambiando el tipo, verificar que no esté duplicado
      if (value.type && field !== 'value') {
        if (isCategoryInUse(set, value.type, field)) {
          alert('Esta categoría ya está en uso en este set. Por favor seleccione una diferente.');
          return;
        }
      }

      const updatedSets = exercise.sets.map(s => 
        s._id === setId ? { ...s, [field]: value } : s
      );

      await updatePlanningExercise(exerciseId, updatedSets);
      
      setLocalSession(prev => ({
        ...prev,
        exercises: prev.exercises.map(e => 
          e._id === exerciseId ? { ...e, sets: updatedSets } : e
        )
      }));
    } catch (error) {
      console.error('Error al actualizar el set:', error);
    }
  };

  const getAvailableCategories = (set: Set, currentField: keyof Set) => {
    const usedCategories = new Set([
      set.reps.type,
      set.weight.type,
      set.rest.type
    ]);
    
    // Removemos la categoría actual para que aparezca en las opciones
    usedCategories.delete(set[currentField].type);
    
    return Object.entries(MEASURE_TYPES).filter(([key]) => !usedCategories.has(key as MeasureType));
  };

  const updatePlanningExercise = async (exerciseId: string, updatedSets: Set[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('SesionEntrenamiento: Actualizando ejercicio:', {
        planningId,
        weekNumber,
        day: selectedDay,
        sessionId: session._id,
        exerciseId,
        sets: updatedSets
      });

      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekNumber}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}`;
      
      const response = await axios.put(
        url,
        { sets: updatedSets },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Error al actualizar el ejercicio');
      }

      console.log('SesionEntrenamiento: Ejercicio actualizado exitosamente:', response.data);
      return response.data;
    } catch (err) {
      console.error('SesionEntrenamiento: Error al actualizar ejercicio:', err);
      throw err;
    }
  };

  const toggleEjercicio = (ejercicioId: string) => {
    setEjerciciosExpandidos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ejercicioId)) {
        newSet.delete(ejercicioId);
      } else {
        newSet.add(ejercicioId);
      }
      return newSet;
    });
  };

  // Definir las opciones disponibles para cada campo
  const fieldOptions = {
    campo1: [
      { value: 'reps', label: 'Repeticiones' },
      { value: 'time', label: 'Tiempo' },
      { value: 'distance', label: 'Distancia' }
    ],
    campo2: [
      { value: 'weight', label: 'Peso' },
      { value: 'speed', label: 'Velocidad' },
      { value: 'height', label: 'Altura' }
    ],
    campo3: [
      { value: 'rest', label: 'Descanso' },
      { value: 'round', label: 'Ronda' },
      { value: 'rpe', label: 'RPE' },
      { value: 'rir', label: 'RIR' }
    ]
  };

  const handleShowDetails = () => {
    console.log('SesionEntrenamiento - handleShowDetails llamado');
    if (onShowSesionEntrenamiento) {
      console.log('SesionEntrenamiento - Ejecutando onShowSesionEntrenamiento');
      onShowSesionEntrenamiento();
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} cursor-pointer`}
      onClick={handleShowDetails}
    >
      <div className="flex flex-col space-y-2">
        {/* Encabezado de la sesión */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">{localSession.name}</h3>
              {localSession.tipo === 'Superset' && (
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Superset
                </span>
              )}
            </div>
          </div>
          {/* Controles de la sesión */}
          <div className="flex items-center space-x-2">
            <Button
              variant="normal"
              onClick={() => setShowExerciseSelector(true)}
              className="p-2"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="normal"
              onClick={() => setShowEditPopup(true)}
              className="p-2"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button variant="danger" onClick={handleDeleteSession} className="p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* ExerciseSelector Modal */}
        {showExerciseSelector && (
          <ExerciseSelector
            isOpen={showExerciseSelector}
            onClose={() => setShowExerciseSelector(false)}
            onSelectExercise={handleSelectExercise}
            templateId={templateId}
            weekNumber={weekNumber}
            dayNumber={dayNumber}
            sessionId={session._id}
          />
        )}

        {/* Rondas (si es superset) */}
        {localSession.tipo === 'Superset' && (
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-sm">Rondas:</span>
            {isEditingRounds ? (
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={editedRounds}
                  onChange={(e) => setEditedRounds(Number(e.target.value))}
                  className={`w-16 px-2 py-1 rounded ${
                    theme === 'dark'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  min="1"
                />
                <Button
                  variant="success"
                  onClick={() => {
                    handleUpdateRounds();
                    setIsEditingRounds(false);
                  }}
                  className="p-1"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setEditedRounds(session.rondas || 0);
                    setIsEditingRounds(false);
                  }}
                  className="p-1"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-medium">{session.rondas || 0}</span>
                <Button
                  variant="normal"
                  onClick={() => setIsEditingRounds(true)}
                  className="p-1"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Lista de ejercicios */}
        <div className="mt-4 space-y-4">
          {localSession.exercises.map((exercise) => (
            <div
              key={exercise._id}
              className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium">
                  {exercise.exercise.nombre}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleEjercicio(exercise._id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {ejerciciosExpandidos.has(exercise._id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {ejerciciosExpandidos.has(exercise._id) && (
                <div className="mt-4">
                  {exercise.sets.map((set, index) => {
                    console.log('Renderizando set:', set);

                    const setData = getSetStructuredData(set);
                    console.log('Set data estructurado:', setData);
                    
                    return (
                      <div
                        key={set._id}
                        className="grid grid-cols-4 gap-4 items-center mb-4 p-2 bg-white dark:bg-gray-700 rounded shadow"
                      >
                        <span className="font-medium">Set {index + 1}</span>
                        
                        {/* Primera categoría */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={set.renderConfig?.campo1 || 'reps'}
                            className="p-1 border rounded"
                            onChange={(e) => handleTypeChange(
                              exercise._id,
                              set._id,
                              'campo1',
                              e.target.value as MeasureType
                            )}
                          >
                            {fieldOptions.campo1.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={setData.campo1.value}
                            readOnly
                            className="w-20 p-1 border rounded"
                          />
                          <span>{getMeasureUnit(setData.campo1.type)}</span>
                        </div>

                        {/* Segunda categoría */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={set.renderConfig?.campo2 || 'weight'}
                            className="p-1 border rounded"
                            onChange={(e) => handleTypeChange(
                              exercise._id,
                              set._id,
                              'campo2',
                              e.target.value as MeasureType
                            )}
                          >
                            {fieldOptions.campo2.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={setData.campo2.value}
                            readOnly
                            className="w-20 p-1 border rounded"
                          />
                          <span>{getMeasureUnit(setData.campo2.type)}</span>
                        </div>

                        {/* Tercera categoría */}
                        <div className="flex items-center space-x-2">
                          <select
                            value={set.renderConfig?.campo3 || 'rest'}
                            className="p-1 border rounded"
                            onChange={(e) => handleTypeChange(
                              exercise._id,
                              set._id,
                              'campo3',
                              e.target.value as MeasureType
                            )}
                          >
                            {fieldOptions.campo3.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={setData.campo3.value}
                            readOnly
                            className="w-20 p-1 border rounded"
                          />
                          <span>{getMeasureUnit(setData.campo3.type)}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteSet(exercise._id, set._id)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-500"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => handleAddSet(exercise._id)}
                    className="mt-2 flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Set</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Popup de edición */}
      {showEditPopup && (
        <EditSessionPopup
          session={localSession}
          onSave={handleSaveSession}
          onClose={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
};

export default SesionEntrenamiento;
