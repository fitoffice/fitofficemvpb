import axios from 'axios';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

export interface Cliente {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
  tag: string;
  fechaRegistro: string;
  trainer: string;
  planesDePago: {
    nombre: string;
    estado: string;
  }[];
  servicios: {
    nombre: string;
    estado: string;
  }[];
  ultimoCheckin: string;
  alertas: {
    tipo: string;
    mensaje: string;
    fecha: string;
  }[];
  transacciones: any[];
  __v: number;
}

class ClientService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  async getClients(): Promise<Cliente[]> {
    try {
      const response = await axios.get(`${API_URL}/clientes`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
      throw error;
    }
  }
}

export const clientService = new ClientService();
