import api from './api';

export const authService = {
    async register(data: any) {
        const response = await api.post('/register', data);
        return response.data;
    },

    async login(data: any) {
        const response = await api.post('/login', data);
        return response.data;
    },

    async logout() {
        const response = await api.post('/logout');
        return response.data;
    },

    async getMe() {
        const response = await api.get('/me');
        return response.data;
    }
};
