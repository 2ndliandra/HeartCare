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
        // Check session timeout (3 hours = 10,800,000 ms)
        if (setAt && (Date.now() - parseInt(setAt)) > 10800000) {
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

// Add interceptor to handle 401 Unauthorized responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_token_set_at');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
