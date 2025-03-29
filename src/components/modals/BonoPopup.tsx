import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import BonoForm from '../Forms/BonoForm';

interface BonoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const BonoPopup: React.FC<BonoPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Bono"
    >
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2">
        <BonoForm 
          onSubmit={(formData) => {
            onSubmit(formData);
            onClose();
          }}
        />
      </div>
    </PopupReutilizable>
  );
};

export default BonoPopup;