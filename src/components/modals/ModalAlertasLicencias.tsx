import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { createPortal } from 'react-dom';
import { useAlertContext } from '../../contexts/AlertContext';
import axios from 'axios';
interface ModalAlertasLicenciasProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlertaLicencia) => void;
  setError?: (error: string) => void;
  setSuccessMessage?: (message: string) => void;
}

interface AlertaLicencia {
  nombre: string;
  fechaExpiracion: string;
  fechaFinAlerta: string;
  descripcion?: string;
}

const ModalAlertasLicencias: React.FC<ModalAlertasLicenciasProps> = ({
  isOpen,
  onClose,
  onSubmit,
  setError,
  setSuccessMessage
}) => {
  const { theme } = useTheme();
  const { addAlert } = useAlertContext();
  const [formData, setFormData] = useState<AlertaLicencia>({
    nombre: '',
    fechaExpiracion: '',
    fechaFinAlerta: '',
    descripcion: ''
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the context's addAlert function
      const success = await addAlert(formData);
      
      if (success) {
        if (setSuccessMessage) {
          setSuccessMessage('Alerta creada exitosamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        
        // Notify parent component
        onSubmit(formData);
        
        // Reset form
        setFormData({
          nombre: '',
          fechaExpiracion: '',
          fechaFinAlerta: '',
          descripcion: ''
        });
        
        // Close the modal
        onClose();
      } else {
        if (setError) {
          setError('Error al crear la alerta');
        } else {
          setLocalError('Error al crear la alerta');
        }
      }
    } catch (error: any) {
      const errorMessage = `Error al crear la alerta: ${error.message}`;
      if (setError) {
        setError(errorMessage);
      } else {
        setLocalError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-full max-w-md p-6 rounded-lg shadow-xl relative z-[10000] ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Crear Alerta Manual (No vinculada)</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {localError && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la Alerta
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Ingrese el nombre de la alerta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de la alerta
              </label>
              <input
                type="date"
                name="fechaExpiracion"
                value={formData.fechaExpiracion}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha Expiracion de Alerta
              </label>
              <input
                type="date"
                name="fechaFinAlerta"
                value={formData.fechaFinAlerta}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                rows={3}
                placeholder="Añade una descripción para la alerta..."
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Alerta'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalAlertasLicencias;