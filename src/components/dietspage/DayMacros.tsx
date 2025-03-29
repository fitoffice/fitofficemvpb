import React from 'react';
import MacroGraph from './MacroGraph';
import { Scale, Flame, Beef, Wheat, Droplet } from 'lucide-react';

interface DayMacrosProps {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fats: { current: number; target: number };
}

export default function DayMacros({ calories, protein, carbs, fats }: DayMacrosProps) {
  return (
    <div className="bg-white/50 backdrop-blur-lg p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <Scale className="w-5 h-5 text-white" />
        </div>
        <h4 className="font-bold text-xl text-gray-800">Objetivos Diarios</h4>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <span className="font-medium text-amber-700">Calorías</span>
          </div>
          <MacroGraph
            current={calories.current}
            target={calories.target}
            label="Calorías"
            color="bg-gradient-to-r from-amber-400 to-amber-500"
            unit="kcal"
          />
        </div>
        
        <div className="p-4 bg-gradient-to-r from-red-50 to-red-100/50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <Beef className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-medium text-red-700">Proteínas</span>
          </div>
          <MacroGraph
            current={protein.current}
            target={protein.target}
            label="Proteínas"
            color="bg-gradient-to-r from-red-400 to-red-500"
            unit="g"
          />
        </div>
        
        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Wheat className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-medium text-blue-700">Carbohidratos</span>
          </div>
          <MacroGraph
            current={carbs.current}
            target={carbs.target}
            label="Carbohidratos"
            color="bg-gradient-to-r from-blue-400 to-blue-500"
            unit="g"
          />
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Droplet className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-medium text-purple-700">Grasas</span>
          </div>
          <MacroGraph
            current={fats.current}
            target={fats.target}
            label="Grasas"
            color="bg-gradient-to-r from-purple-400 to-purple-500"
            unit="g"
          />
        </div>
      </div>
    </div>
  );
}