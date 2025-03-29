import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartStatsProps {
  data: Array<{ income: number }>;
  viewType: 'weekly' | 'monthly' | 'annual';
}

const ChartStats: React.FC<ChartStatsProps> = ({ data, viewType }) => {
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const averageIncome = totalIncome / data.length;
  
  const previousPeriodIncome = data[0]?.income || 0;
  const currentPeriodIncome = data[data.length - 1]?.income || 0;
  const growthRate = ((currentPeriodIncome - previousPeriodIncome) / previousPeriodIncome) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getPeriodLabel = () => {
    switch (viewType) {
      case 'weekly':
        return 'esta semana';
      case 'monthly':
        return 'este mes';
      case 'annual':
        return 'este año';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Total {getPeriodLabel()}</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalIncome)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Promedio {getPeriodLabel()}</h3>
        <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageIncome)}</p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Crecimiento</h3>
        <div className="flex items-center gap-2">
          {growthRate > 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-500" />
          )}
          <p className={`text-2xl font-bold ${growthRate > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {growthRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartStats;