import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

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

interface Servicio {
  _id: string;
  nombre: string;
  precio: number;
}

interface NuevoIngresoPopupProps {
  onClose: () => void;
  onSubmit: (ingresoData: any) => void;
}

const NuevoIngresoPopup: React.FC<NuevoIngresoPopupProps> = ({ onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [planesDePago, setPlanesDePago] = useState<PlanDePago[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    importe: '',
    moneda: 'EUR',
    estado: 'pendiente',
    clienteId: '',
    planId: '',
    servicioId: '',
    metodoPago: 'efectivo',
    tipoAsociacion: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Fetch clientes
        const clientesResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const clientesData = await clientesResponse.json();
        setClientes(clientesData);

        // Fetch planes de pago
        const planesResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/payment-plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const planesData = await planesResponse.json();
        setPlanesDePago(planesData);

        // Fetch servicios
        const serviciosResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const serviciosData = await serviciosResponse.json();
        setServicios(serviciosData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
        
        <h2 className="text-xl font-semibold mb-4">Nuevo Ingreso</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Importe</label>
              <input
                type="number"
                name="importe"
                value={formData.importe}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
                required
                step="0.01"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Moneda</label>
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="pendiente">Pendiente</option>
              <option value="pagado">Pagado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Asociación</label>
            <select
              name="tipoAsociacion"
              value={formData.tipoAsociacion}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Seleccionar tipo</option>
              <option value="cliente">Cliente</option>
              <option value="servicio">Servicio</option>
              <option value="plan">Plan de Pago</option>
            </select>
          </div>

          {formData.tipoAsociacion === 'cliente' && (
            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.tipoAsociacion === 'servicio' && (
            <div>
              <label className="block text-sm font-medium mb-1">Servicio</label>
              <select
                name="servicioId"
                value={formData.servicioId}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Seleccionar servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio._id} value={servicio._id}>
                    {servicio.nombre} - {servicio.precio}€
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.tipoAsociacion === 'plan' && (
            <div>
              <label className="block text-sm font-medium mb-1">Plan de Pago</label>
              <select
                name="planId"
                value={formData.planId}
                onChange={handleChange}
                className={`w-full p-2 rounded border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              >
                <option value="">Seleccionar plan</option>
                {planesDePago.map(plan => (
                  <option key={plan._id} value={plan._id}>
                    {plan.nombre} - {plan.precio}€
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Método de Pago</label>
            <select
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleChange}
              className={`w-full p-2 rounded border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300'
              }`}
            >
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="transferencia">Transferencia</option>
              <option value="bizum">Bizum</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoIngresoPopup;
