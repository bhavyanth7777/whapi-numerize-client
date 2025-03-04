// client/src/services/chatService.js
import api from './api';

// Get all chats and groups combined
export const getAllChats = async () => {
    try {
        const response = await api.get('/chats');
        return response.data;
    } catch (error) {
        console.error('Error fetching chats:', error);
        throw error;
    }
};

// Get individual chats only (no groups)
export const getIndividualChats = async () => {
    try {
        const response = await api.get('/chats/individual');
        return response.data;
    } catch (error) {
        console.error('Error fetching individual chats:', error);
        throw error;
    }
};

// Get groups only
export const getGroupsOnly = async () => {
    try {
        const response = await api.get('/chats/groups');
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
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