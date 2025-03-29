import React, { useState, useEffect } from 'react';
import { Gift, Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';
import Table from '../../Common/Table';
import Button from '../../Common/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import AddBonoModal from './AddBonoModal';
import EditBonoModal from './EditBonoModal';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBono, setSelectedBono] = useState<Bono | null>(null);
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
    console.log('Filtrar bonos');
  };

  const handleEdit = (bono: Bono) => {
    setSelectedBono(bono);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (bonoId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este bono?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/bonos/${bonoId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Actualizar la lista de bonos después de eliminar
      setBonos(bonos.filter(bono => bono._id !== bonoId));
    } catch (err) {
      console.error('Error al eliminar el bono:', err);
      setError('Error al eliminar el bono');
    }
  };

  const handleAddBono = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBono(null);
  };

  const handleBonoAdded = () => {
    fetchBonos();
  };

  const filteredBonos = bonos.filter(bono =>
    bono.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bono.servicio.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(bono)}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                  }`}
                  title="Modificar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(bono._id)}
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
      )}
      <AddBonoModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onBonoAdded={handleBonoAdded}
      />
      {selectedBono && (
        <EditBonoModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onBonoUpdated={handleBonoAdded}
          bono={selectedBono}
        />
      )}
    </div>
  );
};

export default BonosWidget;