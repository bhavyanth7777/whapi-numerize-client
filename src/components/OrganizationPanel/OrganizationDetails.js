import React, { useState, useEffect } from 'react';
import {
    getOrganizationById,
    updateOrganization,
    removeChatFromOrganization
} from '../../services/organizationService';
import { getAllChats } from '../../services/chatService';

const OrganizationDetails = ({ organization, onBack, onUpdate }) => {
    const [org, setOrg] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedChats, setAssignedChats] = useState([]);
    const [availableChats, setAvailableChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (organization) {
            fetchData();
        }
    }, [organization]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Get organization details
            const orgData = await getOrganizationById(organization._id);
            setOrg(orgData);
            setName(orgData.name);
            setDescription(orgData.description || '');

            // Get all chats
            const chatsData = await getAllChats();

            // Split into assigned and available chats
            const orgChatIds = orgData.chats.map(chat => chat._id);
            const assigned = chatsData.filter(chat => chat._id && orgChatIds.includes(chat._id));
            const available = chatsData.filter(chat => !chat._id || !orgChatIds.includes(chat._id));

            setAssignedChats(assigned);
            setAvailableChats(available);

            setError(null);
        } catch (err) {
            setError('Failed to load organization details. Please try again.');
            console.error('Error fetching organization details:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateOrganization = async (e) => {
        e.preventDefault();

        try {
            const updatedOrg = await updateOrganization(org._id, {
                name,
                description
            });

            setOrg(updatedOrg);
            setEditing(false);

            // Notify parent
            if (onUpdate) {
                onUpdate(updatedOrg);
            }
        } catch (err) {
            setError('Failed to update organization. Please try again.');
            console.error('Error updating organization:', err);
        }
    };

    const handleRemoveChat = async (chatId) => {
        try {
            await removeChatFromOrganization(org._id, chatId);

            // Update local state
            const removedChat = assignedChats.find(chat => chat.chatId === chatId);
            setAssignedChats(assignedChats.filter(chat => chat.chatId !== chatId));

            if (removedChat) {
                setAvailableChats([...availableChats, removedChat]);
            }
        } catch (err) {
            setError('Failed to remove chat. Please try again.');
            console.error('Error removing chat:', err);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading organization details...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!org) {
        return <div className="p-4 text-center">No organization selected</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        className="mr-2 text-blue-500"
                        onClick={onBack}
                    >
                        ← Back
                    </button>
                    <h2 className="text-xl font-semibold">Organization Details</h2>
                </div>

                {!editing && (
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => setEditing(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

            <div className="p-4">
                {editing ? (
                    <form onSubmit={handleUpdateOrganization}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                className="border px-4 py-2 rounded hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false);
                                    setName(org.name);
                                    setDescription(org.description || '');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <h3 className="text-xl font-medium">{org.name}</h3>
                        {org.description && (
                            <p className="text-gray-600 mt-2">{org.description}</p>
                        )}
                    </div>
                )}

                <div className="mt-6">
                    <h4 className="font-medium mb-2">Assigned Chats ({assignedChats.length})</h4>

                    {assignedChats.length > 0 ? (
                        <div className="divide-y border rounded max-h-64 overflow-y-auto">
                            {assignedChats.map((chat) => (
                                <div key={chat.chatId} className="p-3 flex justify-between items-center">
                                    <div>
                                        <div className="font-medium">{chat.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {chat.isGroup ? 'Group' : 'Individual chat'}
                                        </div>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRemoveChat(chat.chatId)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm">
                            No chats assigned to this organization yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrganizationDetails;