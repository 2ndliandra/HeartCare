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
    },

    async forgotPassword(data: { email: string }) {
        const response = await api.post('/forgot-password', data);
        return response.data;
    },

    async verifyToken(data: { email: string; token: string }) {
        const response = await api.post('/verify-token', data);
        return response.data;
    },

    async resetPassword(data: any) {
        const response = await api.post('/reset-password', data);
        return response.data;
    }
};
