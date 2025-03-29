import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AddLicenciaModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const AddLicenciaModalContext = createContext<AddLicenciaModalContextType | undefined>(undefined);

export const AddLicenciaModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    console.log('AddLicenciaModalContext: openModal called, setting isModalOpen to true');
    setIsModalOpen(true);
    console.log('AddLicenciaModalContext: isModalOpen state after update:', true);
  };

  const closeModal = () => {
    console.log('AddLicenciaModalContext: closeModal called, setting isModalOpen to false');
    setIsModalOpen(false);
    console.log('AddLicenciaModalContext: isModalOpen state after update:', false);
  };

  console.log('AddLicenciaModalContext: Current isModalOpen state:', isModalOpen);

  return (
    <AddLicenciaModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </AddLicenciaModalContext.Provider>
  );
};

export const useAddLicenciaModal = (): AddLicenciaModalContextType => {
  const context = useContext(AddLicenciaModalContext);
  if (context === undefined) {
    console.error('useAddLicenciaModal: Error - hook used outside of AddLicenciaModalProvider');
    throw new Error('useAddLicenciaModal must be used within an AddLicenciaModalProvider');
  }
  console.log('useAddLicenciaModal: Hook called, current isModalOpen:', context.isModalOpen);
  return context;
};