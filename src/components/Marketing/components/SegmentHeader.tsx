import React from 'react';
import { Users, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface SegmentHeaderProps {
  onClose: () => void;
}

export function SegmentHeader({ onClose }: SegmentHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gradient-to-r from-gray-800 to-gray-900' 
        : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
      } p-6 flex justify-between items-center`}>
      <div className="flex items-center gap-3">
        <Users className="text-white h-6 w-6" />
        <h2 className="text-xl font-bold text-white">Gestión de Segmentos</h2>
      </div>
      <button
        onClick={onClose}
        className={`text-white ${
          theme === 'dark' 
            ? 'hover:bg-gray-700' 
            : 'hover:bg-emerald-600'
          } rounded-full p-2 transition-colors`}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}