import React, { useState, useEffect } from 'react';
import { getChatById } from '../../services/chatService';
import { getAllOrganizations, addChatToOrganization, removeChatFromOrganization } from '../../services/organizationService';

const ChatDetails = ({ chatId, onBack }) => {
    const [chat, setChat] = useState(null);
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrganization, setSelectedOrganization] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [chatData, orgsData] = await Promise.all([
                    getChatById(chatId),
                    getAllOrganizations()
                ]);

                setChat(chatData);
                setOrganizations(orgsData);

                if (chatData.organization) {
                    setSelectedOrganization(chatData.organization._id);
                }

                setError(null);
            } catch (err) {
                setError('Failed to load data. Please try again.');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (chatId) {
            fetchData();
        }
    }, [chatId]);

    const handleOrganizationChange = async (e) => {
        const orgId = e.target.value;
        setSelectedOrganization(orgId);

        try {
            if (orgId) {
                // Add to new organization
                await addChatToOrganization(orgId, chat.chatId);
            } else if (chat.organization) {
                // Remove from current organization
                await removeChatFromOrganization(chat.organization._id, chat.chatId);
            }

            // Refresh chat data
            const updatedChat = await getChatById(chatId);
            setChat(updatedChat);
        } catch (err) {
            console.error('Error updating organization:', err);
            setError('Failed to update organization. Please try again.');
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading details...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!chat) {
        return <div className="p-4 text-center">No chat selected</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center">
                <button
                    className="mr-2 text-blue-500"
                    onClick={onBack}
                >
                    ← Back
                </button>
                <h2 className="text-xl font-semibold">Chat Details</h2>
            </div>

            <div className="p-4">
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                        {chat.profilePicture ? (
                            <img
                                src={chat.profilePicture}
                                alt={chat.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-2xl text-gray-500">
                {chat.name.charAt(0).toUpperCase()}
              </span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-medium">{chat.name}</h3>
                        <p className="text-gray-500">
                            {chat.isGroup ? 'Group' : 'Individual chat'}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization
                    </label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedOrganization}
                        onChange={handleOrganizationChange}
                    >
                        <option value="">-- None --</option>
                        {organizations.map((org) => (
                            <option key={org._id} value={org._id}>
                                {org.name}
                            </option>
                        ))}
                    </select>
                </div>

                {chat.isGroup && (
                    <div className="mb-4">
                        <h4 className="font-medium mb-2">Participants ({chat.participants.length})</h4>
                        <div className="max-h-40 overflow-y-auto">
                            {chat.participants.map((participant, index) => (
                                <div key={index} className="py-1">
                                    {participant}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatDetails;