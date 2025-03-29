import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Exercise {
  name: string;
  metrics: Array<{ type: string; value: string }>;
  notes: string;
}

interface Routine {
  _id?: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RoutineCreationContextType {
  pendingRoutine: Routine | null;
  setPendingRoutine: (routine: Routine | null) => void;
  savePendingRoutine: () => void;
  hasPendingRoutine: boolean;
}

const RoutineCreationContext = createContext<RoutineCreationContextType | undefined>(undefined);

export const useRoutineCreation = () => {
  const context = useContext(RoutineCreationContext);
  if (!context) {
    throw new Error('useRoutineCreation must be used within a RoutineCreationProvider');
  }
  return context;
};

interface RoutineCreationProviderProps {
  children: ReactNode;
}

export const RoutineCreationProvider: React.FC<RoutineCreationProviderProps> = ({ children }) => {
  const [pendingRoutine, setPendingRoutine] = useState<Routine | null>(null);

  const savePendingRoutine = () => {
    // This function will be called when we want to actually save the routine
    // For now it just clears the pending routine
    setPendingRoutine(null);
  };

  const hasPendingRoutine = pendingRoutine !== null;

  return (
    <RoutineCreationContext.Provider 
      value={{ 
        pendingRoutine, 
        setPendingRoutine, 
        savePendingRoutine,
        hasPendingRoutine
      }}
    >
      {children}
    </RoutineCreationContext.Provider>
  );
};