import React from 'react';
import { Plus, Edit3, Coffee, Utensils, Trash2 } from 'lucide-react';
import MacroProgress from '../MacroProgress';
import { MealTime } from './types';
import { useTheme } from '../../../contexts/ThemeContext';
import axios from 'axios';

interface GridDayViewProps {
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
  handleDeleteMeal?: (mealId: string) => void;
  getMealsForTime: (mealTime: string) => any[];
  dietId?: string; // Add dietId prop

}

export default function GridDayView({
  day,
  date,
  mealTimes,
  macros,
  handleAddMeal,
  handleEditMeal,
  handleEditMacros,
  handleDeleteMeal,
  getMealsForTime,
   dietId // Add dietId to destructuring

}: GridDayViewProps) {
  const { theme } = useTheme();
  console.log('GridDayView - Datos recibidos:', {
    day,
    date,
    mealTimes,
    macros,
    allMeals: getMealsForTime(),
    dietId // Log dietId for debugging
  });
  const calculateMealTotals = (meals: any[]) => {
    return meals.reduce((acc, meal) => {
      let mealCalorias = 0;
      let mealProteinas = 0;
      let mealCarbohidratos = 0;
      let mealGrasas = 0;

      meal.ingredientes?.forEach((ingrediente: any) => {
        mealCalorias += Number(ingrediente.calorias) || 0;
        mealProteinas += Number(ingrediente.proteinas) || 0;
        mealCarbohidratos += Number(ingrediente.carbohidratos) || 0;
        mealGrasas += Number(ingrediente.grasas) || 0;
      });

      return {
        calorias: acc.calorias + mealCalorias,
        proteinas: acc.proteinas + mealProteinas,
        carbohidratos: acc.carbohidratos + mealCarbohidratos,
        grasas: acc.grasas + mealGrasas
      };
    }, {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  // Obtener todas las comidas del día
  const allMeals = getMealsForTime();

  // Calcular los totales de todas las comidas para los macros
  const dayTotals = calculateMealTotals(allMeals);

  // Add a function to handle delete with confirmation
  const onDeleteMeal = async (e: React.MouseEvent, mealId: string) => {
    e.stopPropagation(); // Prevent triggering the parent onClick (edit meal)
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta comida?')) {
      try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          alert('No se encontró token de autenticación. Por favor, inicie sesión nuevamente.');
          return;
        }
        
        if (!dietId) {
          alert('No se encontró el ID de la dieta.');
          return;
        }
        
        // Realizar la petición DELETE a la API con el dietId correcto
        const response = await axios.delete(
          `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas/${dietId}/dias/${date}/comidas/${mealId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        // Si la petición fue exitosa, llamar a handleDeleteMeal para actualizar la UI
        if (response.status === 200) {
          if (handleDeleteMeal) {
            handleDeleteMeal(mealId);
          }
          alert('Comida eliminada correctamente');
        }
      } catch (error) {
        console.error('Error al eliminar la comida:', error);
        alert('Ocurrió un error al eliminar la comida. Por favor, inténtelo de nuevo.');
      }
    }
  };

  return (
    <div className={`${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700 hover:border-blue-700/50' 
        : 'bg-white border-gray-100/50 hover:border-blue-200/50'
    } backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl border transform hover:-translate-y-1`}>
      {/* Enhanced Header Section */}
      <div className={`relative p-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-blue-900/30 via-indigo-900/30 to-purple-900/30 border-b border-gray-700/50'
          : 'bg-gradient-to-br from-blue-500/15 via-indigo-500/15 to-purple-500/15 border-b border-gray-100/50'
      } overflow-hidden`}>
        <div className="relative flex justify-between items-center">
        <div className="space-y-2">
        <h3 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 capitalize tracking-tight hover:scale-105 transition-transform cursor-default">{day}</h3>
        <p className={`text-sm font-medium tracking-wider uppercase px-3 py-1 rounded-full inline-block backdrop-blur-sm ${
              theme === 'dark'
                ? 'text-gray-300 bg-gray-700/50'
                : 'text-gray-600 bg-white/50'
            }`}>{date}</p>
          </div>
          <div className="flex items-center space-x-4">
          <button
              onClick={() => handleAddMeal("Comida")}
              className={`p-3.5 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/50 hover:to-indigo-900/50'
                  : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20'
              }`}
            >

<Plus size={24} className={`${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              } group-hover:scale-110 transition-transform rotate-0 group-hover:rotate-180 duration-300`} />
            </button>
            <button
              onClick={handleEditMacros}
              className={`p-3.5 rounded-2xl transition-all duration-300 group backdrop-blur-sm hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 hover:from-purple-900/50 hover:to-pink-900/50'
                  : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20'
              }`}
            >
 <Edit3 size={24} className={`${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
              } group-hover:scale-110 transition-transform group-hover:rotate-12 duration-300`} />
                          </button>
          </div>
        </div>

        {/* Enhanced Macros Section */}
        <div className={`grid grid-cols-2 gap-6 mt-8 p-6 rounded-2xl backdrop-blur-md shadow-inner ${
          theme === 'dark'
            ? 'bg-gray-700/40 border border-gray-600/50'
            : 'bg-white/40 border border-white/50'
        }`}>          <MacroProgress
            label="Calorías"
            current={dayTotals.calorias}
            target={macros.calories.target}
            unit="kcal"
          />
          <MacroProgress
            label="Proteínas"
            current={dayTotals.proteinas}
            target={macros.protein.target}
            unit="g"
          />
          <MacroProgress
            label="Carbohidratos"
            current={dayTotals.carbohidratos}
            target={macros.carbs.target}
            unit="g"
          />
          <MacroProgress
            label="Grasas"
            current={dayTotals.grasas}
            target={macros.fats.target}
            unit="g"
          />
        </div>
      </div>

      {/* Enhanced Meals Section */}
      <div className={`p-8 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-gray-800/50 to-gray-900'
          : 'bg-gradient-to-b from-gray-50/50 to-white'
      }`}>        {allMeals.length > 0 ? (
          <div className="space-y-8">
            {allMeals.map((meal: any) => {
              const mealTotals = calculateMealTotals([meal]);
              return (
                <div
                key={meal.numero}
                className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-sm hover:-translate-y-1 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700/50 hover:border-blue-700/50 hover:shadow-2xl'
                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100/50 hover:border-blue-200/50 hover:shadow-2xl'
                }`}
                onClick={() => handleEditMeal(meal)}
              >

                  <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-2xl"></div>
                  <div className="relative flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center space-x-4">
                      <div className={`p-3.5 rounded-2xl transition-colors backdrop-blur-sm shadow-lg ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 group-hover:from-blue-900/50 group-hover:to-indigo-900/50'
                            : 'bg-gradient-to-br from-blue-500/15 to-indigo-500/15 group-hover:from-blue-500/25 group-hover:to-indigo-500/25'
                        }`}>                                                   <Utensils className={`w-7 h-7 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        } group-hover:scale-110 transition-transform`} />

                        </div>
                        <div>
                        <h4 className={`text-2xl font-bold transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-100 group-hover:text-blue-400'
                              : 'text-gray-900 group-hover:text-blue-600'
                          }`}>{meal.nombre || meal.comida?.nombre || `Comida #${meal.numero}`}</h4>
                        <p className={`text-sm mt-1 transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-400 group-hover:text-blue-400'
                              : 'text-gray-500 group-hover:text-blue-500'
                          }`}>Peso total: {meal.peso || meal.comida?.peso || 0}g</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => onDeleteMeal(e, meal._id)}
                        className={`p-2.5 rounded-xl transition-all duration-300 group/delete backdrop-blur-sm hover:shadow-lg ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 hover:from-red-900/50 hover:to-red-800/50'
                            : 'bg-gradient-to-r from-red-500/10 to-red-400/10 hover:from-red-500/20 hover:to-red-400/20'
                        }`}
                      >
                        <Trash2 size={20} className={`transition-colors group-hover/delete:scale-110 group-hover/delete:rotate-12 duration-300 ${
                          theme === 'dark'
                            ? 'text-red-400 group-hover/delete:text-red-300'
                            : 'text-red-500 group-hover/delete:text-red-600'
                        }`} />
                      </button>
                      <Edit3 size={22} className={`transition-colors group-hover:rotate-12 duration-300 ${
                        theme === 'dark'
                          ? 'text-gray-500 group-hover:text-blue-400'
                          : 'text-gray-400 group-hover:text-blue-500'
                      }`} />
                    </div>
                  </div>
                  
                  {/* Enhanced Ingredients Section */}
                  <div className="space-y-4 ml-[3.75rem]">
                  <h5 className={`text-sm font-bold uppercase tracking-wider ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Ingredientes:</h5>
                    <div className="space-y-4">
                    {(meal.ingredientes || meal.comida?.ingredientes || []).map((ingrediente: any, index: number) => (
                      <div key={index} className={`p-5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 group/ingredient ${
                          theme === 'dark'
                            ? 'bg-gray-800 border border-gray-700/50 hover:border-blue-700/50'
                            : 'bg-white border border-gray-100/50 hover:border-blue-100'
                        }`}>
                          <p className={`font-semibold mb-3 transition-colors ${
                            theme === 'dark'
                              ? 'text-gray-200 group-hover/ingredient:text-blue-400'
                              : 'text-gray-800 group-hover/ingredient:text-blue-600'
                          }`}>{ingrediente.nombre}</p>
                          <div className="flex flex-wrap gap-3">
                          <span className={`text-sm px-4 py-2 rounded-xl font-medium backdrop-blur-sm hover:shadow-md transition-shadow ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-300'
                                : 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700'
                            }`}>
                              {ingrediente.calorias} kcal
                            </span>
                            <span className={`text-sm px-4 py-2 rounded-xl font-medium backdrop-blur-sm hover:shadow-md transition-shadow ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 text-green-300'
                                : 'bg-gradient-to-r from-green-50 to-green-100/50 text-green-700'
                            }`}>
                              {ingrediente.proteinas}g P
                            </span>
                            <span className={`text-sm px-4 py-2 rounded-xl font-medium backdrop-blur-sm hover:shadow-md transition-shadow ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 text-yellow-300'
                                : 'bg-gradient-to-r from-yellow-50 to-yellow-100/50 text-yellow-700'
                            }`}>
                              {ingrediente.carbohidratos}g C
                            </span>
                            <span className={`text-sm px-4 py-2 rounded-xl font-medium backdrop-blur-sm hover:shadow-md transition-shadow ${
                              theme === 'dark'
                                ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-300'
                                : 'bg-gradient-to-r from-red-50 to-red-100/50 text-red-700'
                            }`}>
                              {ingrediente.grasas}g G
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhanced Meal Totals Section */}
                  <div className={`mt-8 pt-6 ${
                    theme === 'dark' ? 'border-t border-gray-700/50' : 'border-t border-gray-100/50'
                  }`}>
                    <div className="flex flex-col space-y-4">
                    <h5 className={`text-sm font-bold uppercase tracking-wider ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>Totales de la comida:</h5>
                      <div className="flex flex-wrap gap-4">
                      <span className={`text-sm px-5 py-2.5 rounded-xl font-medium backdrop-blur-sm hover:shadow-lg transition-shadow hover:-translate-y-0.5 transform duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/30 text-blue-300'
                            : 'bg-gradient-to-r from-blue-500/15 to-blue-600/15 text-blue-700'
                        }`}>
                          {mealTotals.calorias} kcal
                        </span>
                        <span className={`text-sm px-5 py-2.5 rounded-xl font-medium backdrop-blur-sm hover:shadow-lg transition-shadow hover:-translate-y-0.5 transform duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-green-900/30 to-green-800/30 text-green-300'
                            : 'bg-gradient-to-r from-green-500/15 to-green-600/15 text-green-700'
                        }`}>
                          {mealTotals.proteinas}g P
                        </span>
                        <span className={`text-sm px-5 py-2.5 rounded-xl font-medium backdrop-blur-sm hover:shadow-lg transition-shadow hover:-translate-y-0.5 transform duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 text-yellow-300'
                            : 'bg-gradient-to-r from-yellow-500/15 to-yellow-600/15 text-yellow-700'
                        }`}>
                          {mealTotals.carbohidratos}g C
                        </span>
                        <span className={`text-sm px-5 py-2.5 rounded-xl font-medium backdrop-blur-sm hover:shadow-lg transition-shadow hover:-translate-y-0.5 transform duration-300 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-300'
                            : 'bg-gradient-to-r from-red-500/15 to-red-600/15 text-red-700'
                        }`}>
                          {mealTotals.grasas}g G
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-8 text-xl font-medium">No hay comidas agregadas para este día</p>
            <button
              onClick={() => handleAddMeal("Comida")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 font-medium tracking-wide group"
            >
              <Plus size={24} className="mr-2 group-hover:rotate-180 transition-transform duration-300" />
              Agregar comida
            </button>
          </div>
        )}
      </div>
    </div>
  );
}