import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface FiltroIngresosPopupProps {
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FiltroIngresosPopup: React.FC<FiltroIngresosPopupProps> = ({ onClose, onApplyFilters }) => {
  const { theme } = useTheme();
  const [planesDePago, setPlanesDePago] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: '',
    planDePago: '',
    metodoPago: '',
    montoMinimo: '',
    montoMaximo: ''
  });

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planes-de-pago', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch planes de pago');
        }
        const data = await response.json();
        setPlanesDePago(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching planes:', error);
        setPlanesDePago([]);
      }
    };

    fetchPlanes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      fechaInicio: '',
      fechaFin: '',
      estado: '',
      planDePago: '',
      metodoPago: '',
      montoMinimo: '',
      montoMaximo: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Filtrar Ingresos</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
              <input
                type="date"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Fin</label>
              <input
                type="date"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              value={filters.estado}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Plan de Pago</label>
            <select
              name="planDePago"
              value={filters.planDePago}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Todos</option>
              {Array.isArray(planesDePago) && planesDePago.map(plan => (
                <option key={plan._id} value={plan._id}>
                  {plan.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Método de Pago</label>
            <select
              name="metodoPago"
              value={filters.metodoPago}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Todos</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="bizum">Bizum</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monto Mínimo</label>
              <input
                type="number"
                name="montoMinimo"
                value={filters.montoMinimo}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Monto Máximo</label>
              <input
                type="number"
                name="montoMaximo"
                value={filters.montoMaximo}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={handleReset} type="button">
              Resetear
            </Button>
            <Button variant="primary" type="submit">
              Aplicar Filtros
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FiltroIngresosPopup;
