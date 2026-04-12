import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add interceptor to include token in requests and check session timeout
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    const setAt = localStorage.getItem('auth_token_set_at');
    
    if (token) {
        // Check session timeout (1 hour = 3,600,000 ms)
        if (setAt && (Date.now() - parseInt(setAt)) > 3600000) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_token_set_at');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return config;
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
