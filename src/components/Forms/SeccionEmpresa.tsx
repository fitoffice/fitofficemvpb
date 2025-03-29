import React from 'react';
import { Building2 } from 'lucide-react';

interface SeccionEmpresaProps {
  formData: {
    nombreEmisor: string;
    direccionEmisor: string;
    nifEmisor: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SeccionEmpresa: React.FC<SeccionEmpresaProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Datos de la Empresa</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            name="nombreEmisor"
            value={formData.nombreEmisor}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Dirección de la Empresa
          </label>
          <input
            type="text"
            name="direccionEmisor"
            value={formData.direccionEmisor}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            NIF de la Empresa
          </label>
          <input
            type="text"
            name="nifEmisor"
            value={formData.nifEmisor}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default SeccionEmpresa;
