import React, { useState } from 'react';

interface ClaseGrupalFormData {
  tipoCreacion: string;
  nombre: string;
  descripcion: string;
  maxParticipantes: number;
  estatus: string;
}

interface ClaseGrupalFormProps {
  onSubmit: (data: ClaseGrupalFormData) => void;
}

const ClaseGrupalForm: React.FC<ClaseGrupalFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ClaseGrupalFormData>({
    tipoCreacion: '',
    nombre: '',
    descripcion: '',
    maxParticipantes: 0,
    estatus: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Creación
        </label>
        <select
          name="tipoCreacion"
          value={formData.tipoCreacion}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="regular">Clase Regular</option>
          <option value="especial">Clase Especial</option>
          <option value="taller">Taller</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Clase
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número Máximo de Participantes
        </label>
        <input
          type="number"
          name="maxParticipantes"
          value={formData.maxParticipantes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estatus
        </label>
        <select
          name="estatus"
          value={formData.estatus}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar estatus</option>
          <option value="activa">Activa</option>
          <option value="inactiva">Inactiva</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Crear Clase Grupal
        </button>
      </div>
    </form>
  );
};

export default ClaseGrupalForm;