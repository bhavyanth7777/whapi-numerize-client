// src/contexts/SystemContext.js
import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const SystemContext = createContext(null);

export const SystemProvider = ({ children }) => {
    const [systemInfo, setSystemInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    const fetchSystemInfo = async (forceRefresh = false) => {
        // If we already have data and don't need a refresh, return the cached data
        if (systemInfo && !forceRefresh) {
            return systemInfo;
        }

        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/system/info');
            setSystemInfo(data);
            setLastFetched(new Date());
            return data;
        } catch (err) {
            setError('Failed to load system information');
            console.error('Error fetching system info:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshSystemInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.post('/system/info/update');
            setSystemInfo(data);
            setLastFetched(new Date());
            return data;
        } catch (err) {
            setError('Failed to update system information');
            console.error('Error updating system info:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <SystemContext.Provider
            value={{
                systemInfo,
                loading,
                error,
                lastFetched,
                fetchSystemInfo,
                refreshSystemInfo
            }}
        >
            {children}
        </SystemContext.Provider>
    );
};

export const useSystem = () => useContext(SystemContext);