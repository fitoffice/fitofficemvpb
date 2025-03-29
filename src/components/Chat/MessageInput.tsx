import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { chatService } from '../../services/chatService';

interface MessageInputProps {
  clientId: string;
  onMessageSent?: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  clientId,
  onMessageSent 
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending || !clientId) {
      console.log('❌ MessageInput - No se puede enviar:', {
        message: !message.trim() ? 'Mensaje vacío' : 'Mensaje presente',
        isSending: isSending ? 'Enviando otro mensaje' : 'No enviando',
        clientId: !clientId ? 'Cliente no seleccionado' : clientId
      });
      return;
    }

    console.log('📝 MessageInput - Iniciando envío de mensaje:', {
      clientId,
      message: message.trim()
    });

    setIsSending(true);
    try {
      console.log('🚀 MessageInput - Llamando a chatService.sendMessage');
      await chatService.sendMessage(clientId, message.trim());
      
      console.log('✅ MessageInput - Mensaje enviado exitosamente');
      setMessage('');
      
      if (onMessageSent) {
        console.log('📢 MessageInput - Notificando al componente padre');
        onMessageSent();
      }
    } catch (error) {
      console.error('❌ MessageInput - Error al enviar mensaje:', error);
    } finally {
      console.log('🔄 MessageInput - Finalizando envío de mensaje');
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={clientId ? "Escribe un mensaje..." : "Selecciona un cliente para enviar mensajes"}
            disabled={!clientId}
            className={`w-full p-3 rounded-xl resize-none min-h-[44px] max-h-[120px] ${
              theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-500/50 disabled:bg-gray-800'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 disabled:bg-gray-200'
            } focus:ring-2 focus:outline-none transition-all disabled:cursor-not-allowed`}
            rows={1}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending || !clientId}
          className={`p-3 rounded-xl ${
            theme === 'dark'
              ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700'
              : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'
          } text-white disabled:cursor-not-allowed transition-all`}
        >
          <Send size={20} className={isSending ? 'animate-pulse' : ''} />
        </button>
      </div>
    </div>
  );
};
