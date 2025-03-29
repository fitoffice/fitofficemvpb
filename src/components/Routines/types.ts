export interface Exercise {
  id: string;
  name: string;
  metrics: {
    type: string;
    value: string;
  }[];
  notes?: string;
}

export interface CreateRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (routineData: any) => void;
  routine?: any;
  theme?: 'light' | 'dark';
}

export interface APIExercise {
  _id: string;
  nombre: string;
  tipo?: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  imgUrl?: string;
  fechaCreacion: string;
}

export interface APIResponse {
  message: string;
  data: APIExercise[];
}
