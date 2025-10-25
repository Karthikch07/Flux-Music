import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('API Request:', config.method.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url
        });
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (username, email, password) => {
        const response = await api.post('/auth/register', { username, email, password });
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },
    
    updateProfile: async (data) => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    }
};

// Playlist API
export const playlistAPI = {
    getAll: async () => {
        const response = await api.get('/playlists');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/playlists/${id}`);
        return response.data;
    },
    
    create: async (name, description, coverImage, isPublic) => {
        const response = await api.post('/playlists', { name, description, coverImage, isPublic });
        return response.data;
    },
    
    update: async (id, data) => {
        const response = await api.put(`/playlists/${id}`, data);
        return response.data;
    },
    
    delete: async (id) => {
        const response = await api.delete(`/playlists/${id}`);
        return response.data;
    },
    
    addSong: async (playlistId, songId) => {
        const response = await api.post(`/playlists/${playlistId}/songs`, { songId });
        return response.data;
    },
    
    removeSong: async (playlistId, songId) => {
        const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
        return response.data;
    }
};

// Song API
export const songAPI = {
    getAll: async () => {
        const response = await api.get('/songs');
        return response.data;
    },
    
    getById: async (id) => {
        const response = await api.get(`/songs/${id}`);
        return response.data;
    },
    
    search: async (query) => {
        const response = await api.get(`/songs/search?q=${query}`);
        return response.data;
    },
    
    incrementPlay: async (id) => {
        const response = await api.post(`/songs/${id}/play`);
        return response.data;
    }
};

// User API
export const userAPI = {
    likeSong: async (songId) => {
        const response = await api.post(`/users/like/${songId}`);
        return response.data;
    },
    
    getLikedSongs: async () => {
        const response = await api.get('/users/liked-songs');
        return response.data;
    }
};

export default api;
