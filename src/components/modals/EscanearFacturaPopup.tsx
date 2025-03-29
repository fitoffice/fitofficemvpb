import React from 'react';
import PopupReutilizable from '../Common/PopupReutilizable';
import EscanearFacturaForm from '../Forms/EscanearFacturaForm';

interface EscanearFacturaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

const EscanearFacturaPopup: React.FC<EscanearFacturaPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Escanear Factura"
    >
      <EscanearFacturaForm onSubmit={(formData) => {
        onSubmit(formData);
        onClose();
      }} />
    </PopupReutilizable>
  );
};

export default EscanearFacturaPopup;