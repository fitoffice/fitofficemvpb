import React from 'react';
import { Search, Filter } from 'lucide-react';
import Button from '../Button';

interface ExerciseFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void; // Add this line
  showFilterMenu: boolean;
  handleFilterToggle: () => void;
  filters: {
    upperBody: boolean;
    lowerBody: boolean;
    core: boolean;
    cardio: boolean;
  };
  handleFilterChange: (filterName: keyof typeof filters) => void;
}

const ExerciseFilter: React.FC<ExerciseFilterProps> = ({
  searchTerm,
  setSearchTerm,
  showFilterMenu,
  handleFilterToggle,
  filters,
  handleFilterChange
}) => {
  return (
    <div className="flex gap-3 mb-5 items-center">
      <div className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex items-center p-2 focus-within:ring-2 focus-within:ring-indigo-300 focus-within:border-indigo-300">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar ejercicios..."
          className="w-full border-none focus:outline-none text-gray-700"
        />
      </div>
      <div className="relative">
        <Button
          variant="exportar"
          onClick={handleFilterToggle}
          className="flex items-center gap-2 shadow-sm hover:shadow transition-shadow"
        >
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        {showFilterMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.upperBody}
                  onChange={() => handleFilterChange('upperBody')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Tren Superior</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.lowerBody}
                  onChange={() => handleFilterChange('lowerBody')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Tren Inferior</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.core}
                  onChange={() => handleFilterChange('core')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Core</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.cardio}
                  onChange={() => handleFilterChange('cardio')}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Cardio</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseFilter;