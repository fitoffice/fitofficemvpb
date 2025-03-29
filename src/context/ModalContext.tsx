import React, { createContext, useContext, useState, ReactNode } from 'react';
import CreateRoutineModal from '../components/Routines/CreateRoutineModal';

interface ModalContextType {
  openRoutineModal: (props: any) => void;
  closeRoutineModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRoutineModalOpen, setIsRoutineModalOpen] = useState(false);
  const [routineModalProps, setRoutineModalProps] = useState<any>(null);

  const openRoutineModal = (props: any) => {
    setRoutineModalProps(props);
    setIsRoutineModalOpen(true);
  };

  const closeRoutineModal = () => {
    setIsRoutineModalOpen(false);
    setRoutineModalProps(null);
  };

  return (
    <ModalContext.Provider value={{ openRoutineModal, closeRoutineModal }}>
      {children}
      {isRoutineModalOpen && routineModalProps && (
        <CreateRoutineModal
          {...routineModalProps}
          isOpen={isRoutineModalOpen}
          onClose={closeRoutineModal}
        />
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
