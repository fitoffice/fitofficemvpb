import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  isFilterActive: boolean;
}

const defaultFilters: Filters = {
  estado: '',
  tag: '',
  tipoPlan: '',
  clase: '',
  servicio: '',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Determina si hay algún filtro activo
  const isFilterActive = Object.values(filters).some(value => value !== '');

  return (
    <FilterContext.Provider value={{ filters, setFilters, isFilterActive }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters debe ser usado dentro de un FilterProvider');
  }
  return context;
};