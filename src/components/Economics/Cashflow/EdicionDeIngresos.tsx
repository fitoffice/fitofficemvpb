import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import Button from '../../Common/Button';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
}

interface PlanDePago {
  _id: string;
  nombre: string;
  precio: number;
}

interface Ingreso {
  _id: string;
  entrenador: string;
  cliente: Cliente;
  planDePago: PlanDePago;
  importe: number;
  moneda: string;
  estado: string;
  metodoPago: string;
  fecha: string;
  descripcion: string;
}

interface EdicionDeIngresosProps {
  ingreso: Ingreso;
  onClose: () => void;
  onSave: (ingresoActualizado: Ingreso) => void;
}


const EdicionDeIngresos: React.FC<EdicionDeIngresosProps> = ({ ingreso, onClose, onSave }) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Ingreso>(ingreso);
  const [planesDePago, setPlanesDePago] = useState<PlanDePago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlanesDePago = async () => {
      console.log('Iniciando fetchPlanesDePago');
      try {
        const token = localStorage.getItem('token');
        console.log('Token obtenido:', token ? 'Token existe' : 'Token no encontrado');
        
        console.log('Realizando petición a API de planes de pago');
        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/payment-plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log('Respuesta recibida, status:', response.status);
        if (!response.ok) throw new Error('Error al cargar planes de pago');
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setPlanesDePago(data);
      } catch (error) {
        console.error('Error completo:', error);
        setError('Error al cargar planes de pago');
      }
    };

    fetchPlanesDePago();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'planDePago') {
      if (value === '') {
        // Si se selecciona "Ningún plan de pago"
        setFormData(prev => ({
          ...prev,
          planDePago: null as any
        }));
      } else {
        // Buscar el plan de pago seleccionado
        const planSeleccionado = planesDePago.find(plan => plan._id === value);
        if (planSeleccionado) {
          setFormData(prev => ({
            ...prev,
            planDePago: planSeleccionado
          }));
        }
      }
    } else if (name === 'importe') {
      // Asegurar que importe sea un número
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // No necesitamos validar el plan de pago ya que puede ser null
    // Crear una copia del formData para enviar
    const dataToSend = {
      ...formData,
      importe: parseFloat(formData.importe.toString()) || 0, // Asegurar que importe sea número
    };
    
    // Para depuración - ver qué datos se están enviando
    console.log('Datos a enviar:', dataToSend);
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/${ingreso._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error respuesta:', errorData);
        throw new Error(errorData.message || 'Error al actualizar el ingreso');
      }
      
      const ingresoActualizado = await response.json();
      onSave(ingresoActualizado);
      onClose();
    } catch (err) {
      console.error('Error completo:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el ingreso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-${theme === 'dark' ? 'gray-800' : 'white'} rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl`}>
        <h2 className={`text-2xl font-bold mb-4 text-${theme === 'dark' ? 'white' : 'black'}`}>
          Editar Ingreso
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              importe
            </label>
            <input
              type="number"
              name="importe"
              value={formData.importe}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Moneda
            </label>
            <select
              name="moneda"
              value={formData.moneda}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="ARS">ARS</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Método de Pago
            </label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Plan de Pago
            </label>
            <select
              name="planDePago"
              value={formData.planDePago?._id || ''}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="">Ningún plan de pago</option>
              {planesDePago.map(plan => {
                // Verificar si el plan tiene un servicio asociado
                const servicioInfo = plan.servicio ? 
                  `${plan.servicio.nombre} - ${plan.servicio.tipo} - ` : '';
                
                return (
                  <option key={plan._id} value={plan._id}>
                    {servicioInfo}{plan.nombre} - {plan.precio} {plan.moneda}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha.split('T')[0]}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium text-${theme === 'dark' ? 'white' : 'gray-700'}`}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdicionDeIngresos;
