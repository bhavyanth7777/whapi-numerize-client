import api from './api';

export const getAllDocuments = async () => {
    try {
        const response = await api.get('/documents');
        return response.data;
    } catch (error) {
        console.error('Error fetching documents:', error);
        throw error;
    }
};

export const getDocumentById = async (id) => {
    try {
        const response = await api.get(`/documents/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching document ${id}:`, error);
        throw error;
    }
};

export const getDocumentsByChat = async (chatId) => {
    try {
        const response = await api.get(`/documents/chat/${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching documents for chat ${chatId}:`, error);
        throw error;
    }
};

export const processDocument = async (messageId) => {
    try {
        const response = await api.post(`/documents/process/${messageId}`);
        return response.data;
    } catch (error) {
        console.error(`Error processing document for message ${messageId}:`, error);
        throw error;
    }
};