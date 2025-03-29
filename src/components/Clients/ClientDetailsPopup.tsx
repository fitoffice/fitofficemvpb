import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Mail, Phone, Calendar, Tag, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientDetailsPopupProps {
  client: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    estado: string;
    tag: string;
    alertas: string;
    cumplimiento: string;
    fechaRegistro?: string;
  } | null;
  onClose: () => void;
}

const ClientDetailsPopup: React.FC<ClientDetailsPopupProps> = ({ client, onClose }) => {
  const { theme } = useTheme();

  if (!client) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-xl w-full max-w-2xl overflow-hidden`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Detalles del Cliente
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full hover:bg-opacity-10 ${
                  theme === 'dark' ? 'hover:bg-white' : 'hover:bg-black'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="flex items-start space-x-4">
              <div
                className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {client.nombre.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {client.nombre} {client.apellido}
                </h3>
                <div className="flex items-center space-x-2 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      client.estado === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.estado}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {client.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{client.telefono}</span>
                </div>
                {client.fechaRegistro && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Registrado: {new Date(client.fechaRegistro).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span>Tag: {client.tag}</span>
                </div>
                {parseInt(client.alertas) > 0 && (
                  <div className="flex items-center space-x-3 text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{client.alertas} alertas pendientes</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-500">Cumplimiento</span>
                <span className="font-medium">{client.cumplimiento}</span>
              </div>
              <div className={`h-2.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-2.5 rounded-full ${
                    parseInt(client.cumplimiento) > 80
                      ? 'bg-green-600'
                      : parseInt(client.cumplimiento) > 50
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${client.cumplimiento}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={onClose}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ClientDetailsPopup;
