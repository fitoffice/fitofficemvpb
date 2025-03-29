import React, { useState } from 'react';
import SuscripcionForm from './SuscripcionForm';
import AsesoriaForm from './AsesoriaForm';
import ClaseGrupalForm from './ClaseGrupalForm';
import CitaForm from './CitaForm';

type TipoServicio = 'suscripcion' | 'asesoria' | 'clase' | 'cita' | '';

interface ServicioFormProps {
  onSubmit: (tipo: TipoServicio, data: any) => void;
  onCancel: () => void;
}

const ServicioForm: React.FC<ServicioFormProps> = ({ onSubmit, onCancel }) => {
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleTipoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoServicio) {
      setMostrarFormulario(true);
    }
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(tipoServicio, data);
  };

  if (mostrarFormulario) {
    switch (tipoServicio) {
      case 'suscripcion':
        return <SuscripcionForm onSubmit={handleFormSubmit} />;
      case 'asesoria':
        return <AsesoriaForm onSubmit={handleFormSubmit} />;
      case 'clase':
        return <ClaseGrupalForm onSubmit={handleFormSubmit} />;
      case 'cita':
        return <CitaForm onSubmit={handleFormSubmit} onCancel={onCancel} />;
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleTipoSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona un servicio
        </label>
        <select
          value={tipoServicio}
          onChange={(e) => setTipoServicio(e.target.value as TipoServicio)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">Seleccionar tipo de servicio</option>
          <option value="suscripcion">Nueva Suscripción</option>
          <option value="asesoria">Asesoría Individual</option>
          <option value="clase">Clase Grupal</option>
          <option value="cita">Nueva Cita</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Continuar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ServicioForm;