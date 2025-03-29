import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Send,
  Bot,
  User,
  Loader,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  Rocket,
  Brain,
  Target,
  BarChart,
  Mail,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  onSendMessage: (message: string) => Promise<string>;
  chatDescription: string;
  theme: string;
}

const AIChat: React.FC<AIChatProps> = ({ onSendMessage, chatDescription, theme }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    console.log('AIChat - Componente montado/actualizado');
    if (chatDescription) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          content: `¡https://fitoffice-a7ed6ea26ba4.herokuapp.com/! 👋 ${chatDescription}. Describe tu consulta y te ayudaré a resolverla.`,
          timestamp: new Date(),
        }
      ]);
    }
  }, [chatDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AIChat - handleSubmit llamado');

    if (!newMessage.trim() || isLoading) {
      console.log('AIChat - Mensaje vacío o cargando, no se envía');
      return;
    }

    // Crear el mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      console.log('AIChat - Enviando query:', newMessage.trim());
      const response = await onSendMessage(newMessage.trim());
      console.log('AIChat - Respuesta recibida:', response);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AIChat - Error al enviar mensaje:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Lo siento, ha ocurrido un error al procesar tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      {/* Encabezado del chat */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
      >
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-500" />
          Asistente IA
        </h2>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {chatDescription}
        </p>
      </motion.div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? `${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                    : `${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      } ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.type === 'bot' && (
                    <Bot className="w-5 h-5 mt-1 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <span
                      className={`text-xs ${
                        message.type === 'user'
                          ? 'text-blue-100'
                          : theme === 'dark'
                          ? 'text-gray-400'
                          : 'text-gray-500'
                      } block mt-1`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {message.type === 'user' && (
                    <User className="w-5 h-5 mt-1 text-blue-100" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada de texto */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className={`flex-1 p-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className={`p-2 rounded-lg ${
              isLoading || !newMessage.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors duration-200`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AIChat;