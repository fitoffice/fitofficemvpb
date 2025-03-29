import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Gasto {
  _id: string;
  importe: number;
  moneda: string;
  fecha: string;
  descripcion: string;
  categoria: string;
  tipo: 'fijo' | 'variable';
  client?: {
    nombre: string;
  };
}

interface GastosContextType {
    nuevoGasto: Gasto | null;
    setNuevoGasto: (gasto: Gasto) => void;
    refreshGastos: () => void;
    refreshTrigger: number;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [nuevoGasto, setNuevoGasto] = useState<Gasto | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
  
    const refreshGastos = () => {
      setRefreshTrigger(prev => prev + 1);
    };
  
    // Reset nuevoGasto after it's been consumed
    useEffect(() => {
      if (nuevoGasto) {
        const timer = setTimeout(() => {
          setNuevoGasto(null);
          refreshGastos(); // Trigger refresh after new gasto is added
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }, [nuevoGasto]);
  
    // Add effect to handle refresh trigger
    useEffect(() => {
      if (refreshTrigger > 0) {
        // This will trigger a re-render in components that use the context
        console.log('Refreshing gastos list...');
      }
    }, [refreshTrigger]);
  
    return (
      <GastosContext.Provider value={{ 
        nuevoGasto, 
        setNuevoGasto, 
        refreshGastos,
        refreshTrigger // Expose refreshTrigger to allow components to react to changes
      }}>
        {children}
      </GastosContext.Provider>
    );
};

export const useGastos = () => {
  const context = useContext(GastosContext);
  if (context === undefined) {
    throw new Error('useGastos debe ser usado dentro de un GastosProvider');
  }
  return context;
};