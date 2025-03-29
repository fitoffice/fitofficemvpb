import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useContratoModal } from '../../../contexts/ContratoModalContext';
import { useContratos } from '../../../contexts/ContratosContext';

interface AddContratoModalProps {
  // No props needed as we're using context
}

const AddContratoModal: React.FC<AddContratoModalProps> = () => {
  const { isOpen, closeModal } = useContratoModal();
  const { addContrato } = useContratos();
  const { theme } = useTheme();
  
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [estado, setEstado] = useState<'Activo' | 'Pendiente' | 'Finalizado' | 'Cancelado'>('Activo');
  const [notas, setNotas] = useState('');
  const [crearAlerta, setCrearAlerta] = useState(false);
  const [fechaAlerta, setFechaAlerta] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !fechaInicio || !fechaFin || !estado) {
      setError('Por favor, complete todos los campos obligatorios');
      return;
    }

    if (crearAlerta && !fechaAlerta) {
      setError('Por favor, ingrese la fecha de finalización de la alerta');
      return;
    }

    // Validate that fechaAlerta is after fechaFin
    if (crearAlerta && fechaAlerta && new Date(fechaAlerta) <= new Date(fechaFin)) {
      setError('La fecha de finalización de la alerta debe ser posterior a la fecha de expiración del contrato');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('fechaInicio', fechaInicio);
      formData.append('fechaFin', fechaFin);
      formData.append('estado', estado);
      
      if (notas) formData.append('notas', notas);
      if (crearAlerta) formData.append('crearAlerta', String(crearAlerta));
      if (fechaAlerta) formData.append('fechaAlerta', fechaAlerta);

      // Use the context function to add the contract
      await addContrato({
        nombre,
        fechaInicio,
        fechaFin,
        estado,
        notas: notas || undefined,
        crearAlerta,
        fechaAlerta: fechaAlerta || undefined
      });
      
      // Reset form
      resetForm();
      // Close modal
      closeModal();
      
    } catch (error: any) {
      console.error('Error al crear contrato:', error);
      setError(error.message || 'Error al crear el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNombre('');
    setFechaInicio('');
    setFechaFin('');
    setEstado('Activo');
    setNotas('');
    setCrearAlerta(false);
    setFechaAlerta('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
        theme === 'dark' 
          ? 'bg-gray-800 text-white border border-gray-700' 
          : 'bg-white text-gray-800 border border-gray-200'
      } transform transition-all duration-300 ease-in-out`}>
        <div className="absolute -top-3 -right-3">
          <button
            onClick={handleClose}
            className={`p-2 rounded-full shadow-md ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-100 text-gray-800'
            } transition-colors duration-200`}
          >
            <X size={18} />
          </button>
        </div>
        
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-300 dark:border-gray-700">
          Añadir Nuevo Contrato
        </h2>
        
        {error && (
          <div className="mb-5 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-sm">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                } transition-all duration-200`}
                placeholder="Nombre del contrato"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Fecha de Inicio <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                  } transition-all duration-200`}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Fecha de expiración <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                  } transition-all duration-200`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-2 font-medium text-sm">
                Estado <span className="text-red-500">*</span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as any)}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                } transition-all duration-200`}
                required
              >
                <option value="Activo">Activo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            
            {/* Checkbox para Crear Alerta */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="crearAlerta"
                checked={crearAlerta}
                onChange={(e) => setCrearAlerta(e.target.checked)}
                className={`w-5 h-5 rounded border focus:ring-2 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-purple-600 focus:ring-purple-500'
                } transition-all duration-200`}
              />
              <label
                htmlFor="crearAlerta"
                className="ml-2 font-medium text-sm"
              >
                Crear alerta de contrato
              </label>
            </div>
            
            {/* Fecha de Alerta (condicional) */}
                     {/* Fecha de Alerta (condicional) */}
                     {crearAlerta && (
              <div>
                <label className="block mb-2 font-medium text-sm">
                  Fecha de finalización de la alerta <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={fechaAlerta}
                  onChange={(e) => setFechaAlerta(e.target.value)}
                  min={fechaFin || new Date().toISOString().split('T')[0]} 
                  className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                  } transition-all duration-200`}
                  required={crearAlerta}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  La fecha debe ser posterior a la fecha de expiración del contrato
                </p>
              </div>
            )}
            
            <div>
              <label className="block mb-2 font-medium text-sm">
                Notas
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className={`w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500' 
                    : 'bg-white border-gray-300 text-gray-800 focus:ring-purple-500 focus:border-purple-500'
                } transition-all duration-200`}
                placeholder="Notas adicionales"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end pt-5 mt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleClose}
                className={`px-5 py-2.5 mr-3 rounded-md font-medium text-sm ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                } transition-colors duration-200`}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium text-sm shadow-sm hover:shadow transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? 
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span> : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContratoModal;