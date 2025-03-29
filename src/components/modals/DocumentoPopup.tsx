import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import DocumentoForm from '../Forms/DocumentoForm';

interface DocumentoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const DocumentoPopup: React.FC<DocumentoPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Añadir Documento"
    >
      <DocumentoForm 
        onSubmit={(formData) => {
          onSubmit(formData);
          onClose();
        }}
        onCancel={onClose}
      />
    </PopupReutilizable>
  );
};

export default DocumentoPopup;