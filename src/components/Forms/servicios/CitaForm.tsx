import React, { useState } from 'react';

interface CitaFormData {
  actividad: string;
  nombre: string;
  numSesiones: number;
  frecuencia: string;
  fechaCaducidad: string;
}

interface CitaFormProps {
  onSubmit: (data: CitaFormData) => void;
  onCancel: () => void;
}

const CitaForm: React.FC<CitaFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CitaFormData>({
    actividad: '',
    nombre: '',
    numSesiones: 1,
    frecuencia: '',
    fechaCaducidad: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          Elegir Actividad
        </label>
        <select
          name="actividad"
          value={formData.actividad}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar actividad</option>
          <option value="entrenamiento">Entrenamiento Personal</option>
          <option value="fisioterapia">Fisioterapia</option>
          <option value="nutricion">Nutrición</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Cita
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
          Número de Sesiones
        </label>
        <input
          type="number"
          name="numSesiones"
          value={formData.numSesiones}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          min="1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frecuencia
        </label>
        <select
          name="frecuencia"
          value={formData.frecuencia}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar frecuencia</option>
          <option value="diaria">Diaria</option>
          <option value="semanal">Semanal</option>
          <option value="quincenal">Quincenal</option>
          <option value="mensual">Mensual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Caducidad
        </label>
        <input
          type="date"
          name="fechaCaducidad"
          value={formData.fechaCaducidad}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CitaForm;