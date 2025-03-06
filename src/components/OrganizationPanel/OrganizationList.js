// src/components/OrganizationPanel/OrganizationList.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OrganizationList = ({ onSelectOrganization, refreshCounter = 0 }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newOrgName, setNewOrgName] = useState('');
    const [newOrgDescription, setNewOrgDescription] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchOrganizations();
    }, [refreshCounter]); // Re-fetch when refreshCounter changes

    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/organizations');
            setOrganizations(data);
            setError(null);
        } catch (err) {
            setError('Failed to load organizations. Please try again.');
            console.error('Error fetching organizations:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrganization = async (e) => {
        e.preventDefault();

        if (!newOrgName.trim()) {
            return;
        }

        try {
            const { data: newOrg } = await api.post('/organizations', {
                name: newOrgName,
                description: newOrgDescription
            });

            setOrganizations([...organizations, newOrg]);
            setNewOrgName('');
            setNewOrgDescription('');
            setShowForm(false);
        } catch (err) {
            setError('Failed to create organization. Please try again.');
            console.error('Error creating organization:', err);
        }
    };

    const handleDeleteOrganization = async (id) => {
        if (!window.confirm('Are you sure you want to delete this organization?')) {
            return;
        }

        try {
            await api.delete(`/organizations/${id}`);
            setOrganizations(organizations.filter(org => org._id !== id));
        } catch (err) {
            setError('Failed to delete organization. Please try again.');
            console.error('Error deleting organization:', err);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Organizations</h2>
                <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ New'}
                </button>
            </div>

            {showForm && (
                <div className="p-4 border-b">
                    <form onSubmit={handleCreateOrganization}>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded"
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full p-2 border rounded"
                                value={newOrgDescription}
                                onChange={(e) => setNewOrgDescription(e.target.value)}
                                rows="2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create
                        </button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="p-4 text-center">Loading organizations...</div>
            ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
                <div className="divide-y">
                    {organizations.length > 0 ? (
                        organizations.map((org) => (
                            <div
                                key={org._id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onSelectOrganization(org)}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{org.name}</h3>
                                        {org.description && (
                                            <p className="text-sm text-gray-500 mt-1">{org.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {org.chatIds ? org.chatIds.length : 0} chats assigned
                                        </p>
                                    </div>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteOrganization(org._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No organizations yet. Create one to get started.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizationList;