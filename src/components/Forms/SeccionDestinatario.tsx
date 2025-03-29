import React from 'react';
import { Users } from 'lucide-react';

interface SeccionDestinatarioProps {
  formData: {
    tipoDestinatario: 'fisica' | 'juridica';
    nombre: string;
    apellidos: string;
    facturaSimplificada: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const SeccionDestinatario: React.FC<SeccionDestinatarioProps> = ({
  formData,
  handleChange,
  setFormData,
}) => {
  if (formData.facturaSimplificada) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Datos del Destinatario</h2>
      </div>

      <div className="space-y-6">
        {/* Tipo de Destinatario */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Destinatario
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoDestinatario"
                value="fisica"
                checked={formData.tipoDestinatario === 'fisica'}
                onChange={(e) => setFormData(prev => ({ ...prev, tipoDestinatario: e.target.value as 'fisica' | 'juridica' }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Persona Física</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tipoDestinatario"
                value="juridica"
                checked={formData.tipoDestinatario === 'juridica'}
                onChange={(e) => setFormData(prev => ({ ...prev, tipoDestinatario: e.target.value as 'fisica' | 'juridica' }))}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Persona Jurídica</span>
            </label>
          </div>
        </div>

        {/* Campos específicos según el tipo de destinatario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {formData.tipoDestinatario === 'fisica' ? 'Nombre' : 'Razón Social'}
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {formData.tipoDestinatario === 'fisica' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Apellidos
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeccionDestinatario;
