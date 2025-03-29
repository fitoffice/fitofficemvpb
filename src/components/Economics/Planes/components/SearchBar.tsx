import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: 'dark' | 'light';
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, theme }) => (
  <div className="relative flex-grow">
    <input
      type="text"
      placeholder="Buscar planes o clientes..."
      value={value}
      onChange={onChange}
      className={`w-full px-6 py-4 border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700 text-white'
          : 'bg-white border-gray-200 text-gray-800'
      } rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg placeholder-gray-400`}
    />
    <Search
      className={`absolute right-6 top-4 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}
    />
  </div>
);

export default SearchBar;
