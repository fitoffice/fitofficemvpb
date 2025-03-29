import React from 'react';
import { Globe } from 'lucide-react';

const IdiomaSettings: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Globe className="mr-2" /> Idioma
      </h2>
      <div>
        <label htmlFor="idioma" className="block mb-2">Selecciona tu idioma:</label>
        <select
          id="idioma"
          className="w-full p-2 border rounded-md"
          defaultValue="Español"
        >
          <option value="Español">Español</option>
          <option value="English">English</option>
          <option value="Français">Français</option>
          <option value="Deutsch">Deutsch</option>
        </select>
      </div>
    </div>
  );
};

export default IdiomaSettings;