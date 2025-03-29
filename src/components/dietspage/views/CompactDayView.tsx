import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Sparkles, Coffee, Apple, Pizza, Cookie, Moon } from 'lucide-react';
import { DayViewProps } from './types';

export default function CompactDayView({ day, date, isToday, meals = [], macros, handleAddMeal }: DayViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = [
    { title: "Batido de proteínas", calories: 150, time: "Pre-entreno" },
    { title: "Yogur con frutas", calories: 200, time: "Snack" },
    { title: "Ensalada de quinoa", calories: 300, time: "Almuerzo" }
  ];

  const calculateCompletionRate = () => {
    if (!meals.length) return 0;
    const completed = meals.filter(m => m.title === "Desayuno").length;
    return (completed / meals.length) * 100;
  };

  const getMealIcon = (title: string) => {
    switch (title) {
      case "Desayuno": return Coffee;
      case "Almuerzo": return Apple;
      case "Comida": return Pizza;
      case "Merienda": return Cookie;
      case "Cena": return Moon;
      default: return Coffee;
    }
  };

  const completionRate = calculateCompletionRate();
  const remainingCalories = macros.calories.target - macros.calories.current;

  return (
    <div 
      className={`bg-white backdrop-blur-lg border border-gray-100 p-5 rounded-2xl transform transition-all duration-300 
      hover:shadow-lg hover:shadow-blue-100/50 ${
        isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg shadow-blue-100/50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200/50' 
              : 'bg-blue-50'
          }`}>
            <Calendar className={`w-6 h-6 ${isToday ? 'text-white' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800 capitalize">{day}</h3>
            <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} text-sm font-medium`}>{date}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isToday && (
            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
              Hoy
            </span>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {meals.map((meal, index) => {
          if (!meal || !meal.title) return null;
          const Icon = getMealIcon(meal.title);
          const hasMeal = meal.title === "Desayuno";
          const shortTitle = meal.title.slice(0, 3);
          
          return (
            <button
              key={`${day}-${meal.title}-${index}`}
              onClick={handleAddMeal}
              className={`p-3 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all ${
                hasMeal 
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 hover:shadow-md hover:shadow-emerald-100/50' 
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{shortTitle}</span>
            </button>
          );
        })}
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-blue-700">Progreso del día</span>
              <span className="text-sm font-bold text-blue-800">{Math.round(completionRate)}%</span>
            </div>
            <div className="h-2.5 bg-blue-200/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-2xl">
              <p className="text-sm text-amber-600 font-medium mb-1">Calorías restantes</p>
              <p className="text-2xl font-bold text-amber-700">{remainingCalories} <span className="text-base">kcal</span></p>
            </div>
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-2xl">
              <p className="text-sm text-emerald-600 font-medium mb-1">Proteína total</p>
              <p className="text-2xl font-bold text-emerald-700">{macros.protein.current}<span className="text-base">g</span></p>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mb-4 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold">
                {showRecommendations ? 'Ocultar recomendaciones' : 'Ver recomendaciones'}
              </span>
            </button>
            
            {showRecommendations && (
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{rec.title}</p>
                      <p className="text-xs text-gray-500">{rec.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                      {rec.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}