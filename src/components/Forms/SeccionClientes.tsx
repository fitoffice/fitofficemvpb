import React from 'react';
import { Users } from 'lucide-react';
import { Cliente, Direccion } from './FacturaTypes';

interface SeccionClientesProps {
  formData: {
    tipoPersona: 'fisica' | 'juridica';
    nombre: string;
    apellidos: string;
    telefono: string;
    email: string;
    nif: string;
    clienteId: string;
    comentarios: string;
    direccion: Direccion;
  };
  clientes: Cliente[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDireccionChange: (campo: keyof Direccion, valor: string) => void;
  handleClienteSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const SeccionClientes: React.FC<SeccionClientesProps> = ({
  formData,
  clientes,
  handleChange,
  handleDireccionChange,
  handleClienteSelect,
  setFormData,
}) => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Información Adicional</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cliente y Datos Personales */}
          <div className="space-y-4 md:col-span-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Seleccionar Cliente
              </label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleClienteSelect}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente._id} value={cliente._id}>{cliente.nombre}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Persona */}
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="tipoPersona"
                  value="fisica"
                  checked={formData.tipoPersona === 'fisica'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoPersona: e.target.value }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Persona Física</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="tipoPersona"
                  value="juridica"
                  checked={formData.tipoPersona === 'juridica'}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipoPersona: e.target.value }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Persona Jurídica</span>
              </label>
            </div>

            {/* Datos Personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
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
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {formData.tipoPersona === 'juridica' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    NIF
                  </label>
                  <input
                    type="text"
                    name="nif"
                    value={formData.nif}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              )}
            </div>

            {/* Sección de Dirección del Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Calle
                </label>
                <input
                  type="text"
                  value={formData.direccion.calle}
                  onChange={(e) => handleDireccionChange('calle', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.direccion.numero}
                  onChange={(e) => handleDireccionChange('numero', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ciudad
                </label>
                <input
                  type="text"
                  value={formData.direccion.ciudad}
                  onChange={(e) => handleDireccionChange('ciudad', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Código Postal
                </label>
                <input
                  type="text"
                  value={formData.direccion.codigoPostal}
                  onChange={(e) => handleDireccionChange('codigoPostal', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Provincia
                </label>
                <input
                  type="text"
                  value={formData.direccion.provincia}
                  onChange={(e) => handleDireccionChange('provincia', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  País
                </label>
                <input
                  type="text"
                  value={formData.direccion.pais}
                  onChange={(e) => handleDireccionChange('pais', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Comentario */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Comentario
            </label>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Añade cualquier nota o comentario relevante..."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SeccionClientes;
