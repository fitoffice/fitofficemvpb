import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from '../Common/Button';

const SoporteSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <HelpCircle className="mr-2" /> Soporte
      </h2>
      <p className="mb-4">Aquí puedes contactar con el soporte o acceder a recursos de ayuda.</p>
      <Button variant="normal">
        Contactar Soporte
      </Button>
    </div>
  );
};

export default SoporteSettings;