import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DocumentoModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  refreshDocumentos: () => void;
}

const DocumentoModalContext = createContext<DocumentoModalContextType | undefined>(undefined);

export const DocumentoModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const refreshDocumentos = () => setShouldRefresh(prev => !prev);

  return (
    <DocumentoModalContext.Provider value={{ isOpen, openModal, closeModal, refreshDocumentos }}>
      {children}
    </DocumentoModalContext.Provider>
  );
};

export const useDocumentoModal = () => {
  const context = useContext(DocumentoModalContext);
  if (context === undefined) {
    throw new Error('useDocumentoModal must be used within a DocumentoModalProvider');
  }
  return context;
};
