import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({
        chats: 0,
        groups: 0,
        organizations: 0,
        documents: 0
    });

    // This would normally fetch stats from your backend
    // For now, we'll use placeholders

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Chats</h2>
                    <p className="text-3xl font-bold text-blue-500">--</p>
                    <Link to="/chats" className="text-blue-500 text-sm hover:underline">
                        View all chats →
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Groups</h2>
                    <p className="text-3xl font-bold text-green-500">--</p>
                    <Link to="/chats" className="text-green-500 text-sm hover:underline">
                        View all groups →
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Organizations</h2>
                    <p className="text-3xl font-bold text-purple-500">--</p>
                    <Link to="/organizations" className="text-purple-500 text-sm hover:underline">
                        Manage organizations →
                    </Link>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Documents</h2>
                    <p className="text-3xl font-bold text-amber-500">--</p>
                    <Link to="/documents" className="text-amber-500 text-sm hover:underline">
                        Browse documents →
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            to="/chats"
                            className="bg-blue-100 hover:bg-blue-200 p-3 rounded flex items-center"
                        >
                            <span className="mr-2">💬</span>
                            <span>Manage Chats & Groups</span>
                        </Link>

                        <Link
                            to="/organizations"
                            className="bg-purple-100 hover:bg-purple-200 p-3 rounded flex items-center"
                        >
                            <span className="mr-2">🏢</span>
                            <span>Manage Organizations</span>
                        </Link>

                        <Link
                            to="/documents"
                            className="bg-amber-100 hover:bg-amber-200 p-3 rounded flex items-center"
                        >
                            <span className="mr-2">📄</span>
                            <span>Browse Documents</span>
                        </Link>

                        <a
                            href={`${process.env.REACT_APP_API_URL}/health`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-100 hover:bg-green-200 p-3 rounded flex items-center"
                        >
                            <span className="mr-2">🔍</span>
                            <span>Check API Status</span>
                        </a>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-4">System Information</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">WhatsApp Number:</span>
                            <span className="font-medium">Connected</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Whapi.cloud Status:</span>
                            <span className="font-medium text-green-500">Active</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-600">Document AI:</span>
                            <span className="font-medium">Configured</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Sync:</span>
                            <span className="font-medium">--</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;