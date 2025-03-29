import React from 'react';
import { Bell } from 'lucide-react';

const NovedadesSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Bell className="mr-2" /> Novedades
      </h2>
      <p className="mb-4">Aquí puedes ver las últimas novedades y actualizaciones.</p>
      {/* Aquí puedes añadir una lista de novedades o un enlace a las mismas */}
    </div>
  );
};

export default NovedadesSettings;