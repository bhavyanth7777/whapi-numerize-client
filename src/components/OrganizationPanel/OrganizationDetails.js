import React, { useState, useEffect } from 'react';
import {
    getOrganizationById,
    updateOrganization,
    removeChatFromOrganization,
    addChatToOrganization
} from '../../services/organizationService';
import { getAllChats, getIndividualChats, getGroupsOnly } from '../../services/chatService';
import OrganizationDocuments from './OrganizationDocuments';

const OrganizationDetails = ({ organization, onBack, onUpdate }) => {
    const [org, setOrg] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedChats, setAssignedChats] = useState([]);
    const [availableChats, setAvailableChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showChatSelector, setShowChatSelector] = useState(false);
    const [selectedChats, setSelectedChats] = useState([]);

    useEffect(() => {
        if (organization) {
            fetchData();
        }
    }, [organization]);

    const fetchData = async () => {
        try {
            // Get organization details
            const orgData = await getOrganizationById(organization._id);
            setOrg(orgData);
            setName(orgData.name);
            setDescription(orgData.description || '');

            // Get all chats and groups
            const [individualChats, groups] = await Promise.all([
                getIndividualChats(),
                getGroupsOnly()
            ]);

            // Combine and add type indicator
            const allChats = [
                ...individualChats.map(chat => ({ ...chat, type: 'chat' })),
                ...groups.map(group => ({ ...group, type: 'group' }))
            ];

            // Find assigned chats using chatIds array
            const assigned = allChats.filter(chat =>
                orgData.chatIds && orgData.chatIds.includes(chat.chatId)
            );

            // Find available chats (not assigned to this org)
            const available = allChats.filter(chat =>
                !orgData.chatIds || !orgData.chatIds.includes(chat.chatId)
            );

            setAssignedChats(assigned);
            setAvailableChats(available);
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

    const handleAddChats = async () => {
        if (selectedChats.length === 0) return;

        try {
            setLoading(true);

            // Process all selected chats
            const promises = selectedChats.map(chatId =>
                addChatToOrganization(org._id, chatId)
            );

            await Promise.all(promises);

            // Refresh data after adding chats
            await fetchData();

            // Reset selection
            setSelectedChats([]);
            setShowChatSelector(false);

        } catch (err) {
            setError('Failed to add chats. Please try again.');
            console.error('Error adding chats:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChat = (chatId) => {
        if (selectedChats.includes(chatId)) {
            setSelectedChats(selectedChats.filter(id => id !== chatId));
        } else {
            setSelectedChats([...selectedChats, chatId]);
        }
    };

    // Filter available chats based on search term
    const filteredAvailableChats = availableChats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && !org) {
        return <div className="p-4 text-center">Loading organization details...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!org) {
        return <div className="p-4 text-center">No organization selected</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">Assigned Chats ({assignedChats.length})</h4>
                            {!showChatSelector && (
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                    onClick={() => setShowChatSelector(true)}
                                >
                                    + Add Chats/Groups
                                </button>
                            )}
                        </div>

                        {assignedChats.length > 0 ? (
                            <div className="divide-y border rounded max-h-64 overflow-y-auto">
                                {assignedChats.map((chat) => (
                                    <div key={chat.chatId} className="p-3 flex justify-between items-center">
                                        <div className="flex items-center">
                                            <span
                                                className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                    chat.type === 'chat' ? 'bg-blue-500' : 'bg-green-500'
                                                }`}
                                            />
                                            <div>
                                                <div className="font-medium">{chat.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center">
                                                    <span className={`px-2 py-0.5 rounded text-white text-xs mr-2 ${
                                                        chat.type === 'chat' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`}>
                                                        {chat.type === 'chat' ? 'Chat' : 'Group'}
                                                    </span>
                                                    {chat.type === 'chat' ? 'Individual chat' : 'Group chat'}
                                                </div>
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
                            <div className="text-gray-500 text-sm border rounded p-4 text-center">
                                No chats assigned to this organization yet.
                            </div>
                        )}
                    </div>

                    {showChatSelector && (
                        <div className="mt-6 border rounded p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium">Select Chats & Groups</h4>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-sm"
                                        onClick={() => {
                                            setShowChatSelector(false);
                                            setSelectedChats([]);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className={`bg-blue-500 text-white px-3 py-1 rounded text-sm ${
                                            selectedChats.length === 0 || loading
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:bg-blue-600'
                                        }`}
                                        onClick={handleAddChats}
                                        disabled={selectedChats.length === 0 || loading}
                                    >
                                        {loading ? 'Adding...' : `Add Selected (${selectedChats.length})`}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search chats and groups..."
                                    className="w-full p-2 border rounded"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="divide-y border rounded bg-white max-h-80 overflow-y-auto">
                                {filteredAvailableChats.length > 0 ? (
                                    filteredAvailableChats.map((chat) => (
                                        <div
                                            key={chat.chatId}
                                            className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 ${
                                                selectedChats.includes(chat.chatId) ? 'bg-blue-50' : ''
                                            }`}
                                            onClick={() => handleSelectChat(chat.chatId)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-3"
                                                    checked={selectedChats.includes(chat.chatId)}
                                                    onChange={() => {}} // Handled by parent div click
                                                />
                                                <span
                                                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                        chat.type === 'chat' ? 'bg-blue-500' : 'bg-green-500'
                                                    }`}
                                                />
                                                <div>
                                                    <div className="font-medium">{chat.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center">
                                                        <span className={`px-2 py-0.5 rounded text-white text-xs mr-2 ${
                                                            chat.type === 'chat' ? 'bg-blue-500' : 'bg-green-500'
                                                        }`}>
                                                            {chat.type === 'chat' ? 'Chat' : 'Group'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        {searchTerm
                                            ? `No chats matching "${searchTerm}"`
                                            : 'No available chats or groups'
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <OrganizationDocuments organization={org} />
        </div>
    );
};

export default OrganizationDetails;