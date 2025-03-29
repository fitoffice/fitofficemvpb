export interface Day {
  sessions: any[];
}

export interface Period {
  id?: string;
  start: number;
  end: number;
  name: string;
  exercises?: any[];
}

export interface Week {
  weekNumber: number;
  days: { [key: string]: Day };
}

export interface WeekRange {
  start: number;
  end: number;
  name: string;
}

export interface Exercise {
  id: string;
  nombre: string;
  descripcion: string;
  grupoMuscular: string[];
  equipo: string[];
}

export interface ExerciseVariant {
  porcentaje: number;
}

export interface ExerciseWithVariant {
  ejercicio: Exercise;
  variante: ExerciseVariant;
}

export interface PlanningData {
  planningId: string;
  periodos: Period[];
  totalPeriodos: number;
}