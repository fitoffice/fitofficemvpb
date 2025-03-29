import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos las interfaces de los datos
interface MacroInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

interface Meal {
  id: string;
  name: string;
  macros: MacroInfo;
  ingredients: Ingredient[];
}

// Estructura de datos por día: cada día tiene un id (fecha) y una lista de comidas
interface DayMeals {
  id: string;       // formato 'YYYY-MM-DD'
  meals: Meal[];
}

// Definimos el tipo de valor que provee el contexto
interface MealsContextValue {
  days: DayMeals[];
  addMealToDay: (date: string | Date, meal: Meal) => void;
  updateMeal: (date: string | Date, updatedMeal: Meal) => void;
  removeMeal: (date: string | Date, mealId: string) => void;
}

// Creamos el contexto
const MealsContext = createContext<MealsContextValue | undefined>(undefined);

// Provider del contexto
export const MealsProvider = ({ children }: { children: ReactNode }) => {
  // Estado que contiene las comidas organizadas por día
  const [days, setDays] = useState<DayMeals[]>([]);

  // Función para normalizar la fecha al formato 'YYYY-MM-DD'
  const normalizeDate = (date: string | Date): string => {
    if (date instanceof Date) {
      // Convertir Date a string ISO 'YYYY-MM-DD'
      return date.toISOString().slice(0, 10);
    }
    if (typeof date === 'string') {
      // Si ya está en formato 'YYYY-MM-DD', devolver directamente
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Intentar parsear la fecha si es un string más complejo (con hora, etc.)
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
      }
      // En último caso, tomar los primeros 10 caracteres (ej. de 'YYYY-MM-DDTHH:mm:ss')
      return date.slice(0, 10);
    }
    return '';
  };

  // Función para agregar una nueva comida a un día específico
  const addMealToDay = (date: string | Date, meal: Meal) => {
    const dayId = normalizeDate(date);
    setDays(prevDays => {
      // Verificar si el día ya existe en el estado
      const existingDay = prevDays.find(d => d.id === dayId);
      if (existingDay) {
        // Día existente: agregar la nueva comida a la lista de comidas de ese día
        return prevDays.map(d =>
          d.id === dayId ? { ...d, meals: [...d.meals, meal] } : d
        );
      } else {
        // Día no existente: crear una nueva entrada de día con esta comida
        const newDay: DayMeals = { id: dayId, meals: [meal] };
        const updatedDays = [...prevDays, newDay];
        // Ordenar los días por fecha para mantener una estructura ordenada
        updatedDays.sort((a, b) => a.id.localeCompare(b.id));
        return updatedDays;
      }
    });
  };

  // Función para actualizar una comida existente en un día
  const updateMeal = (date: string | Date, updatedMeal: Meal) => {
    const dayId = normalizeDate(date);
    setDays(prevDays =>
      prevDays.map(d => {
        if (d.id !== dayId) return d;
        // Reemplazar la comida correspondiente por la versión actualizada
        const updatedMeals = d.meals.map(m =>
          m.id === updatedMeal.id ? updatedMeal : m
        );
        return { ...d, meals: updatedMeals };
      })
    );
  };

  // Función para eliminar una comida de un día
  const removeMeal = (date: string | Date, mealId: string) => {
    const dayId = normalizeDate(date);
    setDays(prevDays =>
      prevDays
        .map(d => {
          if (d.id !== dayId) return d;
          // Filtrar la comida a eliminar
          const remainingMeals = d.meals.filter(m => m.id !== mealId);
          return { ...d, meals: remainingMeals };
        })
        // Eliminar del estado los días que se queden sin comidas, para limpiar estructura
        .filter(d => d.meals.length > 0)
    );
  };

  return (
    <MealsContext.Provider value={{ days, addMealToDay, updateMeal, removeMeal }}>
      {children}
    </MealsContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useMealsContext = (): MealsContextValue => {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error("useMealsContext debe usarse dentro de un MealsProvider");
  }
  return context;
};