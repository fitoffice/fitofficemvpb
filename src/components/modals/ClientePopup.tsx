import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import ClienteForm from '../Forms/ClienteForm';

interface ClientePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const ClientePopup: React.FC<ClientePopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Cliente"
    >
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2">
        <ClienteForm 
          onSubmit={(formData) => {
            onSubmit(formData);
            onClose();
          }}
        />
      </div>
    </PopupReutilizable>
  );
};

export default ClientePopup;