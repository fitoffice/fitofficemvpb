import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AsociarGastoPopupProps {
  gastoId: string;
  onClose: () => void;
  onSubmit: (data: { serviceId?: string; planId?: string; tipo: 'servicio' | 'planPago' }) => void;
}

interface Servicio {
  _id: string;
  nombre: string;
  precio: number;
  tipo?: string;
  descripcion?: string;
}

interface PlanPago {
  _id: string;
  nombre: string;
  monto: number;
  precio?: number;
  frecuencia?: string;
  duracion?: number;
  detalles?: string;
  servicio?: {
    nombre: string;
    tipo?: string;
    _id: string;
  };
}

const AsociarGastoPopup: React.FC<AsociarGastoPopupProps> = ({
  gastoId,
  onClose,
  onSubmit,
}) => {
  const { theme } = useTheme();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [planesPago, setPlanesPago] = useState<PlanPago[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tipo, setTipo] = useState<'servicio' | 'planPago'>('servicio');

  useEffect(() => {
    fetchServicios();
    fetchPlanesPago();
  }, []);

  const fetchServicios = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Solicitando servicios...');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los servicios');
      }

      const data = await response.json();
      console.log('Servicios recibidos:', data);
      setServicios(data);
    } catch (err) {
      console.error('Error en fetchServicios:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const fetchPlanesPago = async () => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      console.log('Solicitando planes de pago...');
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/paymentplans', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los planes de pago');
      }

      const data = await response.json();
      console.log('Planes de pago recibidos:', data);
      setPlanesPago(data);
    } catch (err) {
      console.error('Error en fetchPlanesPago:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };
  const handleItemClick = async (item: Servicio | PlanPago, tipo: 'servicio' | 'planPago') => {
    try {
      const token = localStorage.getItem('token');
      console.log('=== INICIO ASOCIACIÓN DE GASTO ===');
      console.log('Item seleccionado:', JSON.stringify(item, null, 2));
      console.log('Tipo de item:', tipo);
      console.log('ID del gasto a asociar:', gastoId);
      console.log('Token disponible:', token ? 'Sí' : 'No');

      const requestBody = {
        itemId: item._id,
        tipo: tipo
      };
      console.log('Datos a enviar:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/gastos/${gastoId}/asociar`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Respuesta status:', response.status);
      console.log('Respuesta OK:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error respuesta:', errorText);
        throw new Error(`Error al asociar el gasto: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Respuesta de asociación exitosa:', result);
      console.log('Datos enviados a onSubmit:', {
        serviceId: tipo === 'servicio' ? item._id : undefined,
        planId: tipo === 'planPago' ? item._id : undefined,
        tipo
      });

      onSubmit({
        serviceId: tipo === 'servicio' ? item._id : undefined,
        planId: tipo === 'planPago' ? item._id : undefined,
        tipo
      });
      console.log('=== FIN ASOCIACIÓN DE GASTO ===');
      onClose();
    } catch (err) {
      console.error('Error completo al asociar:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className={`
      relative
      w-full max-w-3xl
      h-auto max-h-[80vh]
      p-8
      rounded-lg
      shadow-xl
      ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
    `}>
    <button
          onClick={onClose}
          className={`
            absolute top-4 right-4
            p-2
            rounded-full
            transition-colors duration-200
            ${theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}
          `}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Asociar Gasto</h2>

        <div className="mb-6">
        <div className="flex gap-6 mb-6">
            <button
              onClick={() => setTipo('servicio')}
              className={`
                flex-1 py-3 px-6 rounded-xl font-semibold
                transition-all duration-200 transform hover:scale-105
                shadow-md hover:shadow-lg
                ${tipo === 'servicio'
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              Servicios
            </button>
            <button
              onClick={() => setTipo('planPago')}
              className={`
                flex-1 py-3 px-6 rounded-xl font-semibold
                transition-all duration-200 transform hover:scale-105
                shadow-md hover:shadow-lg
                ${tipo === 'planPago'
                  ? theme === 'dark'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
              `}
            >
              Planes de Pago
            </button>
          </div>

          {error && (
            <div className={`
              p-4 mb-4 rounded-lg
              ${theme === 'dark' ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'}
            `}>
              {error}
            </div>
          )}

          <div className="max-h-60 overflow-y-auto">
          {tipo === 'servicio' ? (
              servicios.length > 0 ? (
                <div className="space-y-3">
                {servicios.map((servicio) => (
                  <button
                    key={servicio._id}
                    onClick={() => handleItemClick(servicio, 'servicio')}
                    className={`
                      w-full p-4 text-left rounded-xl
                      transition-all duration-200 transform hover:scale-102
                      border border-transparent
                      shadow-sm hover:shadow-md
                      ${theme === 'dark'
                        ? 'hover:bg-gray-700 hover:border-gray-600 bg-gray-800/50'
                        : 'hover:bg-gray-50 hover:border-gray-200 bg-white'}
                    `}
                  >
                    <div className="font-semibold text-lg mb-1">{servicio.nombre}</div>
                    {servicio.tipo && (
                      <div className={`
                        text-sm px-2 py-1 rounded-md inline-block mb-2
                        ${theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-700'}
                      `}>
                        {servicio.tipo}
                      </div>
                    )}
                    {servicio.descripcion && (
                      <div className={`
                        text-sm line-clamp-2
                        ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                      `}>
                        {servicio.descripcion}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              ) : ( 
                <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No hay servicios disponibles
                </p>
              )
                 ) : (
                  planesPago.length > 0 ? (
                    <div className="space-y-3">
                    {planesPago.map((plan) => (
                      <button
                        key={plan._id}
                        onClick={() => handleItemClick(plan, 'planPago')}
                        className={`
                          w-full p-4 text-left rounded-xl
                          transition-all duration-200 transform hover:scale-102
                          border border-transparent
                          shadow-sm hover:shadow-md
                          ${theme === 'dark'
                            ? 'hover:bg-gray-700 hover:border-gray-600 bg-gray-800/50'
                            : 'hover:bg-gray-50 hover:border-gray-200 bg-white'}
                        `}
                      >
                        <div className="font-semibold text-lg mb-2">{plan.nombre}</div>
                        {plan.servicio && (
                          <div className={`
                            text-sm px-3 py-1 rounded-full inline-block mb-2
                            ${theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-600'}
                          `}>
                            Servicio: {plan.servicio.nombre}
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          {plan.frecuencia && (
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Frecuencia:</span> {plan.frecuencia}
                            </div>
                          )}
                          {plan.duracion && (
                            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              <span className="font-medium">Duración:</span> {plan.duracion} {plan.frecuencia === 'Mensual' ? 'meses' : 
                                        plan.frecuencia === 'Semanal' ? 'semanas' : 
                                        plan.frecuencia === 'Anual' ? 'años' : 'periodos'}
                            </div>
                          )}
                        </div>
                        {plan.detalles && (
                          <div className={`
                            text-sm line-clamp-2 mb-2 italic
                            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
                          `}>
                            {plan.detalles}
                          </div>
                        )}
                        <div className={`
                          text-sm font-semibold px-3 py-1 rounded-lg inline-block
                          ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                        `}>
                          Precio: ${plan.precio || plan.monto}
                        </div>
                      </button>
                    ))}
                  </div>
                  ) : ( 
                    <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      No hay planes de pago disponibles
                    </p>            
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsociarGastoPopup;
