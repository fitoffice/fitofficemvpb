import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Message } from '../components/Chat/types';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';
const SOCKET_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com'; // Socket server URL

export interface ChatHistory {
  messages: Message[];
  unreadCount: number;
}

export const chatService = {
  socket: null as Socket | null,

  initialize(userId: string): Socket {
    console.log('🔌 ChatService - Inicializando socket con userId:', userId);
    
    if (this.socket) {
      console.log('🔄 ChatService - Desconectando socket existente');
      this.socket.disconnect();
    }

    localStorage.setItem('userId', userId);
    
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      query: { 
        userId,
        userType: 'Trainer'
      },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('✅ ChatService - Conexión socket establecida');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ ChatService - Error de conexión socket:', error);
    });

    console.log('✅ ChatService - Socket inicializado');
    return this.socket;
  },

  disconnect() {
    if (this.socket) {
      console.log('👋 ChatService - Desconectando socket');
      this.socket.disconnect();
      this.socket = null;
    }
  },

  async sendMessage(clientId: string, message: string): Promise<void> {
    console.log('📤 ChatService - Enviando mensaje a cliente:', clientId);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario');
      }

      const headers = await this.getHeaders();
      console.log('🔐 ChatService - Headers:', headers);

      // Updated data format to match the required structure
      const data = {
        receiverId: clientId,
        receiverType: "Client",
        message
      };
      console.log('📦 ChatService - Datos a enviar:', data);

      const response = await axios.post(`${API_URL}/chat/send`, data, { headers });
      console.log('✅ ChatService - Mensaje enviado exitosamente');

      if (this.socket) {
        console.log('🔌 ChatService - Emitiendo evento socket');
        this.socket.emit('newMessage', {
          message: response.data
        });
      }

      return response.data;
    } catch (error) {
      console.error('❌ ChatService - Error al enviar mensaje:', error);
      throw error;
    }
  },

  async getChatHistory(clientId: string): Promise<any> {
      console.log('🔍 ChatService - Obteniendo historial para cliente:', clientId);
      
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('❌ ChatService - No se encontró el ID del usuario');
          throw new Error('No se encontró el ID del usuario');
        }
  
        const headers = await this.getHeaders();
        console.log('🔐 ChatService - Headers obtenidos:', headers);
  
        const response = await axios.get(`${API_URL}/chat/history`, {
          params: {
            userId,
            userType: 'Trainer',
            otherUserId: clientId,
            otherUserType: 'Client'
          },
          headers
        });
  
        console.log('📥 ChatService - Historial recibido:', response.data);
        // Return the data array directly instead of looking for a messages property
        return response.data;
      } catch (error) {
        console.error('❌ ChatService - Error al obtener historial:', error);
        throw error;
      }
    },

  async sendBulkMessage(clientIds: string[], message: string): Promise<void> {
    console.log('📤 ChatService - Enviando mensaje masivo:', { clientIds, message });

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario');
      }

      const headers = await this.getHeaders();
      const data = {
        userId,
        userType: 'Trainer',
        otherUserIds: clientIds,
        otherUserType: 'Client',
        message
      };

      const response = await axios.post(`${API_URL}/chat/bulk-send`, data, { headers });
      console.log('✅ ChatService - Mensaje masivo enviado exitosamente');
      return response.data;
    } catch (error) {
      console.error('❌ ChatService - Error al enviar mensaje masivo:', error);
      throw error;
    }
  },

  async getUnreadMessages(userId: string, userType: 'Trainer' | 'Client'): Promise<Message[]> {
    console.log('🔍 ChatService - Obteniendo mensajes no leídos para:', { userId, userType });
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${API_URL}/chat/unread`, {
          params: {
            userId,
            userType
          },
          headers
        }
      );
      console.log('📥 ChatService - Mensajes no leídos recibidos:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ ChatService - Error al obtener mensajes no leídos:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los mensajes no leídos');
    }
  },

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    console.log('📤 ChatService - Marcando mensajes como leídos:', messageIds);
    try {
      const headers = await this.getHeaders();
      await axios.post(
        `${API_URL}/chat/mark-read`,
        { messageIds },
        { headers }
      );

      console.log('✅ ChatService - Mensajes marcados como leídos');
    } catch (error: any) {
      console.error('❌ ChatService - Error al marcar mensajes como leídos:', error);
      throw new Error(error.response?.data?.message || 'Error al marcar los mensajes como leídos');
    }
  },

  async getHeaders(): Promise<any> {
    console.log('🔐 ChatService - Obteniendo headers para la petición');
    const token = localStorage.getItem('token') || localStorage.getItem('jwt');
  
    if (!token) {
      console.error('❌ ChatService - No se encontró token de autenticación');
      throw new Error('No se encontró el token de autenticación');
    }
  
    console.log('✅ ChatService - Token encontrado y headers generados');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
};
