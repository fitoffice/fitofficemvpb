import React, { useState, useMemo } from 'react';
import { FileSignature, Search, Filter, Plus, Eye, Edit2, Trash2, Calendar } from 'lucide-react';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { useContratoModal } from '../../../contexts/ContratoModalContext';
import { useContratos } from '../../../contexts/ContratosContext';
import { motion } from 'framer-motion';
import EditContratoModal from './EditContratoModal';

interface Contrato {
  _id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'Activo' | 'Finalizado' | 'Cancelado' | 'Pendiente';
  trainer?: string;
  cliente?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

const ContratosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const { theme } = useTheme();
  const { openModal } = useContratoModal();
  
  // Use the context instead of local state
  const { contratos, isLoading, error, fetchContratos, deleteContrato } = useContratos();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number = 14) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredContratos = useMemo(() => {
    return contratos.filter(contrato => {
      const matchesSearch = contrato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contrato.notas?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'todos') return matchesSearch;
      return matchesSearch && contrato.estado === selectedFilter;
    });
  }, [contratos, searchTerm, selectedFilter]);

  const getStatusColor = (estado: Contrato['estado']) => {
    switch (estado) {
      case 'Activo':
        return theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-800';
      case 'Pendiente':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-200 text-yellow-800';
      case 'Cancelado':
        return theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-200 text-red-800';
      case 'Finalizado':
        return theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800';
      default:
        return theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800';
    }
  };

  const handleView = async (contrato: Contrato) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts/${contrato._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al descargar el contrato');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contrato.nombre);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar el contrato:', err);
    }
  };

  const handleEdit = (contrato: Contrato) => {
    setSelectedContrato(contrato);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (contratoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contrato?')) {
      return;
    }

    try {
      await deleteContrato(contratoId);
    } catch (err) {
      console.error('Error al eliminar el contrato:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col space-y-4 mb-6">
          {/* First row: Title and Add button */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-purple-600">Contratos</h2>
            <Button
              onClick={openModal}
              variant="primary"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Añadir</span>
            </Button>
          </div>
      
          {/* Second row: Search input and filter button */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar contratos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full pl-4 pr-10 py-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
      
            <div className="relative">
              <Button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                variant="filter"
                className="p-2 rounded-full bg-[#F1416C] hover:bg-[#d93860] text-white"
              >
                <Filter size={20} />
              </Button>
              
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`absolute right-0 mt-2 py-2 w-48 rounded-lg shadow-lg z-10 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                  }`}
                >
                  {['todos', 'Activo', 'Pendiente', 'Finalizado', 'Cancelado'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterSelect(filter)}
                      className={`w-full text-left px-4 py-2 hover:bg-opacity-10 ${
                        theme === 'dark'
                          ? 'hover:bg-white text-gray-200'
                          : 'hover:bg-gray-900 text-gray-700'
                      } ${selectedFilter === filter ? 'font-semibold' : ''}`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-8">{error}</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {filteredContratos.length === 0 ? (
            <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              No hay contratos disponibles
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`min-w-full divide-y ${
                theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Nombre
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Fecha de Inicio
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Fecha de Fin
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Estado
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className={theme === 'dark' ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}>
                  {filteredContratos.map(contrato => (
                    <tr key={contrato._id} className={`${
                      theme === 'dark' 
                        ? 'hover:bg-gray-700 transition-colors duration-150' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center" title={contrato.nombre}>
                          <FileSignature className={`w-4 h-4 mr-2 ${
                            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <span className="truncate max-w-[120px]">{truncateText(contrato.nombre)}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <Calendar className={`w-4 h-4 mr-2 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                          {formatDate(contrato.fechaInicio)}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}>
                        <div className="flex items-center">
                          <Calendar className={`w-4 h-4 mr-2 ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`} />
                          {formatDate(contrato.fechaFin)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contrato.estado)}`}>
                          {contrato.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleView(contrato)}
                            className={`p-1.5 rounded-full transition-colors ${
                              theme === 'dark' 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Ver contrato"
                          >
                            <Eye size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(contrato)}
                            className={`p-1.5 rounded-full transition-colors ${
                              theme === 'dark' 
                                ? 'text-gray-300 hover:bg-gray-600' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            title="Modificar"
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(contrato._id)}
                            className={`p-1.5 rounded-full transition-colors ${
                              theme === 'dark' 
                                ? 'text-red-400 hover:bg-red-900/50' 
                                : 'text-red-600 hover:bg-red-100'
                            }`}
                            title="Eliminar"
                          >
                                                       <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedContrato && (
        <EditContratoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          contrato={selectedContrato}
          onContratoUpdated={fetchContratos}
        />
      )}
    </div>
  );
};

export default ContratosWidget;