import { useState } from 'react';

interface FilterState {
  upperBody: boolean;
  lowerBody: boolean;
  core: boolean;
  cardio: boolean;
}

interface UsePeriodFiltersProps {
  selectedWeeks: any[];
  setSelectedWeeks: React.Dispatch<React.SetStateAction<any[]>>;
  onPeriodsChange: (periods: any[]) => void;
  numberOfWeeks: number;
  getEjerciciosEnPeriodo: (start: number, end: number) => any[];
}

export const usePeriodFilters = ({
  selectedWeeks,
  setSelectedWeeks,
  onPeriodsChange,
  numberOfWeeks,
  getEjerciciosEnPeriodo
}: UsePeriodFiltersProps) => {
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    upperBody: false,
    lowerBody: false,
    core: false,
    cardio: false
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdjustPeriod = (periodIndex: number, isStart: boolean, increment: boolean) => {
    const newPeriods = [...selectedWeeks];
    const period = newPeriods[periodIndex];
    
    if (isStart) {
      const newStart = increment ? period.start + 1 : period.start - 1;
      if (newStart < 1 || newStart >= period.end) return;
      period.start = newStart;
    } else {
      const newEnd = increment ? period.end + 1 : period.end - 1;
      if (newEnd > numberOfWeeks || newEnd <= period.start) return;
      period.end = newEnd;
    }

    // Update exercises for the adjusted period
    period.exercises = getEjerciciosEnPeriodo(period.start, period.end);
    
    setSelectedWeeks(newPeriods);
    onPeriodsChange(newPeriods);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (filterName: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filterExercises = (ejercicios: any[]) => {
    return ejercicios.filter(ejercicio => {
      // Texto de búsqueda
      const matchesSearch = !searchTerm || 
        ejercicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ejercicio.detalles?.grupoMuscular?.some((musculo: string) => 
          musculo.toLowerCase().includes(searchTerm.toLowerCase())
        );

      // Filtros de grupo muscular
      const activeFilters = Object.entries(filters).filter(([_, value]) => value).map(([key]) => key);
      const matchesFilters = activeFilters.length === 0 || ejercicio.detalles?.grupoMuscular?.some((musculo: string) => {
        const muscleGroup = musculo.toLowerCase();
        return (
          (filters.upperBody && (muscleGroup.includes('pecho') || muscleGroup.includes('hombro') || muscleGroup.includes('brazo') || muscleGroup.includes('espalda'))) ||
          (filters.lowerBody && (muscleGroup.includes('pierna') || muscleGroup.includes('gluteo'))) ||
          (filters.core && (muscleGroup.includes('abdomen') || muscleGroup.includes('core'))) ||
          (filters.cardio && muscleGroup.includes('cardio'))
        );
      });

      return matchesSearch && matchesFilters;
    });
  };

  return {
    filterAnchorEl,
    filters,
    searchTerm,
    setSearchTerm,
    handleAdjustPeriod,
    handleFilterClick,
    handleFilterClose,
    handleFilterChange,
    filterExercises
  };
};