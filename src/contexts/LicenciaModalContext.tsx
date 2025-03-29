import React, { createContext, useContext, useState } from 'react';

interface LicenciaModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onLicenciaAdded: () => void;
}

const LicenciaModalContext = createContext<LicenciaModalContextType | undefined>(undefined);

export const LicenciaModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const onLicenciaAdded = () => {
    closeModal();
    // Puedes agregar aquí lógica adicional si es necesario
  };

  return (
    <LicenciaModalContext.Provider value={{ isOpen, openModal, closeModal, onLicenciaAdded }}>
      {children}
    </LicenciaModalContext.Provider>
  );
};

export const useLicenciaModal = () => {
  const context = useContext(LicenciaModalContext);
  if (context === undefined) {
    throw new Error('useLicenciaModal must be used within a LicenciaModalProvider');
  }
  return context;
};
