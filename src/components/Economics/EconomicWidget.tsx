import React from 'react';
import { DollarSign, TrendingUp, FileText, Users, PieChart, UserPlus, X } from 'lucide-react';

interface EconomicWidgetProps {
  title: string;
  value: number;
  icon: string;
  isEditMode: boolean;
  onUpdate: (value: number) => void;
  onRemove: () => void;
  isPercentage?: boolean;
}

const EconomicWidget: React.FC<EconomicWidgetProps> = ({
  title,
  value,
  icon,
  isEditMode,
  onUpdate,
  onRemove,
  isPercentage = false,
}) => {
  const IconComponent = {
    DollarSign,
    TrendingUp,
    FileText,
    Users,
    PieChart,
    UserPlus,
  }[icon];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = isPercentage ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
    onUpdate(newValue);
  };

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      {isEditMode && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-1 shadow-md"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 truncate">{title}</h3>
        <div className="bg-blue-100 p-2 rounded-full">
          <IconComponent className="w-5 h-5 text-blue-500" />
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {isEditMode ? (
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className="w-full text-2xl font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded p-1"
          />
        ) : (
          <>
            {isPercentage ? `${value.toFixed(2)}%` : value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">
        {isPercentage ? 'Porcentaje' : 'Valor'}
      </div>
    </div>
  );
};

export default EconomicWidget;