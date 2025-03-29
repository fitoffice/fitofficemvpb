// src/components/SesionEntrenamiento.tsx

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
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
import Button from '../Common/Button';
import type { Set } from './trainingVariants';
import axios from 'axios';
import ExerciseSelector from './ExerciseSelector';
import { useExercise } from '../../contexts/ExerciseContext';

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
  planningId: string;
  weekId: string; // Changed from weekId: number
  selectedDay: string;
  exerciseData?: Record<string, ExerciseData>; // Add this line
  getExerciseName?: (exerciseId: string) => string; // Add this line
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
  planningId,
  weekId, // Changed from weekId
  selectedDay,
  exerciseData = {}, // Default to empty object
  getExerciseName = (id) => 'Cargando...', // Default implementation

}) => {
  console.log('SesionEntrenamiento - weekId recibido:', weekId, 'tipo:', typeof weekId);
  
  // Convert weekId to a number if it's a string containing only digits
  const weekNumber = /^\d+$/.test(weekId) ? parseInt(weekId, 10) : null;
  console.log('SesionEntrenamiento - weekNumber convertido:', weekNumber);

  const { theme } = useTheme();
  const [modifiedSets, setModifiedSets] = useState<Set<string>>(new Set());
  const { exerciseResponse, setExerciseResponse } = useExercise();
  const [localSession, setLocalSession] = useState<Session>(session);
  const [ejerciciosExpandidos, setEjerciciosExpandidos] = useState(new Set<string>());
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(session.name);
  const [isEditingRounds, setIsEditingRounds] = useState(false);
  const [editedRounds, setEditedRounds] = useState(session.rondas || 0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setsStructuredData, setSetsStructuredData] = useState<{
    [exerciseId: string]: {
      [setId: string]: any
    }
  }>({});

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

  useEffect(() => {
    const loadSetsData = async () => {
      const newData: any = {};
      
      for (const exercise of localSession.exercises) {
        newData[exercise._id] = {};
        for (const set of exercise.sets) {
          newData[exercise._id][set._id] = await getSetStructuredData(set, exercise._id);
        }
      }
      
      setSetsStructuredData(newData);
    };
    
    loadSetsData();
  }, [localSession.exercises]);

  // Lista de campos válidos para la configuración
  const VALID_FIELDS = [
    'reps',
    'weight',
    'rest',
    'tempo',
    'rpe',
    'rpm',
    'rir',
    'speed',
    'cadence',
    'distance',
    'height',
    'calories',
    'round'
  ] as const;

  type ValidField = typeof VALID_FIELDS[number];

  // Función para validar si un campo es válido
  const isValidField = (field: string): field is ValidField => {
    return VALID_FIELDS.includes(field as ValidField);
  };
  const handleSaveSetChanges = async (exerciseId: string, setId: string) => {
    try {
      const exercise = localSession.exercises.find(e => e._id === exerciseId);
      if (!exercise) return;
  
      const set = exercise.sets.find(s => s._id === setId);
      if (!set) return;
  
      // Make sure all values are properly formatted before saving
      const formattedSets = exercise.sets.map(s => {
        if (s._id === setId) {
          // Ensure each field has the correct structure
          return {
            ...s,
            reps: typeof s.reps === 'object' ? s.reps : { value: Number(s.reps), type: 'REPS' },
            weight: typeof s.weight === 'object' ? s.weight : { value: Number(s.weight), type: 'WEIGHT' },
            rest: typeof s.rest === 'object' ? s.rest : { value: Number(s.rest), type: 'REST' }
          };
        }
        return s;
      });
  
      await updatePlanningExercise(exerciseId, formattedSets);
      
      // Remove this set from the modified sets
      setModifiedSets(prev => {
        const newModified = new Set(prev);
        newModified.delete(setId);
        return newModified;
      });
      
      console.log('Set changes saved successfully');
    } catch (error) {
      console.error('Error al guardar los cambios del set:', error);
    }
  };
  
  const getExerciseDisplayName = (exercise: Exercise) => {
    // First check if exercise has its own data
    if (exercise.exercise?.nombre) {
      return exercise.exercise.nombre;
    }
    
    // If exercise.exercise is a string (ID reference), use the getExerciseName function
    if (typeof exercise.exercise === 'string') {
      return getExerciseName(exercise.exercise);
    }
    
    // If we have a name directly on the exercise
    if (exercise.name) {
      return exercise.name;
    }
    
    // Default fallback
    return 'Cargando...';
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

      // Validar que los campos sean válidos
      const validatedConfig = {
        campo1: isValidField(config.campo1) ? config.campo1 : 'reps',
        campo2: isValidField(config.campo2) ? config.campo2 : 'weight',
        campo3: isValidField(config.campo3) ? config.campo3 : 'rest'
      };

      // Use weekNumber if available, otherwise fall back to weekId
      const weekParam = weekNumber !== null ? weekNumber : weekId;
      
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekParam}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}/sets/${setId}/render-config`;
      
      const response = await axios.patch(url, validatedConfig, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Actualizar el estado local con la nueva configuración
        setLocalSession(prevSession => ({
          ...prevSession,
          exercises: prevSession.exercises.map(exercise => 
            exercise._id === exerciseId
              ? {
                  ...exercise,
                  sets: exercise.sets.map(set =>
                    set._id === setId
                      ? { ...set, renderConfig: validatedConfig }
                      : set
                  )
                }
              : exercise
          )
        }));
        console.log('Configuración de renderizado actualizada exitosamente');
      }
    } catch (error) {
      console.error('Error al actualizar la configuración de renderizado:', error);
      throw error;
    }
  };
  // Función para obtener la estructura de datos del set basada en renderConfig
  // Función para obtener la estructura de datos del set basada en renderConfig
  const getSetStructuredData = async (set: any, exerciseId?: string) => {
    try {
      // Si ya tenemos renderConfig, usamos los datos locales
      if (set.renderConfig) {
        const { campo1, campo2, campo3 } = set.renderConfig;
        
        return {
          campo1: {
            value: set[campo1]?.value || 0,
            type: campo1.toUpperCase()
          },
          campo2: {
            value: set[campo2]?.value || 0,
            type: campo2.toUpperCase()
          },
          campo3: {
            value: set[campo3]?.value || 0,
            type: campo3.toUpperCase()
          }
        };
      }
      
      // Si no tenemos renderConfig, intentamos obtener los datos de la API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Use weekNumber if available, otherwise fall back to weekId
      const weekParam = weekNumber !== null ? weekNumber : weekId;
      
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekParam}/days/${selectedDay}/sessions/${session._id}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200 && response.data) {
        // Buscar el ejercicio y el set correspondiente en la respuesta
        const apiExercise = response.data.session.exercises.find((e: any) => e.id === exerciseId);
        if (apiExercise) {
          const apiSet = apiExercise.sets.find((s: any) => s.id === set._id);
          if (apiSet && apiSet.renderConfig) {
            const { campo1, campo2, campo3 } = apiSet.renderConfig;
            
            // Actualizar el set local con los datos de la API
            set.renderConfig = apiSet.renderConfig;
            
            return {
              campo1: {
                value: apiSet[campo1] || 0,
                type: campo1.toUpperCase()
              },
              campo2: {
                value: apiSet[campo2] || 0,
                type: campo2.toUpperCase()
              },
              campo3: {
                value: apiSet[campo3] || 0,
                type: campo3.toUpperCase()
              }
            };
          }
        }
      }
      
      // Si no se pudo obtener de la API, usar valores por defecto
      return {
        campo1: { value: set.reps?.value || 0, type: 'REPS' },
        campo2: { value: set.weight?.value || 0, type: 'WEIGHT' },
        campo3: { value: set.rest?.value || 0, type: 'REST' }
      };
    } catch (error) {
      console.error('Error al obtener datos del set:', error);
      // En caso de error, devolver valores por defecto
      return {
        campo1: { value: set.reps?.value || 0, type: 'REPS' },
        campo2: { value: set.weight?.value || 0, type: 'WEIGHT' },
        campo3: { value: set.rest?.value || 0, type: 'REST' }
      };
    }
  };
  useEffect(() => {
    console.log('Session recibida:', session);
    console.log('Exercises:', session.exercises);
    setLocalSession(session);
  }, [session]);

  // Add a new effect to handle the exercise response from context
  // Add a new effect to handle the exercise response from context
  useEffect(() => {
    if (exerciseResponse && exerciseResponse.status === 'success' && exerciseResponse.data) {
      const newExerciseData = exerciseResponse.data;
      
      // Format the exercise data to match the Exercise interface
      const newExercise: Exercise = {
        _id: newExerciseData._id,
        exercise: {
          _id: newExerciseData.exercise._id,
          nombre: newExerciseData.exercise.nombre,
          grupoMuscular: newExerciseData.exercise.grupoMuscular || [],
          descripcion: newExerciseData.exercise.descripcion || '',
          equipo: newExerciseData.exercise.equipo || [],
          imgUrl: newExerciseData.exercise.imgUrl || '',
        },
        sets: newExerciseData.sets.map((set: any) => ({
          _id: set._id,
          reps: { value: set.reps || 0, type: 'REPS' },
          weight: { value: set.weight || 0, type: 'WEIGHT' },
          rest: { value: set.rest || 0, type: 'REST' },
          renderConfig: set.renderConfig || {
            campo1: 'reps',
            campo2: 'weight',
            campo3: 'rest'
          },
          createdAt: set.createdAt,
          updatedAt: set.updatedAt,
        })),
        createdAt: newExerciseData.createdAt,
        updatedAt: newExerciseData.updatedAt,
      };

      console.log('Nuevo ejercicio formateado desde context:', newExercise);

      // Update local session with the new exercise
      setLocalSession(prev => {
        const newSession = {
          ...prev,
          exercises: [...prev.exercises, newExercise]
        };
        console.log('Nueva sesión local con ejercicio del context:', newSession);
        return newSession;
      });

      // Expand the new exercise
      setEjerciciosExpandidos(prev => {
        const newSet = new Set(prev);
        newSet.add(newExerciseData._id);
        return newSet;
      });

      // Clear the response after processing
      setExerciseResponse(null);
    }
  }, [exerciseResponse, setExerciseResponse]);
  const handleSelectExercise = async (exercise: any) => {
    try {
      console.log('Exercise recibido en handleSelectExercise:', exercise);
      
      // If the exercise is already in the format we need, we can directly add it to the session
      if (exercise && exercise._id && exercise.exercise && exercise.sets) {
        // Format the exercise to match our interface if needed
        const formattedExercise: Exercise = {
          _id: exercise._id,
          exercise: {
            _id: exercise.exercise._id,
            nombre: exercise.exercise.nombre,
            grupoMuscular: exercise.exercise.grupoMuscular || [],
            descripcion: exercise.exercise.descripcion || '',
            equipo: exercise.exercise.equipo || [],
            imgUrl: exercise.exercise.imgUrl || '',
          },
          sets: exercise.sets.map((set: any) => ({
            _id: set._id,
            reps: { value: set.reps || 0, type: 'REPS' },
            weight: { value: set.weight || 0, type: 'WEIGHT' },
            rest: { value: set.rest || 0, type: 'REST' },
            renderConfig: set.renderConfig || {
              campo1: 'reps',
              campo2: 'weight',
              campo3: 'rest'
            },
            createdAt: set.createdAt,
            updatedAt: set.updatedAt,
          })),
          createdAt: exercise.createdAt,
          updatedAt: exercise.updatedAt,
        };

        console.log('Ejercicio formateado en handleSelectExercise:', formattedExercise);

        // Update local session with the new exercise
        setLocalSession(prev => {
          const newSession = {
            ...prev,
            exercises: [...prev.exercises, formattedExercise]
          };
          console.log('Nueva sesión local con ejercicio añadido:', newSession);
          return newSession;
        });

        // Expand the new exercise
        setEjerciciosExpandidos(prev => {
          const newSet = new Set(prev);
          newSet.add(exercise._id);
          return newSet;
        });
      }
      
      setShowExerciseSelector(false);
    } catch (error) {
      console.error('Error al agregar el ejercicio:', error);
    }
  };
    const fetchSessionData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Use weekNumber if available, otherwise fall back to weekId
      const weekParam = weekNumber !== null ? weekNumber : weekId;
      
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekParam}/days/${selectedDay}/sessions/${session._id}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 && response.data) {
        console.log('Datos completos de la sesión:', response.data);
        
        // Actualizar el estado local con los datos completos
        setLocalSession(response.data);
        
        // Expandir todos los ejercicios por defecto
        const exerciseIds = new Set<string>();
        if (response.data.exercises && response.data.exercises.length > 0) {
          response.data.exercises.forEach((exercise: Exercise) => {
            exerciseIds.add(exercise._id);
          });
        }
        setEjerciciosExpandidos(exerciseIds);
      }
    } catch (error) {
      console.error('Error al obtener los datos completos de la sesión:', error);
    } finally {
      setIsLoading(false);
    }
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
      
      // Check if onClose exists before calling it
      if (typeof onClose === 'function') {
        onClose();
      } else {
        console.log('Session deleted successfully, but no onClose handler provided');
        
        // Dispatch a custom event to notify parent components about the deletion
        const deleteEvent = new CustomEvent('sessionDeleted', {
          detail: { sessionId: session._id, day: selectedDay }
        });
        window.dispatchEvent(deleteEvent);
        
        // If we're in a view that has onReload function (like VistaCompleja)
        // Try to find and call the onReload function from the parent component
        if (window.location.pathname.includes('/planning/edit')) {
          // Force a refresh of the planning data in the parent component
          const reloadEvent = new CustomEvent('reloadPlanning');
          window.dispatchEvent(reloadEvent);
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
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

      // Use weekNumber if available, otherwise fall back to weekId
      const weekParam = weekNumber !== null ? weekNumber : weekId;

      // Hacer la petición a la API para añadir el set
      const response = await axios.post(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekParam}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}/sets`,
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

  

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const response = await axios.delete(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekId}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.status === 200) {
        setLocalSession(prev => ({
          ...prev,
          exercises: prev.exercises.filter(e => e._id !== exerciseId)
        }));
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
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

  const updatePlanningExercise = async (exerciseId: string, updatedSets: Set[]) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      console.log('SesionEntrenamiento: Actualizando ejercicio:', {
        planningId,
        weekId, // Original weekId
        weekNumber, // Converted week number
        day: selectedDay,
        sessionId: session._id,
        exerciseId,
        sets: updatedSets
      });

      // Use weekNumber if available, otherwise fall back to weekId
      const weekParam = weekNumber !== null ? weekNumber : weekId;
      
      const url = `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${planningId}/weeks/${weekParam}/days/${selectedDay}/sessions/${session._id}/exercises/${exerciseId}`;
      
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
      { value: 'distance', label: 'Distancia' },
      { value: 'tempo', label: 'Tempo' },
      { value: 'calories', label: 'Calorías' }
    ],
    campo2: [
      { value: 'weight', label: 'Peso' },
      { value: 'speed', label: 'Velocidad' },
      { value: 'height', label: 'Altura' },
      { value: 'cadence', label: 'Cadencia' },
      { value: 'rpm', label: 'RPM' }
    ],
    campo3: [
      { value: 'rest', label: 'Descanso' },
      { value: 'round', label: 'Ronda' },
      { value: 'rpe', label: 'RPE' },
      { value: 'rir', label: 'RIR' }
    ]
  };

  // Función para actualizar los tipos seleccionados
  const handleTypeChange = async (
    exerciseId: string,
    setId: string,
    campo: string,
    newType: string
  ) => {
    try {
      // Validar que el nuevo tipo sea válido
      if (!isValidField(newType.toLowerCase())) {
        console.error('Tipo de medición no válido:', newType);
        return;
      }

      // Actualizar el estado local
      setSelectedTypes((prevTypes) => {
        const updatedTypes = { ...prevTypes };
        if (!updatedTypes[exerciseId]) {
          updatedTypes[exerciseId] = {};
        }
        if (!updatedTypes[exerciseId][setId]) {
          updatedTypes[exerciseId][setId] = {
            reps: 'reps',
            weight: 'weight',
            rest: 'rest'
          };
        }
        updatedTypes[exerciseId][setId] = {
          ...updatedTypes[exerciseId][setId],
          [campo]: newType.toLowerCase()
        };
        return updatedTypes;
      });

      // Encontrar el ejercicio y el set actual
      const exercise = localSession.exercises.find(e => e._id === exerciseId);
      const set = exercise?.sets.find(s => s._id === setId);
      
      if (!set) {
        console.error('No se encontró el set especificado');
        return;
      }

      // Crear el nuevo renderConfig basado en el campo que se está cambiando
      const currentConfig = set.renderConfig || {
        campo1: 'reps',
        campo2: 'weight',
        campo3: 'rest'
      };

      const newRenderConfig = {
        ...currentConfig,
        [campo]: newType.toLowerCase()
      };

      // Actualizar la configuración en el backend
      await updateRenderConfig(exerciseId, setId, newRenderConfig);

    } catch (error) {
      console.error('Error al actualizar el tipo de medición:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        {/* Encabezado */}
        <div className="flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 w-full"
                placeholder="Nombre de la sesión"
              />
              <Button
                variant="success"
                onClick={() => {
                  handleUpdateSessionName();
                  setIsEditingName(false);
                }}
                className="p-2 hover:bg-green-600 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setEditedName(session.name);
                  setIsEditingName(false);
                }}
                className="p-2 hover:bg-red-600 transition-colors duration-200"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{session.name}</h2>
              <Button
                variant="normal"
                onClick={() => setIsEditingName(true)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="normal"
            onClick={() => setShowExerciseSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Añadir Ejercicio</span>
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteSession}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <Trash2 className="w-5 h-5" />
            <span>Eliminar Sesión</span>
          </Button>
        </div>
      </div>

      {/* Rondas */}
      {session.tipo === 'Superset' && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Rondas</h3>
          {isEditingRounds ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editedRounds}
                onChange={(e) => setEditedRounds(Number(e.target.value))}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700"
                min="0"
              />
              <Button
                variant="success"
                onClick={() => {
                  handleUpdateRounds();
                  setIsEditingRounds(false);
                }}
                className="p-2 hover:bg-green-600 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setEditedRounds(session.rondas || 0);
                  setIsEditingRounds(false);
                }}
                className="p-2 hover:bg-red-600 transition-colors duration-200"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl font-medium">{session.rondas || 0}</span>
              <Button
                variant="normal"
                onClick={() => setIsEditingRounds(true)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Lista de ejercicios */}
      <div className="space-y-6">
        {localSession.exercises.map((exercise) => (
          <div
            key={exercise._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                {getExerciseDisplayName(exercise)}                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEjercicio(exercise._id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {ejerciciosExpandidos.has(exercise._id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {ejerciciosExpandidos.has(exercise._id) && (
                           <div className="p-4">
                           {exercise.sets.map((set, index) => {
                             // Move getDefaultSetData function outside of the map
                             const getDefaultSetData = (set: any) => ({
                               campo1: { value: set.reps?.value || set.reps || 0, type: 'REPS' },
                               campo2: { value: set.weight?.value || set.weight || 0, type: 'WEIGHT' },
                               campo3: { value: set.rest?.value || set.rest || 0, type: 'REST' }
                             });
                             
                             // Handle both object and primitive value formats
                             const setData = setsStructuredData?.[exercise._id]?.[set._id] || getDefaultSetData(set);
                             const isModified = modifiedSets.has(set._id);
                             
                             return (
                               <div
                                 key={set._id}
                                 className="grid grid-cols-4 gap-4 items-center mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600"
                               >
                                 <div className="flex items-center justify-between">
                                   <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                                     Set {index + 1}
                                   </span>
                                   {isModified && (
                                     <Button
                                       variant="success"
                                       onClick={() => handleSaveSetChanges(exercise._id, set._id)}
                                       className="p-1 ml-2 hover:bg-green-600 transition-colors duration-200"
                                     >
                                       <Save className="w-4 h-4" />
                                     </Button>
                                   )}
                                 </div>
           
                      
                      {/* Primera categoría */}
                      <div className="flex items-center gap-2">
                        <select
                          value={set.renderConfig?.campo1 || 'reps'}
                          className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                          onChange={(e) => {
                            handleTypeChange(exercise._id, set._id, 'campo1', e.target.value as MeasureType);
                            setModifiedSets(prev => new Set(prev).add(set._id));
                          }}
                        >
                          {fieldOptions.campo1.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={typeof set[set.renderConfig?.campo1 || 'reps'] === 'object' 
                            ? set[set.renderConfig?.campo1 || 'reps'].value 
                            : set[set.renderConfig?.campo1 || 'reps'] || 0}
                          onChange={(e) => {
                            // Update local state only without API call
                            const newValue = Number(e.target.value);
                            setLocalSession(prev => ({
                              ...prev,
                              exercises: prev.exercises.map(e => 
                                e._id === exercise._id ? {
                                  ...e,
                                  sets: e.sets.map(s => 
                                    s._id === set._id ? {
                                      ...s,
                                      [set.renderConfig?.campo1 || 'reps']: typeof s[set.renderConfig?.campo1 || 'reps'] === 'object'
                                        ? { 
                                            value: newValue,
                                            type: (s[set.renderConfig?.campo1 || 'reps']?.type || 'REPS')
                                          }
                                        : newValue
                                    } : s
                                  )
                                } : e
                              )
                            }));
                            // Mark this set as modified
                            setModifiedSets(prev => new Set(prev).add(set._id));
                          }}
                          className="w-20 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
                        />
                      </div>

                      {/* Segunda categoría */}
                      <div className="flex items-center gap-2">
        <select
          value={set.renderConfig?.campo2 || 'weight'}
          className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
          onChange={(e) => {
            handleTypeChange(exercise._id, set._id, 'campo2', e.target.value as MeasureType);
            setModifiedSets(prev => new Set(prev).add(set._id));
          }}
        >
          {fieldOptions.campo2.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={typeof set[set.renderConfig?.campo2 || 'weight'] === 'object' 
            ? set[set.renderConfig?.campo2 || 'weight'].value 
            : set[set.renderConfig?.campo2 || 'weight'] || 0}
          onChange={(e) => {
            // Update local state only without API call
            const newValue = Number(e.target.value);
            setLocalSession(prev => ({
              ...prev,
              exercises: prev.exercises.map(e => 
                e._id === exercise._id ? {
                  ...e,
                  sets: e.sets.map(s => 
                    s._id === set._id ? {
                      ...s,
                      [set.renderConfig?.campo2 || 'weight']: typeof s[set.renderConfig?.campo2 || 'weight'] === 'object'
                        ? { 
                            value: newValue,
                            type: (s[set.renderConfig?.campo2 || 'weight']?.type || 'WEIGHT')
                          }
                        : newValue
                    } : s
                  )
                } : e
              )
            }));
            // Mark this set as modified
            setModifiedSets(prev => new Set(prev).add(set._id));
          }}
          className="w-20 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>


                      {/* Tercera categoría */}
                      <div className="flex items-center gap-2">
        <select
          value={set.renderConfig?.campo3 || 'rest'}
          className="flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
          onChange={(e) => {
            handleTypeChange(exercise._id, set._id, 'campo3', e.target.value as MeasureType);
            setModifiedSets(prev => new Set(prev).add(set._id));
          }}
        >
          {fieldOptions.campo3.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={typeof set[set.renderConfig?.campo3 || 'rest'] === 'object' 
            ? set[set.renderConfig?.campo3 || 'rest'].value 
            : set[set.renderConfig?.campo3 || 'rest'] || 0}
          onChange={(e) => {
            // Update local state only without API call
            const newValue = Number(e.target.value);
            setLocalSession(prev => ({
              ...prev,
              exercises: prev.exercises.map(e => 
                e._id === exercise._id ? {
                  ...e,
                  sets: e.sets.map(s => 
                    s._id === set._id ? {
                      ...s,
                      [set.renderConfig?.campo3 || 'rest']: typeof s[set.renderConfig?.campo3 || 'rest'] === 'object'
                        ? { 
                            value: newValue,
                            type: (s[set.renderConfig?.campo3 || 'rest']?.type || 'REST')
                          }
                        : newValue
                    } : s
                  )
                } : e
              )
            }));
            // Mark this set as modified
            setModifiedSets(prev => new Set(prev).add(set._id));
          }}
          className="w-20 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>
    </div>
  );
})}                
                {/* Botón Añadir Set */}
                <button
                  onClick={() => handleAddSet(exercise._id)}
                  className="w-full mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Añadir Set</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ExerciseSelector Modal */}
      <ExerciseSelector
        isOpen={showExerciseSelector}
        onClose={() => setShowExerciseSelector(false)}
        onSelectExercise={handleSelectExercise}
        planningId={planningId}
        weekNumber={weekNumber || parseInt(weekId, 10) || 1} // Pass the converted weekNumber, fallback to parsed weekId or 1
        selectedDay={selectedDay}
        sessionId={session._id}
      />
    </div>
  );
};

export default SesionEntrenamiento;
