// src/components/Header.js
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSystem } from '../contexts/SystemContext';

const Header = () => {
    const { refreshSystemInfo, loading } = useSystem();

    const handleUpdateSystemInfo = async () => {
        try {
            await refreshSystemInfo();
            // Optional: Show success notification
            alert('System information updated successfully');
        } catch (error) {
            // Error handling is done in the context
        }
    };

    return (
        <nav className="bg-white shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-blue-600">
                            Numerize AP Automation
                        </Link>
                    </div>
                    <div className="flex space-x-4 items-center">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                            }
                            end
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/chats"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                            }
                        >
                            Chats
                        </NavLink>

                        <NavLink
                            to="/organizations"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                            }
                        >
                            Organizations
                        </NavLink>

                        <NavLink
                            to="/documents"
                            className={({ isActive }) =>
                                isActive ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                            }
                        >
                            Documents
                        </NavLink>

                        {/* Update button */}
                        <button
                            onClick={handleUpdateSystemInfo}
                            disabled={loading}
                            className={`ml-4 px-3 py-1 ${loading ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'} text-sm rounded-md flex items-center`}
                        >
                            <span className="mr-1">{loading ? '⏳' : '⟳'}</span>
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;