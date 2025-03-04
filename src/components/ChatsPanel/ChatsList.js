// client/src/components/ChatsPanel/ChatsList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllChats, getIndividualChats, getGroupsOnly } from '../../services/chatService';

const ChatsList = ({ onChatSelect, showGroupsOnly = false, showChatsOnly = false }) => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                let data;
                if (showGroupsOnly) {
                    // Fetch only groups
                    data = await getGroupsOnly();
                } else if (showChatsOnly) {
                    // Fetch only individual chats
                    data = await getIndividualChats();
                } else {
                    // Fetch all (both chats and groups)
                    data = await getAllChats();
                }

                setChats(data);
                setError(null);
            } catch (err) {
                setError('Failed to load chats. Please try again.');
                console.error('Error fetching chats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showGroupsOnly, showChatsOnly]);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const headerText = showGroupsOnly
        ? "Groups"
        : (showChatsOnly ? "Individual Chats" : "Chats & Groups");

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">{headerText}</h2>
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder={`Search ${headerText.toLowerCase()}...`}
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-4 text-center">Loading...</div>
            ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
                <div className="divide-y overflow-y-auto max-h-96">
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.chatId}
                                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                                onClick={() => onChatSelect(chat)}
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                    {chat.profilePicture ? (
                                        <img
                                            src={chat.profilePicture}
                                            alt={chat.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl text-gray-500">
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{chat.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {chat.isGroup ? 'Group' : 'Individual chat'}
                                        {chat.organization && ` • ${chat.organization.name}`}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm
                                ? `No ${headerText.toLowerCase()} found matching "${searchTerm}"`
                                : `No ${headerText.toLowerCase()} available`}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatsList;