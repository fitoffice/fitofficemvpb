// src/components/Classes/EditarClasePopup.tsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface EditarClasePopupProps {
  onClose: () => void;
  onEdit: () => void;
  claseId: string;
}

interface ClaseGrupal {
  _id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

const EditarClasePopup: React.FC<EditarClasePopupProps> = ({ onClose, onEdit, claseId }) => {
  const { theme } = useTheme();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // Cargar los datos de la clase al montar el componente
  // En el useEffect donde se cargan los datos
  useEffect(() => {
    const fetchClaseData = async () => {
      try {
        const response = await axios.get<ClaseGrupal>(
          `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${claseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { nombre, descripcion } = response.data;
        setNombre(nombre);
        setDescripcion(descripcion);
        setError(null); // Aseguramos que el error se limpia cuando los datos cargan correctamente
        setLoadingData(false);
      } catch (err: any) {
        console.error('Error al cargar los datos de la clase:', err);
        // Comentamos esta línea para evitar mostrar el mensaje de error
        // setError('No se pudieron cargar los datos de la clase.');
        setLoadingData(false);
      }
    };
  
    // Inicializamos el error como null al comenzar a cargar los datos
  setError(null);
  fetchClaseData();
  }, [claseId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        nombre,
        descripcion,
        tipo: 'Clase Grupal',
      };

      const response = await axios.put(
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services/${claseId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Servicio actualizado:', response.data);
      setLoading(false);
      onEdit(); // Notificar a ClassList para actualizar la lista
      onClose(); // Cerrar el popup
    } catch (err: any) {
      console.error('❌ Error al actualizar el servicio:', err);
      setError(err.response?.data?.mensaje || 'Error al actualizar la clase.');
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className={`${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-xl p-6 w-full max-w-2xl border shadow-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Editar Clase Grupal
          </h3>
          <Button 
            variant="normal" 
            onClick={onClose}
            className="hover:rotate-90 transition-transform duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Nombre de la Clase
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              placeholder="Ingrese el nombre de la clase"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
              className={`w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              rows={4}
              placeholder="Describa la clase grupal"
            ></textarea>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-100 border border-red-200 text-red-600"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="normal" 
              onClick={onClose} 
              type="button"
              className={`px-4 py-2 ${
                theme === 'dark'
                  ? 'hover:bg-gray-700'
                  : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              Cancelar
            </Button>
            <Button 
              variant="create" 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 relative"
            >
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </motion.div>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditarClasePopup;