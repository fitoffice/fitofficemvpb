import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, UserPlus, Check, Users, Filter, Mail, AlertCircle } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  selected?: boolean;
  lastInteraction?: string;
  tags?: string[];
}

interface AssignClientsPopupProps {
  emailNumber: number;
  onClose: () => void;
  onAssign: (clientIds: string[]) => void;
}

export function AssignClientsPopup({ emailNumber, onClose, onAssign }: AssignClientsPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      lastInteraction: '2024-01-15',
      tags: ['VIP', 'Activo']
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      lastInteraction: '2024-01-10',
      tags: ['Nuevo', 'Potencial']
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos@example.com',
      lastInteraction: '2024-01-18',
      tags: ['VIP', 'Premium']
    },
  ]);

  const handleToggleClient = (clientId: string) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, selected: !client.selected }
        : client
    ));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleAssign = () => {
    const selectedClientIds = clients
      .filter(client => client.selected)
      .map(client => client.id);
    onAssign(selectedClientIds);
    onClose();
  };

  const allTags = Array.from(new Set(clients.flatMap(client => client.tags || [])));

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => client.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const selectedCount = clients.filter(client => client.selected).length;

  return (
    <motion.div
      className="fixed inset-0 bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden border border-gray-100"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4yIi8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Users className="text-white/90" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Asignar Contactos - Correo {emailNumber}
                </h2>
                <p className="text-white/80 text-sm mt-1">
                  Selecciona los destinatarios para tu campaña
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:rotate-90"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all group-hover:border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                  {filteredClients.length} resultados
                </div>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                showFilters 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-inner'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={20} />
              Filtros
              <span className={`w-2 h-2 rounded-full ${selectedTags.length > 0 ? 'bg-purple-500' : 'bg-transparent'}`}></span>
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-purple-100/50">
                <h3 className="text-sm font-medium text-purple-900">Filtrar por etiquetas</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`group px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      {tag}
                      <span className={`inline-block ml-1.5 transition-transform duration-200 ${
                        selectedTags.includes(tag) ? 'rotate-45' : 'group-hover:rotate-45'
                      }`}>
                        {selectedTags.includes(tag) ? '×' : '+'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="mb-4 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {filteredClients.length} contactos encontrados
            </span>
            {selectedCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
              >
                {selectedCount} contactos seleccionados
              </motion.span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto mb-6 rounded-xl border border-gray-200 divide-y divide-gray-100">
            {filteredClients.map(client => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200 ${
                  client.selected ? 'bg-gradient-to-r from-purple-50 to-pink-50' : 'bg-white'
                }`}
                onClick={() => handleToggleClient(client.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                    client.selected
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                      : 'border-2 border-gray-300 group-hover:border-purple-300'
                  }`}>
                    {client.selected && <Check size={16} className="animate-appear" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-900 transition-colors">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-500">{client.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {client.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 px-4"
            >
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <AlertCircle size={48} className="text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron contactos</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Intenta ajustar los filtros o el término de búsqueda para encontrar los contactos que estás buscando
              </p>
            </motion.div>
          )}

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {selectedCount === 0 ? (
                'Selecciona los contactos a los que deseas enviar el correo'
              ) : (
                <span className="animate-pulse">
                  ¿Listo para asignar los contactos seleccionados?
                </span>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssign}
                disabled={selectedCount === 0}
                className="group px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-xl flex items-center gap-2 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
                <span className="relative">
                  <UserPlus size={18} />
                </span>
                <span className="relative">
                  Asignar {selectedCount} contactos
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
