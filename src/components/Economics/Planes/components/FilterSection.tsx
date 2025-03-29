import React from 'react';
import FilterButton from './FilterButton';

interface FilterSectionProps {
  title: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  selectedValue: string;
  onSelect: (value: string) => void;
  theme: 'dark' | 'light';
  isLast?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
  theme,
  isLast = false,
}) => (
  <div className={`${!isLast ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
    <div className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
      {title}
    </div>
    {options.map((option) => (
      <FilterButton
        key={option.value}
        selected={selectedValue === option.value}
        onClick={() => onSelect(option.value)}
        theme={theme}
      >
        {option.label}
      </FilterButton>
    ))}
  </div>
);

export default FilterSection;
