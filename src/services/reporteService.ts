import axios from 'axios';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

export interface Reporte {
  _id: string;
  idTicket: string;
  trainer: string;
  resumenFeedback: string;
  categoria: string;
  seccion: string;
  estado: string;
  departamentoAsignado: string;
  fechaRecibido: string;
  ultimaActualizacion: string;
  resumenResolucion: string;
  usuarioNotificado: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const reporteService = {
  getReportes: async (): Promise<Reporte[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.get<ApiResponse<Reporte[]>>(`${API_URL}/reportes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status !== 'success') {
        throw new Error('Error al obtener los reportes');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error al obtener los reportes:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error al obtener los reportes');
    }
  },

  crearReporte: async (reporteData: Omit<Reporte, '_id' | 'idTicket' | 'trainer' | 'fechaRecibido' | 'ultimaActualizacion' | 'createdAt' | 'updatedAt' | '__v'>): Promise<Reporte> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.post<ApiResponse<Reporte>>(`${API_URL}/reportes`, reporteData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status !== 'success') {
        throw new Error('Error al crear el reporte');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error al crear el reporte:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error al crear el reporte');
    }
  },

  actualizarReporte: async (id: string, reporteData: Partial<Reporte>): Promise<Reporte> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await axios.put<ApiResponse<Reporte>>(`${API_URL}/reportes/${id}`, reporteData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status !== 'success') {
        throw new Error('Error al actualizar el reporte');
      }

      return response.data.data;
    } catch (error: any) {
      console.error('Error al actualizar el reporte:', error);
      throw new Error(error.response?.data?.message || error.message || 'Error al actualizar el reporte');
    }
  }
};
