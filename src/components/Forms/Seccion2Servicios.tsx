import React from 'react';
import { PlusCircle, Trash2, FileText } from 'lucide-react';
import { Servicio } from './FacturaTypes';

interface Seccion2ServiciosProps {
  servicios: Servicio[];
  handleServicioChange: (index: number, field: keyof Servicio, value: any) => void;
  addServicio: () => void;
  removeServicio: (index: number) => void;
}

const Seccion2Servicios: React.FC<Seccion2ServiciosProps> = ({
  servicios,
  handleServicioChange,
  addServicio,
  removeServicio,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Servicios</h2>
        </div>
        <button
          type="button"
          onClick={addServicio}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <PlusCircle size={18} />
          Añadir Servicio
        </button>
      </div>

      <div className="space-y-4">
        {servicios.map((servicio, index) => (
          <div key={index} className="relative p-5 bg-gray-50 rounded-lg border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Código
                </label>
                <input
                  type="text"
                  value={servicio.codigo}
                  onChange={(e) => handleServicioChange(index, 'codigo', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={servicio.nombre}
                  onChange={(e) => handleServicioChange(index, 'nombre', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  IVA (%)
                </label>
                <input
                  type="number"
                  value={servicio.iva}
                  onChange={(e) => handleServicioChange(index, 'iva', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Exento IVA
                </label>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={servicio.exentoIva}
                    onChange={(e) => handleServicioChange(index, 'exentoIva', e.target.checked)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={servicio.cantidad}
                  onChange={(e) => handleServicioChange(index, 'cantidad', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Precio Unitario
                </label>
                <input
                  type="number"
                  value={servicio.precioUnitario}
                  onChange={(e) => handleServicioChange(index, 'precioUnitario', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descuento (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={servicio.descuento}
                    onChange={(e) => handleServicioChange(index, 'descuento', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    min="0"
                    max="100"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeServicio(index)}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-700"
                      title="Eliminar servicio"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seccion2Servicios;
