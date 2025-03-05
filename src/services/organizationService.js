import api from './api';

export const getAllOrganizations = async () => {
    try {
        const response = await api.get('/organizations');
        return response.data;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        throw error;
    }
};

export const getOrganizationById = async (id) => {
    try {
        const response = await api.get(`/organizations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching organization ${id}:`, error);
        throw error;
    }
};

export const createOrganization = async (organizationData) => {
    try {
        const response = await api.post('/organizations', organizationData);
        return response.data;
    } catch (error) {
        console.error('Error creating organization:', error);
        throw error;
    }
};

export const updateOrganization = async (id, organizationData) => {
    try {
        const response = await api.put(`/organizations/${id}`, organizationData);
        return response.data;
    } catch (error) {
        console.error(`Error updating organization ${id}:`, error);
        throw error;
    }
};

export const deleteOrganization = async (id) => {
    console.log('CLIENT Organization Service')
    try {
        const response = await api.delete(`/organizations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting organization ${id}:`, error);
        throw error;
    }
};

export const addChatToOrganization = async (organizationId, chatId) => {
    console.log('Making request to add chat', chatId, 'to organization', organizationId);

    try {
        // Encode the chatId to handle special characters
        const encodedChatId = encodeURIComponent(chatId);
        console.log('Encoded chatId:', encodedChatId);

        const url = `/organizations/${organizationId}/chats/${encodedChatId}`;
        console.log('Request URL:', url);

        const response = await api.post(url);
        return response.data;
    } catch (error) {
        console.error(`Error adding chat ${chatId} to organization ${organizationId}:`, error);
        throw error;
    }
};

export const testOrganizationApi = async () => {
    try {
        const response = await api.post('/organizations/test');
        console.log('Test response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Test error:', error);
        throw error;
    }
};

export const removeChatFromOrganization = async (organizationId, chatId) => {
    try {
        // Encode the chatId to handle special characters
        const encodedChatId = encodeURIComponent(chatId);

        const response = await api.delete(`/organizations/${organizationId}/chats/${encodedChatId}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing chat ${chatId} from organization ${organizationId}:`, error);
        throw error;
    }
};