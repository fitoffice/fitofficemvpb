import React, { useState } from 'react';

interface Subtipo {
  nombre: string;
  servicio: string;
}

interface AsesoriaFormData {
  nombre: string;
  descripcion: string;
  duracionUnidad: string;
  duracionValor: number;
  subtipos: Subtipo[];
}

interface AsesoriaFormProps {
  onSubmit: (data: AsesoriaFormData) => void;
}

const AsesoriaForm: React.FC<AsesoriaFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<AsesoriaFormData>({
    nombre: '',
    descripcion: '',
    duracionUnidad: '',
    duracionValor: 0,
    subtipos: []
  });

  const [subtipoActual, setSubtipoActual] = useState<Subtipo>({
    nombre: '',
    servicio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubtipoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSubtipoActual(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarSubtipo = () => {
    if (subtipoActual.nombre && subtipoActual.servicio) {
      setFormData(prev => ({
        ...prev,
        subtipos: [...prev.subtipos, subtipoActual]
      }));
      setSubtipoActual({
        nombre: '',
        servicio: ''
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la asesoría
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad de Duración
          </label>
          <select
            name="duracionUnidad"
            value={formData.duracionUnidad}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="">Seleccionar unidad</option>
            <option value="semanas">Semanas</option>
            <option value="meses">Meses</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duración
          </label>
          <input
            type="number"
            name="duracionValor"
            value={formData.duracionValor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
            min="1"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Agregar Subtipo</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Subtipo
            </label>
            <input
              type="text"
              name="nombre"
              value={subtipoActual.nombre}
              onChange={handleSubtipoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Servicio
            </label>
            <input
              type="text"
              name="servicio"
              value={subtipoActual.servicio}
              onChange={handleSubtipoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={agregarSubtipo}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Añadir Subtipo
        </button>
      </div>

      {formData.subtipos.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Subtipos Agregados</h3>
          <div className="space-y-2">
            {formData.subtipos.map((subtipo, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{subtipo.nombre}</span>
                <span>{subtipo.servicio}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Crear Asesoría
        </button>
      </div>
    </form>
  );
};

export default AsesoriaForm;