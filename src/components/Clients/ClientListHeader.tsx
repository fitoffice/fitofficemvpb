import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Trash,
  Download,
  Share2,
  Plus,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import FilterPanel from './FilterPanel';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface ClientListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  selectedClientsCount: number;
  viewMode: 'table' | 'simple';
  setViewMode: (mode: 'table' | 'simple') => void;
  onCreateClient: () => void; // Agregamos esta prop
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  selectedClientsCount,
  viewMode,
  setViewMode,
  onCreateClient, // Desestructuramos la nueva prop
}) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
   <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('simple')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'simple'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
                            <Grid className="w-5 h-5" />

            </button>
          </div>

          <div className="relative">
            <Button
              variant="filter"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </Button>
            {filterOpen && <FilterPanel filters={filters} setFilters={setFilters} />}
          </div>

          {/* Botón "Nuevo Cliente" con onClick */}
          <Button variant="create" onClick={onCreateClient} className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {selectedClientsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`flex items-center justify-between p-4 rounded-xl border 
            ${theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-gray-900/20' 
              : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-200/40'
            } backdrop-blur-sm backdrop-filter`}
        >
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg 
              ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <span className="text-sm font-semibold text-blue-500">
                {selectedClientsCount}
              </span>
            </div>
            <span className="text-sm font-medium">
              cliente{selectedClientsCount !== 1 && 's'}{' '}
              seleccionado{selectedClientsCount !== 1 && 's'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="csv" 
              size="sm" 
              className={`flex items-center transition-all duration-200 hover:scale-105
                ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              <span>Exportar</span>
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              className="flex items-center transition-all duration-200 hover:scale-105 hover:bg-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              <span>Eliminar</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientListHeader;
