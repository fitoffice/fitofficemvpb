import React from 'react';

interface DatosDestinatarioProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  theme: string;
}

const DatosDestinatario: React.FC<DatosDestinatarioProps> = ({ formData, handleChange, theme }) => {
  return (
    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
      <h3 className="text-lg font-semibold mb-4">Datos del Destinatario</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Tipo de Persona</label>
          <select
            name="tipoPersona"
            value={formData.tipoPersona}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          >
            <option value="fisica">Persona Física</option>
            <option value="juridica">Persona Jurídica</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Tipo de Destinatario</label>
          <select
            name="tipoDestinatario"
            value={formData.tipoDestinatario}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          >
            <option value="cliente">Cliente</option>
            <option value="proveedor">Proveedor</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required={formData.tipoPersona === 'fisica'}
          />
        </div>
        <div>
          <label className="block mb-1">NIF/CIF</label>
          <input
            type="text"
            name="nif"
            value={formData.nif}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>
      
      <h4 className="text-md font-semibold mt-4 mb-2">Dirección</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Calle</label>
          <input
            type="text"
            name="direccion.calle"
            value={formData.direccion.calle}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">Número</label>
          <input
            type="text"
            name="direccion.numero"
            value={formData.direccion.numero}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">Ciudad</label>
          <input
            type="text"
            name="direccion.ciudad"
            value={formData.direccion.ciudad}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">Código Postal</label>
          <input
            type="text"
            name="direccion.codigoPostal"
            value={formData.direccion.codigoPostal}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">Provincia</label>
          <input
            type="text"
            name="direccion.provincia"
            value={formData.direccion.provincia}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block mb-1">País</label>
          <input
            type="text"
            name="direccion.pais"
            value={formData.direccion.pais}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              theme === 'dark' ? 'bg-gray-600 border-gray-500' : 'bg-white border-gray-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default DatosDestinatario;