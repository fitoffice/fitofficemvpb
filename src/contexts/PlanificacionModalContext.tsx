import React, { createContext, useContext, useState, ReactNode } from 'react';
import PopupCrearPlanificacion from '../components/Routines/PopupCrearPlanificacion';

interface PlanificacionModalContextType {
  openModal: () => void;
  closeModal: () => void;
}

const PlanificacionModalContext = createContext<PlanificacionModalContextType | undefined>(undefined);

export const PlanificacionModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PlanificacionModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {isModalOpen && (
        <PopupCrearPlanificacion
          onClose={closeModal}
          onPlanningCreated={() => {
            // The planning will be added to the context by the PopupCrearPlanificacion component
            // No need to do anything here
          }}
        />
      )}
    </PlanificacionModalContext.Provider>
  );
};

export const usePlanificacionModal = () => {
  const context = useContext(PlanificacionModalContext);
  if (context === undefined) {
    throw new Error('usePlanificacionModal must be used within a PlanificacionModalProvider');
  }
  return context;
};