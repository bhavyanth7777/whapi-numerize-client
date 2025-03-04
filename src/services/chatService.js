import api from './api';

export const getAllChats = async () => {
    try {
        const response = await api.get('/chats');
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};

export const getChatById = async (chatId) => {
    try {
        const response = await api.get(`/chats/${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching chat ${chatId}:`, error);
        throw error;
    }
};

export const assignChatToOrganization = async (chatId, organizationId) => {
    try {
        const response = await api.post('/chats/assign', { chatId, organizationId });
        return response.data;
    } catch (error) {
        console.error('Error assigning chat to organization:', error);
        throw error;
    }
};