import React, { useState, useEffect } from 'react';
import { Gift, Search, Filter, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import AddBonoModal from './AddBonoModal';

interface Trainer {
  _id: string;
  nombre: string;
  email: string;
}

interface Bono {
  _id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  primeraFecha: string;
  segundaFecha: string;
  terceraFecha: string;
  servicio: string;
  sesiones: number;
  precio: number;
  trainer: Trainer;
  estado: string;
  sesionesRestantes: number;
  createdAt: string;
  updatedAt: string;
}

const BonosWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bonos, setBonos] = useState<Bono[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    servicio: '',
    estado: '',
    trainer: '',
    fechaDesde: '',
    fechaHasta: '',
    precioMin: '',
    precioMax: '',
  });
  const { theme } = useTheme();

  const fetchBonos = async () => {
    try {
      const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/bonos');
      setBonos(response.data.data.bonos);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los bonos');
      setLoading(false);
      console.error('Error fetching bonos:', err);
    }
  };

  useEffect(() => {
    fetchBonos();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddBono = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleBonoAdded = () => {
    fetchBonos();
  };

  const deleteBono = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Mock API call
      const response = await fetch(`https://api.ejemplo.com/bonos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el bono');
      }

      // Actualizar la lista de bonos después de eliminar
      setBonos(prevBonos => prevBonos.filter(bono => bono._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error deleting bono:', err);
    }
  };

  const filteredBonos = bonos.filter(bono => {
    // Texto de búsqueda
    const matchesSearch = searchTerm === '' || 
      bono.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bono.servicio.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtros
    const matchesServicio = !filters.servicio || bono.servicio === filters.servicio;
    const matchesEstado = !filters.estado || bono.estado === filters.estado;
    const matchesTrainer = !filters.trainer || bono.trainer._id === filters.trainer;
    
    // Rango de fechas
    const bonoDate = new Date(bono.createdAt);
    const fechaDesde = filters.fechaDesde ? new Date(filters.fechaDesde) : null;
    const fechaHasta = filters.fechaHasta ? new Date(filters.fechaHasta) : null;
    const matchesFechaDesde = !fechaDesde || bonoDate >= fechaDesde;
    const matchesFechaHasta = !fechaHasta || bonoDate <= fechaHasta;

    // Rango de precios
    const precioMin = filters.precioMin ? parseFloat(filters.precioMin) : null;
    const precioMax = filters.precioMax ? parseFloat(filters.precioMax) : null;
    const matchesPrecioMin = !precioMin || bono.precio >= precioMin;
    const matchesPrecioMax = !precioMax || bono.precio <= precioMax;

    return matchesSearch && matchesServicio && matchesEstado && matchesTrainer && 
           matchesFechaDesde && matchesFechaHasta && matchesPrecioMin && matchesPrecioMax;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>Bonos</h3>
        <div className={`${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-100'} p-2 rounded-full`}>
          <Gift className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-500'}`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar bonos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full px-3 py-2 border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500`}
          />
          <Search className={`absolute right-3 top-2.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>
        <Button variant="filter" onClick={handleFilter}>
          <Filter className="w-4 h-4" />
        </Button>
        <Button variant="create" onClick={handleAddBono}>
          <Plus className="w-4 h-4 mr-1" />
          Añadir
        </Button>
      </div>
      {isFilterOpen && (
        <div className={`mb-4 p-4 ${
          theme === 'dark'
            ? 'bg-gray-700 border-gray-600'
            : 'bg-white border-gray-200'
        } border rounded-md shadow-sm space-y-3`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                Servicio
              </label>
              <select
                name="servicio"
                value={filters.servicio}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <option value="">Todos</option>
                {Array.from(new Set(bonos.map(bono => bono.servicio))).map(servicio => (
                  <option key={servicio} value={servicio}>{servicio}</option>
                ))}
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
                <option value="activo">Activo</option>
                <option value="expirado">Expirado</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                Trainer
              </label>
              <select
                name="trainer"
                value={filters.trainer}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}
              >
                <option value="">Todos</option>
                {Array.from(new Set(bonos.map(bono => bono.trainer))).map(trainer => (
                  <option key={trainer._id} value={trainer._id}>{trainer.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                Rango de Precio
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="precioMin"
                  placeholder="Min"
                  value={filters.precioMin}
                  onChange={handleFilterChange}
                  className={`w-1/2 px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
                <input
                  type="number"
                  name="precioMax"
                  placeholder="Max"
                  value={filters.precioMax}
                  onChange={handleFilterChange}
                  className={`w-1/2 px-3 py-2 border rounded-md ${
                    theme === 'dark'
                      ? 'bg-gray-600 border-gray-500 text-white'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
      {loading ? (
        <div className="text-center py-4">Cargando bonos...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <Table
          headers={['Nombre', 'Servicio', 'Sesiones', 'Precio', 'Trainer', 'Estado', 'Acciones']}
          data={filteredBonos.map(bono => ({
            Nombre: bono.nombre,
            Servicio: bono.servicio,
            Sesiones: `${bono.sesionesRestantes}/${bono.sesiones}`,
            Precio: `${bono.precio}€`,
            Trainer: bono.trainer.nombre,
            Estado: (
              <span className={`px-2 py-1 rounded-full text-sm ${
                bono.estado === 'activo' ? 'bg-green-100 text-green-800' :
                bono.estado === 'expirado' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {bono.estado.charAt(0).toUpperCase() + bono.estado.slice(1)}
              </span>
            ),
            Acciones: (
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que deseas eliminar este bono?')) {
                    deleteBono(bono._id);
                  }
                }}
                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                title="Eliminar bono"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            ),
          }))}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      )}
      <AddBonoModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onBonoAdded={handleBonoAdded}
      />
    </div>
  );
};

export default BonosWidget;