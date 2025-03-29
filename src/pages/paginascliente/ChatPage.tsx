import React, { useState, useEffect, useRef } from 'react';
import { Users, ChevronLeft, FileText, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { ClientsList } from '../../components/Chat/ClientsList';
import { SearchBar } from '../../components/Chat/SearchBar';
import { MessageInput } from '../../components/Chat/MessageInput';
import { MessageTemplates } from '../../components/Chat/MessageTemplates';
import { MessagesArea } from '../../components/Chat/MessagesArea';
import { Client, Message, MessageTemplate } from '../../components/Chat/types';
import { clientService } from '../../services/clientService';
import { chatService } from '../../services/chatService';
import { Socket } from 'socket.io-client';


const ChatPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('❌ ChatPage - No se encontró el ID del usuario');
      setError('Error: No se encontró el ID del usuario');
      return;
    }

    console.log('🔄 ChatPage - Inicializando socket con userId:', userId);
    socketRef.current = chatService.initialize(userId);

    // Listen for socket events
    socketRef.current.on('newMessage', handleNewMessage);
    socketRef.current.on('messageSent', handleMessageSent);
    socketRef.current.on('messageError', handleMessageError);

    return () => {
      chatService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedClient) {
      console.log('🔄 ChatPage - Cliente seleccionado:', selectedClient);
      loadChatHistory();
    }
  }, [selectedClient]);

  useEffect(() => {
    fetchClients();
  }, []);

  const handleNewMessage = (message: any) => {
    console.log('📩 ChatPage - Nuevo mensaje recibido:', message);
    setMessages(prev => [...prev, {
      _id: message._id,
      content: message.message,
      sender: message.sender,
      receiver: message.receiver,
      timestamp: new Date(message.timestamp),
      read: false
    }]);
  };

  const handleMessageSent = ({ messageId }: { messageId: string }) => {
    console.log('✅ ChatPage - Mensaje enviado correctamente:', messageId);
  };

  const handleMessageError = ({ error }: { error: string }) => {
    console.error('❌ ChatPage - Error en mensaje:', error);
    setError(error);
  };

  const loadChatHistory = async () => {
    if (!selectedClient?.id) {
      console.log('❌ ChatPage - No hay cliente seleccionado');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('🔍 ChatPage - Cargando historial para cliente:', selectedClient.id);
      const response = await chatService.getChatHistory(selectedClient.id);
      console.log('📥 ChatPage - Historial recibido:', response);
      
      // Transform the messages to match the Message type
      const transformedMessages = response.data.map((msg: any) => ({
        _id: msg._id,
        content: msg.message,
        sender: msg.sender,
        receiver: msg.receiver,
        timestamp: new Date(msg.createdAt),
        read: msg.read
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error('❌ ChatPage - Error al cargar historial:', error);
      setError('Error al cargar el historial del chat');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const clientsData = await clientService.getClients();
      console.log('📥 ChatPage - Clientes obtenidos:', clientsData);
      
      const transformedClients: Client[] = clientsData.map(client => ({
        id: client._id,
        name: client.nombre,
        email: client.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(client.nombre)}&background=random`,
        lastMessage: '',
        lastMessageTime: new Date(),
        unreadCount: 0,
        online: false,
      }));

      setClients(transformedClients);
      setError(null);
    } catch (err) {
      console.error('❌ ChatPage - Error al obtener clientes:', err);
      setError('Error al cargar los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    console.log('👤 ChatPage - Seleccionando cliente:', client);
    setSelectedClient(client);
    setError(null);
  };

  const toggleClientSelection = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`h-screen flex ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {/* Clients List */}
      <div className={`w-1/3 border-r shadow-lg ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <div className="p-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isBulkMode={isBulkMode}
            onBulkModeToggle={() => setIsBulkMode(!isBulkMode)}
          />
          {error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <ClientsList
              clients={filteredClients}
              selectedClient={selectedClient}
              isBulkMode={isBulkMode}
              selectedClients={selectedClients}
              onClientSelect={handleClientSelect}
              onClientToggle={toggleClientSelection}
            />
          )}
        </div>
      </div>

      {/* Chat Area */}
      {(selectedClient || isBulkMode) ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className={`p-4 flex items-center justify-between border-b shadow-sm ${
            theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}>
            <div className="flex items-center">
              <button
                className="md:hidden mr-2"
                onClick={() => isBulkMode ? setIsBulkMode(false) : setSelectedClient(null)}
              >
                <ChevronLeft size={24} />
              </button>
              {isBulkMode ? (
                <div className="flex items-center">
                  <Users size={24} className="text-blue-500" />
                  <span className="ml-2 font-semibold">
                    Mensaje masivo ({selectedClients.length} seleccionados)
                  </span>
                </div>
              ) : (
                <>
                  <img
                    src={selectedClient?.avatar}
                    alt={selectedClient?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="ml-3">
                    <h2 className="font-semibold">{selectedClient?.name}</h2>
                    <p className="text-sm text-gray-500">{selectedClient?.email}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <MessagesArea
              messages={messages}
              isBulkMode={isBulkMode}
            />
          </div>

          {/* Message Input */}
          <MessageInput
            clientId={selectedClient?.id || ''}
            onMessageSent={loadChatHistory}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Users size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Selecciona un cliente para comenzar el chat
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
