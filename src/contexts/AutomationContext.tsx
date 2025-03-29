import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Types
interface AutomationStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay' | 'email';
  name: string;
  description: string;
  icon: any;
}

interface AutomationFlow {
  steps: AutomationStep[];
}

export interface Automation {
  id: string;
  name: string;
  status: 'active' | 'paused';
  type: string;
  trigger: string;
  lastRun: string;
  description: string;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
  icon: string;
  flow: AutomationFlow;
}

interface AutomationResponse {
  success: boolean;
  count: number;
  data: {
    _id: string;
    nombre: string;
    tipo: string;
    activo: boolean;
    trainer: string | null;
    correos: string[];
    createdAt: string;
    updatedAt: string;
    tracking: any;
    asuntoCorreo?: string;
    contenidoCorreo?: string;
  }[];
}

interface AutomationContextType {
  automations: Automation[];
  loading: boolean;
  error: string | null;
  fetchAutomations: () => Promise<void>;
  createAutomation: (automationData: any) => Promise<Automation | null>;
  toggleAutomationStatus: (id: string) => Promise<boolean>;
  selectedType: string | null;
  setSelectedType: React.Dispatch<React.SetStateAction<string | null>>;
}

const AutomationContext = createContext<AutomationContextType | undefined>(undefined);

export const useAutomation = () => {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error('useAutomation must be used within an AutomationProvider');
  }
  return context;
};

interface AutomationProviderProps {
  children: ReactNode;
}

export const AutomationProvider: React.FC<AutomationProviderProps> = ({ children }) => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Función auxiliar para determinar el icono según el tipo
  const getIconForType = (tipo: string): string => {
    switch (tipo) {
      case 'bienvenida_nuevos_clientes':
        return 'UserPlus';
      case 'cumpleanos_aniversarios':
        return 'Gift';
      case 'recuperacion_clientes_inactivos':
        return 'UserX';
      case 'consejos_periodicos':
        return 'MessageSquare';
      case 'recordatorios':
        return 'Calendar';
      default:
        return 'MessageSquare';
    }
  };

  const fetchAutomations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else {
          setError('Error al cargar las automatizaciones');
        }
        setLoading(false);
        return;
      }

      const data: AutomationResponse = await response.json();
      
      if (data.success) {
        // Transformar los datos de la API al formato que espera nuestro componente
        const transformedAutomations = data.data.map(automation => ({
          id: automation._id,
          name: automation.nombre,
          status: automation.activo ? 'active' : 'paused',
          type: 'email',
          trigger: automation.tipo,
          lastRun: new Date(automation.updatedAt).toISOString().split('T')[0],
          description: `Automatización de ${automation.tipo.replace(/_/g, ' ')}`,
          stats: { 
            sent: 0, 
            opened: 0, 
            clicked: 0 
          },
          icon: getIconForType(automation.tipo),
          flow: {
            steps: []
          }
        }));

        setAutomations(transformedAutomations);
      } else {
        setError('Error al cargar las automatizaciones');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Error fetching automations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAutomation = async (automationData: any): Promise<Automation | null> => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        return null;
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(automationData)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al crear la automatización');
        }
        return null;
      }

      const data = await response.json();

      if (data.success) {
        const transformedData = {
          id: data.data._id,
          name: data.data.nombre,
          type: 'email',
          status: data.data.activo ? 'active' : 'paused',
          trigger: data.data.tipo,
          lastRun: new Date().toISOString().split('T')[0],
          description: `Automatización de ${data.data.tipo.replace(/_/g, ' ')}`,
          stats: { sent: 0, opened: 0, clicked: 0 },
          icon: getIconForType(data.data.tipo),
          flow: { steps: [] }
        };
        
        setAutomations(prev => [...prev, transformedData]);
        toast.success('Automatización creada con éxito');
        return transformedData;
      } else {
        setError('Error al crear la automatización');
        return null;
      }
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al conectar con el servidor');
      return null;
    }
  };

  const toggleAutomationStatus = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa. Por favor, inicie sesión nuevamente.');
        return false;
      }

      const automation = automations.find(a => a.id === id);
      if (!automation) return false;

      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/automations/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activo: !automation.status.includes('active')
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Sesión expirada. Por favor, inicie sesión nuevamente.');
        } else {
          setError('Error al actualizar el estado de la automatización');
        }
        return false;
      }

      const data = await response.json();
      if (data.success) {
        setAutomations(prev =>
          prev.map(a => {
            if (a.id === id) {
              return {
                ...a,
                status: a.status === 'active' ? 'paused' : 'active'
              };
            }
            return a;
          })
        );
        toast.success('Estado de automatización actualizado');
        return true;
      } else {
        setError('Error al actualizar el estado de la automatización');
        return false;
      }
    } catch (err) {
      console.error('Error toggling automation status:', err);
      setError('Error al conectar con el servidor');
      return false;
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  return (
    <AutomationContext.Provider
      value={{
        automations,
        loading,
        error,
        fetchAutomations,
        createAutomation,
        toggleAutomationStatus,
        selectedType,
        setSelectedType
      }}
    >
      {children}
    </AutomationContext.Provider>
  );
};