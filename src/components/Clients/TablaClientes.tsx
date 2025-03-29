import React from 'react';
import { motion } from 'framer-motion';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import type { Cliente } from '../types/servicios';

interface Props {
  clientes: Cliente[];
  isDarkMode: boolean;
}

const TablaClientes = ({ clientes, isDarkMode }: Props) => {
  const navigate = useNavigate();

  const handleVerDetalles = () => {
    navigate('/clients');
  };

  return (
    <div className={`overflow-hidden rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-inner`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className={isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-gray-50 to-gray-100'}>
            <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Nombre
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Email
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Teléfono
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Fecha Inicio
            </th>
            <th className={`px-6 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              Estado
            </th>
            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {clientes.map((cliente, index) => (
            <motion.tr
              key={cliente.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50/50'} transition-colors duration-200`}
            >
              <td className="px-6 py-4">
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {cliente.nombre}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cliente.email}</div>
              </td>
              <td className="px-6 py-4">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cliente.telefono}</div>
              </td>
              <td className="px-6 py-4">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`px-3 py-1 text-sm rounded-full inline-block ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}
                >
                  {cliente.fechaInicio}
                </motion.span>
              </td>
              <td className="px-6 py-4">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    cliente.estado === 'Activo'
                      ? isDarkMode ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-800'
                      : cliente.estado === 'Pendiente'
                      ? isDarkMode ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-800'
                      : isDarkMode ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 mr-2 rounded-full ${
                      cliente.estado === 'Activo'
                        ? 'bg-green-400'
                        : cliente.estado === 'Pendiente'
                        ? 'bg-yellow-400'
                        : 'bg-red-400'
                    }`}
                  />
                  {cliente.estado}
                </motion.span>
              </td>
              <td className="px-6 py-4 text-center">
                <motion.button
                  onClick={handleVerDetalles}
                  className="flex items-center justify-center gap-2 text-blue-500 hover:text-white bg-blue-100 hover:bg-blue-500 transition-all duration-300 ease-in-out rounded-full px-3 py-2 shadow-md hover:shadow-lg"
                  whileTap={{ scale: 0.9, opacity: 0.8 }} // Añade un efecto de escala y opacidad al hacer clic
                  aria-label={`Ver detalles de ${cliente.nombre}`}
                >
                  <AiOutlineEye size={20} />
                  <span className="text-sm font-medium">Ver más</span>
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaClientes;
