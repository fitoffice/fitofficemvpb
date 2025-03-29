import React from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { getWeekAndDay } from '../utils/estadisticasUtils';

interface PeriodDateRangeProps {
  index: number;
  startDate: number;
  endDate: number;
  handleAdjustPeriod: (periodIndex: number, isStart: boolean, increment: boolean) => void;
}

const PeriodDateRange: React.FC<PeriodDateRangeProps> = ({
  index,
  startDate,
  endDate,
  handleAdjustPeriod
}) => {
  const startInfo = getWeekAndDay(startDate);
  const endInfo = getWeekAndDay(endDate);

  return (
    <div className="mb-4 flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAdjustPeriod(index, true, false)}
          className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 text-gray-700">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Semana {startInfo.week} día {startInfo.day}</span>
        </div>
        <button
          onClick={() => handleAdjustPeriod(index, true, true)}
          className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <span className="text-gray-500">a</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAdjustPeriod(index, false, false)}
          className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 text-gray-700">
          <Clock className="w-4 h-4 text-indigo-600" />
          <span>Semana {endInfo.week} día {endInfo.day}</span>
        </div>
        <button
          onClick={() => handleAdjustPeriod(index, false, true)}
          className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center hover:bg-indigo-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PeriodDateRange;