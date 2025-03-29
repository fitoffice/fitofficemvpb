import React, { createContext, useState, useContext, useEffect } from 'react';
import { Cliente, clientService } from '../services/clientService';

interface ClientContextType {
  clients: Cliente[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Cliente) => void;
  refreshClients: () => Promise<void>; // Nueva función para recargar clientes
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    console.log('ClientContext: Fetching clients...');
    try {
      const data = await clientService.getClients();
      setClients(data);
      console.log('ClientContext: Clients fetched successfully:', data);
    } catch (err) {
      console.error('ClientContext: Error fetching clients:', err);
      setError('Error fetching clients');
    } finally {
      setLoading(false);
      console.log('ClientContext: Finished fetching clients.');
    }
  };

  // Nueva función que hace lo mismo que fetchClients pero con un nombre más descriptivo
  // para el caso específico de recargar después de crear un cliente
  const refreshClients = async () => {
    console.log('ClientContext: Refreshing clients after new client creation...');
    await fetchClients();
  };

  const addClient = (client: Cliente) => {
    setClients(prevClients => [client, ...prevClients]);
    console.log('ClientContext: Added new client:', client);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientContext.Provider value={{ 
      clients, 
      loading, 
      error, 
      fetchClients, 
      addClient,
      refreshClients // Añadimos la nueva función al contexto
    }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClientContext = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClientContext must be used within a ClientProvider');
  }
  return context;
};