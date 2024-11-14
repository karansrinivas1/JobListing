
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/', // Replace with your backend URL
});

// Automatically add the token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;
