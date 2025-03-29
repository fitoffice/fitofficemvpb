// src/constants/trainingVariants.ts

export interface Set {
    id: string;
    reps: number;
    weight?: number;
    rest?: number;
  }
  
  export const trainingVariants = {
    0: {
      name: 'Normal',
      setModifier: (sets: Set[], exerciseName: string) => sets,
      setCount: 3, // 3 series por defecto para Variante Normal
    },
    1: {
      name: 'Verde',
      setModifier: (sets: Set[], exerciseName: string) => {
        switch (exerciseName) {
          case 'Sentadilla':
            return sets.map((set, index) => ({
              ...set,
              reps: [6, 6, 6, 4][index],
              weight: [66, 72, 77, 83][index],
              rest: 120,
            }));
          case 'Press de Banca':
            return sets.map((set, index) => ({
              ...set,
              reps: [6, 6, 6, 4][index],
              weight: [44, 50, 50, 55][index],
              rest: 120,
            }));
          case 'Peso Muerto':
            return sets.map((set, index) => ({
              ...set,
              reps: [4, 4, 4, 3][index],
              weight: [88, 94, 99, 104][index],
              rest: 150,
            }));
          default:
            return sets;
        }
      },
      setCount: 4, // 4 series para Variante Verde
    },
    2: {
      name: 'Amarillo',
      setModifier: (sets: Set[], exerciseName: string) => {
        switch (exerciseName) {
          case 'Sentadilla':
            return sets.map((set, index) => ({
              ...set,
              reps: [7, 7, 7, 5][index],
              weight: [63, 69, 73, 78][index],
              rest: 100,
            }));
          case 'Press de Banca':
            return sets.map((set, index) => ({
              ...set,
              reps: [7, 7, 7, 5][index],
              weight: [42, 48, 48, 53][index],
              rest: 100,
            }));
          case 'Peso Muerto':
            return sets.map((set, index) => ({
              ...set,
              reps: [5, 5, 5, 4][index],
              weight: [84, 89, 95, 100][index],
              rest: 140,
            }));
          default:
            return sets;
        }
      },
      setCount: 4, // 4 series para Variante Amarillo
    },
    3: {
      name: 'Rojo',
      setModifier: (sets: Set[], exerciseName: string) => {
        switch (exerciseName) {
          case 'Sentadilla':
            return sets.map((set, index) => ({
              ...set,
              reps: [10, 10, 10, 8][index],
              weight: [54, 59, 63, 68][index],
              rest: 75,
            }));
          case 'Press de Banca':
            return sets.map((set, index) => ({
              ...set,
              reps: [10, 10, 10, 8][index],
              weight: [36, 41, 41, 45][index],
              rest: 75,
            }));
          case 'Peso Muerto':
            return sets.map((set, index) => ({
              ...set,
              reps: [7, 7, 7, 5][index],
              weight: [72, 76, 81, 85][index],
              rest: 120,
            }));
          default:
            return sets;
        }
      },
      setCount: 4, // 4 series para Variante Rojo
    },
  } as const;
  