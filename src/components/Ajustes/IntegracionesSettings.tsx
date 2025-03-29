import React from 'react';
import { Link } from 'lucide-react';
import Button from '../Common/Button';

const IntegracionesSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Link className="mr-2" /> Integraciones
      </h2>
      <p className="mb-4">Aquí puedes conectar con tus herramientas favoritas como Google Calendar, plataformas de pago, etc.</p>
      <Button variant="normal">
        Conectar Google Calendar
      </Button>
    </div>
  );
};

export default IntegracionesSettings;