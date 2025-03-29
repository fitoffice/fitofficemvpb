import React from 'react';
import { CreditCard } from 'lucide-react';
import Button from '../Common/Button';

const FacturacionSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <CreditCard className="mr-2" /> Facturación
      </h2>
      <p className="mb-4">Gestiona tus métodos de pago, visualiza tus facturas y suscripciones.</p>
      <Button variant="normal">
        Gestionar Métodos de Pago
      </Button>
    </div>
  );
};

export default FacturacionSettings;