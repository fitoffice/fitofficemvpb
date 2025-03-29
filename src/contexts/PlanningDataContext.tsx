import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the planning schema type
interface PlanningSchema {
  _id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  meta: string;
  semanas: number;
  tipo: 'Planificacion' | 'Plantilla';
  esqueleto?: string;
  cliente?: {
    _id: string;
    nombre: string;
    email: string;
  };
  trainer?: {
    _id: string;
    nombre: string;
    email: string;
  };
  plan?: any[];
  createdAt: string;
  updatedAt: string;
  estado?: string;
}

// Define the context type
interface PlanningDataContextType {
  planningData: PlanningSchema[];
  loading: boolean;
  error: string | null;
  fetchPlannings: () => Promise<void>;
  addPlanning: (planning: PlanningSchema) => void;
  updatePlanning: (id: string, updatedData: Partial<PlanningSchema>) => void;
  deletePlanning: (id: string) => Promise<void>;
}

// Create the context
const PlanningDataContext = createContext<PlanningDataContextType | undefined>(undefined);

// Create a provider component
interface PlanningDataProviderProps {
  children: ReactNode;
}

export const PlanningDataProvider: React.FC<PlanningDataProviderProps> = ({ children }) => {
  const [planningData, setPlanningData] = useState<PlanningSchema[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch plannings
  const fetchPlannings = async () => {
    console.log('Fetching plannings from context...');
    setLoading(true);
    setError(null);
    try {
      // Obtener el token JWT
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Realizar ambas peticiones en paralelo
      const [planningsResponse, templatesResponse] = await Promise.all([
        fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/schemas', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/planningtemplate/templates', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
      ]);

      if (!planningsResponse.ok) {
        const errorData = await planningsResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las planificaciones');
      }

      if (!templatesResponse.ok) {
        const errorData = await templatesResponse.json();
        throw new Error(errorData.mensaje || 'Error al obtener las plantillas');
      }

      const planningsData = await planningsResponse.json();
      const templatesData = await templatesResponse.json();

      // Ensure planningsData and templatesData are arrays
      const planningsArray = Array.isArray(planningsData) ? planningsData : [];
      const templatesArray = Array.isArray(templatesData) ? templatesData : [];

      // Process and normalize the data
      const processedPlannings = [...planningsArray, ...templatesArray].map(item => ({
        _id: item._id,
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        fechaInicio: item.fechaInicio || item.createdAt,
        meta: item.meta || 'No especificada',
        semanas: typeof item.semanas === 'number' ? item.semanas : 
                typeof item.semanas === 'string' ? parseInt(item.semanas) : 0,
        tipo: item.tipo || (templatesArray.includes(item) ? 'Plantilla' : 'Planificacion'),
        esqueleto: item.esqueleto,
        cliente: item.cliente,
        trainer: item.trainer,
        plan: item.plan || [],
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        estado: item.estado || 'En progreso'
      }));

      setPlanningData(processedPlannings);
    } catch (err: any) {
      console.error('Error al obtener las planificaciones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new planning
  const addPlanning = (planning: PlanningSchema) => {
    setPlanningData(prevData => [planning, ...prevData]);
  };

  // Function to update a planning
  const updatePlanning = (id: string, updatedData: Partial<PlanningSchema>) => {
    setPlanningData(prevData => 
      prevData.map(item => 
        item._id === id ? { ...item, ...updatedData } : item
      )
    );
  };

  // Function to delete a planning
  const deletePlanning = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/plannings/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensaje || 'Error al eliminar la planificación');
      }

      // Remove the planning from state
      setPlanningData(prevData => prevData.filter(item => item._id !== id));
    } catch (error: any) {
      console.error('Error al eliminar la planificación:', error);
      setError(error.message);
      throw error;
    }
  };

  // Fetch plannings on mount
  useEffect(() => {
    fetchPlannings();
  }, []);

  // Create the context value
  const contextValue: PlanningDataContextType = {
    planningData,
    loading,
    error,
    fetchPlannings,
    addPlanning,
    updatePlanning,
    deletePlanning
  };

  return (
    <PlanningDataContext.Provider value={contextValue}>
      {children}
    </PlanningDataContext.Provider>
  );
};

// Create a custom hook to use the context
export const usePlanningData = () => {
  const context = useContext(PlanningDataContext);
  if (context === undefined) {
    throw new Error('usePlanningData must be used within a PlanningDataProvider');
  }
  return context;
};