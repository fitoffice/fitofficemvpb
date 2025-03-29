import axios from 'axios';

const API_BASE_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/youtube';

interface VideoMetadata {
  title: string;
  description: string;
  tags?: string[];
  privacyStatus?: 'private' | 'unlisted' | 'public';
}

export const youtubeService = {
  // Autenticación
  async getAuthUrl() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/auth`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.url;
  },

  // Gestión de Videos
  async getVideos() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/videos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getVideoDetails(videoId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async uploadVideo(file: File, metadata: VideoMetadata) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('video', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
        console.log(`Upload Progress: ${percentCompleted}%`);
      }
    });
    return response.data;
  },

  async updateVideo(videoId: string, metadata: VideoMetadata) {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_BASE_URL}/videos/${videoId}`,
      metadata,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async deleteVideo(videoId: string) {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${API_BASE_URL}/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
