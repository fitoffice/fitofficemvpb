import React from 'react';
import { Shield } from 'lucide-react';
import Button from '../Common/Button';

const SeguridadSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Shield className="mr-2" /> Seguridad
      </h2>
      <p className="mb-4">Aquí puedes gestionar tu configuración de seguridad, como cambiar contraseña y activar 2FA.</p>
      <div className="space-y-4">
        <Button variant="normal">
          Cambiar Contraseña
        </Button>
        <Button variant="normal">
          Activar 2FA
        </Button>
      </div>
    </div>
  );
};

export default SeguridadSettings;