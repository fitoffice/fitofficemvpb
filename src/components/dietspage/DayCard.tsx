import React from 'react';
import MealCard from './MealCard';
import DayMacros from './DayMacros';
import { Calendar, Sun, Coffee, Apple, Pizza, Cookie, Moon, ChevronRight } from 'lucide-react';

interface DayCardProps {
  day: string;
  date: string;
  isToday?: boolean;
  viewMode: 'grid' | 'list';
}

export default function DayCard({ day, date, isToday, viewMode }: DayCardProps) {
  const handleAddMeal = () => {
    const event = new CustomEvent('openMealModal', {
      detail: { mealType: '', isEdit: false }
    });
    window.dispatchEvent(event);
  };

  const handleEditMeal = () => {
    const event = new CustomEvent('openMealModal', {
      detail: { 
        mealType: '', 
        isEdit: true,
        meal: sampleMeal
      }
    });
    window.dispatchEvent(event);
  };

  const sampleMeal = {
    name: "Avena con frutas",
    calories: 350,
    protein: 15,
    carbs: 45,
    fats: 12,
    time: "08:00"
  };

  const macros = {
    calories: { current: 1800, target: 2200 },
    protein: { current: 140, target: 180 },
    carbs: { current: 180, target: 220 },
    fats: { current: 55, target: 73 }
  };

  const getMealIcon = (title: string) => {
    switch (title) {
      case "Desayuno": return Coffee;
      case "Almuerzo": return Apple;
      case "Comida": return Pizza;
      case "Merienda": return Cookie;
      case "Cena": return Moon;
      default: return Sun;
    }
  };

  const meals = [
    { title: "Desayuno", time: "07:00 - 09:00" },
    { title: "Almuerzo", time: "10:30 - 11:30" },
    { title: "Comida", time: "14:00 - 15:00" },
    { title: "Merienda", time: "17:00 - 18:00" },
    { title: "Cena", time: "20:00 - 21:30" }
  ];

  if (viewMode === 'list') {
    return (
      <div className={`glass-card p-4 rounded-xl transform transition-all duration-300 hover:-translate-x-1 ${
        isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-xl ${
              isToday 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
                : 'bg-blue-100'
            }`}>
              <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="font-bold text-xl text-gray-800">{day}</h3>
                <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} font-medium`}>{date}</p>
                {isToday && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Hoy
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center space-x-4">
                  {meals.map((meal) => {
                    const Icon = getMealIcon(meal.title);
                    return (
                      <div 
                        key={meal.title}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={handleAddMeal}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{meal.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Calorías</p>
                <p className="font-semibold text-gray-800">{macros.calories.current}/{macros.calories.target}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Proteínas</p>
                <p className="font-semibold text-gray-800">{macros.protein.current}/{macros.protein.target}g</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Carbos</p>
                <p className="font-semibold text-gray-800">{macros.carbs.current}/{macros.carbs.target}g</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-6 rounded-xl transform transition-all duration-300 hover:-translate-y-1 ${
      isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
              : 'bg-blue-100'
          }`}>
            <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">{day}</h3>
            <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} font-medium`}>{date}</p>
          </div>
        </div>
        {isToday && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Hoy
          </span>
        )}
      </div>

      <DayMacros {...macros} />

      <div className="mt-6 space-y-4">
        {meals.map((mealTime) => (
          <MealCard 
            key={mealTime.title}
            title={mealTime.title}
            meal={mealTime.title === "Desayuno" ? sampleMeal : undefined}
            onAdd={handleAddMeal}
            onEdit={handleEditMeal}
            icon={getMealIcon(mealTime.title)}
            suggestedTime={mealTime.time}
          />
        ))}
      </div>
    </div>
  );
}