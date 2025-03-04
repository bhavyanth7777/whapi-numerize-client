// client/src/services/systemService.js
import api from './api';

export const getSystemInfo = async () => {
    try {
        const response = await api.get('/system/info');
        return response.data;
    } catch (error) {
        console.error('Error fetching system info:', error);
        throw error;
    }
};