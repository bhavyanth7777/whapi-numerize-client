// client/src/services/systemService.js
import api from './api';

export const getSystemInfo = async (forceUpdate = false) => {
    try {
        const response = await api.get(`/system/info${forceUpdate ? '?forceUpdate=true' : ''}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching system info:', error);
        throw error;
    }
};

export const updateSystemInfo = async () => {
    try {
        const response = await api.post('/system/info/update');
        return response.data;
    } catch (error) {
        console.error('Error updating system info:', error);
        throw error;
    }
};