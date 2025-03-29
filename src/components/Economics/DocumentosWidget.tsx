import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface Documento {
  _id: string;
  nombre: string;
  fecha?: string;
  fechaCreacion?: string;
  fechaExpiracion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipo: string;
  estado?: string;
  trainer?: {
    nombre: string;
    email: string;
  };
  notas?: string;
  descripcion?: string;
}

interface DocumentosWidgetProps {
  setIsDocumentoPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DocumentosWidget: React.FC<DocumentosWidgetProps> = ({
  setIsDocumentoPopupOpen,
}) => {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    fechaDesde: '',
    fechaHasta: '',
  });
  const { theme } = useTheme();

  useEffect(() => {
    const fetchDocumentos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': `application/json`
        };

        // Fetch contracts
        const contractsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/contracts', { headers });
        const contractsData = await contractsResponse.json();
        const contractsDocs = contractsData.data.contracts.map((contract: any) => ({
          _id: contract._id,
          nombre: contract.nombre,
          fecha: contract.fechaInicio,
          fechaInicio: contract.fechaInicio,
          fechaFin: contract.fechaFin,
          tipo: 'Contrato',
          estado: contract.estado,
          trainer: contract.trainer,
          notas: contract.notas
        }));

        // Fetch otros documentos
        const otrosDocsResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/otros-documentos', { headers });
        const otrosDocsData = await otrosDocsResponse.json();
        const otrosDocs = otrosDocsData.data.documentos.map((doc: any) => ({
          _id: doc._id,
          nombre: doc.nombre,
          fecha: doc.fechaCreacion,
          fechaCreacion: doc.fechaCreacion,
          fechaFinalizacion: doc.fechaFinalizacion,
          tipo: 'Documento',
          trainer: doc.trainer,
          notas: doc.notas
        }));

        // Fetch licenses
        const licensesResponse = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licenses', { headers });
        const licensesData = await licensesResponse.json();
        const licensesDocs = licensesData.data.licenses.map((license: any) => ({
          _id: license._id,
          nombre: license.nombre,
          fecha: license.fechaExpiracion,
          fechaExpiracion: license.fechaExpiracion,
          tipo: 'Licencia',
          estado: license.estado,
          descripcion: license.descripcion,
          campo: license.campo
        }));

        // Combine all documents
        const allDocuments = [...contractsDocs, ...otrosDocs, ...licensesDocs];
        
        // Sort by date (most recent first)
        const sortedDocuments = allDocuments.sort((a, b) => {
          const dateA = new Date(a.fecha || '');
          const dateB = new Date(b.fecha || '');
          return dateB.getTime() - dateA.getTime();
        });

        setDocumentos(sortedDocuments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los documentos');
        setLoading(false);
      }
    };

    fetchDocumentos();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Fecha no disponible';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString('es-ES', options);
  };

  const truncateName = (name: string, maxLength: number = 20): string => {
    return name.length > maxLength 
      ? `${name.substring(0, maxLength)}...` 
      : name;
  };

  const filteredDocumentos = documentos.filter(doc => {
    const matchesTipo = !filters.tipo || doc.tipo === filters.tipo;
    const matchesEstado = !filters.estado || doc.estado === filters.estado;
    
    const docDate = new Date(doc.fecha || '');
    const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
    const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;
    
    const matchesFechaDesde = !fechaDesde || docDate >= fechaDesde;
    const matchesFechaHasta = !fechaHasta || docDate <= fechaHasta;

    return matchesTipo && matchesEstado && matchesFechaDesde && matchesFechaHasta;
  });

  if (loading) {
    return (
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

return (
  <div
    className={`p-4 h-full flex flex-col  ${
      theme === 'dark'
        ? 'bg-gray-800 text-white'
        : 'bg-purple-50 text-gray-800'
    } rounded-lg`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3
        className={`text-lg font-semibold ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}
      >
        Documentos
      </h3>
      <div
        className={`${
          theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'
        } p-2 rounded-full`}
      >
        <FileText
          className={`w-5 h-5 ${
            theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
          }`}
        />
      </div>
    </div>
    <div className="flex items-center space-x-2 mb-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Buscar documentos..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={`w-full pl-3 pr-10 h-10 border ${
            theme === 'dark'
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-800'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
        />
        <Search
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}
        />
      </div>
      <Button variant="filter" onClick={toggleFilter}>
        <Filter className="w-4 h-4" />
      </Button>
    </div>

      <div className="relative">
        {isFilterOpen && (
          <div
            className={`absolute right-0 top-0 z-10 w-80 mb-4 p-4 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-200'
            } border rounded-md shadow-lg space-y-3`}
          >
            <div className="space-y-3 max-h-[100px] overflow-y-auto custom-scrollbar">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Tipo de Documento
                </label>
                <select
                  name="tipo"
                  value={filters.tipo}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Todos</option>
                  <option value="Contrato">Contrato</option>
                  <option value="Documento">Documento</option>
                  <option value="Licencia">Licencia</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Estado
                </label>
                <select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Todos</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Fecha Desde
                </label>
                <input
                  type="date"
                  name="fechaDesde"
                  value={filters.fechaDesde}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  name="fechaHasta"
                  value={filters.fechaHasta}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
         <div className="flex-grow overflow-auto custom-scrollbar max-h-[300px]">
          <Table
            headers={['Nombre', 'Tipo', 'Fecha']}
            data={filteredDocumentos.map((doc) => ({
              Nombre: truncateName(doc.nombre),
              Tipo: doc.tipo,
              Fecha: formatDate(doc.fecha),
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
        </div>
        <div
          className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          } mt-2`}
        >
          {filteredDocumentos.length} documentos
        </div>
      </div>
    </div>
  );
};

export default DocumentosWidget;
