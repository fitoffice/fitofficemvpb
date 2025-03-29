import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import ReporteActualForm from '../Forms/ReporteActualForm';

interface ReporteActualPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const ReporteActualPopup: React.FC<ReporteActualPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Reporte Actual"
    >
      <ReporteActualForm 
        onSubmit={(formData) => {
          onSubmit(formData);
          onClose();
        }}
      />
    </PopupReutilizable>
  );
};

export default ReporteActualPopup;