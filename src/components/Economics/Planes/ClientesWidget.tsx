import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface Cliente {
  _id: string;
  nombre: string;
  email: string;
  trainer: string;
  fechaRegistro: string;
  servicios: any[];
  planesDePago: any[];
  transacciones: any[];
}

interface FilterOptions {
  conServicios: boolean;
  conPlanesPago: boolean;
  conTransacciones: boolean;
}

const ClientesWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    conServicios: false,
    conPlanesPago: false,
    conTransacciones: false
  });
  const { theme } = useTheme();

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setClientes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching clientes:', err);
      setError('Error al cargar los clientes');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (filterName: keyof FilterOptions) => {
    setFilterOptions(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filteredClientes = clientes.filter(cliente => {
    // Aplicar búsqueda por texto
    const matchesSearch = 
      cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.email.toLowerCase().includes(searchTerm.toLowerCase());

    // Aplicar filtros
    const matchesFilters = 
      (!filterOptions.conServicios || cliente.servicios.length > 0) &&
      (!filterOptions.conPlanesPago || cliente.planesDePago.length > 0) &&
      (!filterOptions.conTransacciones || cliente.transacciones.length > 0);

    return matchesSearch && matchesFilters;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Clientes</h3>
        <div className={`${theme === 'dark' ? 'bg-green-900' : 'bg-green-100'} p-2 rounded-full`}>
          <Users className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`} />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full px-3 py-2 border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <Button 
            variant={showFilters ? "active" : "filter"}
            onClick={handleFilterToggle}
          >
            {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          </Button>
        </div>

        {showFilters && (
          <div className={`p-4 rounded-md ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterOptions.conServicios}
                  onChange={() => handleFilterChange('conServicios')}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Con servicios activos</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterOptions.conPlanesPago}
                  onChange={() => handleFilterChange('conPlanesPago')}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Con planes de pago</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterOptions.conTransacciones}
                  onChange={() => handleFilterChange('conTransacciones')}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Con transacciones</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">Cargando clientes...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="mt-4">
          <Table
            headers={['Nombre', 'Email', 'Fecha de Registro', 'Servicios', 'Planes de Pago']}
            data={filteredClientes.map(cliente => ({
              Nombre: cliente.nombre,
              Email: cliente.email,
              'Fecha de Registro': formatDate(cliente.fechaRegistro),
              Servicios: cliente.servicios.length.toString(),
              'Planes de Pago': cliente.planesDePago.length.toString()
            }))}
            variant={theme === 'dark' ? 'dark' : 'white'}
          />
          <div className="text-sm text-gray-500 mt-2">
            Mostrando {filteredClientes.length} de {clientes.length} clientes
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesWidget;