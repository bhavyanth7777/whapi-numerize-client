import api from './api';

export const getMessages = async (chatId, limit = 50, before = null) => {
    try {
        let url = `/messages/${encodeURIComponent(chatId)}`;
        const params = {};

        if (limit) params.limit = limit;
        if (before) params.before = before;

        const response = await api.get(url, { params });

        // Check response structure from Whapi
        if (response.data && response.data.messages) {
            return response.data.messages;
        }

        return response.data;
    } catch (error) {
        console.error(`Error fetching messages for chat ${chatId}:`, error);
        throw error;
    }
};

export const getMediaMessages = async (chatId) => {
    try {
        const messages = await getMessages(chatId, 100);

        // Filter only media messages (images and documents)
        return messages.filter(msg =>
            msg.type === 'image' ||
            msg.type === 'document' ||
            msg.type === 'video' ||
            msg.type === 'audio'
        );
    } catch (error) {
        console.error(`Error fetching media messages for chat ${chatId}:`, error);
        throw error;
    }
};

export const sendMessage = async (chatId, messageData) => {
    try {
        const response = await api.post(`/messages/${encodeURIComponent(chatId)}`, messageData);
        return response.data;
    } catch (error) {
        console.error(`Error sending message to chat ${chatId}:`, error);
        throw error;
    }
};

export const reactToMessage = async (chatId, messageId, emoji) => {
    try {
        const response = await api.post(`/messages/${encodeURIComponent(chatId)}/react/${messageId}`, { emoji });
        return response.data;
    } catch (error) {
        console.error(`Error reacting to message ${messageId}:`, error);
        throw error;
    }
};

export default {
    getMessages,
    getMediaMessages,
    sendMessage,
    reactToMessage
};