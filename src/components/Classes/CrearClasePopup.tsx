// src/components/Classes/CrearClasePopup.tsx

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { X } from 'lucide-react';
import axios from 'axios';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

interface CrearClasePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  isDarkMode: boolean;
}

const CrearClasePopup: React.FC<CrearClasePopupProps> = ({
  isOpen,
  onClose,
  onAdd,
  isDarkMode
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    capacidad: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creando nueva Clase Grupal:', formData);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post(`${API_URL}/servicios/grupal`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        onAdd(); // Actualizar la lista de servicios
        onClose(); // Cerrar el popup
      } else {
        throw new Error('Error al crear la clase grupal');
      }
    } catch (error) {
      console.error('Error al crear la clase grupal:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  // Usamos React Portal para que el modal se monte en el <body>
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-4xl rounded-2xl shadow-2xl 
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
          mx-4  /* Para dar un margen horizontal en móviles */
        `}
      >
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          } flex justify-between items-center`}
        >
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Nueva Clase Grupal
          </h3>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre Field */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre de la clase"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }
                `}
              />
            </div>

            {/* Descripción Field */}
            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-semibold mb-2"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe la clase grupal"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }
                `}
              />
            </div>

            {/* Capacidad Field */}
            <div>
              <label htmlFor="capacidad" className="block text-sm font-semibold mb-2">
                Capacidad
              </label>
              <input
                type="number"
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                required
                min="1"
                placeholder="0"
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300 bg-white text-gray-900'
                  }
                `}
              />
            </div>

            {/* Submit Button */}
            <div
              className={`pt-4 border-t flex justify-end gap-4 ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-2 rounded-lg font-medium transition-colors
                  ${
                    isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }
                `}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all"
              >
                Crear Clase
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    // Montamos el modal en el body (fuera del contenedor principal)
    document.body
  );
};

export default CrearClasePopup;