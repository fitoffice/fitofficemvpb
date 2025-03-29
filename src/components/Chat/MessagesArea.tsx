import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, MessageCircle, Sparkles, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Message, chatService } from '../../services/chatService';

interface MessagesAreaProps {
  messages?: Message[];
  isBulkMode: boolean;
  onGenerateAIMessage?: (prompt: string) => Promise<string>;
}

export const MessagesArea: React.FC<MessagesAreaProps> = ({ 
  messages = [], 
  isBulkMode,
  onGenerateAIMessage 
}) => {
  const { theme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [tono, setTono] = useState<string>('profesional y motivador');

  useEffect(() => {
    const markUnreadMessages = async () => {
      try {
        const unreadMessages = messages
          .filter(msg => !msg.read)
          .map(msg => msg._id);
          
        if (unreadMessages.length > 0) {
          await chatService.markMessagesAsRead(unreadMessages);
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markUnreadMessages();
  }, [messages]);

  const handleGenerateMessage = async () => {
    if (!prompt) return;
    
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/ia/generar-mensaje', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          descripcion: prompt,
          tono: tono
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al generar el mensaje');
      }

      const data = await response.json();
      if (!data.mensaje && !data.message) {
        throw new Error('Respuesta inválida del servidor');
      }
      
      setGeneratedMessage(data.mensaje || data.message);
      setPrompt(''); // Limpiar el prompt después de generar exitosamente
    } catch (error) {
      console.error('Error generating message:', error);
      // Mostrar el error en la UI
      setGeneratedMessage(`Error: ${error instanceof Error ? error.message : 'Error al generar el mensaje'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isBulkMode) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 200
          }}
          className={`w-full max-w-2xl p-8 rounded-3xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50' 
              : 'bg-gradient-to-br from-gray-50 to-gray-100/50'
          } backdrop-blur-lg shadow-xl`}
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-4"
            >
              <MessageCircle size={48} className={`${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
              }`} />
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
              animate={{
                backgroundPosition: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                backgroundSize: '200% auto',
              }}
            >
              Modo mensaje masivo
            </motion.h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg mb-8`}>
              Selecciona los clientes a los que deseas enviar el mensaje
            </p>

            <div className="space-y-4">
              <div className={`p-6 rounded-2xl ${
                theme === 'dark' 
                  ? 'bg-gray-800/50' 
                  : 'bg-white/50'
              } backdrop-blur-sm`}>
                <div className="flex items-center mb-4">
                  <Sparkles className={`mr-2 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-500'
                  }`} size={20} />
                  <h4 className={`font-semibold ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                  }`}>
                    Generar mensaje con IA
                  </h4>
                </div>
                
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Descripción del mensaje
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe el mensaje que quieres generar..."
                      className={`w-full p-4 rounded-xl resize-none h-24 ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500/50'
                          : 'bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:ring-purple-500/30'
                      } focus:ring-2 focus:outline-none transition-all`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Tono del mensaje
                    </label>
                    <select
                      value={tono}
                      onChange={(e) => setTono(e.target.value)}
                      className={`w-full p-3 rounded-xl ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white focus:ring-purple-500/50'
                          : 'bg-gray-50/50 text-gray-900 focus:ring-purple-500/30'
                      } focus:ring-2 focus:outline-none transition-all`}
                    >
                      <option value="profesional y motivador">Profesional y Motivador</option>
                      <option value="casual y amigable">Casual y Amigable</option>
                      <option value="formal y directo">Formal y Directo</option>
                      <option value="entusiasta y energético">Entusiasta y Energético</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <motion.button
                      onClick={handleGenerateMessage}
                      disabled={!prompt || isGenerating}
                      className={`flex items-center px-4 py-2 rounded-xl font-medium ${
                        theme === 'dark'
                          ? 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-700'
                          : 'bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-300'
                      } disabled:cursor-not-allowed transition-all`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isGenerating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Sparkles size={18} />
                        </motion.div>
                      ) : (
                        <Sparkles size={18} className="mr-2" />
                      )}
                      {isGenerating ? 'Generando...' : 'Generar mensaje'}
                    </motion.button>
                  </div>

                  {generatedMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl mt-4 ${
                        theme === 'dark'
                          ? 'bg-gray-700/50 text-white'
                          : 'bg-white/50 text-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Mensaje generado:
                        </span>
                        <div className="flex items-center">
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Tono: {tono}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{generatedMessage}</p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => {
          const isUser = message.sender === 'user';
          const showTimestamp = index === 0 || 
            new Date(messages[index - 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 300000;

          return (
            <motion.div
              key={message._id}
              layout
              initial={{ 
                opacity: 0,
                x: isUser ? 50 : -50,
                scale: 0.8
              }}
              animate={{ 
                opacity: 1,
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0,
                scale: 0.8,
                x: isUser ? 50 : -50
              }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                {showTimestamp && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-xs px-3 py-1.5 rounded-full inline-block ${
                      theme === 'dark' 
                        ? 'bg-gray-800/70 text-gray-400' 
                        : 'bg-gray-100/70 text-gray-500'
                    } backdrop-blur-sm`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`group relative px-4 py-3 rounded-2xl break-words shadow-lg ${
                    isUser
                      ? theme === 'dark'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20'
                      : theme === 'dark'
                        ? 'bg-gradient-to-br from-gray-700/90 to-gray-800/90 text-white shadow-gray-900/20'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 text-gray-900 shadow-gray-200/50'
                  }`}
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                >
                  {message.content}
                  {isUser && message.status === 'read' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute -bottom-6 right-2 flex items-center space-x-0.5 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                      }`}
                    >
                      <Check size={14} />
                      <Check size={14} className="-ml-2.5" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};
