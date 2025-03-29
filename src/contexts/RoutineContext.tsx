import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface Metric {
  type: string;
  value: string;
  _id?: string;
}

interface Exercise {
  id?: string;
  _id?: string;
  name: string;
  metrics: Metric[];
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

interface RoutineContextType {
  routines: Routine[];
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>;
  addRoutine: (routine: Routine) => void;
  updateRoutine: (id: string, updatedRoutine: Routine) => void;
  deleteRoutine: (id: string) => void;
  refreshRoutines: () => Promise<void>;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const useRoutines = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
};

interface RoutineProviderProps {
  children: ReactNode;
}

export const RoutineProvider: React.FC<RoutineProviderProps> = ({ children }) => {
  const [routines, setRoutines] = useState<Routine[]>([]);

  const addRoutine = (routine: Routine) => {
    setRoutines(prev => [...prev, routine]);
  };

  const updateRoutine = (id: string, updatedRoutine: Routine) => {
    setRoutines(prev => 
      prev.map(routine => 
        routine._id === id ? { ...routine, ...updatedRoutine } : routine
      )
    );
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(routine => routine._id !== id));
  };


  return (
    <RoutineContext.Provider 
      value={{ 
        routines, 
        setRoutines, 
        addRoutine, 
        updateRoutine, 
        deleteRoutine,
        
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
};