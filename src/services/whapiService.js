// src/services/whapiService.js
import api from './api';

/**
 * Service wrapper for Whapi.cloud API calls
 * This allows us to format the data consistently and handle errors in one place
 */
class WhapiService {
    /**
     * Get messages from a specific chat
     * @param {string} chatId - The chat ID
     * @param {number} limit - Maximum number of messages to retrieve
     * @param {string} before - Message ID to retrieve messages before this ID
     * @returns {Promise<Array>} - List of messages
     */
    async getChatMessages(chatId, limit = 100, before = null) {
        try {
            let url = `/messages/list/${encodeURIComponent(chatId)}`;
            const params = {};

            if (limit) params.limit = limit;
            if (before) params.before = before;

            const response = await api.get(url, { params });

            // Whapi returns an object with 'messages' array and 'count', 'total' metadata
            if (response.data && Array.isArray(response.data.messages)) {
                return response.data.messages;
            }

            // Handle mock data or different response format
            if (Array.isArray(response.data)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error(`Error fetching messages for chat ${chatId}:`, error);
            // Return empty array instead of throwing to avoid breaking the UI
            return [];
        }
    }

    /**
     * Get only media messages (images, documents, videos, audio) from a chat
     * @param {string} chatId - The chat ID
     * @returns {Promise<Array>} - List of media messages
     */
    async getChatMediaMessages(chatId) {
        try {
            const messages = await this.getChatMessages(chatId);

            return messages.filter(msg =>
                msg.type === 'image' ||
                msg.type === 'document' ||
                msg.type === 'video' ||
                msg.type === 'audio'
            );
        } catch (error) {
            console.error(`Error fetching media messages for chat ${chatId}:`, error);
            return [];
        }
    }

    /**
     * Download media file from URL
     * @param {string} mediaUrl - The media URL
     * @returns {Promise<ArrayBuffer>} - Media data as ArrayBuffer
     */
    async downloadMedia(mediaUrl) {
        try {
            const response = await fetch(mediaUrl);

            if (!response.ok) {
                throw new Error(`Failed to download media: ${response.statusText}`);
            }

            return await response.arrayBuffer();
        } catch (error) {
            console.error(`Error downloading media from ${mediaUrl}:`, error);
            throw error;
        }
    }

    /**
     * Get mock media messages when testing without API access
     * @returns {Array} - Mocked media messages for testing
     */
    getMockMediaMessages() {
        return {
            "messages": [
                {
                    "id": "OoD8DNmN1NaEYg-klYBq53b8oQfNQ-A0nWqJw",
                    "from_me": false,
                    "type": "text",
                    "chat_id": "120363383047593781@g.us",
                    "timestamp": 1741066392,
                    "source": "mobile",
                    "text": {
                        "body": "Feb Maintenance"
                    },
                    "from": "14123706524",
                    "from_name": "Bhavy Kolli"
                },
                {
                    "id": "XqMUCssusLJQLQ-kk8Bq53b8oQfNQ-A0nWqJw",
                    "from_me": false,
                    "type": "image",
                    "chat_id": "120363383047593781@g.us",
                    "timestamp": 1741066374,
                    "source": "mobile",
                    "image": {
                        "id": "jpeg-5ea3140acb2eb0b2502d-924f01ab9ddbf2841f35-0349d6a89c",
                        "mime_type": "image/jpeg",
                        "file_size": 86282,
                        "sha256": "VuvCygJVlvawD4Djr/+cWQZ9JODzubrRarL3vrwCx8I=",
                        "link": "https://s3.eu-central-1.wasabisys.com/in-files/918508204587/jpeg-5ea3140acb2eb0b2502d-924f01ab9ddbf2841f35-0349d6a89c.jpeg",
                        "width": 1320,
                        "height": 1331,
                        "preview": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIAEcDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAIBAwT/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAADy+aI769Dzj0c+WLaFWgdufs83HPFeENwVNEArdwzdk1IpIkHWu3EwkzAFnMVojdCAAYK//8QAFxEBAQEBAAAAAAAAAAAAAAAAEQABQP/aAAgBAgEBPwBmcnJzl//EABcRAAMBAAAAAAAAAAAAAAAAAAARMBD/2gAIAQMBAT8A1jmpf//EACgQAAIBAwMDBAIDAAAAAAAAAAECAAMREhMhUQQgIkEgIkEQU2Fikf/aAAgBAgEBPwDpvTmr9Pq524ESkrXu+JBmgn7RNBLkagmgn3VAlRFQ/FsvYnWVEQojMFP1BWt2vNczXMNbLvNQcGag4M1BwYaoH0Z0tCrWU6dLP+ZURhUKlMSO4mDeJmDeJhBHcW/IpuRcKTeVVKizCxnp3qCdNQNNwe9wROp6jW6h6oBAMFXfe8NRr7EwsW7m/wCRUdRYMRKrFhdjcxSANxeZL4wEX7TJfGFl8ZkvjMl8ZkvjKm422lIqFOS34ilbfJSTL0/ExipPxFvbUtbaUyoG5tCU8j/ktS+2MxpeRjhQfibj2VbW2nR9OKtJmLAW7TEkkXXY2ml/YRlx+wfYtPIXyAlZcdrgxahUWViLwVAODNUcCao4ELAmZDmZDmZDmVGDCf/+AAMA/9k="
                    },
                    "from": "14123706524",
                    "from_name": "Bhavy Kolli"
                },
                {
                    "id": "XnJAEJsmaYNPqA-gjgBq53b8oQfNQ",
                    "from_me": false,
                    "type": "image",
                    "chat_id": "120363383047593781@g.us",
                    "timestamp": 1740729781,
                    "source": "mobile",
                    "image": {
                        "id": "jpeg-5e7240109b2669834fa8-823801ab9ddbf2841f35",
                        "mime_type": "image/jpeg",
                        "file_size": 231763,
                        "sha256": "XLP9pPaX7ky0VSGx4N919cfyiCyH3GhGXDbrcw7hyGU=",
                        "caption": "Internet bill - Feb 2025",
                        "width": 1139,
                        "height": 1600
                    },
                    "from": "14123706524"
                },
                {
                    "id": "OvhJT51.ikvULw-gl4Bq53b8oQfNQ",
                    "from_me": false,
                    "type": "document",
                    "chat_id": "120363383047593781@g.us",
                    "timestamp": 1739601704,
                    "source": "mobile",
                    "document": {
                        "id": "pdf-3af8494f9d7e8a4bd42f-825e01ab9ddbf2841f35",
                        "mime_type": "application/pdf",
                        "file_size": 114212,
                        "sha256": "GhU/9Hc5/kijjUn1ljR5NTnY0k0c+p8W/FPmuLcp39E=",
                        "file_name": "144.pdf",
                        "caption": "144.pdf",
                        "filename": "144.pdf",
                        "page_count": 1
                    },
                    "context": {
                        "forwarded": true,
                        "forwarding_score": 1,
                        "ephemeral": 0
                    },
                    "from": "14123706524"
                }
            ],
            "count": 100,
            "total": 4
        };
    }
}

export default new WhapiService();