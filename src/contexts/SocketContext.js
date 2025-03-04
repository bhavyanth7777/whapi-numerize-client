import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(process.env.REACT_APP_SOCKET_URL);

        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected');
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const joinChat = (chatId) => {
        if (socket && isConnected) {
            socket.emit('join_chat', chatId);
        }
    };

    const leaveChat = (chatId) => {
        if (socket && isConnected) {
            socket.emit('leave_chat', chatId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, isConnected, joinChat, leaveChat }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);