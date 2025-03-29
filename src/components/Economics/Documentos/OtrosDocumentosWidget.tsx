import React, { useState, useEffect, useMemo } from 'react';
import { File, Search, Filter, Plus, Eye, Edit2, Trash2, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import EditDocumentoModal from './EditDocumentoModal';
import { useDocumentoModal } from '../../../contexts/DocumentoModalContext';

interface OtroDocumento {
  _id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  fechaFinalizacion?: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    documentos: OtroDocumento[];
  };
}

const OtrosDocumentosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('');
  const [documentos, setDocumentos] = useState<OtroDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<OtroDocumento | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const { theme } = useTheme();
  const { openModal } = useDocumentoModal();

  const fetchDocumentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<ApiResponse>('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success' && Array.isArray(response.data.data.documentos)) {
        setDocumentos(response.data.data.documentos);
      } else {
        setDocumentos([]);
      }
      setError('');
    } catch (err) {
      setError('Error al cargar los documentos');
      console.error('Error fetching documentos:', err);
      setDocumentos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Función auxiliar para truncar texto
  const truncateText = (text: string, maxLength: number = 14) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const filteredDocumentos = useMemo(() => {
    if (!Array.isArray(documentos)) return [];
    
    return documentos.filter(doc => {
      if (!doc) return false;
      
      const matchesSearch = 
        doc.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.notas?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesTipo = selectedFilter === 'todos' || doc.tipo === selectedFilter;
      
      return matchesSearch && matchesTipo;
    });
  }, [documentos, searchTerm, selectedFilter]);

  const tiposUnicos = useMemo(() => {
    if (!Array.isArray(documentos)) return [];
    return Array.from(new Set(documentos.map(doc => doc.tipo).filter(Boolean)));
  }, [documentos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    const nextTipo = tiposUnicos[(tiposUnicos.indexOf(tipoFilter) + 1) % (tiposUnicos.length + 1)];
    setTipoFilter(nextTipo || '');
  };

  const handleView = async (documento: OtroDocumento) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos/${documento._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', documento.nombre);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar el documento:', err);
      setError('Error al descargar el documento');
    }
  };

  const handleEdit = (documento: OtroDocumento) => {
    setSelectedDocumento(documento);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (documentoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos/${documentoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDocumentos(documentos.filter(doc => doc._id !== documentoId));
    } catch (err) {
      console.error('Error al eliminar el documento:', err);
      setError('Error al eliminar el documento');
    }
  };

  return (
    <>
      <div className={`rounded-lg p-6 shadow-sm transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-gray-800 text-gray-100 shadow-gray-900' 
          : 'bg-white text-gray-800 shadow-gray-200'
      }`}>
        <div className="flex flex-col space-y-4 mb-6">
          {/* First row: Title and Add button */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <File className={`w-5 h-5 mr-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              <h2 className="text-xl font-semibold">Otros Documentos</h2>
            </div>
            <Button
              onClick={openModal}
              variant="primary"
              className="flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Añadir</span>
            </Button>
          </div>

          {/* Second row: Search input and filter button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-4 pr-10 py-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300`}
              />
              <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className="relative">
              <Button variant="filter" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <Filter className={`w-4 h-4 ${isFilterOpen ? 'text-white' : 'text-white'}`} />
              </Button>
              {isFilterOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 ring-1 ring-gray-600' 
                    : 'bg-white ring-1 ring-black ring-opacity-5'
                }`}>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedFilter('todos');
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        theme === 'dark'
                          ? 'text-gray-200 hover:bg-gray-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Todos
                    </button>
                    {tiposUnicos.map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => {
                          setSelectedFilter(tipo);
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          theme === 'dark'
                            ? 'text-gray-200 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-100'
                        } ${selectedFilter === tipo ? 'bg-orange-100 text-orange-600' : ''}`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <Table
              headers={['Nombre', 'Tipo', 'Fecha de Creación', 'Fecha de Fin', 'Notas', 'Acciones']}
              data={filteredDocumentos.map(doc => ({
                Nombre: (
                  <div className="flex items-center" title={doc.nombre}>
                    <File className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
                    <span className="truncate max-w-[120px]">{truncateText(doc.nombre)}</span>
                  </div>
                ),
                Tipo: (
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    doc.tipo === 'Legal' ? 'bg-blue-200 text-blue-800' :
                    doc.tipo === 'RRHH' ? 'bg-green-200 text-green-800' :
                    doc.tipo === 'Procedimiento' ? 'bg-purple-200 text-purple-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {doc.tipo}
                  </span>
                ),
                'Fecha de Creación': (
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    {formatDate(doc.fechaCreacion)}
                  </div>
                ),
                'Fecha de Fin': (
                  <div className="flex items-center">
                    <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                    {doc.fechaFinalizacion ? formatDate(doc.fechaFinalizacion) : 'No tiene'}
                  </div>
                ),
                Notas: doc.notas ? (
                  <div className="max-w-xs truncate">
                    {doc.notas}
                  </div>
                ) : (
                  <span className="text-gray-400">-</span>
                ),
                Acciones: (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleView(doc)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                      }`}
                      title="Ver documento"
                    >
                      <Eye size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(doc)}
                      className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                      }`}
                      title="Modificar"
                    >
                      <Edit2 size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(doc._id)}
                      className={`p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors ${
                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                      }`}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                )
              }))}
              variant={theme === 'dark' ? 'dark' : 'white'}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center p-8 text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        ) : filteredDocumentos.length === 0 ? (
          <div className={`text-center py-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            No se encontraron documentos
          </div>
        ) : null}
      </div>

      {selectedDocumento && (
        <EditDocumentoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          documento={selectedDocumento}
          onDocumentoUpdated={fetchDocumentos}
        />
      )}
    </>
  );
};

export default OtrosDocumentosWidget;
