// ExerciseContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Exercise } from '../components/Planning/vistasplanning/utils/estadisticasUtils';

interface ExerciseContextType {
  selectedExercise: Exercise | null;
  setSelectedExercise: (exercise: Exercise | null) => void;
  isExerciseModalOpen: boolean;
  openExerciseModal: (
    exercise: Exercise,
    periodId: string,
    planningId: string,
    periodIndex: number,
    onExerciseAdded?: () => void
  ) => void;
  closeExerciseModal: () => void;
  currentPeriodIndex: number;
  setCurrentPeriodIndex: (index: number) => void;
  currentPeriodId: string;
  setCurrentPeriodId: (id: string) => void;
  currentPlanningId: string;
  setCurrentPlanningId: (id: string) => void;
  pendingExercise: Exercise | null;
  setPendingExercise: React.Dispatch<React.SetStateAction<Exercise | null>>;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};

interface ExerciseProviderProps {
  children: ReactNode;
}

export const ExerciseProvider: React.FC<ExerciseProviderProps> = ({ children }) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [currentPeriodIndex, setCurrentPeriodIndex] = useState<number>(0);
  const [currentPeriodId, setCurrentPeriodId] = useState<string>('');
  const [currentPlanningId, setCurrentPlanningId] = useState<string>('');
  const [pendingExercise, setPendingExercise] = useState<Exercise | null>(null);

  const openExerciseModal = (
    exercise: Exercise,
    periodId: string,
    planningId: string,
    periodIndex: number,
    onExerciseAdded?: () => void
  ) => {
    console.log('Opening exercise modal with:', { exercise, periodId, planningId, periodIndex });
    setSelectedExercise(exercise);
    setCurrentPeriodId(periodId);
    setCurrentPlanningId(planningId);
    setCurrentPeriodIndex(periodIndex);
    // Aquí podrías almacenar o ejecutar el callback opcional
    setIsExerciseModalOpen(true);
  };

  const closeExerciseModal = () => {
    console.log('Closing exercise modal');
    setIsExerciseModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <ExerciseContext.Provider
      value={{
        selectedExercise,
        setSelectedExercise,
        isExerciseModalOpen,
        openExerciseModal,
        closeExerciseModal,
        currentPeriodIndex,
        setCurrentPeriodIndex,
        currentPeriodId,
        setCurrentPeriodId,
        currentPlanningId,
        setCurrentPlanningId,
        pendingExercise,
        setPendingExercise,
      }}
    >
      {children}
    </ExerciseContext.Provider>
  );
};