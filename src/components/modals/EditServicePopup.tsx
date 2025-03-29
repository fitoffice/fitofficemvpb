import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ServicioAsesoriaSubscripcion } from '../../types/servicios';

interface EditServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  servicio: ServicioAsesoriaSubscripcion | null;
  onSubmit: (servicio: ServicioAsesoriaSubscripcion) => void;
  isDarkMode: boolean;
}

const EditServicePopup: React.FC<EditServicePopupProps> = ({
  isOpen,
  onClose,
  servicio,
  onSubmit,
  isDarkMode,
}) => {
  const [formData, setFormData] = React.useState<{
    nombre: string;
    descripcion: string;
    serviciosAdicionales: string;
  }>({
    nombre: servicio?.nombre || '',
    descripcion: servicio?.descripcion || '',
    serviciosAdicionales: servicio?.serviciosAdicionales.join(', ') || '',
  });

  React.useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        serviciosAdicionales: servicio.serviciosAdicionales.join(', '),
      });
    }
  }, [servicio]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (servicio) {
      onSubmit({
        ...servicio,
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        serviciosAdicionales: formData.serviciosAdicionales.split(',').map(s => s.trim()).filter(Boolean),
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          
          {/* Modal Content */}
          <motion.div
            className={`relative w-full max-w-md p-6 mx-4 ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-100' 
                : 'bg-white text-gray-900'
            } rounded-lg shadow-xl`}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1 rounded-full transition-colors duration-150 ${
                isDarkMode
                  ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <h2 className={`text-xl font-semibold mb-6 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Editar Servicio
            </h2>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label htmlFor="nombre" className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 py-2 rounded-md border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                />
              </div>

              <div>
                <label htmlFor="descripcion" className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className={`w-full px-3 py-2 rounded-md border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                />
              </div>

              <div>
                <label htmlFor="serviciosAdicionales" className={`block text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Servicios Adicionales (separados por comas)
                </label>
                <input
                  type="text"
                  name="serviciosAdicionales"
                  id="serviciosAdicionales"
                  value={formData.serviciosAdicionales}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-1 focus:ring-blue-500 focus:outline-none`}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-md ${
                    isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } transition-colors duration-150`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                >
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditServicePopup;
