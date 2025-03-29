import React from 'react';
import { Plus, Edit3, Clock, Utensils } from 'lucide-react';
import MacroProgress from '../MacroProgress';
import { MealTime } from './types';
import { useTheme } from '../../../contexts/ThemeContext';

interface ListDayViewProps {
  day: string;
  date: string;
  isToday: boolean;
  mealTimes: MealTime[];
  macros: {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fats: { current: number; target: number };
  };
  handleAddMeal: (mealTime: string) => void;
  handleEditMeal: (meal: any) => void;
  handleEditMacros: () => void;
  getMealsForTime: (mealTime: string) => any[];
}

export default function ListDayView({
  day,
  date,
  isToday,
  mealTimes,
  macros,
  handleAddMeal,
  handleEditMeal,
  handleEditMacros,
  getMealsForTime
}: ListDayViewProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100/50'} rounded-2xl shadow-xl p-6 space-y-6 border hover:shadow-2xl transition-all duration-300 backdrop-blur-xl`}>
      {/* Enhanced Header */}
      <div className={`flex justify-between items-center ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} p-4 rounded-xl`}>
        <div className="space-y-1">
        <h3 className={`text-2xl font-bold bg-clip-text text-transparent ${isDark ? 'bg-gradient-to-r from-blue-400 to-indigo-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} capitalize`}>{day}</h3>
        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} tracking-wide`}>{date}</p>
        </div>
        <button
          onClick={handleEditMacros}
          className={`p-3 ${isDark ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30' : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20'} rounded-xl transition-all duration-300 group`}
        >         <Edit3 size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`} />
        </button>
      </div>

      {/* Enhanced Macros Grid */}
      <div className={`grid grid-cols-2 gap-4 ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-700' : 'bg-gradient-to-br from-gray-50 to-white border-gray-100/50'} p-4 rounded-xl border`}>
        <MacroProgress
          label="Calorías"
          current={macros.calories.current}
          target={macros.calories.target}
          unit="kcal"
        />
        <MacroProgress
          label="Proteínas"
          current={macros.protein.current}
          target={macros.protein.target}
          unit="g"
        />
        <MacroProgress
          label="Carbohidratos"
          current={macros.carbs.current}
          target={macros.carbs.target}
          unit="g"
        />
        <MacroProgress
          label="Grasas"
          current={macros.fats.current}
          target={macros.fats.target}
          unit="g"
        />
      </div>

      {/* Enhanced Meals List */}
      <div className="space-y-6">
        {mealTimes.map((mealTime) => {
          const meals = getMealsForTime(mealTime.title);
          return (
            <div key={mealTime.title} className="space-y-3">
              <div className={`flex justify-between items-center ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-700' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100/50'} p-3 rounded-xl border`}>
              <div className="flex items-center space-x-3">
              <div className={`p-2 ${isDark ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' : 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10'} rounded-lg`}>
              <Clock className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
                  <div>
                  <h4 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{mealTime.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{mealTime.time}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddMeal(mealTime.title)}
                  className={`p-2 ${isDark ? 'hover:bg-blue-500/20' : 'hover:bg-blue-500/10'} rounded-lg transition-colors duration-300 group`}
                >
                  <Plus size={20} className={`${isDark ? 'text-blue-400' : 'text-blue-600'} group-hover:scale-110 group-hover:rotate-180 transition-all duration-300`} />
                </button>
              </div>
              {meals.length > 0 ? (
                <div className="pl-6 space-y-3">
                  {meals.map((meal: any) => (
                    <div
                    key={meal.id}
                    className={`flex justify-between items-center p-4 ${isDark ? 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-700 hover:border-blue-700/50' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100/50 hover:border-blue-200/50'} rounded-xl border hover:shadow-lg cursor-pointer transition-all duration-300 group`}
                    onClick={() => handleEditMeal(meal)}
                  >
                    <div className="flex items-center space-x-4">
                    <div className={`p-2 ${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 group-hover:from-indigo-500/30 group-hover:to-purple-500/30' : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20'} rounded-lg transition-colors`}>
                          <Utensils className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                        </div>
                        <div>
                        <p className={`font-medium ${isDark ? 'text-gray-200 group-hover:text-indigo-400' : 'text-gray-800 group-hover:text-indigo-600'} transition-colors`}>{meal.nombre}</p>
                        <div className="flex gap-2 mt-1">
                        <span className={`text-sm px-2 py-1 ${isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/10 text-blue-700'} rounded-md`}>
                              {meal.calorias} kcal
                            </span>
                            <span className={`text-sm px-2 py-1 ${isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-500/10 text-green-700'} rounded-md`}>
                              {meal.proteinas}g P
                            </span>
                            <span className={`text-sm px-2 py-1 ${isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-500/10 text-yellow-700'} rounded-md`}>
                              {meal.carbohidratos}g C
                            </span>
                            <span className={`text-sm px-2 py-1 ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-500/10 text-red-700'} rounded-md`}>
                              {meal.grasas}g G
                            </span>
                          </div>
                        </div>
                      </div>
                      <Edit3 size={18} className={`${isDark ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-600'} group-hover:rotate-12 transition-all duration-300`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`pl-6 py-4 ${isDark ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50/50 border-gray-100/50'} rounded-xl border text-center`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>No hay comidas agregadas</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}