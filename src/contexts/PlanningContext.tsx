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
  createdAt?: string;
  updatedAt?: string;
}

// Define the context type
interface PlanningContextType {
  plannings: PlanningSchema[];
  loading: boolean;
  error: string | null;
  fetchPlannings: () => Promise<void>;
  addPlanning: (planning: PlanningSchema) => void;
  deletePlanning: (id: string) => Promise<void>;
  updatePlanning: (id: string, updatedData: Partial<PlanningSchema>) => void;
}

// Create the context
const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

// Create the provider component
export const PlanningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plannings, setPlannings] = useState<PlanningSchema[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch plannings from the API
  const fetchPlannings = async () => {
    console.log('Fetching plannings from context...');
    setLoading(true);
    setError(null);
    try {
      // Get JWT token
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      // Make parallel requests for plannings and templates
      console.log('Fetching plannings and templates...');
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
      
      console.log('Templates response status:', templatesResponse.status);
      console.log('Plannings response status:', planningsResponse.status);
      
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
      
      // Log the templates data to inspect its structure and content
      console.log('Templates data received:', templatesData);
      console.log('Templates data length:', Array.isArray(templatesData) ? templatesData.length : 'Not an array');
      
      // Extraer el array de templates si viene en formato {status, results, data}
      let templatesArray;
      if (!Array.isArray(templatesData) && templatesData && typeof templatesData === 'object') {
        if (templatesData.data && Array.isArray(templatesData.data)) {
          console.log('Templates data extracted from data property:', templatesData.data);
          templatesArray = templatesData.data;
        } else {
          console.log('Templates data is not in expected format, using empty array');
          templatesArray = [];
        }
      } else {
        templatesArray = Array.isArray(templatesData) ? templatesData : [];
      }
      
      // Log the extracted templates array
      console.log('Templates array after extraction:', templatesArray);
      if (templatesArray.length > 0) {
        console.log('First template example after extraction:', templatesArray[0]);
      }
      
      // Ensure data is in array format
      const planningsArray = Array.isArray(planningsData) ? planningsData : [];

      // Process planning data
      const processedPlannings = planningsArray.map((planning: any) => ({
        _id: planning._id,
        nombre: planning.nombre,
        descripcion: planning.descripcion,
        fechaInicio: planning.fechaInicio,
        meta: planning.meta,
        semanas: typeof planning.semanas === 'number' ? planning.semanas : 
                parseInt(planning.semanas) || 0,
        tipo: planning.tipo || 'Planificacion',
        esqueleto: planning.esqueleto,
        cliente: planning.cliente,
        trainer: planning.trainer,
        createdAt: planning.createdAt,
        updatedAt: planning.updatedAt
      }));

      // Process template data
          // Process template data
          const processedTemplates = templatesArray.map((template: any) => ({
            _id: template._id,
            nombre: template.nombre,
            descripcion: template.descripcion,
            fechaInicio: template.createdAt,
            meta: template.meta,
            semanas: typeof template.semanas === 'number' ? template.semanas : 
                    parseInt(template.semanas) || 0,
            tipo: 'Plantilla',
            esqueleto: template.esqueleto,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt,
            // Añadir campos adicionales que puedan ser necesarios para PlanningList
            plan: template.plan || []
          }));

      // Log processed templates for debugging
      console.log('Processed templates:', processedTemplates);

      // Combine both data sets
      setPlannings([...processedPlannings, ...processedTemplates]);
    } catch (err: any) {
      console.error('Error al obtener las planificaciones:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new planning
  const addPlanning = (planning: PlanningSchema) => {
    setPlannings(prevPlannings => [...prevPlannings, planning]);
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

      // Update the plannings state by removing the deleted planning
      setPlannings(prevPlannings => prevPlannings.filter(planning => planning._id !== id));
    } catch (err: any) {
      console.error('Error al eliminar la planificación:', err);
      setError(err.message);
    }
  };

  // Function to update a planning
  const updatePlanning = (id: string, updatedData: Partial<PlanningSchema>) => {
    setPlannings(prevPlannings => 
      prevPlannings.map(planning => 
        planning._id === id ? { ...planning, ...updatedData } : planning
      )
    );
  };

  // Fetch plannings when the component mounts
  useEffect(() => {
    fetchPlannings();
  }, []);

  return (
    <PlanningContext.Provider 
      value={{ 
        plannings, 
        loading, 
        error, 
        fetchPlannings, 
        addPlanning, 
        deletePlanning,
        updatePlanning
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

// Custom hook to use the planning context
export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};