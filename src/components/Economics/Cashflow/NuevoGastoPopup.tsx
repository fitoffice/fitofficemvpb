import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface Cliente {
  _id: string;
  nombre: string;
}

interface Servicio {
  _id: string;
  nombre: string;
}

interface NuevoGasto {
  importe: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
  estado: string;
  clientId?: string;
  serviceId?: string;
}

interface NuevoGastoPopupProps {
  onClose: () => void;
  onSubmit: (gasto: NuevoGasto) => void;
}

const NuevoGastoPopup: React.FC<NuevoGastoPopupProps> = ({ onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tipoAsociacion, setTipoAsociacion] = useState<'cliente' | 'servicio' | ''>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const [formData, setFormData] = useState<NuevoGasto>({
    importe: 0,
    moneda: 'EUR',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    categoria: 'otros',
    tipo: 'variable',
    estado: 'pendiente'
  });

  useEffect(() => {
    if (tipoAsociacion) {
      fetchData();
    }
  }, [tipoAsociacion]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (tipoAsociacion === 'cliente') {
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al cargar los clientes');
        const data = await response.json();
        setClientes(data);
      } else if (tipoAsociacion === 'servicio') {
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Error al cargar los servicios');
        const data = await response.json();
        setServicios(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'importe' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el gasto');
      }

      const nuevoGasto = await response.json();
      onSubmit(nuevoGasto);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el gasto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">Nuevo Gasto</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            {/* Importe */}
            <div>
              <label htmlFor="importe" className="block text-sm font-medium text-gray-700 mb-1">
                Importe (€)
              </label>
              <input
                type="number"
                id="importe"
                name="importe"
                value={formData.importe}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            {/* Moneda */}
            <div>
              <label htmlFor="moneda" className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                id="moneda"
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="alquiler">Alquiler</option>
                <option value="servicios">Servicios</option>
                <option value="equipamiento">Equipamiento</option>
                <option value="marketing">Marketing</option>
                <option value="personal">Personal</option>
                <option value="otros">Otros</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="fijo">Fijo</option>
                <option value="variable">Variable</option>
              </select>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              >
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Asociación */}
            <div>
              <label htmlFor="tipoAsociacion" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Asociación
              </label>
              <select
                id="tipoAsociacion"
                name="tipoAsociacion"
                value={tipoAsociacion}
                onChange={(e) => setTipoAsociacion(e.target.value as 'cliente' | 'servicio' | '')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">Sin asociación</option>
                <option value="cliente">Cliente</option>
                <option value="servicio">Servicio</option>
              </select>
            </div>

            {tipoAsociacion === 'cliente' && (
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
                  Cliente
                </label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente._id} value={cliente._id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {tipoAsociacion === 'servicio' && (
              <div>
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio._id} value={servicio._id}>
                      {servicio.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Descripción del gasto..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Guardar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoGastoPopup;
