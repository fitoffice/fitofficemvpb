import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filterState: FilterState;
  onFilterStateChange: (newState: FilterState) => void;
  onClose: () => void;
}

export function FilterPanel({ filterState, onFilterStateChange, onClose }: FilterPanelProps) {
  const updateOptions = (updates: Partial<FilterState['options']>) => {
    onFilterStateChange({
      ...filterState,
      options: { ...filterState.options, ...updates }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute right-0 mt-2 w-[320px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 flex flex-col max-h-[400px]"
    >
      <div className="flex-none px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Filtros de Búsqueda</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 custom-scrollbar">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rango de Edad
          </label>
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <input
                type="number"
                min="0"
                placeholder="Mín"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                value={filterState.options.minAge}
                onChange={(e) => updateOptions({ minAge: e.target.value })}
              />
            </div>
            <span className="text-gray-500">-</span>
            <div className="flex-1">
              <input
                type="number"
                min="0"
                placeholder="Máx"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
                value={filterState.options.maxAge}
                onChange={(e) => updateOptions({ maxAge: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Género
          </label>
          <div className="space-y-2">
            {['Hombre', 'Mujer', 'Otro'].map((gender) => (
              <label key={gender} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                  checked={filterState.options.gender.includes(gender)}
                  onChange={(e) => {
                    const newGenders = e.target.checked
                      ? [...filterState.options.gender, gender]
                      : filterState.options.gender.filter(g => g !== gender);
                    updateOptions({ gender: newGenders });
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">{gender}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Región
          </label>
          <input
            type="text"
            placeholder="Ej: Madrid"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#FF385C] focus:border-[#FF385C] transition-all"
            value={filterState.options.region}
            onChange={(e) => updateOptions({ region: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intereses
          </label>
          <div className="space-y-2">
            {['fitness', 'nutrición', 'yoga'].map((interest) => (
              <label key={interest} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#FF385C] focus:ring-[#FF385C]"
                  checked={filterState.options.interests.includes(interest)}
                  onChange={(e) => {
                    const newInterests = e.target.checked
                      ? [...filterState.options.interests, interest]
                      : filterState.options.interests.filter(i => i !== interest);
                    updateOptions({ interests: newInterests });
                  }}
                />
                <span className="ml-2 text-sm text-gray-600">{interest}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
