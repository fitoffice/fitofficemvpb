import React, { createContext, useContext, useState } from 'react';
import { Licencia } from '../types/licencia';

interface LicenciaEditModalContextType {
  isEditOpen: boolean;
  selectedLicencia: Licencia | null;
  openEditModal: (licencia: Licencia) => void;
  closeEditModal: () => void;
  onLicenciaEdited: () => void;
}

const LicenciaEditModalContext = createContext<LicenciaEditModalContextType | undefined>(undefined);

export const LicenciaEditModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLicencia, setSelectedLicencia] = useState<Licencia | null>(null);

  const openEditModal = (licencia: Licencia) => {
    setSelectedLicencia(licencia);
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setSelectedLicencia(null);
  };

  const onLicenciaEdited = () => {
    closeEditModal();
    // Puedes agregar aquí lógica adicional si es necesario
  };

  return (
    <LicenciaEditModalContext.Provider 
      value={{ 
        isEditOpen, 
        selectedLicencia, 
        openEditModal, 
        closeEditModal, 
        onLicenciaEdited 
      }}
    >
      {children}
    </LicenciaEditModalContext.Provider>
  );
};

export const useLicenciaEditModal = () => {
  const context = useContext(LicenciaEditModalContext);
  if (context === undefined) {
    throw new Error('useLicenciaEditModal must be used within a LicenciaEditModalProvider');
  }
  return context;
};
