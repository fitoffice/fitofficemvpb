import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckSquare, Calendar, Clock, User, Search } from 'lucide-react';
import Button from '../../components/Common/Button';
import { useCheckin } from '../../contexts/CheckinContext';
import { clientService, Cliente } from '../../services/clientService';
import CheckinClientDetail from '../../components/Checkin/CheckinClientDetail';

const CheckInPage: React.FC = () => {
  const { theme } = useTheme();
  const checkinContext = useCheckin() || { tipo: 'default' };
  
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [checkIns, setCheckIns] = useState<Array<{id: number, name: string, date: string, time: string, notes: string}>>([]);
  const [submitted, setSubmitted] = useState(false);
  
  // Client state
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);

  // Use the tipo property safely with optional chaining
  const tipoValue = checkinContext?.tipo || 'default';

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const clientsData = await clientService.getClients();
      console.log('📥 CheckInPage - Clientes obtenidos:', clientsData);
      setClients(clientsData);
      setError(null);
    } catch (err) {
      console.error('❌ CheckInPage - Error al obtener clientes:', err);
      setError('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCheckIn = {
      id: Date.now(),
      name,
      date,
      time,
      notes
    };
    setCheckIns([...checkIns, newCheckIn]);
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setName('');
      setDate('');
      setTime('');
      setNotes('');
      setSubmitted(false);
      setSelectedClientId(null);
    }, 2000);
  };

  const handleClientSelect = (client: Cliente) => {
    setSelectedClient(client);
    setSelectedClientId(client._id);
    setName(`${client.nombre} ${client.apellido}`);
  };

  const filteredClients = clients.filter(client => 
    `${client.nombre} ${client.apellido}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  // Generate initials for avatar
  const getInitials = (name: string, apellido: string) => {
    return (name.charAt(0) + (apellido ? apellido.charAt(0) : '')).toUpperCase();
  };

  // Get random background color for avatar
  const getAvatarBgColor = (clientId: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500', 
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'
    ];
    const index = clientId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="h-full flex">
      {/* Left sidebar - Client list */}
      <div className={`w-1/3 border-r ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="p-4">
          {/* Search bar */}
          <div className={`relative mb-4 ${
            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 w-full p-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Clients list */}
          <div className="overflow-y-auto max-h-[calc(100vh-150px)]">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              </div>
            ) : error ? (
              <div className={`p-4 text-center ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                {error}
              </div>
            ) : filteredClients.length === 0 ? (
              <div className={`p-4 text-center ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No se encontraron clientes
              </div>
            ) : (
              filteredClients.map(client => (
                <div
                  key={client._id}
                  onClick={() => handleClientSelect(client)}
                  className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
                    selectedClientId === client._id
                      ? theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                      : theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                  }`}
                >
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarBgColor(client._id)}`}>
                    {getInitials(client.nombre, client.apellido)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {client.nombre} {client.apellido}
                    </div>
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {client.email}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    17:03
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right content area - Check-in form and history */}
      <CheckinClientDetail 
        theme={theme}
        selectedClient={selectedClient}
        checkIns={checkIns}
        containerVariants={containerVariants}
        itemVariants={itemVariants}
        getAvatarBgColor={getAvatarBgColor}
        getInitials={getInitials}
      />

    </div>
  );
};

export default CheckInPage;