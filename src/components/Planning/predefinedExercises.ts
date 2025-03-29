// src/constants/predefinedExercises.ts

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroup: string;
  defaultSets: {
    reps: number;
    weight?: number;
    rest?: number;
  }[];
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  equipment: string[];
}

// Interface for API response
interface ExerciseApiResponse {
  message: string;
  data: {
    _id: string;
    nombre: string;
    grupoMuscular: string[];
    descripcion: string;
    equipo: string[];
    fechaCreacion: string;
    __v: number;
  }[];
}

// Function to fetch exercises from API
export const fetchExercisesFromApi = async (): Promise<Exercise[]> => {
  try {
    // Get token from localStorage or wherever it's stored in your app
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No authentication token found');
      return [];
    }

    const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/exercises', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const apiResponse: ExerciseApiResponse = await response.json();
    
    // Add console log to check the API response
    console.log('API Response:', apiResponse);
    console.log('Number of exercises received:', apiResponse.data.length);
    
    // Map API response to Exercise interface
    return apiResponse.data.map(item => ({
      id: item._id,
      name: item.nombre,
      category: 'Compuesto', // Default value as API doesn't provide this
      muscleGroup: item.grupoMuscular.length > 0 ? item.grupoMuscular[0] : 'No especificado',
      defaultSets: [
        { reps: 8, weight: 0, rest: 90 },
        { reps: 8, weight: 0, rest: 90 },
        { reps: 8, weight: 0, rest: 90 },
      ],
      difficulty: 'Intermedio', // Default value as API doesn't provide this
      equipment: item.equipo,
    }));
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return []; // Return empty array as fallback
  }
};