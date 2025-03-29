import React, { useState } from 'react';

interface Servicio {
  nombre: string;
  duracion: number;
  unidad: string;
  tipo: string;
}

interface SuscripcionFormData {
  nombre: string;
  descripcion: string;
  servicios: Servicio[];
}

interface SuscripcionFormProps {
  onSubmit: (data: SuscripcionFormData) => void;
}

const SuscripcionForm: React.FC<SuscripcionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<SuscripcionFormData>({
    nombre: '',
    descripcion: '',
    servicios: []
  });

  const [servicioActual, setServicioActual] = useState<Servicio>({
    nombre: '',
    duracion: 0,
    unidad: '',
    tipo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setServicioActual(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const agregarServicio = () => {
    if (servicioActual.nombre && servicioActual.duracion && servicioActual.unidad && servicioActual.tipo) {
      setFormData(prev => ({
        ...prev,
        servicios: [...prev.servicios, servicioActual]
      }));
      setServicioActual({
        nombre: '',
        duracion: 0,
        unidad: '',
        tipo: ''
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
          Nombre de la suscripción
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

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Agregar Servicio</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Servicio
            </label>
            <select
              name="tipo"
              value={servicioActual.tipo}
              onChange={handleServicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar tipo</option>
              <option value="entrenamiento">Entrenamiento</option>
              <option value="nutricion">Nutrición</option>
              <option value="fisioterapia">Fisioterapia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Servicio
            </label>
            <input
              type="text"
              name="nombre"
              value={servicioActual.nombre}
              onChange={handleServicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración
            </label>
            <input
              type="number"
              name="duracion"
              value={servicioActual.duracion}
              onChange={handleServicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad de Tiempo
            </label>
            <select
              name="unidad"
              value={servicioActual.unidad}
              onChange={handleServicioChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Seleccionar unidad</option>
              <option value="dias">Días</option>
              <option value="semanas">Semanas</option>
              <option value="meses">Meses</option>
              <option value="años">Años</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={agregarServicio}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Agregar Servicio
        </button>
      </div>

      {formData.servicios.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-4">Servicios Agregados</h3>
          <div className="space-y-2">
            {formData.servicios.map((servicio, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{servicio.nombre}</span>
                <span>{servicio.duracion} {servicio.unidad}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Crear Suscripción
        </button>
      </div>
    </form>
  );
};

export default SuscripcionForm;