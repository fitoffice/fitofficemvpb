import React from 'react';
import { Plus, Edit2, Clock } from 'lucide-react';
import { Meal } from './views/types';

interface MealCardProps {
  meal?: Meal;
  onAdd: () => void;
  onEdit: (meal: Meal) => void;
}

export default function MealCard({ meal, onAdd, onEdit }: MealCardProps) {
  if (!meal) {
    return (
      <div 
        onClick={onAdd}
        className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer group"
      >
        <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-500 mb-1 group-hover:scale-110 transition-transform" />
        <p className="text-gray-400 group-hover:text-gray-500 text-sm font-medium">Añadir comida</p>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-lg p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-semibold text-gray-800">{meal.name}</h4>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{meal.time}</span>
          </div>
        </div>
        <button 
          onClick={() => onEdit(meal)} 
          className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors flex items-center space-x-2 group"
        >
          <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Editar</span>
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="macro-pill bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 flex items-center justify-center space-x-1">
          <span className="font-semibold">{meal.calories}</span>
          <span>kcal</span>
        </div>
        <div className="macro-pill bg-gradient-to-r from-red-100 to-red-200 text-red-700 flex items-center justify-center space-x-1">
          <span className="font-semibold">{meal.protein}g</span>
          <span>prot</span>
        </div>
        <div className="macro-pill bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center space-x-1">
          <span className="font-semibold">{meal.carbs}g</span>
          <span>carbs</span>
        </div>
        <div className="macro-pill bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 flex items-center justify-center space-x-1">
          <span className="font-semibold">{meal.fats}g</span>
          <span>grasas</span>
        </div>
      </div>
    </div>
  );
}