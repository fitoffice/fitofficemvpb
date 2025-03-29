import React from 'react';

interface FilterButtonProps {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  theme: 'dark' | 'light';
}

const FilterButton: React.FC<FilterButtonProps> = ({ selected, onClick, children, theme }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm ${
      selected
        ? 'bg-violet-100 dark:bg-violet-900 text-violet-900 dark:text-violet-100'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

export default FilterButton;
