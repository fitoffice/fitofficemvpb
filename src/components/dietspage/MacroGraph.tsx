import React from 'react';

interface MacroGraphProps {
  current: number;
  target: number;
  label: string;
  color: string;
  unit: string;
}

export default function MacroGraph({ current, target, unit, color }: MacroGraphProps) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-semibold">
          <span className="text-gray-800">{current}</span>
          <span className="text-gray-500">/{target}</span>
          <span className="ml-1 text-gray-600">{unit}</span>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}