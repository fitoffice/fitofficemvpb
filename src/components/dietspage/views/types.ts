import { LucideIcon } from 'lucide-react';

export interface Meal {
  id?: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
  mealTime?: string;
}

export interface MealTime {
  title: string;
  time: string;
  icon?: LucideIcon;
}

export interface Macros {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fats: { current: number; target: number };
}

export interface DayViewProps {
  day: string;
  date: string;
  isToday?: boolean;
  mealTimes: MealTime[];
  macros: Macros;
  handleAddMeal: (mealTime: string) => void;
  handleEditMeal: (meal: Meal) => void;
  getMealsForTime: (mealTime: string) => Meal[];
}