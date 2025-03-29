import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ClaseGrupal } from '../../types/servicios';

interface EditPopupClaseGrupalProps {
  isOpen: boolean;
  onClose: () => void;
  clase: ClaseGrupal | null;
  onSubmit: (clase: ClaseGrupal) => void;
  isDarkMode: boolean;
}

const EditPopupClaseGrupal: React.FC<EditPopupClaseGrupalProps> = ({
  isOpen,
  onClose,
  clase,
  onSubmit,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState<{
    nombre: string;
    descripcion: string;
    capacidad: number;
  }>({
    nombre: '',
    descripcion: '',
    capacidad: 0,
  });

  useEffect(() => {
    if (clase) {
      setFormData({
        nombre: clase.nombre,
        descripcion: clase.descripcion,
        capacidad: clase.capacidad,
      });
    }
  }, [clase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacidad' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clase) {
      onSubmit({
        ...clase,
        ...formData,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con efecto de desenfoque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md overflow-hidden ${
                isDarkMode
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              } rounded-lg shadow-xl relative`}
            >
              <div className={`px-6 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Editar Clase Grupal
                  </h3>
                  <button
                    onClick={onClose}
                    className={`p-1 rounded-full hover:bg-opacity-20 ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="nombre"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="descripcion"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="capacidad"
                      className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}
                    >
                      Capacidad
                    </label>
                    <input
                      type="number"
                      id="capacidad"
                      name="capacidad"
                      value={formData.capacidad}
                      onChange={handleInputChange}
                      min="0"
                      className={`w-full px-3 py-2 rounded-md ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600'
                      } border focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-md ${
                      isDarkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    } transition-colors duration-200`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditPopupClaseGrupal;
