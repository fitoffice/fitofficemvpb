import { useState, useEffect } from 'react';

// Types
export interface Exercise {
  id: string;
  ejercicioId?: string;
  nombre?: string;
  detalles?: {
    descripcion?: string;
    grupoMuscular?: string[];
    equipo?: string[];
  };
  variante?: {
    porcentaje?: number;
    series?: number;
    repeticiones?: number;
    descanso?: number;
  };
  apariciones?: number;
  semana?: number;
}

export interface Period {
  id: string;
  start: number;
  end: number;
  name: string;
  exercises: Exercise[];
}

export interface PlanningDay {
  id: string;
  dayNumber: number;
  exercises: Exercise[];
}

// Hook para obtener ejercicios
export const useFetchExercises = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al obtener los ejercicios');
        }
        
        const data = await response.json();
        const exercisesArray = Array.isArray(data) ? data : data.exercises;
        setExercises(exercisesArray || []);
      } catch (error) {
        console.error('Error al cargar los ejercicios:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExercises();
  }, []);

  return { exercises, loading, error };
};

// Función para obtener ejercicios dentro de un rango de días
export const getEjerciciosEnPeriodo = (exercises: Exercise[], plan: PlanningDay[] | null, startDay: number, endDay: number): Exercise[] => {
  if (!plan || !Array.isArray(exercises)) return [];
  return exercises.map(exercise => ({
    ...exercise,
    apariciones: Math.floor(Math.random() * 5) + 1,
    semana: Math.ceil(Math.random() * (endDay - startDay + 1) / 7) + Math.ceil(startDay / 7)
  }));
};

// Funciones de utilidad para días y semanas
export const getDayOfWeek = (totalDays: number): number => {
  return ((totalDays - 1) % 7) + 1;
};

export const getWeekAndDay = (totalDays: number) => {
  const week = Math.ceil(totalDays / 7);
  const day = getDayOfWeek(totalDays);
  return { week, day };
};

// Funciones para manejar ejercicios y periodos
export const handleExerciseUpdate = (
  selectedWeeks: Period[],
  editingPeriodIndex: number | null,
  updatedExercise: Exercise,
  setSelectedWeeks: React.Dispatch<React.SetStateAction<Period[]>>,
  setEditingExercise: React.Dispatch<React.SetStateAction<Exercise | null>>,
  setEditingPeriodIndex: React.Dispatch<React.SetStateAction<number | null>>
) => {
  console.log('VistaEstadisticas - Updating Exercise:', {
    updatedExercise,
    editingPeriodIndex,
    currentPeriods: selectedWeeks
  });
  
  if (editingPeriodIndex !== null) {
    const updatedPeriods = [...selectedWeeks];
    const periodExercises = updatedPeriods[editingPeriodIndex].exercises || [];
    const exerciseIndex = periodExercises.findIndex(ex => ex.id === updatedExercise.id);
    
    console.log('VistaEstadisticas - Exercise Update Details:', {
      periodExercises,
      exerciseIndex,
      foundExercise: exerciseIndex !== -1 ? periodExercises[exerciseIndex] : null
    });
    
    if (exerciseIndex !== -1) {
      periodExercises[exerciseIndex] = updatedExercise;
      updatedPeriods[editingPeriodIndex] = {
        ...updatedPeriods[editingPeriodIndex],
        exercises: periodExercises
      };
      
      console.log('VistaEstadisticas - Updated Periods:', {
        updatedPeriods,
        modifiedPeriod: updatedPeriods[editingPeriodIndex]
      });
      
      setSelectedWeeks(updatedPeriods);
    }
  }
  setEditingExercise(null);
  setEditingPeriodIndex(null);
};

// Función para añadir una nueva semana
export const handleAddWeek = (
  weekDays: { id: string; dayNumber: number }[],
  setWeekDays?: React.Dispatch<React.SetStateAction<{ id: string; dayNumber: number }[]>>,
  onAddWeek?: () => void
) => {
  // Calculate the new week's start and end days
  const currentTotalDays = weekDays.length;
  const newWeekStartDay = currentTotalDays + 1;
  const newWeekEndDay = currentTotalDays + 7;
  
  // Create new weekDays array with the additional week
  const newWeekDays = [
    ...weekDays,
    ...Array.from({ length: 7 }, (_, i) => ({
      id: `day-${newWeekStartDay + i}`,
      dayNumber: newWeekStartDay + i
    }))
  ];
  
  console.log('Adding new week:', {
    currentTotalDays,
    newWeekStartDay,
    newWeekEndDay,
    newTotalDays: newWeekDays.length
  });
  
  // Update state if setter function is provided
  if (setWeekDays) {
    setWeekDays(newWeekDays);
  }
  
  // Call callback function if provided
  if (onAddWeek) {
    onAddWeek();
  }
  
  return newWeekDays;
};