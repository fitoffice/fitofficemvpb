import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface MacroProgressProps {
  label: string;
  current: number;
  target: number;
  unit: string;
}

export default function MacroProgress({ label, current, target, unit }: MacroProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isOverTarget = current > target;
  const { theme } = useTheme();

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={`font-medium ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
        }`}>{label}</span>
        <span className={`${
          isOverTarget 
            ? theme === 'dark' ? 'text-red-400' : 'text-red-600' 
            : theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {Math.round(current)}/{Math.round(target)} {unit}
        </span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOverTarget 
              ? theme === 'dark' ? 'bg-red-600' : 'bg-red-500' 
              : theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}