import React, { useState, useMemo, useEffect } from 'react';
import Table from '../Common/Table';
import Button from '../Common/Button';
import { Search, Filter, Trash2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface Income {
  _id: string;
  entrenador: string;
  monto: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  estado: string;
}

interface FormattedIncome {
  'Fecha': string;
  'Estado del Pago': string;
  'Descripción': string;
  'Importe': string;
  'Acciones': React.ReactNode;
}

const IncomeWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingresos, setIngresos] = useState<FormattedIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState('all');
  const { theme } = useTheme();

  // Extract fetchIngresos to be reusable
  const fetchIngresos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los ingresos');
      }

      const data: Income[] = await response.json();
      const formattedData = data.map(item => ({
        'Fecha': new Date(item.fecha).toLocaleDateString(),
        'Estado del Pago': item.estado,
        'Descripción': item.descripcion,
        'Importe': `${item.monto} ${item.moneda}`,
        'Acciones': (
          <button
            onClick={() => {
              if (window.confirm('¿Estás seguro de que deseas eliminar este ingreso?')) {
                deleteIncome(item._id);
              }
            }}
            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
            title="Eliminar ingreso"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        ),
      }));
      setIngresos(formattedData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un ingreso
  const deleteIncome = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Mock API call
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ingresos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el ingreso');
      }

      // Refetch the data after successful deletion
      await fetchIngresos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error deleting income:', err);
    }
  };

  useEffect(() => {
    fetchIngresos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFilterOpen && !(event.target as Element).closest('.filter-dropdown')) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    let filtered = ingresos;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Apply dropdown filter
    if (filterOption !== 'all') {
      filtered = filtered.filter((item) => {
        if (filterOption === 'pending') {
          return item['Estado del Pago'].toLowerCase() === 'pendiente';
        }
        if (filterOption === 'completed') {
          return item['Estado del Pago'].toLowerCase() === 'completado';
        }
        return true;
      });
    }
    
    return filtered;
  }, [searchTerm, ingresos, filterOption]);

  if (loading) {
    return (
      <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
        <div className="flex-grow flex items-center justify-center">
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
        <div className="flex-grow flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col p-4 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h3 className="text-lg font-semibold mb-4">Ingresos</h3>
      <div className="flex gap-2 mb-4">
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative filter-dropdown">
          <Button 
            variant="filter"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 ${
              theme === 'dark' 
                ? 'bg-red-900 hover:bg-red-800 text-red-400' 
                : 'bg-red-100 hover:bg-red-200 text-red-500'
            }`}
          >
            <Filter size={16} />
            Filtrar
          </Button>
          
          {isFilterOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 z-10`}>
              <div className="py-1" role="menu">
                <button
                  onClick={() => {
                    setFilterOption('all');
                    setIsFilterOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-gray-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => {
                    setFilterOption('pending');
                    setIsFilterOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-gray-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => {
                    setFilterOption('completed');
                    setIsFilterOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-gray-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Completados
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-auto">
        <Table
          headers={['Fecha', 'Estado del Pago', 'Descripción', 'Importe', 'Acciones']}
          data={filteredData}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default IncomeWidget;
