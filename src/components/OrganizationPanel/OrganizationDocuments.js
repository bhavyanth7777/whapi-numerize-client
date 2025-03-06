// src/components/OrganizationPanel/OrganizationDocuments.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import whapiService from '../../services/whapiService';

const OrganizationDocuments = ({ organization }) => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState('all');
    const [mediaType, setMediaType] = useState('all');
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if (organization && organization.chatIds && organization.chatIds.length > 0) {
            fetchMediaForAllChats();
        }
    }, [organization]);

    // Modified to handle errors gracefully
    const fetchMediaForAllChats = async () => {
        setLoading(true);
        setError(null);

        try {
            let allMedia = [];
            let chatInfoMap = {};

            for (const chatId of organization.chatIds) {
                try {
                    // First, try to get chat info for display purposes
                    // Store chat name even if we can't get full chat info
                    chatInfoMap[chatId] = {
                        chatId: chatId,
                        name: chatId.includes('@g.us') ? `Group ${chatId.split('@')[0]}` : chatId
                    };

                    try {
                        // Try to get official chat info but don't fail if not available
                        const chatResponse = await api.get(`/chats/${encodeURIComponent(chatId)}`);
                        if (chatResponse && chatResponse.data) {
                            chatInfoMap[chatId] = chatResponse.data;
                        }
                    } catch (chatInfoError) {
                        console.warn(`Could not fetch chat info for ${chatId}, using fallback name`);
                    }

                    // Now get messages - this should work for both chats and groups
                    const messages = await fetchChatMessages(chatId);

                    if (messages && messages.length > 0) {
                        const media = extractMediaFromMessages(messages, chatId);
                        allMedia = [...allMedia, ...media];
                    }
                } catch (chatError) {
                    console.error(`Error processing chat ${chatId}:`, chatError);
                    // Continue with other chats even if one fails
                }
            }

            setMediaItems(allMedia);
            setChats(Object.values(chatInfoMap));
        } catch (err) {
            console.error('Error fetching media:', err);
            setError('Failed to load media items');
        } finally {
            setLoading(false);
        }
    };

    const fetchChatMessages = async (chatId) => {
        try {
            // Direct Whapi API call to get messages
            const response = await api.get(`/messages/list/${encodeURIComponent(chatId)}?count=100`);

            // Check different possible response formats
            if (response.data && Array.isArray(response.data.messages)) {
                return response.data.messages;
            } else if (Array.isArray(response.data)) {
                return response.data;
            }

            return [];
        } catch (error) {
            console.error(`Error fetching messages for chat ${chatId}:`, error);
            // Use mock data if available in development
            if (process.env.NODE_ENV === 'development') {
                console.warn(`Using mock data for chat ${chatId}`);
                const mockData = whapiService.getMockMediaMessages();
                return mockData.messages || [];
            }
            return [];
        }
    };

    const extractMediaFromMessages = (messages, chatId) => {
        if (!Array.isArray(messages)) return [];

        return messages.filter(msg =>
            msg.type === 'image' || msg.type === 'document'
        ).map(msg => {
            const isImage = msg.type === 'image';
            const mediaData = isImage ? msg.image : msg.document;

            if (!mediaData) return null;

            return {
                id: msg.id,
                chatId: chatId,
                type: msg.type,
                timestamp: msg.timestamp,
                fileUrl: mediaData.link || null,
                fileName: mediaData.file_name || mediaData.caption || 'Unnamed',
                preview: isImage ? mediaData.preview || null : null,
                fileSize: mediaData.file_size || 0,
                mimeType: mediaData.mime_type || '',
                sender: msg.from_name || msg.from || 'Unknown',
                width: isImage ? mediaData.width : null,
                height: isImage ? mediaData.height : null,
                pageCount: !isImage && mediaData.page_count ? mediaData.page_count : null
            };
        }).filter(item => item !== null);
    };

    const getFilteredItems = () => {
        return mediaItems.filter(item => {
            const chatMatches = selectedChat === 'all' || item.chatId === selectedChat;
            const typeMatches = mediaType === 'all' || item.type === mediaType;
            return chatMatches && typeMatches;
        });
    };

    const getChatName = (chatId) => {
        const chat = chats.find(c => c.chatId === chatId);
        if (chat && chat.name) {
            return chat.name;
        }

        // Fallback to formatted chat ID if no name is available
        return chatId.includes('@g.us')
            ? `Group ${chatId.split('@')[0]}`
            : chatId;
    };

    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return 'Unknown size';
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
        else return (bytes/(1024*1024)).toFixed(1) + ' MB';
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        try {
            return new Date(timestamp * 1000).toLocaleDateString();
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Get unique chat IDs for the filter dropdown
    const uniqueChats = Array.from(new Set(mediaItems.map(item => item.chatId)));
    const filteredItems = getFilteredItems();

    const getDocumentIcon = (mimeType) => {
        if (!mimeType) return '📁';
        if (mimeType.includes('pdf')) return '📄';
        if (mimeType.includes('word') || mimeType.includes('msword')) return '📝';
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
        return '📁';
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Images & Documents</h2>

                <div className="mt-3 flex flex-wrap gap-3">
                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Chat
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={selectedChat}
                            onChange={(e) => setSelectedChat(e.target.value)}
                        >
                            <option value="all">All Chats</option>
                            {uniqueChats.map((chatId) => (
                                <option key={chatId} value={chatId}>
                                    {getChatName(chatId)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full sm:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="image">Images</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="p-4 text-center">Loading media items...</div>
            ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
                <div className="p-4">
                    {filteredItems.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">
                            No media items found for the selected filters
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="border rounded-lg overflow-hidden">
                                    {item.type === 'image' && (
                                        <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {item.preview ? (
                                                <img
                                                    src={item.preview}
                                                    alt={item.fileName}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : item.fileUrl ? (
                                                <img
                                                    src={item.fileUrl}
                                                    alt={item.fileName}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="h-full flex items-center justify-center text-gray-400">
                                                    No preview
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {item.type === 'document' && (
                                        <div className="h-48 bg-gray-50 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-4xl mb-2">{getDocumentIcon(item.mimeType)}</div>
                                                <div className="text-sm font-medium truncate px-4">
                                                    {item.fileName}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.pageCount && `${item.pageCount} page${item.pageCount !== 1 ? 's' : ''}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-2 border-t">
                                        <div className="font-medium truncate text-sm">{item.fileName}</div>
                                        <div className="text-xs text-gray-500">
                                            {getChatName(item.chatId)}
                                        </div>
                                        <div className="text-xs text-gray-400 flex justify-between mt-1">
                                            <span>{formatDate(item.timestamp)}</span>
                                            <span>{formatFileSize(item.fileSize)}</span>
                                        </div>
                                        {item.fileUrl && (
                                            <a
                                                href={item.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 block text-center text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                                            >
                                                View Original
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizationDocuments;