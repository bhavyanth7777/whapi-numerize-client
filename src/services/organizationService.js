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
    try {
        const response = await api.delete(`/organizations/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting organization ${id}:`, error);
        throw error;
    }
};

export const addChatToOrganization = async (organizationId, chatId) => {
    try {
        const response = await api.post(`/organizations/${organizationId}/chats/${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`Error adding chat ${chatId} to organization ${organizationId}:`, error);
        throw error;
    }
};

export const removeChatFromOrganization = async (organizationId, chatId) => {
    try {
        const response = await api.delete(`/organizations/${organizationId}/chats/${chatId}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing chat ${chatId} from organization ${organizationId}:`, error);
        throw error;
    }
};