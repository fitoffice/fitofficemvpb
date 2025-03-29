import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  confirmed?: boolean;
}

const AVAILABLE_COMMANDS = {
  'ir': [
    'ir a la vista simplificada',
    'ir a la vista compleja',
    'ir a la vista excel',
    'ir a la vista resumen',
    'ir a la vista ejercicios',
    'ir a la vista progreso',
    'ir a la vista estadísticas',
    'ir a la vista notas',
    'ir a la vista rutinas',
    'ir a la vista configuración',
    'ir a la semana 1',
    'ir a la semana 2',
    'ir a la semana 3',
    'ir a la semana 4',
  ],
  'vamos': [
    'vamos a clientes',
  ],
  'siguiente': [
    'siguiente semana',
  ],
  'anterior': [
    'anterior semana',
    'semana anterior',
  ],
  'bajar': [
    'bajar pantalla',
    'bajar la pantalla',
  ],
  'subir': [
    'subir pantalla',
    'subir la pantalla',
  ],
  'añadir': [
    'añadir sesion',
    'añadir sesión',
  ],
};

const CommandMessages: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Buenos dias ¿En qué puedo ayudarte hoy?',
      sender: 'assistant',
      timestamp: new Date(),
      status: 'sent',
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    const handleAssistantResponse = (event: CustomEvent) => {
      const { message } = event.detail;
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'assistant',
        timestamp: new Date(),
        status: 'sent',
      };
      setMessages(prev => [...prev, assistantMessage]);
    };

    window.addEventListener('assistantResponse', handleAssistantResponse as EventListener);

    return () => {
      window.removeEventListener('assistantResponse', handleAssistantResponse as EventListener);
    };
  }, []);

  useEffect(() => {
    // Cerrar sugerencias al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewCommand = (command: string) => {
    const viewMatch = command.match(/ir a la vista\s+(.+)/i);
    if (viewMatch && location.pathname.startsWith('/edit-planning/')) {
      const requestedView = viewMatch[1].toLowerCase().trim();
      const viewMap: { [key: string]: string } = {
        'simplificada': 'simplificada',
        'compleja': 'compleja',
        'excel': 'excel',
        'resumen': 'resumen',
        'ejercicios': 'ejercicios',
        'progreso': 'progreso',
        'estadísticas': 'estadisticas',
        'notas': 'notas',
        'rutinas': 'rutinas',
        'configuración': 'configuracion'
      };

      const view = viewMap[requestedView];
      if (view) {
        // Dispatch a custom event to communicate with EditPlanningPage
        const event = new CustomEvent('changeView', { detail: { view } });
        window.dispatchEvent(event);
        return `Cambiando a la vista ${requestedView}`;
      }
      return 'Vista no reconocida. Las vistas disponibles son: simplificada, compleja, excel, resumen, ejercicios, progreso, estadísticas, notas, rutinas y configuración.';
    }
    return null;
  };

  const handleWeekCommand = (command: string) => {
    if (location.pathname.startsWith('/edit-planning/')) {
      // Comando para ir a una semana específica
      const weekMatch = command.match(/ir a (?:la )?semana\s+(\d+)/i);
      if (weekMatch) {
        const weekNumber = parseInt(weekMatch[1]);
        const event = new CustomEvent('changeWeek', { detail: { weekNumber } });
        window.dispatchEvent(event);
        return `Cambiando a la semana ${weekNumber}`;
      }

      // Comando para siguiente semana
      if (command.match(/siguiente semana|semana siguiente|próxima semana/i)) {
        const event = new CustomEvent('changeWeek', { detail: { action: 'next' } });
        window.dispatchEvent(event);
        return 'Cambiando a la siguiente semana';
      }

      // Comando para semana anterior
      if (command.match(/semana anterior|anterior semana/i)) {
        const event = new CustomEvent('changeWeek', { detail: { action: 'previous' } });
        window.dispatchEvent(event);
        return 'Cambiando a la semana anterior';
      }
    }
    return null;
  };

  const handleWeekListCommand = (command: string) => {
    if (location.pathname.startsWith('/edit-planning/')) {
      if (command.match(/lista de semanas/i)) {
        const event = new CustomEvent('requestWeeksList');
        window.dispatchEvent(event);
        return null;
      }
    }
    return null;
  };

  const handleScrollCommand = (command: string) => {
    const scrollAmount = window.innerHeight * 0.8; // 80% de la altura de la ventana

    if (command.match(/baja la pantalla|bajar pantalla|scroll down/i)) {
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
      return null;
    } else if (command.match(/sube la pantalla|subir pantalla|scroll up/i)) {
      window.scrollBy({
        top: -scrollAmount,
        behavior: 'smooth'
      });
      return null;
    }
    return null;
  };

  const handleAddSessionCommand = (command: string) => {
    if (location.pathname.startsWith('/edit-planning/') && command.match(/añadir sesion|añadir sesión/i)) {
      const event = new CustomEvent('addSession');
      window.dispatchEvent(event);
      return null;
    }
    return null;
  };

  const handleClientCommand = (command: string) => {
    if (command.match(/vamos a clientes/i)) {
      navigate('/clients');
      return 'Navegando a la sección de clientes';
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentMessage(value);

    // Solo mostrar sugerencias si estamos en la ruta de edición de planning
    if (location.pathname.startsWith('/edit-planning/')) {
      // Mostrar sugerencias si hay 2 o más caracteres
      if (value.length >= 2) {
        const matchingSuggestions: string[] = [];
        Object.entries(AVAILABLE_COMMANDS).forEach(([prefix, commands]) => {
          if (prefix.toLowerCase().startsWith(value.toLowerCase())) {
            matchingSuggestions.push(...commands);
          } else {
            commands.forEach(command => {
              if (command.toLowerCase().includes(value.toLowerCase())) {
                matchingSuggestions.push(command);
              }
            });
          }
        });
        setSuggestions(matchingSuggestions);
        setShowSuggestions(matchingSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      // Si no estamos en la ruta correcta, no mostrar sugerencias
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Actualizar las sugerencias cuando cambia la ruta
  useEffect(() => {
    // Si no estamos en la ruta de edición de planning, ocultar las sugerencias
    if (!location.pathname.startsWith('/edit-planning/')) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location.pathname]);

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const sendMessageToTrainer = async (text: string) => {
    try {
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/trainer-messages/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error('Error sending message to trainer');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const confirmTrainerMessage = async (messageId: string) => {
    try {
      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/trainer-messages/message/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error('Error confirming message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming message:', error);
      throw error;
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setShowSuggestions(false);

    try {
      // Check for client command first
      const clientResponse = handleClientCommand(text);
      if (clientResponse) {
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        ));
        
        const assistantMessage: Message = {
          id: Date.now().toString(),
          text: clientResponse,
          sender: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };
        setMessages(prev => [...prev, assistantMessage]);
        return;
      }

      // If not a client command, proceed with trainer API
      const trainerResponse = await sendMessageToTrainer(text);
      
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
      ));

      if (trainerResponse.response) {
        const assistantMessage: Message = {
          id: trainerResponse.messageId || Date.now().toString(),
          text: trainerResponse.response,
          sender: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };
        setMessages(prev => [...prev, assistantMessage]);

        await confirmTrainerMessage(assistantMessage.id);
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'error' } : msg
      ));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    await handleSendMessage(currentMessage.trim());
  };

  const renderMessageStatus = (status?: string) => {
    if (status === 'sending') {
      return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2 animate-fadeIn`}
          >
            {message.sender === 'assistant' && (
              <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'} transition-colors duration-300 animate-bounce-subtle`}>
                <Bot size={16} className="text-blue-500" />
              </div>
            )}
            <div className={`max-w-[80%] group ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
              <div className={`p-4 rounded-2xl ${message.sender === 'user' ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100')} shadow-sm transition-all duration-300 group-hover:shadow-md ${message.sender === 'user' ? 'group-hover:shadow-blue-500/20' : 'group-hover:shadow-gray-500/20'} relative before:content-[''] before:absolute before:-inset-1 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20 before:rounded-3xl before:blur-xl before:opacity-0 before:group-hover:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}>
                {message.text}
              </div>
              <div className="flex items-center justify-end mt-1 space-x-2">
                <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {renderMessageStatus(message.status)}
              </div>
            </div>
            {message.sender === 'user' && (
              <div className={`p-2 rounded-lg order-3 ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'} transition-colors duration-300 animate-bounce-subtle`}>
                <User size={16} className="text-blue-500" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Bot size={16} className="text-blue-500" />
            <span>Escribiendo</span>
            <span className="flex space-x-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          </div>
        )}
      </div>
      <div className="relative p-4 border-t">
        {showSuggestions && suggestions.length > 0 && location.pathname.startsWith('/edit-planning/') && (
          <div
            ref={suggestionsRef}
            className={`absolute bottom-full left-4 right-4 mb-2 p-2 rounded-lg shadow-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
            }`}
          >
            <div className="max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <input
              ref={inputRef}
              id="command-input"
              type="text"
              value={currentMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              placeholder={
                location.pathname.startsWith('/edit-planning/')
                  ? "Escribe un comando (ej: siguiente semana, bajar pantalla)..."
                  : "Escribe un mensaje..."
              }
              className={`flex-1 px-4 py-3 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                  : 'bg-gray-100 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 border ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              } hover:border-blue-500/30 transition-all duration-300 group-hover:shadow-lg`}
            />
            <button
              type="submit"
              disabled={!currentMessage.trim()}
              className={`p-3 rounded-xl ${currentMessage.trim() ? (theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600') : (theme === 'dark' ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-200 cursor-not-allowed')} text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-sm hover:shadow-lg hover:shadow-blue-500/20 relative before:content-[''] before:absolute before:-inset-1 before:bg-gradient-to-r before:from-blue-500/20 before:via-purple-500/20 before:to-pink-500/20 before:rounded-3xl before:blur-xl before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500 before:-z-10`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandMessages;