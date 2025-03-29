import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, X, UserPlus } from 'lucide-react';
import Button from '../ui/Button';

interface ClienteDisponible {
  id: string;
  nombre: string;
  email: string;
  objetivo?: string;
}

interface ClienteSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCliente: (clienteId: string) => void;
}

// Datos de ejemplo - reemplazar con datos reales
const clientesDisponibles: ClienteDisponible[] = [
  {
    id: '4',
    nombre: 'Ana Martínez',
    email: 'ana@example.com',
    objetivo: 'Pérdida de peso'
  },
  {
    id: '5',
    nombre: 'Roberto Sánchez',
    email: 'roberto@example.com',
    objetivo: 'Ganancia muscular'
  },
  {
    id: '6',
    nombre: 'Laura Gómez',
    email: 'laura@example.com',
    objetivo: 'Tonificación'
  }
];

export const ClienteSelector: React.FC<ClienteSelectorProps> = ({
  isOpen,
  onClose,
  onSelectCliente
}) => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<string | null>(null);

  const filteredClientes = clientesDisponibles.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCliente = (clienteId: string) => {
    setSelectedCliente(clienteId);
    onSelectCliente(clienteId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed inset-x-4 top-[10%] md:inset-auto md:top-[15%] md:left-1/2 md:-translate-x-1/2 
              md:w-full md:max-w-2xl max-h-[80vh] rounded-xl shadow-2xl z-50 overflow-hidden
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            {/* Header */}
            <div className={`p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Seleccionar Cliente
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search bar */}
              <div className={`mt-4 relative`}>
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 pl-10 rounded-lg outline-none transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 text-white placeholder-gray-400 focus:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:bg-gray-50'
                    }`}
                />
                <Search
                  size={18}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}
                />
              </div>
            </div>

            {/* Client list */}
            <div className="overflow-y-auto max-h-[60vh]">
              {filteredClientes.length > 0 ? (
                <div className="p-2">
                  {filteredClientes.map((cliente) => (
                    <motion.div
                      key={cliente.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg mb-2 cursor-pointer transition-all
                        ${theme === 'dark'
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-50'
                        } ${selectedCliente === cliente.id
                          ? theme === 'dark'
                            ? 'bg-gray-700'
                            : 'bg-gray-50'
                          : ''
                        }`}
                      onClick={() => handleSelectCliente(cliente.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${theme === 'dark'
                              ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                              : 'bg-gradient-to-br from-blue-400 to-purple-400'
                            } text-white font-semibold`}
                          >
                            {cliente.nombre.charAt(0)}
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {cliente.nombre}
                            </h3>
                            <p className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {cliente.email}
                            </p>
                            {cliente.objetivo && (
                              <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block
                                ${theme === 'dark'
                                  ? 'bg-gray-700 text-blue-400 border border-blue-500/30'
                                  : 'bg-blue-100 text-blue-800'
                                }`}>
                                {cliente.objetivo}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectCliente(cliente.id)}
                          className={`ml-4 px-4 py-2 rounded-lg text-white
                            ${theme === 'dark'
                              ? 'bg-blue-500 hover:bg-blue-600'
                              : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                          <UserPlus size={18} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={`p-8 text-center ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <p className="text-lg">No se encontraron clientes</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClienteSelector;
