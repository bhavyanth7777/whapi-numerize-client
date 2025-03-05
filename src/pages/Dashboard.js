// client/src/pages/Dashboard.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSystem } from '../contexts/SystemContext';

const Dashboard = () => {
    const { systemInfo, loading, error, fetchSystemInfo, lastFetched } = useSystem();

    useEffect(() => {
        // Only fetch if we don't already have the data
        if (!systemInfo) {
            fetchSystemInfo();
        }
    }, [systemInfo, fetchSystemInfo]);

    // Format the last sync time
    const formatLastSync = (lastSync) => {
        if (!lastSync) return '--';

        try {
            const date = new Date(lastSync);
            return date.toLocaleString();
        } catch (err) {
            return '--';
        }
    };

    // Format the last fetched time
    const formatLastFetched = () => {
        if (!lastFetched) return 'Never';
        return lastFetched.toLocaleString();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {loading && !systemInfo ? (
                <div className="text-center">Loading system information...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : systemInfo && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Chats</h2>
                            <p className="text-3xl font-bold text-blue-500">{systemInfo.stats.chats}</p>
                            <Link to="/chats?type=chats" className="text-blue-500 text-sm hover:underline">
                                View all chats →
                            </Link>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-2">Groups</h2>
                            <p className="text-3xl font-bold text-green-500">{systemInfo.stats.groups}</p>
                            <Link to="/chats?type=groups" className="text-green-500 text-sm hover:underline">
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
                            <p className="text-3xl font-bold text-amber-500">{systemInfo.stats.documents}</p>
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
                                    to="/chats?type=chats"
                                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded flex items-center"
                                >
                                    <span className="mr-2">💬</span>
                                    <span>Manage Individual Chats</span>
                                </Link>

                                <Link
                                    to="/chats?type=groups"
                                    className="bg-green-100 hover:bg-green-200 p-3 rounded flex items-center"
                                >
                                    <span className="mr-2">👥</span>
                                    <span>Manage Groups</span>
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
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="text-lg font-semibold mb-4">System Information</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">WhatsApp Account:</span>
                                    <div className="flex items-center">
                                        {systemInfo.profileIcon && (
                                            <img
                                                src={systemInfo.profileIcon}
                                                alt="Profile"
                                                className="w-6 h-6 rounded-full mr-2"
                                            />
                                        )}
                                        <span className="font-medium">{systemInfo.whatsappAccount}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Whapi.cloud Status:</span>
                                    <span className={`font-medium ${systemInfo.whapiStatus === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                                        {systemInfo.whapiStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Document AI:</span>
                                    <span className="font-medium">{systemInfo.documentAIStatus}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Last Sync:</span>
                                    <span className="font-medium">{formatLastSync(systemInfo.lastSync)}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-600">Data Last Fetched:</span>
                                    <span className="font-medium">{formatLastFetched()}</span>
                                </div>
                                {loading && (
                                    <div className="flex justify-center text-blue-500 text-sm pt-2">
                                        Refreshing data...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;