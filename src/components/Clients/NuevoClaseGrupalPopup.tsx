// NuevoClaseGrupalPopup.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

interface NuevoClaseGrupalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newClass?: any) => void; // Updated to accept the created class data
  isDarkMode: boolean;
}

const NuevoClaseGrupalPopup: React.FC<NuevoClaseGrupalPopupProps> = ({ isOpen, onClose, onAdd, isDarkMode }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
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
    console.log('Creando nueva Clase Grupal:', formData);

    try {
      console.log('Obteniendo token de autenticación...');
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Error: No se encontró el token de autenticación');
        throw new Error('No se encontró el token de autenticación');
      }
      console.log('Token obtenido correctamente:', token.substring(0, 15) + '...');

      console.log('Enviando petición al servidor:', `${API_URL}/servicios/grupal`);
      console.log('Datos a enviar:', JSON.stringify(formData, null, 2));
      
      const response = await axios.post(`${API_URL}/servicios/grupal`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Respuesta del servidor:', response);
      console.log('Estado de la respuesta:', response.status);
      console.log('Datos recibidos:', response.data);

      if (response.status === 201 || response.status === 200) {
        console.log('Clase grupal creada exitosamente');
        onAdd(response.data); // Pass the created data to the parent component
        onClose(); // Cerrar el popup
      } else {
        console.error('Error en la respuesta del servidor:', response);
        throw new Error('Error al crear la clase grupal');
      }
    } catch (error) {
      console.error('Error al crear la clase grupal:', error);
      console.error('Detalles del error:', error.response?.data || error.message);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${
              isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'
            } rounded-3xl shadow-2xl w-full max-w-lg relative backdrop-blur-sm backdrop-saturate-150 border ${
              isDarkMode ? 'border-gray-700/50' : 'border-gray-200/50'
            }`}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          >
            {/* Decorative elements */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl" />
            <div className="absolute -z-10 top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />

            <div className="p-8">
              <div className="absolute -top-3 -right-3">
                <button
                  onClick={onClose}
                  className={`p-2.5 rounded-full shadow-lg ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
                  } transform transition-all duration-200 hover:scale-110 hover:rotate-90 group border ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                  aria-label="Cerrar"
                >
                  <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                </button>
              </div>

              <h2 className={`text-3xl font-bold mb-8 ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              } border-b pb-3 relative`}>
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Nueva Clase Grupal
                </span>
                <div className="absolute bottom-0 left-0 w-1/3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="group">
                    <label htmlFor="nombre" className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}>
                      <span>Nombre</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Nombre de la clase"
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-gray-700/50 text-white border-gray-600' 
                          : 'bg-white/50 text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 backdrop-blur-sm`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="descripcion" className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}>
                      <span>Descripción</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                    </label>
                    <textarea
                      name="descripcion"
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Describe la clase grupal"
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-gray-700/50 text-white border-gray-600' 
                          : 'bg-white/50 text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200 backdrop-blur-sm resize-none`}
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="capacidad" className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    } group-hover:text-blue-500 transition-colors flex items-center space-x-2`}>
                      <span>Capacidad</span>
                      <div className="h-px flex-grow bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                    </label>
                    <input
                      type="number"
                      name="capacidad"
                      id="capacidad"
                      value={formData.capacidad}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="0"
                      className={`w-full px-4 py-3.5 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-gray-700/50 text-white border-gray-600' 
                          : 'bg-white/50 text-gray-900 border-gray-300'
                      } focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-400 transition-all duration-200`}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700/50">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                      isDarkMode 
                        ? 'bg-gray-700/70 text-gray-200 hover:bg-gray-600/70' 
                        : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
                    } backdrop-blur-sm`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 hover:to-purple-600"
                  >
                    Crear Clase
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NuevoClaseGrupalPopup;
