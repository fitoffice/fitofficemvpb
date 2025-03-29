import React, { useState, useEffect } from 'react';
import {  Target, Flame, Calendar, AlertCircle, TrendingUp, Settings } from 'lucide-react';
import DietConfigPopup, { DietConfig } from './DietConfigPopup';

// Define props interface for DietInfo
interface DietInfoProps {
  title?: string;
  client?: string;
  goal?: string;
  restrictions?: string;
  estado?: string;
  macros?: {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fats: { current: number; target: number };
  };
}

export default function DietInfo({ 
  title = 'Plan Nutricional',
  client = 'Cliente',
  goal = 'Sin objetivo definido',
  restrictions = 'Sin restricciones',
  estado = 'activa',
  macros
}: DietInfoProps) {

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [dietConfig, setDietConfig] = useState<DietConfig>({
    calorieGoal: macros?.calories.target || 0,
    macros: {
      protein: macros?.protein.target || 0,
      carbs: macros?.carbs.target || 0,
      fat: macros?.fats.target || 0,
    },
    restrictions: [
      { type: 'Sin Gluten', severity: 'high' },
      { type: 'Lácteos Limitados', severity: 'medium' }
    ],
    mealFrequency: 5
  });

  // Update dietConfig when props change
  useEffect(() => {
    if (macros) {
      setDietConfig(prev => ({
        ...prev,
        calorieGoal: macros.calories.target || prev.calorieGoal,
        macros: {
          protein: macros.protein.target || prev.macros.protein,
          carbs: macros.carbs.target || prev.macros.carbs,
          fat: macros.fats.target || prev.macros.fat,
        }
      }));
    }
  }, [macros]);

  // Log the props received from PageEdicionDieta
  useEffect(() => {
    console.log('Datos recibidos en DietInfo:', {
      título: title,
      cliente: client,
      objetivo: goal,
      restricciones: restrictions,
      estado: estado,
      macros: macros
    });
  }, [title, client, goal, restrictions, estado, macros]);

  const handleConfigClick = () => {
    setIsConfigOpen(true);
  };

  const handleConfigSave = (newConfig: DietConfig) => {
    setDietConfig(newConfig);
    console.log('Nueva configuración guardada:', newConfig);
  };

  // Use dietConfig.restrictions instead of the hardcoded array
  const dietaryRestrictions = dietConfig.restrictions;

  return (
    <div className="relative overflow-hidden p-4">
      <div className="diet-info-gradient text-white p-8 rounded-[2rem] shadow-2xl mb-8 relative overflow-hidden backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-blue-500/20 hover:shadow-3xl">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1932&auto=format&fit=crop')] bg-cover bg-center opacity-10 animate-subtle-pulse mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-indigo-700/90 to-blue-900/90"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 animate-float">
          <Flame className="w-64 h-64 text-white/5 animate-glow" />
        </div>
        <div className="absolute bottom-0 left-0 transform -translate-x-1/3 translate-y-1/3 rotate-45 animate-float-delayed">
          <Target className="w-48 h-48 text-white/5 animate-glow" />
        </div>
        
        {/* Configuration button - positioned in the top right corner */}
        <button 
          onClick={handleConfigClick}
          className="absolute top-6 right-6 z-10 p-3 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10 group"
          aria-label="Configurar dieta"
        >
          <Settings className="w-6 h-6 text-white group-hover:text-blue-300 transition-colors animate-pulse-slow" />
        </button>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Calendar className="w-5 h-5 text-blue-300 animate-pulse-slow" />
              <span className="font-medium">Marzo 2024</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-xl hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <TrendingUp className="w-5 h-5 text-emerald-300 animate-bounce-slow" />
              <span className="font-medium text-emerald-100">Progreso Excelente</span>
            </div>
          </div>

          {/* Enhanced header section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-5xl font-bold tracking-tight flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                Plan Nutricional Personalizado
                <span className="text-sm font-normal px-3 py-1 bg-blue-500/20 rounded-full border border-blue-400/20 animate-pulse-slow">
                  Premium
                </span>
              </h1>
              <p className="text-white/80 max-w-xl text-lg leading-relaxed font-light">
                Optimizado para tus objetivos de fitness y preferencias alimenticias.
                Ajustado dinámicamente según tu progreso.
              </p>
            </div>
            
            {/* Enhanced restrictions display */}
            <div className="flex flex-wrap gap-3">
              {dietaryRestrictions.map((restriction, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    restriction.severity === 'high'
                      ? 'bg-red-500/20 text-white border border-red-400/20 hover:bg-red-500/30'
                      : 'bg-yellow-500/20 text-white border border-yellow-400/20 hover:bg-yellow-500/30'
                  }`}
                >
                  <AlertCircle className={`w-4 h-4 ${
                    restriction.severity === 'high' ? 'text-red-300' : 'text-yellow-300'
                  } animate-pulse-slow`} />
                  <span className="font-medium">{restriction.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced grid items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Update each grid item with enhanced styling */}
            <div className="flex items-center space-x-4 bg-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all duration-300 group cursor-pointer hover:scale-105 hover:shadow-lg border border-white/5">
              <div className="p-3 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8 group-hover:text-blue-300 transition-colors" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Objetivo</h3>
                <p className="text-white/80">Pérdida de grasa</p>
              </div>
            </div>

            {/* ... Similar updates for other grid items ... */}
          </div>
        </div>
      </div>

      {/* Diet Configuration Popup */}
      <DietConfigPopup 
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSave={handleConfigSave}
        initialConfig={dietConfig}
        title={title}
        client={client}
        goal={goal}
        restrictions={restrictions}
        estado={estado}
        macrosData={macros}
      />
      <style jsx>{`
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(10px) rotate(-5deg); }
        }
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 8s ease-in-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 4s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}