import { useState } from 'react';
import { alpha, useTheme } from '@mui/material';
import React from 'react';

export const useEjercicioHandler = (
  selectedWeeks: any[] = [], // Provide default empty array
  setSelectedWeeks: React.Dispatch<React.SetStateAction<any[]>>,
  onPeriodsChange: (periods: any[]) => void
) => {
  const theme = useTheme();
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [editingPeriodIndex, setEditingPeriodIndex] = useState<number | null>(null);

  const handleExerciseUpdate = (updatedExercise: any) => {
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
        onPeriodsChange(updatedPeriods);
      }
    }
    setEditingExercise(null);
    setEditingPeriodIndex(null);
  };

  const handleCloseEdit = () => {
    setEditingExercise(null);
    setEditingPeriodIndex(null);
  };

  const handleEditExercise = (ejercicio: any, periodIndex: number) => {
    console.log('VistaEstadisticas - Opening Edit Exercise:', {
      ejercicio,
      periodIndex,
      selectedWeeks
    });
    setEditingExercise(ejercicio);
    setEditingPeriodIndex(periodIndex);
  };

  // This function should be implemented in the component that uses this hook
  // or imported from EjercicioHandler component
  const renderEjercicio = (ejercicio: any) => {
    // Placeholder function that returns null
    // The actual implementation should be in the component that uses this hook
    return null;
  };

  return {
    editingExercise,
    editingPeriodIndex,
    setEditingExercise,
    setEditingPeriodIndex,
    handleExerciseUpdate,
    handleCloseEdit,
    handleEditExercise,
    renderEjercicio
  };
};