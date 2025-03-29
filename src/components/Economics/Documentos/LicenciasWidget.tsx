import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, Eye, Edit2, Trash2, Calendar, Key } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useLicenciaModal } from '../../../contexts/LicenciaModalContext';
import { useLicenciaEditModal } from '../../../contexts/LicenciaEditModalContext';
import { useLicencias } from '../../../contexts/LicenciasContext';
import { useAddLicenciaModal } from '../../../contexts/AddLicenciaModalContext';
// Remove the import of AddLicenciaModal since it will be rendered in App.tsx

const LicenciasWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const { theme } = useTheme();
  const { openModal } = useLicenciaModal();
  const { openEditModal } = useLicenciaEditModal();
  
  // Use the context instead of local state
  const { licencias, isLoading, fetchLicencias, deleteLicencia } = useLicencias();
  const { openModal: openAddLicenciaModal } = useAddLicenciaModal();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  const handleView = async (licencia: Licencia) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licencias/${licencia._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', licencia.nombre);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar la licencia:', err);
    }
  };

  const handleEdit = (licencia: Licencia) => {
    openEditModal(licencia);
  };

  const handleDelete = async (licenciaId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta licencia?')) {
      return;
    }

    try {
      await deleteLicencia(licenciaId);
    } catch (err) {
      console.error('Error al eliminar la licencia:', err);
    }
  };

  const truncateText = (text: string, maxLength: number = 14) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredLicencias = useMemo(() => {
    return licencias.filter(licencia => {
      const matchesSearch = licencia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          licencia.campo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          licencia.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (selectedFilter === 'todos') return matchesSearch;
      return matchesSearch && licencia.estado === selectedFilter;
    });
  }, [licencias, searchTerm, selectedFilter]);

  const handleAddLicencia = () => {
    console.log('handleAddLicencia called');
    openAddLicenciaModal(); // Use the new context function
    console.log('openModal function called');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col space-y-4 mb-4">
        {/* First row: Title and Add button */}
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            Licencias
          </h3>
          <Button variant="create" onClick={handleAddLicencia}>
            <Plus className="w-4 h-4 mr-1" />
            Añadir
          </Button>
        </div>

        {/* Second row: Search input and filter button */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar licencias..."
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
            <Button variant="filter" onClick={handleFilter}>
              <Filter className="w-4 h-4" />
            </Button>
            {isFilterOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } ring-1 ring-black ring-opacity-5 z-50`}>
                <div className="py-1">
                  {['todos', 'Activa', 'Expirada', 'Suspendida', 'En Proceso'].map((estado) => (
                    <button
                      key={estado}
                      onClick={() => handleFilterSelect(estado)}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'text-gray-200 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${selectedFilter === estado ? 'bg-purple-100 text-purple-600' : ''}`}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Cargando licencias...
        </div>
      ) : filteredLicencias.length === 0 ? (
        <div className={`text-center py-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          No hay licencias disponibles
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <Table
              headers={['Nombre', 'Fecha de Expiración', 'Estado', 'Acciones']}
              data={filteredLicencias.map(licencia => ({
                Nombre: (
                  <div className="flex items-center" title={licencia.nombre}>
                    <Key className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                    <span className="truncate max-w-[120px]">{truncateText(licencia.nombre)}</span>
                  </div>
                ),
                'Fecha de Expiración': (
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    {formatDate(licencia.fechaExpiracion)}
                  </div>
                ),
                Estado: (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    licencia.estado === 'Activa' ? 'bg-green-200 text-green-800' :
                    licencia.estado === 'En Proceso' ? 'bg-blue-200 text-blue-800' :
                    licencia.estado === 'Suspendida' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {licencia.estado}
                  </span>
                ),
                Acciones: (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(licencia)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                      }`}
                      title="Ver licencia"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(licencia)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                      }`}
                      title="Modificar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(licencia._id)}
                      className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              }))}
              variant={theme === 'dark' ? 'dark' : 'white'}
            />
          </div>
        </div>
      )}
      
      {/* Add the modal component at the end of the return statement */}
    </motion.div>
  );
};

export default LicenciasWidget;