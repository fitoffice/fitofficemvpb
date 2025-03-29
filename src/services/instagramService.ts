import axios from 'axios';

const API_BASE_URL = 'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/instagram';

interface PostContent {
  image?: File;
  video?: File;
  caption: string;
  location?: string;
}

interface StoryContent {
  media: File;
  stickers?: any[];
  links?: string[];
}

export const instagramService = {
  // Autenticación
  async getAuthUrl() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/auth-url`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.url;
  },

  async disconnect() {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_BASE_URL}/disconnect`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  // Gestión de Contenido
  async createPost(content: PostContent) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    if (content.image) {
      formData.append('image', content.image);
    }
    if (content.video) {
      formData.append('video', content.video);
    }
    
    formData.append('caption', content.caption);
    if (content.location) {
      formData.append('location', content.location);
    }

    const response = await axios.post(`${API_BASE_URL}/post`, formData, {
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

  async createStory(content: StoryContent) {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('media', content.media);
    
    if (content.stickers) {
      formData.append('stickers', JSON.stringify(content.stickers));
    }
    if (content.links) {
      formData.append('links', JSON.stringify(content.links));
    }

    const response = await axios.post(`${API_BASE_URL}/story`, formData, {
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

  async getPosts() {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_BASE_URL}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
};
