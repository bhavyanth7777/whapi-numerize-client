import api from './api';

export const getMessages = async (chatId, limit = 50, before = null) => {
    try {
        let url = `/messages/${chatId}`;
        const params = {};

        if (limit) params.limit = limit;
        if (before) params.before = before;

        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        throw error;
    }
};

export const sendMessage = async (chatId, messageData) => {
    try {
        const response = await api.post(`/messages/${chatId}`, messageData);
        return response.data;
    } catch (error) {
        console.error(`Error sending message to chat ${chatId}:`, error);
        throw error;
    }
};

export const reactToMessage = async (chatId, messageId, emoji) => {
    try {
        const response = await api.post(`/messages/${chatId}/react/${messageId}`, { emoji });
        return response.data;
    } catch (error) {
        console.error(`Error reacting to message ${messageId}:`, error);
        throw error;
    }
};
