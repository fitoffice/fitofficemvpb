import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our diet data
interface Macros {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface Meal {
  id?: string;
  nombre: string;
  descripcion?: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
  horario?: string;
}

interface Day {
  fecha: string;
  comidas: Meal[];
  restricciones: Macros;
}

interface Week {
  idSemana: number;
  fechaInicio: string;
  dias: Day[];
}

interface Diet {
  id: string;
  nombre: string;
  cliente?: {
    id: string;
    nombre: string;
  };
  objetivo?: string;
  restricciones?: string;
  semanas: Week[];
  meals?: Meal[];
}

interface DietContextType {
  diet: Diet | null;
  setDiet: React.Dispatch<React.SetStateAction<Diet | null>>;
  selectedWeekId: number;
  setSelectedWeekId: React.Dispatch<React.SetStateAction<number>>;
  updateDayMacros: (date: string, macros: Macros) => void;
  updateDayMeals: (date: string, meals: Meal[]) => void;
  saveMacrosToAPI: (dietId: string, date: string, macros: Macros) => Promise<void>;
  loading: boolean;
}

const DietContext = createContext<DietContextType | undefined>(undefined);

export const DietProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [diet, setDiet] = useState<Diet | null>(null);
  const [selectedWeekId, setSelectedWeekId] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Update macros for a specific day
  const updateDayMacros = (date: string, macros: Macros) => {
    setDiet(prevDiet => {
      if (!prevDiet) return prevDiet;
      
      const updatedSemanas = prevDiet.semanas.map(semana => ({
        ...semana,
        dias: semana.dias.map(dia => {
          if (dia.fecha === date) {
            return {
              ...dia,
              restricciones: macros
            };
          }
          return dia;
        })
      }));
      
      return {
        ...prevDiet,
        semanas: updatedSemanas
      };
    });
  };

  // Update meals for a specific day
  const updateDayMeals = (date: string, meals: Meal[]) => {
    setDiet(prevDiet => {
      if (!prevDiet) return prevDiet;

      return {
        ...prevDiet,
        semanas: prevDiet.semanas.map(semana => ({
          ...semana,
          dias: semana.dias.map(dia => {
            if (dia.fecha === date) {
              return {
                ...dia,
                comidas: meals
              };
            }
            return dia;
          })
        }))
      };
    });
  };

  // Save macros to API
  const saveMacrosToAPI = async (dietId: string, date: string, macros: Macros) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
  
      // Format the data according to the API expectations
      const macronutrientes = {
        calorias: macros.calorias,
        proteinas: macros.proteinas,
        carbohidratos: macros.carbohidratos,
        grasas: macros.grasas
      };
  
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/dietas/${dietId}/dias/${date}/macros`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ macronutrientes })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar macros');
      }
  
      const updatedMacros = await response.json();
      console.log('✅ Macros actualizados correctamente:', updatedMacros);
      
      // Update local state
      updateDayMacros(date, macros);
      
    } catch (error) {
      console.error('❌ Error al actualizar macros:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DietContext.Provider value={{ 
      diet, 
      setDiet, 
      selectedWeekId, 
      setSelectedWeekId,
      updateDayMacros,
      updateDayMeals,
      saveMacrosToAPI,
      loading
    }}>
      {children}
    </DietContext.Provider>
  );
};

export const useDiet = () => {
  const context = useContext(DietContext);
  if (context === undefined) {
    throw new Error('useDiet debe ser usado dentro de un DietProvider');
  }
  return context;
};

// Inside your DietProvider component

// Function to save meals to storage
const saveMealsToStorage = (meals) => {
  try {
    localStorage.setItem('dietMeals', JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals to storage:', error);
  }
};

// Function to load meals from storage
const loadMealsFromStorage = () => {
  try {
    const storedMeals = localStorage.getItem('dietMeals');
    return storedMeals ? JSON.parse(storedMeals) : [];
  } catch (error) {
    console.error('Error loading meals from storage:', error);
    return [];
  }
};

// Function to calculate daily macros based on meals
const calculateDailyMacros = (meals) => {
  const dailyTotals = {
    calories: { current: 0, target: macros.calories.target },
    protein: { current: 0, target: macros.protein.target },
    carbs: { current: 0, target: macros.carbs.target },
    fats: { current: 0, target: macros.fats.target }
  };
  
  meals.forEach(meal => {
    dailyTotals.calories.current += Number(meal.calorias) || 0;
    dailyTotals.protein.current += Number(meal.proteinas) || 0;
    dailyTotals.carbs.current += Number(meal.carbohidratos) || 0;
    dailyTotals.fats.current += Number(meal.grasas) || 0;
  });
  
  setMacros(dailyTotals);
  
  // Save updated macros to storage
  try {
    localStorage.setItem('dietMacros', JSON.stringify(dailyTotals));
  } catch (error) {
    console.error('Error saving macros to storage:', error);
  }
};

// Function to get meals for a specific meal time
const getMealsForTime = (mealTime) => {
  if (!mealTime) {
    return meals; // Return all meals if no mealTime specified
  }
  return meals.filter(meal => meal.mealTime === mealTime);
};
