import axios from 'axios';
import { Planning, WeekPlan, Session } from '../types/planning';

const API_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api';

class PlanningService {
  private getAuthConfig() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  // Obtener todos los plannings
  async getAllPlannings(): Promise<Planning[]> {
    try {
      const response = await axios.get(`${API_URL}/plannings`, this.getAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching plannings:', error);
      throw error;
    }
  }

  // Obtener un planning específico
  async getPlanningById(planningId: string): Promise<Planning> {
    try {
      const response = await axios.get(
        `${API_URL}/plannings/${planningId}`,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching planning:', error);
      throw error;
    }
  }

  // Crear un nuevo planning
  async createPlanning(planningData: Partial<Planning>): Promise<Planning> {
    try {
      const response = await axios.post(
        `${API_URL}/plannings`,
        planningData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error creating planning:', error);
      throw error;
    }
  }

  // Actualizar un planning existente
  async updatePlanning(planningId: string, planningData: Partial<Planning>): Promise<Planning> {
    try {
      const response = await axios.put(
        `${API_URL}/plannings/${planningId}`,
        planningData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating planning:', error);
      throw error;
    }
  }

  // Eliminar un planning
  async deletePlanning(planningId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/plannings/${planningId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting planning:', error);
      throw error;
    }
  }

  // Añadir una nueva semana al planning
  async addWeekToPlan(planningId: string): Promise<WeekPlan> {
    try {
      const response = await axios.post(
        `${API_URL}/plannings/${planningId}/anadirsemanasiguiente`,
        {},
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding week to plan:', error);
      throw error;
    }
  }

  // Actualizar una semana específica
  async updateWeek(planningId: string, weekId: string, weekData: Partial<WeekPlan>): Promise<WeekPlan> {
    try {
      const response = await axios.put(
        `${API_URL}/plannings/${planningId}/weeks/${weekId}`,
        weekData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating week:', error);
      throw error;
    }
  }

  // Eliminar una semana
  async deleteWeek(planningId: string, weekId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/plannings/${planningId}/weeks/${weekId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting week:', error);
      throw error;
    }
  }

  // Añadir una sesión a un día específico
  async addSession(planningId: string, weekId: string, dayId: string, sessionData: Partial<Session>): Promise<Session> {
    try {
      const response = await axios.post(
        `${API_URL}/plannings/${planningId}/weeks/${weekId}/days/${dayId}/sessions`,
        sessionData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  // Actualizar una sesión
  async updateSession(
    planningId: string,
    weekId: string,
    dayId: string,
    sessionId: string,
    sessionData: Partial<Session>
  ): Promise<Session> {
    try {
      const response = await axios.put(
        `${API_URL}/plannings/${planningId}/weeks/${weekId}/days/${dayId}/sessions/${sessionId}`,
        sessionData,
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  // Eliminar una sesión
  async deleteSession(planningId: string, weekId: string, dayId: string, sessionId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/plannings/${planningId}/weeks/${weekId}/days/${dayId}/sessions/${sessionId}`,
        this.getAuthConfig()
      );
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Duplicar un planning completo
  async duplicatePlanning(planningId: string): Promise<Planning> {
    try {
      const response = await axios.post(
        `${API_URL}/plannings/${planningId}/duplicate`,
        {},
        this.getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error duplicating planning:', error);
      throw error;
    }
  }
}

export const planningService = new PlanningService();