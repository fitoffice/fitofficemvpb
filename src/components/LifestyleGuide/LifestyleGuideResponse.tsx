import React from 'react';
import { Heart, Coffee, Sun, Moon, Utensils, Brain, Battery } from 'lucide-react';

interface LifestyleRecommendations {
  morningRoutine: string[];
  eveningRoutine: string[];
  nutritionPlan: {
    meals: Array<{
      time: string;
      suggestions: string[];
      tips: string;
    }>;
  };
  sleepOptimization: string[];
  stressManagement: string[];
  habits: {
    toAdd: string[];
    toReduce: string[];
  };
}

interface LifestyleGuideResponseProps {
  recommendations: LifestyleRecommendations;
}

const LifestyleGuideResponse: React.FC<LifestyleGuideResponseProps> = ({ recommendations }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-6">
        {/* Rutina Matutina */}
        <section className="border-b pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sun className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Rutina Matutina</h3>
          </div>
          <ul className="list-disc pl-6 space-y-2">
            {recommendations.morningRoutine.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </section>

        {/* Plan Nutricional */}
        <section className="border-b pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Plan Nutricional</h3>
          </div>
          <div className="space-y-4">
            {recommendations.nutritionPlan.meals.map((meal, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">{meal.time}</h4>
                <ul className="list-disc pl-6 space-y-1">
                  {meal.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
                <p className="mt-2 text-sm text-gray-600 italic">{meal.tips}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Optimización del Sueño */}
        <section className="border-b pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold">Optimización del Sueño</h3>
          </div>
          <ul className="list-disc pl-6 space-y-2">
            {recommendations.sleepOptimization.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </section>

        {/* Manejo del Estrés */}
        <section className="border-b pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Manejo del Estrés</h3>
          </div>
          <ul className="list-disc pl-6 space-y-2">
            {recommendations.stressManagement.map((item, index) => (
              <li key={index} className="text-gray-700">{item}</li>
            ))}
          </ul>
        </section>

        {/* Hábitos */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold">Hábitos Recomendados</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-green-600 font-medium mb-2">Hábitos a Incorporar</h4>
              <ul className="list-disc pl-6 space-y-2">
                {recommendations.habits.toAdd.map((habit, index) => (
                  <li key={index} className="text-gray-700">{habit}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-red-600 font-medium mb-2">Hábitos a Reducir</h4>
              <ul className="list-disc pl-6 space-y-2">
                {recommendations.habits.toReduce.map((habit, index) => (
                  <li key={index} className="text-gray-700">{habit}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LifestyleGuideResponse;
