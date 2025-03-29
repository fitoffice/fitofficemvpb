import React from 'react';
import { Heart, Coffee, Sun, Moon, Utensils, Brain, Battery } from 'lucide-react';

interface LifestyleRecommendations {
  lifestyleAdvice: {
    morningRoutine: string[];
    eveningRoutine: string[];
    nutritionPlan: {
      desayuno: string;
      almuerzo: string;
      cena: string;
      tips: string;
    };
    sleepOptimization: string[];
    stressManagement: string[];
    habitsToIncorporate: string[];
    habitsToReduce: string[];
  };
  status: string;
  timestamp: string;
  version: string;
}

interface LifestyleResponseProps {
  recommendations: LifestyleRecommendations;
}

const LifestyleResponse: React.FC<LifestyleResponseProps> = ({ recommendations }) => {
  const { lifestyleAdvice } = recommendations;
  
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Rutinas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Rutina Mañana */}
        <div className="bg-orange-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Sun className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Rutina Mañana
            </h3>
          </div>
          <ul className="space-y-2">
            {lifestyleAdvice.morningRoutine.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-orange-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Rutina Noche */}
        <div className="bg-indigo-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Moon className="w-6 h-6 text-indigo-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Rutina Noche
            </h3>
          </div>
          <ul className="space-y-2">
            {lifestyleAdvice.eveningRoutine.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-indigo-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Plan Nutricional */}
      <div className="bg-green-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Utensils className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Plan Nutricional
          </h3>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Desayuno</h4>
            <p className="text-gray-700 dark:text-gray-300">{lifestyleAdvice.nutritionPlan.desayuno}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Almuerzo</h4>
            <p className="text-gray-700 dark:text-gray-300">{lifestyleAdvice.nutritionPlan.almuerzo}</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white">Cena</h4>
            <p className="text-gray-700 dark:text-gray-300">{lifestyleAdvice.nutritionPlan.cena}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            💡 {lifestyleAdvice.nutritionPlan.tips}
          </p>
        </div>
      </div>

      {/* Optimización del Sueño */}
      <div className="bg-purple-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Battery className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Optimización del Sueño
          </h3>
        </div>
        <ul className="space-y-2">
          {lifestyleAdvice.sleepOptimization.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-purple-500 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Manejo del Estrés */}
      <div className="bg-blue-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Manejo del Estrés
          </h3>
        </div>
        <ul className="space-y-2">
          {lifestyleAdvice.stressManagement.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Hábitos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Hábitos a Incorporar */}
        <div className="bg-pink-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hábitos a Incorporar
            </h3>
          </div>
          <ul className="space-y-2">
            {lifestyleAdvice.habitsToIncorporate.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-pink-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Hábitos a Reducir */}
        <div className="bg-red-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Hábitos a Reducir
            </h3>
          </div>
          <ul className="space-y-2">
            {lifestyleAdvice.habitsToReduce.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-500 mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LifestyleResponse;
