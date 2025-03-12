// src/components/OrganizationPanel/OrganizationDocuments.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrganizationDocuments = ({ organization, assignedChats = [] }) => {
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedChat, setSelectedChat] = useState('all');
    const [mediaType, setMediaType] = useState('all');

    // Create a mapping of chat IDs to chat names
    const chatNameMap = {};
    assignedChats.forEach(chat => {
        chatNameMap[chat.chatId] = chat.name;
    });

    useEffect(() => {
        if (organization?.chatIds?.length > 0) {
            fetchMediaItems();
        }
    }, [organization, assignedChats]);

    const fetchMediaItems = async () => {
        if (!organization || !organization.chatIds || organization.chatIds.length === 0) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const allMedia = [];

            // Fetch messages for each chat ID in the organization
            for (const chatId of organization.chatIds) {
                try {
                    const { data } = await api.get(`/messages/${encodeURIComponent(chatId)}`);
                    const messages = data.messages || [];

                    // Get the proper chat name from the mapping or fallback to a formatted version
                    const chatName = chatNameMap[chatId] ||
                        (chatId.includes('@g.us') ? `Group ${chatId.split('@')[0]}` : `Chat ${chatId.split('@')[0]}`);

                    // Filter messages to include only images and documents
                    const mediaMessages = messages.filter(msg =>
                        msg.type === 'image' || msg.type === 'document'
                    );

                    // Extract and format media data
                    for (const msg of mediaMessages) {
                        if (msg.type === 'image' && msg.image) {
                            allMedia.push({
                                id: msg.id,
                                chatId: chatId,
                                chatName: chatName,
                                type: 'image',
                                fileName: msg.image.caption || 'Unnamed',
                                fileUrl: msg.image.link,
                                preview: msg.image.preview,
                                fileSize: msg.image.file_size,
                                timestamp: msg.timestamp
                            });
                        } else if (msg.type === 'document' && msg.document) {
                            allMedia.push({
                                id: msg.id,
                                chatId: chatId,
                                chatName: chatName,
                                type: 'document',
                                fileName: msg.document.file_name || msg.document.caption || 'Unnamed',
                                fileUrl: msg.document.link,
                                fileSize: msg.document.file_size,
                                pageCount: msg.document.page_count,
                                timestamp: msg.timestamp
                            });
                        }
                    }
                } catch (error) {
                    console.error(`Error fetching messages for chat ${chatId}:`, error);
                    // Continue with other chats even if one fails
                }
            }

            // Remove duplicates (same file name and size)
            const uniqueMediaMap = new Map();
            allMedia.forEach(item => {
                const key = `${item.fileName}-${item.fileSize}`;
                if (!uniqueMediaMap.has(key)) {
                    uniqueMediaMap.set(key, item);
                }
            });

            setMediaItems(Array.from(uniqueMediaMap.values()));
        } catch (error) {
            console.error('Error fetching media items:', error);
            setError('Failed to load media items. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get filtered items based on selected chat and media type
    const getFilteredItems = () => {
        return mediaItems.filter(item => {
            const chatMatches = selectedChat === 'all' || item.chatId === selectedChat;
            const typeMatches = mediaType === 'all' || item.type === mediaType;
            return chatMatches && typeMatches;
        });
    };

    // Format file size for display
    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Format date for display
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };

    // Get unique chats for the filter dropdown (with proper names)
    const uniqueChatsWithNames = [];
    const addedChatIds = new Set();

    mediaItems.forEach(item => {
        if (!addedChatIds.has(item.chatId)) {
            uniqueChatsWithNames.push({
                id: item.chatId,
                name: item.chatName
            });
            addedChatIds.add(item.chatId);
        }
    });

    // Get filtered items
    const filteredItems = getFilteredItems();

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Images & Documents</h2>

                <div className="mt-3 flex space-x-4">
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
                            {uniqueChatsWithNames.map((chat) => (
                                <option key={chat.id} value={chat.id}>
                                    {chat.name}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
                                                <div className="text-4xl mb-2">📄</div>
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
                                            {item.chatName}
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
                                                className="mt-2 block text-center text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
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