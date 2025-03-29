import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface ChartControlsProps {
  viewType: 'weekly' | 'monthly' | 'annual';
  onViewTypeChange: (viewType: 'weekly' | 'monthly' | 'annual') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  formattedDate: string;
}

const VIEW_TYPES = {
  weekly: 'Semanal',
  monthly: 'Mensual',
  annual: 'Anual',
} as const;

const ChartControls: React.FC<ChartControlsProps> = ({
  viewType,
  onViewTypeChange,
  onNavigate,
  formattedDate,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="w-5 h-5 text-blue-600" />
        <select
          value={viewType}
          onChange={(e) => onViewTypeChange(e.target.value as typeof viewType)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                   focus:ring-blue-500 focus:border-blue-500 p-2.5 hover:bg-gray-100 
                   transition-colors cursor-pointer"
        >
          {Object.entries(VIEW_TYPES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('prev')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors 
                   active:bg-gray-200 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Anterior período"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <span className="text-lg font-medium text-gray-700 min-w-[200px] text-center">
          {formattedDate}
        </span>
        
        <button
          onClick={() => onNavigate('next')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors 
                   active:bg-gray-200 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-opacity-50"
          aria-label="Siguiente período"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ChartControls;