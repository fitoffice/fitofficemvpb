import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  width?: string;
  position?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Seleccionar',
  className = '',
  width = 'w-56',
  position = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={`relative inline-block text-left w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={handleToggle}
        className={`inline-flex justify-between items-center w-full rounded-md border px-3 py-2 text-sm ${
          theme === 'dark'
            ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        } transition-colors duration-200`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute mt-1 ${width} rounded-md shadow-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 focus:outline-none z-[1001]`}
            style={{
              [position]: 0
            }}
          >
            <div className="py-1 max-h-60 overflow-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`${
                    option.value === value
                      ? theme === 'dark'
                        ? 'bg-gray-600 text-white'
                        : 'bg-blue-50 text-blue-700'
                      : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-600'
                        : 'text-gray-700 hover:bg-gray-100'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;