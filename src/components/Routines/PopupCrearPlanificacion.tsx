import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { usePlanning } from '../../contexts/PlanningContext'; // Import the planning context

interface PopupCrearPlanificacionProps {
  onClose: () => void;
  onPlanningCreated?: () => void;
}

const PopupCrearPlanificacion: React.FC<PopupCrearPlanificacionProps> = ({
  onClose,
  onPlanningCreated,
}) => {
  const { theme } = useTheme();
  const { addPlanning } = usePlanning(); // Use the planning context

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date()));
  const [meta, setMeta] = useState('');
  const [otraMeta, setOtraMeta] = useState('');
  const [semanas, setSemanas] = useState(1);
  const [clienteId, setClienteId] = useState('');
  const [tipo, setTipo] = useState('Planificacion');

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al obtener los clientes');
        }

        const data = await response.json();
        setClientes(data);
      } catch (err: any) {
        console.error('Error al obtener los clientes:', err);
        setError(err.message);
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      let endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings';
      let requestBody: any = {
        nombre,
        descripcion,
        meta: meta === 'Otra' ? otraMeta : meta,
        semanas,
      };

      if (tipo === 'Planificacion') {
        requestBody.fechaInicio = fechaInicio;
        requestBody.tipo = tipo;
        requestBody.clienteId = clienteId || null;
      } else {
        // Si es una plantilla, usar el endpoint específico para plantillas
        endpoint = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Error al crear la planificación');
      }

      console.log('✅ Planificación creada exitosamente:', data);

      // Add the new planning to the context
      addPlanning({
        _id: data._id,
        nombre,
        descripcion,
        fechaInicio,
        meta: meta === 'Otra' ? otraMeta : meta,
        semanas,
        tipo: tipo as 'Planificacion' | 'Plantilla',
        esqueleto: data.esqueleto || null, // Use esqueleto from response if available
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (onPlanningCreated) {
        onPlanningCreated();
      }

      onClose();
    } catch (err: any) {
      console.error('Error al crear la planificación:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {tipo === 'Planificacion' ? 'Crear Planificación' : 'Crear Plantilla'}
              </h3>
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-grow">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields remain the same */}
              {/* Nombre Field */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white transition-colors"
                  required
                />
              </div>

              {/* Descripción Field */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white transition-colors"
                  rows={4}
                  required
                />
              </div>

              {/* Fecha de Inicio Field */}
              {tipo === 'Planificacion' && (
                <div>
                  <label htmlFor="fechaInicio" className="block text-sm font-semibold mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  />
                </div>
              )}

              {/* Meta Field */}
              <div>
                <label htmlFor="meta" className="block text-sm font-semibold mb-2">
                  Meta
                </label>
                <select
                  id="meta"
                  value={meta}
                  onChange={(e) => {
                    setMeta(e.target.value);
                    if (e.target.value !== 'Otra') setOtraMeta('');
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white transition-colors"
                  required
                >
                  <option value="">Selecciona una meta</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Fuerza">Fuerza</option>
                  <option value="Hipertrofia">Hipertrofia</option>
                  <option value="Resistencia">Resistencia</option>
                  <option value="Movilidad">Movilidad</option>
                  <option value="Coordinación">Coordinación</option>
                  <option value="Definición">Definición</option>
                  <option value="Recomposición">Recomposición</option>
                  <option value="Rehabilitación">Rehabilitación</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              {/* Otra Meta Field */}
              {meta === 'Otra' && (
                <div>
                  <label htmlFor="otraMeta" className="block text-sm font-semibold mb-2">
                    Especifica la meta
                  </label>
                  <input
                    type="text"
                    id="otraMeta"
                    value={otraMeta}
                    onChange={(e) => setOtraMeta(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             dark:bg-gray-700 dark:text-white transition-colors"
                    required
                    placeholder="Describe la meta específica"
                  />
                </div>
              )}

              {/* Semanas Field */}
              <div>
                <label htmlFor="semanas" className="block text-sm font-semibold mb-2">
                  Semanas
                </label>
                <input
                  type="number"
                  id="semanas"
                  value={semanas}
                  onChange={(e) => setSemanas(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white transition-colors"
                  min="1"
                  required
                />
              </div>

              {/* Tipo Field */}
              <div>
                <label htmlFor="tipo" className="block text-sm font-semibold mb-2">
                  Tipo
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           dark:bg-gray-700 dark:text-white transition-colors"
                >
                  <option value="Planificacion">Planificación</option>
                  <option value="Plantilla">Plantilla</option>
                </select>
              </div>

              {/* Cliente Field */}
              {tipo === 'Planificacion' && (
                <div>
                  <label htmlFor="clienteId" className="block text-sm font-semibold mb-2">
                    Cliente (opcional)
                  </label>
                  <select
                    id="clienteId"
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             dark:bg-gray-700 dark:text-white transition-colors"
                  >
                    <option value="">Sin cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente._id} value={cliente._id}>
                        {cliente.nombre} ({cliente.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="create"
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-400 
                           hover:from-blue-700 hover:to-blue-500 rounded-lg transform transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creando...
                    </span>
                  ) : (
                    'Crear'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCrearPlanificacion;