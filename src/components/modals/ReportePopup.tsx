import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import ReporteForm from '../Forms/ReporteForm';

interface ReportePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const ReportePopup: React.FC<ReportePopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Reporte Recurrente"
    >
      <ReporteForm 
        onSubmit={(formData) => {
          onSubmit(formData);
          onClose();
        }}
      />
    </PopupReutilizable>
  );
};

export default ReportePopup;