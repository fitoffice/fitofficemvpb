import React, { createContext, useContext, useState } from 'react';
import AIRoutineModal from '../components/Routines/AIRoutineModal';

interface AIRoutineModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AIRoutineModalContext = createContext<AIRoutineModalContextType | undefined>(undefined);

export const AIRoutineModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AIRoutineModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <AIRoutineModal isOpen={isOpen} onClose={closeModal} />
    </AIRoutineModalContext.Provider>
  );
};

export const useAIRoutineModal = () => {
  const context = useContext(AIRoutineModalContext);
  if (context === undefined) {
    throw new Error('useAIRoutineModal must be used within an AIRoutineModalProvider');
  }
  return context;
};
