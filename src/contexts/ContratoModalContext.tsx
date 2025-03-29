import React, { createContext, useContext, useState } from 'react';

interface ContratoModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onContratoAdded: () => void;
}

const ContratoModalContext = createContext<ContratoModalContextType | undefined>(undefined);

export const ContratoModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const onContratoAdded = () => {
    closeModal();
    // You can add additional logic here if needed
  };

  return (
    <ContratoModalContext.Provider value={{ isOpen, openModal, closeModal, onContratoAdded }}>
      {children}
    </ContratoModalContext.Provider>
  );
};

export const useContratoModal = () => {
  const context = useContext(ContratoModalContext);
  if (context === undefined) {
    throw new Error('useContratoModal must be used within a ContratoModalProvider');
  }
  return context;
};
