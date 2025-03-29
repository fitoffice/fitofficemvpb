// NuevoPackCitasPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NuevoPackCitasPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formData: any) => void;
  isDarkMode: boolean;
}

const NuevoPackCitasPopup: React.FC<NuevoPackCitasPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    numeroCitas: '',
    precio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convertir los campos numéricos
      const formDataToSubmit = {
        ...formData,
        numeroCitas: parseInt(formData.numeroCitas),
        precio: parseFloat(formData.precio)
      };

      console.log('Enviando datos del pack de citas:', formDataToSubmit);
      onAdd(formDataToSubmit);
    } catch (error) {
      console.error('Error al crear el pack de citas:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-300 ease-in-out`}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="absolute -top-2 -right-2">
              <button
                onClick={onClose}
                className={`p-2 rounded-full shadow-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                } transform transition-all duration-200 hover:scale-110 group`}
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
              </button>
            </div>

            <h2 className={`text-3xl font-bold mb-8 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-900'
            } border-b pb-3`}>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Nuevo Pack de Citas
              </span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label htmlFor="nombre" className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  } group-hover:text-blue-500 transition-colors`}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ingrese el nombre del pack"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200`}
                  />
                </div>

                <div className="group">
                  <label htmlFor="descripcion" className={`block text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  } group-hover:text-blue-500 transition-colors`}>
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Describa los detalles del pack"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 resize-none`}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="numeroCitas" className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors`}>
                      Número de Citas
                    </label>
                    <input
                      type="number"
                      name="numeroCitas"
                      id="numeroCitas"
                      value={formData.numeroCitas}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="0"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-gray-700 text-white border-gray-600' 
                          : 'bg-white text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="precio" className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors`}>
                      Precio
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                      <input
                        type="number"
                        name="precio"
                        id="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-3 rounded-xl border ${
                          isDarkMode 
                            ? 'bg-gray-700 text-white border-gray-600' 
                            : 'bg-white text-gray-900 border-gray-300'
                        } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Crear Pack
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NuevoPackCitasPopup;
