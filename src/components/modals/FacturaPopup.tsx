// FacturaPopup.tsx

import React from 'react'; 
import PopupReutilizable from '../Common/PopupReutilizable';
import FacturaForm from '../Forms/FacturaForm';

interface FacturaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FacturaPopup: React.FC<FacturaPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <PopupReutilizable
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Nueva Factura"
    >
      <div className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 -mr-2">
        <FacturaForm 
          onSubmit={(data) => {
            // data es la respuesta de la API
            onSubmit(data);
            onClose();
          }}
        />
      </div>
    </PopupReutilizable>
  );
};

export default FacturaPopup;
