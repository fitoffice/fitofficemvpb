import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import ServicioForm from '../Forms/servicios/ServicioForm';

interface ServicioPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tipo: string, formData: any) => void;
}

const ServicioPopup: React.FC<ServicioPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Elegir Servicio"
    >
      <ServicioForm 
        onSubmit={(tipo, formData) => {
          onSubmit(tipo, formData);
          onClose();
        }}
        onCancel={onClose}
      />
    </PopupReutilizable>
  );
};

export default ServicioPopup;