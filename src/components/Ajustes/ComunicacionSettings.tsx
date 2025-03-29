import React from 'react';
import { MessageCircle } from 'lucide-react';

const ComunicacionSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MessageCircle className="mr-2" /> Preferencias de Comunicación
      </h2>
      <p className="mb-4"> cómo y cuándo deseas recibir comunicaciones.</p>
      {/* Aquí puedes añadir opciones específicas de comunicación */}
    </div>
  );
};

export default ComunicacionSettings;