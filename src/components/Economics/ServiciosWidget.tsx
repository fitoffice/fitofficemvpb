import React, { useState, useEffect } from 'react';
import { Package, Search, Filter } from 'lucide-react';
import axios from 'axios';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface PlanDePago {
  _id: string;
  precio: number;
  moneda: string;
  frecuencia: string;
}

interface Servicio {
  _id: string;
  nombre: string;
  tipo: string;
  planDePago: PlanDePago[];
  descripcion: string;
}

interface FilterOptions {
  tipo: string;
  minPlanes: number;
  maxPlanes: number;
}

const ServiciosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    tipo: '',
    minPlanes: 0,
    maxPlanes: 999,
  });
  const { theme } = useTheme();

  const fetchServicios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/servicios/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setServicios(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching servicios:', err);
      setError('Error al cargar los servicios');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredServicios = servicios.filter(servicio => {
    const matchesSearch = servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         servicio.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterOptions.tipo === '' || servicio.tipo === filterOptions.tipo;
    const planesCount = servicio.planDePago?.length || 0;
    const matchesPlanes = planesCount >= filterOptions.minPlanes && 
                         planesCount <= filterOptions.maxPlanes;

    return matchesSearch && matchesTipo && matchesPlanes;
  });

  const tiposUnicos = Array.from(new Set(servicios.map(s => s.tipo)));

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Servicios</h3>
        <div className={`${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'} p-2 rounded-full`}>
          <Package className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button 
          variant="filter" 
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-blue-500 text-white' : ''}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative">
        {showFilters && (
          <div
            className={`absolute right-0 top-0 z-10 w-80 mb-4 p-4 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-200'
            } border rounded-md shadow-lg space-y-3`}
          >
            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Tipo de Servicio
                </label>
                <select
                  name="tipo"
                  value={filterOptions.tipo}
                  onChange={handleFilterChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Todos</option>
                  {tiposUnicos.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Mínimo de Planes
                </label>
                <input
                  type="number"
                  name="minPlanes"
                  value={filterOptions.minPlanes}
                  onChange={handleFilterChange}
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                  Máximo de Planes
                </label>
                <input
                  type="number"
                  name="maxPlanes"
                  value={filterOptions.maxPlanes}
                  onChange={handleFilterChange}
                  min="0"
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
        </div>

      {loading ? (
        <div className="text-center py-4">Cargando servicios...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="mt-4">
          <div style={{ height: '300px' }} className="overflow-y-auto">
            <div className="min-w-full">
              <Table
                headers={['Nombre', 'Tipo', 'Planes de Pago']}
                data={filteredServicios.map(servicio => ({
                  Nombre: servicio.nombre,
                  Tipo: servicio.tipo,
                  'Planes de Pago': servicio.planDePago ? servicio.planDePago.length.toString() : '0',
                }))}
                variant={theme === 'dark' ? 'dark' : 'white'}
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Mostrando {filteredServicios.length} de {servicios.length} servicios
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiciosWidget;