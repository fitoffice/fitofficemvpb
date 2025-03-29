import { Planning, Exercise, Session, Set } from '../types/planning';

const createDefaultSet = (reps: number, weight?: number, rest?: number): Set => ({
  id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  reps,
  weight,
  rest,
});

const createExercise = (
  baseId: string,
  name: string,
  sets: Array<{ reps: number; weight?: number; rest?: number }>
): Exercise => ({
  id: `${baseId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  sets: sets.map(set => createDefaultSet(set.reps, set.weight, set.rest)),
});

const defaultExercises = {
  squat: createExercise('squat', 'Sentadilla', [
    { reps: 8, weight: 60, rest: 90 },
    { reps: 8, weight: 65, rest: 90 },
    { reps: 8, weight: 70, rest: 90 },
    { reps: 6, weight: 75, rest: 90 },
  ]),
  benchPress: createExercise('bench-press', 'Press de Banca', [
    { reps: 8, weight: 40, rest: 90 },
    { reps: 8, weight: 45, rest: 90 },
    { reps: 8, weight: 45, rest: 90 },
    { reps: 6, weight: 50, rest: 90 },
  ]),
  deadlift: createExercise('deadlift', 'Peso Muerto', [
    { reps: 6, weight: 80, rest: 120 },
    { reps: 6, weight: 85, rest: 120 },
    { reps: 6, weight: 90, rest: 120 },
    { reps: 4, weight: 95, rest: 120 },
  ]),
};

const createSession = (name: string, exercises: Exercise[]): Session => ({
  id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name,
  exercises: exercises.map(exercise => ({
    ...exercise,
    id: `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  })),
});

const createDefaultWeekPlan = () => ({
  Lunes: {
    id: 'lunes',
    sessions: [
      createSession('Entrenamiento de Pierna', [
        { ...defaultExercises.squat },
        { 
          ...defaultExercises.deadlift,
          sets: defaultExercises.deadlift.sets.slice(0, 3),
        },
      ]),
    ],
  },
  Martes: {
    id: 'martes',
    sessions: [
      createSession('Pecho y Hombros', [
        { ...defaultExercises.benchPress },
        { 
          ...defaultExercises.benchPress,
          id: `military-press-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Press Militar',
          sets: defaultExercises.benchPress.sets.map(set => ({
            ...set,
            id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            weight: (set.weight || 0) - 10,
          })),
        },
      ]),
    ],
  },
  Miércoles: {
    id: 'miercoles',
    sessions: [],
  },
  Jueves: {
    id: 'jueves',
    sessions: [
      createSession('Entrenamiento de Espalda', [
        { ...defaultExercises.deadlift },
        { 
          ...defaultExercises.squat,
          id: `barbell-row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: 'Remo con Barra',
          sets: defaultExercises.squat.sets.map(set => ({
            ...set,
            id: `set-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            weight: (set.weight || 0) - 20,
          })),
        },
      ]),
    ],
  },
  Viernes: {
    id: 'viernes',
    sessions: [
      createSession('Full Body', [
        { ...defaultExercises.squat },
        { ...defaultExercises.benchPress },
        { ...defaultExercises.deadlift },
      ].map(exercise => ({
        ...exercise,
        id: `${exercise.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }))),
    ],
  },
  Sábado: {
    id: 'sabado',
    sessions: [],
  },
  Domingo: {
    id: 'domingo',
    sessions: [],
  },
});

export const defaultPlanning: Planning = {
  id: 'default-plan',
  nombre: 'Plan de Entrenamiento Básico',
  descripcion: 'Un plan completo para principiantes enfocado en los ejercicios compuestos principales',
  semanas: 6,
  plan: Array(6).fill(null).map(() => createDefaultWeekPlan()),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};