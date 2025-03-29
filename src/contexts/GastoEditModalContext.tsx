import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definir la interfaz para el contexto
interface GastoEditModalContextType {
  isEditMode: boolean;
  selectedGasto: Gasto | null;
  openEditModal: (gasto: Gasto) => void;
  closeEditModal: () => void;
  updateSelectedGasto: (updatedGasto: Partial<Gasto>) => void;
}

// Crear el contexto
const GastoEditModalContext = createContext<GastoEditModalContextType | undefined>(undefined);

// Proveedor del contexto
export const GastoEditModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);

  const openEditModal = (gasto: Gasto) => {
    setSelectedGasto(gasto);
    setIsEditMode(true);
  };

  const closeEditModal = () => {
    setIsEditMode(false);
    setSelectedGasto(null);
  };

  const updateSelectedGasto = (updatedGasto: Partial<Gasto>) => {
    if (selectedGasto) {
      setSelectedGasto({ ...selectedGasto, ...updatedGasto });
    }
  };

  return (
    <GastoEditModalContext.Provider
      value={{
        isEditMode,
        selectedGasto,
        openEditModal,
        closeEditModal,
        updateSelectedGasto
      }}
    >
      {children}
    </GastoEditModalContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useGastoEditModal = () => {
  const context = useContext(GastoEditModalContext);
  if (context === undefined) {
    throw new Error('useGastoEditModal debe ser usado dentro de un GastoEditModalProvider');
  }
  return context;
};