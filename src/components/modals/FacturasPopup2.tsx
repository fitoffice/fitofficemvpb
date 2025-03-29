import React from 'react';
import { X } from 'lucide-react';
import FacturaForm from '../Forms/FacturaForm';

interface FacturasPopup2Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const FacturasPopup2: React.FC<FacturasPopup2Props> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start overflow-y-auto pt-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl mx-4 relative">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Nueva Factura</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <FacturaForm onSubmit={(data) => {
            onSubmit(data);
            onClose();
          }} />
        </div>
      </div>
    </div>
  );
};

export default FacturasPopup2;
