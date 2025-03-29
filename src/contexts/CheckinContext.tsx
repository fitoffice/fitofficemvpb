import React, { createContext, useContext, useState } from 'react';

interface BaseCheckin {
  fecha: string;
  notas: string;
  fotos: string[];
  estado: 'success' | 'warning' | 'error';
}

interface EntrenamientoCheckin extends BaseCheckin {
  tipo: 'entrenamiento';
  pesoLevantado: number;
  repeticiones: number;
  series: number;
  ejerciciosCompletados: number;
}

interface DietaCheckin extends BaseCheckin {
  tipo: 'dieta';
  peso: number;
  calorias: number;
  macros: {
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

type Checkin = EntrenamientoCheckin | DietaCheckin;

interface CheckinContextType {
  selectedCheckin: Checkin | null;
  setSelectedCheckin: (checkin: Checkin | null) => void;
}

const CheckinContext = createContext<CheckinContextType | undefined>(undefined);

export const CheckinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCheckin, setSelectedCheckin] = useState<Checkin | null>(null);

  return (
    <CheckinContext.Provider value={{ selectedCheckin, setSelectedCheckin }}>
      {children}
    </CheckinContext.Provider>
  );
};

export const useCheckin = () => {
  const context = useContext(CheckinContext);
  if (context === undefined) {
    throw new Error('useCheckin must be used within a CheckinProvider');
  }
  return context;
};
