import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Table from '../Common/Table';
import Button from '../Common/Button';

interface ClientTableProps {
  clientData: any[];
  theme: string;
  initialSearchTerm?: string;
  initialFilterType?: string;
}

const ClientTable: React.FC<ClientTableProps> = ({
  clientData,
  theme,
  initialSearchTerm = '',
  initialFilterType = 'todos'
}) => {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState(initialFilterType);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Filter client data based on search term
  const filteredClientData = clientData.filter((client) =>
    client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telefono?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.tag?.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(client => ({
    Nombre: client.nombre || 'N/A',
    Correo: client.email || 'N/A',
    Teléfono: client.telefono || 'N/A',
    Tag: client.tag || 'N/A',
    Estado: client.estado || 'N/A',
  }));

  return (
    <div className={`${
      theme === 'dark'
        ? 'bg-gray-800/90 border-gray-700/50'
        : 'bg-white/90 border-white/50'
    } backdrop-blur-xl p-8 rounded-3xl shadow-xl border hover:shadow-2xl transition-all duration-300`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <h3 className={`text-2xl font-bold ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            Clientes Recientes
          </h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            theme === 'dark'
              ? 'bg-blue-500/10 text-blue-400'
              : 'bg-blue-100 text-blue-600'
          }`}>
            {clientData.length} total
          </span>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-5 py-3 pl-12 ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-blue-400/50'
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500/50'
              } border rounded-2xl focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-300`}
            />
            <Search className={`absolute left-4 top-3.5 w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            } transition-colors duration-200`} />
          </div>
          
          <div className="relative">
            <Button 
              variant="filter" 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`px-5 py-3 rounded-xl ${
                theme === 'dark'
                  ? 'hover:bg-gray-700/50'
                  : 'hover:bg-gray-100'
              } transition-colors duration-200`}
            >
              Filtrar
            </Button>
            {isFilterDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 border border-gray-700' 
                  : 'bg-white border border-gray-200'
              } z-50 overflow-hidden transform transition-all duration-200 ease-out`}>
                <div className="py-2">
                  {['Todos', 'Activos', 'Inactivos', 'Pendientes'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilterType(option.toLowerCase());
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-6 py-3 text-sm ${
                        filterType === option.toLowerCase()
                          ? theme === 'dark'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-blue-50 text-blue-600'
                          : theme === 'dark'
                            ? 'text-gray-200 hover:bg-gray-700/50'
                            : 'text-gray-700 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`overflow-hidden rounded-2xl ${
        theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/50'
      } border shadow-sm`}>
        <Table
          headers={['Nombre', 'Correo', 'Teléfono', 'Tag', 'Estado']}
          data={filteredClientData || []}
          variant={theme === 'dark' ? 'dark' : 'white'}
        />
      </div>
    </div>
  );
};

export default ClientTable;