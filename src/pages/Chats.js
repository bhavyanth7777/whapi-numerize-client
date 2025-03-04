// client/src/pages/Chats.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatsList from '../components/ChatsPanel/ChatsList';
import ChatDetails from '../components/ChatsPanel/ChatDetails';
import MessageList from '../components/MessageComposer/MessageList';
import MessageInput from '../components/MessageComposer/MessageInput';

const Chats = () => {
    const location = useLocation();
    const [selectedChat, setSelectedChat] = useState(null);
    const [showChatDetails, setShowChatDetails] = useState(false);
    const [newMessage, setNewMessage] = useState(null);

    // Check if we should show only groups or only chats based on the URL query
    const queryParams = new URLSearchParams(location.search);
    const showGroupsOnly = queryParams.get('type') === 'groups';
    const showChatsOnly = queryParams.get('type') === 'chats';

    // Determine the page title based on what we're showing
    const pageTitle = showGroupsOnly
        ? "Groups"
        : (showChatsOnly ? "Individual Chats" : "Chats & Groups");

    // Reset selected chat when changing between chats and groups views
    useEffect(() => {
        setSelectedChat(null);
        setShowChatDetails(false);
    }, [showGroupsOnly, showChatsOnly]);

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setShowChatDetails(false);
    };

    const handleMessageSent = (message) => {
        setNewMessage(message);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                    {showChatDetails && selectedChat ? (
                        <ChatDetails
                            chatId={selectedChat.chatId}
                            onBack={() => setShowChatDetails(false)}
                        />
                    ) : (
                        <ChatsList
                            onChatSelect={handleChatSelect}
                            showGroupsOnly={showGroupsOnly}
                            showChatsOnly={showChatsOnly}
                        />
                    )}
                </div>

                <div className="lg:col-span-2">
                    {selectedChat ? (
                        <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-160px)]">
                            <div className="p-3 border-b flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                        {selectedChat.profilePicture ? (
                                            <img
                                                src={selectedChat.profilePicture}
                                                alt={selectedChat.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-lg text-gray-500">
                        {selectedChat.name.charAt(0).toUpperCase()}
                      </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{selectedChat.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {selectedChat.isGroup ? 'Group' : 'Individual chat'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    className="text-blue-500 hover:text-blue-700"
                                    onClick={() => setShowChatDetails(true)}
                                >
                                    Details
                                </button>
                            </div>

                            <MessageList
                                chatId={selectedChat.chatId}
                                newMessage={newMessage}
                            />

                            <MessageInput
                                chatId={selectedChat.chatId}
                                onMessageSent={handleMessageSent}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-4xl mb-3">💬</div>
                            <h3 className="text-xl font-medium mb-2">Select a {showGroupsOnly ? 'Group' : 'Chat'}</h3>
                            <p className="text-gray-500">
                                Choose a {showGroupsOnly ? 'group' : 'chat'} from the list to start messaging
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chats;