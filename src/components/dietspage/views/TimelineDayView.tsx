import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, ChevronDown, ChevronUp, Bell, Coffee, Apple, Pizza, Cookie, Moon } from 'lucide-react';
import { DayViewProps } from './types';

export default function TimelineDayView({ day, date, isToday, meals = [], macros, handleAddMeal }: DayViewProps) {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [showReminders, setShowReminders] = useState(false);

  const reminders = [
    { time: "07:30", message: "Tomar agua al despertar" },
    { time: "10:00", message: "Snack pre-entreno" },
    { time: "14:30", message: "Preparar comida" }
  ];

  const timeSlots = [
    { start: "06:00", end: "09:00", label: "Mañana temprano" },
    { start: "09:00", end: "12:00", label: "Media mañana" },
    { start: "12:00", end: "15:00", label: "Mediodía" },
    { start: "15:00", end: "18:00", label: "Tarde" },
    { start: "18:00", end: "21:00", label: "Noche" }
  ];

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

  const getMealTimeSlot = (mealTime: string) => {
    const [hours] = mealTime.split(" - ")[0].split(":");
    const hour = parseInt(hours);
    return timeSlots.find(slot => {
      const [slotStart] = slot.start.split(":");
      const [slotEnd] = slot.end.split(":");
      return hour >= parseInt(slotStart) && hour < parseInt(slotEnd);
    });
  };

  const toggleMealExpansion = (mealTitle: string) => {
    setExpandedMeal(expandedMeal === mealTitle ? null : mealTitle);
  };

  return (
    <div className={`glass-card p-4 rounded-xl transform transition-all duration-300 hover:-translate-y-1 ${
      isToday ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-100' : ''
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-100' 
              : 'bg-blue-100'
          }`}>
            <Calendar className={`w-5 h-5 ${isToday ? 'text-white' : 'text-blue-700'}`} />
          </div>
          <div className="flex items-center space-x-3">
            <h3 className="font-bold text-xl text-gray-800">{day}</h3>
            <p className={`${isToday ? 'text-blue-600' : 'text-gray-500'} font-medium`}>{date}</p>
            {isToday && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Hoy
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowReminders(!showReminders)}
          className={`p-2 rounded-lg transition-colors ${
            showReminders ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {showReminders && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
          <h4 className="font-medium text-blue-800 mb-3">Recordatorios del día</h4>
          <div className="space-y-2">
            {reminders.map((reminder, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <span className="font-medium text-blue-600">{reminder.time}</span>
                <span className="text-blue-700">{reminder.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative pl-8">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200"></div>
        
        {timeSlots.map((slot, slotIndex) => {
          const slotMeals = meals.filter(meal => {
            const mealSlot = getMealTimeSlot(meal.time);
            return mealSlot && mealSlot.start === slot.start;
          });

          if (slotMeals.length === 0) return null;

          return (
            <div key={slotIndex} className="mb-6 last:mb-0">
              <div className="flex items-center space-x-2 mb-3 -ml-8">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">{slot.label}</span>
              </div>

              {slotMeals.map((meal, index) => {
                const Icon = getMealIcon(meal.title);
                const hasMeal = meal.title === "Desayuno";
                const isExpanded = expandedMeal === meal.title;

                return (
                  <div key={`${day}-${meal.title}-${index}`} className="relative mb-4 last:mb-0">
                    <div className="absolute left-[-1.95rem] w-4 h-4 rounded-full bg-white border-2 border-gray-200"></div>
                    <div 
                      className={`ml-4 p-4 rounded-xl transition-all cursor-pointer ${
                        hasMeal 
                          ? 'bg-emerald-50 hover:bg-emerald-100' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleMealExpansion(meal.title)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-4 h-4 ${hasMeal ? 'text-emerald-600' : 'text-gray-500'}`} />
                          <span className={`font-medium ${hasMeal ? 'text-emerald-900' : 'text-gray-700'}`}>
                            {meal.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">{meal.time}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-sm text-gray-500">Calorías</p>
                              <p className="font-semibold text-amber-600">
                                {hasMeal ? "350 kcal" : "0 kcal"}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-sm text-gray-500">Proteínas</p>
                              <p className="font-semibold text-red-600">
                                {hasMeal ? "15g" : "0g"}
                              </p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                              <p className="text-sm text-gray-500">Carbohidratos</p>
                              <p className="font-semibold text-blue-600">
                                {hasMeal ? "45g" : "0g"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-between items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddMeal();
                              }}
                              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                            >
                              {hasMeal ? 'Editar comida' : 'Añadir comida'}
                            </button>
                            {hasMeal && (
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">Ver detalles</span>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}