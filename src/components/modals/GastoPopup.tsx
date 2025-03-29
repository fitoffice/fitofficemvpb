import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import GastoForm from '../Forms/GastoForm';

interface GastoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const GastoPopup: React.FC<GastoPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Gasto"
    >
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2">
        <GastoForm 
          onSubmit={(formData) => {
            onSubmit(formData);
            onClose();
          }}
        />
      </div>
    </PopupReutilizable>
  );
};

export default GastoPopup;