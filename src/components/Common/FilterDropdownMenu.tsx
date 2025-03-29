import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Dropdown from './Dropdown';
import Button from './Button';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedFilters: {
    muscleGroup: string;
    equipment: string;
  };
  onFilterChange: (filterType: 'muscleGroup' | 'equipment', value: string) => void;
  muscleGroupOptions: FilterOption[];
  equipmentOptions: FilterOption[];
}

const FilterDropdownMenu: React.FC<FilterDropdownMenuProps> = ({
  isOpen,
  onToggle,
  selectedFilters,
  onFilterChange,
  muscleGroupOptions,
  equipmentOptions,
}) => {
  const { theme } = useTheme();

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.muscleGroup) count++;
    if (selectedFilters.equipment) count++;
    return count;
  };

  return (
    <div className="relative">
      <Button
        onClick={onToggle}
        variant="filter"
        className="flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        <span>Filtros {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute right-0 top-full mt-2 w-[300px] z-50 ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            } p-4 rounded-xl shadow-xl border`}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Filtros</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Nivel y Músculo
                  </h4>
                  <div className="space-y-2">
                    <Dropdown
                      options={muscleGroupOptions}
                      value={selectedFilters.muscleGroup}
                      onChange={(value) => onFilterChange('muscleGroup', value)}
                      placeholder="Grupo Muscular"
                      width="w-full"
                    />
                  </div>
                </div>

                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Equipamiento
                  </h4>
                  <Dropdown
                    options={equipmentOptions}
                    value={selectedFilters.equipment}
                    onChange={(value) => onFilterChange('equipment', value)}
                    placeholder="Equipamiento"
                    width="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterDropdownMenu;
