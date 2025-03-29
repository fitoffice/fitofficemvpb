import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import toast from 'react-hot-toast';
import { chatService, Message as ChatMessage } from '../../services/chatService';

interface Message {
  _id: string;
  conversacion: string;
  emisor: string;
  receptor: string;
  contenido: string;
  tipo: 'texto' | 'imagen' | 'archivo';
  urlArchivo: string | null;
  leido: boolean;
  fechaEnvio: string;
  createdAt: string;
  updatedAt: string;
}

interface PanelChatProps {
  clienteId: string;
  clienteName: string;
}

const PanelChat: React.FC<PanelChatProps> = ({ clienteId, clienteName }) => {
  console.log('🎯 PanelChat - Props recibidos:', { clienteId, clienteName });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const initializeChat = async () => {
      console.log('🚀 PanelChat - Iniciando inicialización del chat');
      
      if (!clienteId) {
        console.error('❌ PanelChat - No se proporcionó un ID de cliente');
        return;
      }

      setIsLoading(true);
      try {
        console.log('🔍 PanelChat - Verificando token...');
        const token = localStorage.getItem('token') || localStorage.getItem('jwt');
        console.log('🔑 PanelChat - Token encontrado:', !!token);
        
        if (!token) {
          console.error('❌ PanelChat - No hay token de autenticación');
          toast.error('Error de autenticación');
          return;
        }

        console.log('📞 PanelChat - Iniciando chat para cliente:', clienteId);
        const chat = await chatService.iniciarChat(clienteId);
        console.log('📋 PanelChat - Respuesta del servidor (chat):', chat);
        
        if (chat._id) {
          console.log('💾 PanelChat - Chat ID obtenido:', chat._id);
          setChatId(chat._id);
          
          console.log('📥 PanelChat - Obteniendo mensajes del chat...');
          const chatResponse = await chatService.getChatMessages(chat._id);
          console.log('📃 PanelChat - Respuesta completa:', chatResponse);
          
          setMessages(chatResponse.mensajes || []);
          console.log('✅ PanelChat - Mensajes guardados en el estado');
        }
      } catch (error: any) {
        console.error('❌ PanelChat - Error al inicializar el chat:', error);
        console.error('📝 PanelChat - Detalles del error:', {
          mensaje: error.message,
          respuesta: error.response?.data,
          estado: error.response?.status
        });
        toast.error(error.message || 'Error al cargar el chat');
      } finally {
        setIsLoading(false);
        console.log('🏁 PanelChat - Finalizada la inicialización del chat');
      }
    };

    initializeChat();
  }, [clienteId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    console.log('💬 PanelChat - Iniciando envío de mensaje:', {
      chatId,
      mensaje: newMessage,
      longitud: newMessage.length
    });

    if (!chatId) {
      console.error('❌ PanelChat - No hay un chat activo');
      toast.error('Error al enviar mensaje: No hay un chat activo');
      return;
    }

    setIsLoading(true);
    try {
      console.log('📤 PanelChat - Enviando mensaje al servidor...');
      const sentMessage = await chatService.sendMessage(chatId, newMessage.trim());
      console.log('✅ PanelChat - Mensaje enviado exitosamente:', sentMessage);
      
      setMessages(prev => {
        const newMessages = [...prev, sentMessage];
        console.log('📊 PanelChat - Estado actualizado de mensajes:', newMessages);
        return newMessages;
      });
      
      setNewMessage('');
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error: any) {
      console.error('❌ PanelChat - Error al enviar mensaje:', error);
      console.error('📝 PanelChat - Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
      toast.error('Error al enviar el mensaje');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date: string) => {
    console.log('🕒 PanelChat - Formateando fecha:', date);
    const messageDate = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);
    
    let formattedDate;
    if (diffInHours < 24) {
      formattedDate = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      formattedDate = messageDate.toLocaleDateString([], { 
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    console.log('🕒 PanelChat - Fecha formateada:', formattedDate);
    return formattedDate;
  };

  return (
    <div className={`flex flex-col h-[600px] rounded-lg ${
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chat con {clienteName}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.emisor === clienteId ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.emisor === clienteId
                  ? theme === 'dark'
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : theme === 'dark'
                  ? 'bg-blue-600'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm">{message.contenido}</p>
              <span className="text-xs opacity-75 mt-1 block">
                {formatTimestamp(message.fechaEnvio)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe un mensaje..."
            className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim()}
            className={`p-2 rounded-lg ${
              isLoading || !newMessage.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            } ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            } text-white transition-colors`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelChat;
