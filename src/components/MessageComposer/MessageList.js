import React, { useState, useEffect, useRef } from 'react';
import { getMessages, reactToMessage } from '../../services/messageService';
import { useSocket } from '../../contexts/SocketContext';
import { getDocumentsByChat } from '../../services/documentService';

const MessageList = ({ chatId, newMessage }) => {
    const [messages, setMessages] = useState([]);
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const { socket, joinChat, leaveChat } = useSocket();

    useEffect(() => {
        if (chatId) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);
                    const [messagesData, documentsData] = await Promise.all([
                        getMessages(chatId),
                        getDocumentsByChat(chatId)
                    ]);

                    setMessages(messagesData);

                    // Create a map of message ID to document
                    const docsMap = {};
                    documentsData.forEach(doc => {
                        if (doc.originalMessage) {
                            docsMap[doc.originalMessage._id] = doc;
                        }
                    });

                    setDocuments(docsMap);
                    setError(null);
                } catch (err) {
                    setError('Failed to load messages. Please try again.');
                    console.error('Error fetching messages:', err);
                } finally {
                    setLoading(false);
                }
            };

            fetchMessages();

            // Join socket room for this chat
            joinChat(chatId);

            return () => {
                // Leave socket room when component unmounts
                leaveChat(chatId);
            };
        }
    }, [chatId, joinChat, leaveChat]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Add new message to the list when received
        if (newMessage && newMessage.chat === chatId) {
            setMessages(prevMessages => [...prevMessages, newMessage]);
        }
    }, [newMessage, chatId]);

    useEffect(() => {
        if (socket) {
            // Listen for document processing events
            socket.on('document_processed', async (data) => {
                try {
                    // Refresh documents list
                    const documentsData = await getDocumentsByChat(chatId);

                    // Update documents map
                    const docsMap = {};
                    documentsData.forEach(doc => {
                        if (doc.originalMessage) {
                            docsMap[doc.originalMessage._id] = doc;
                        }
                    });

                    setDocuments(docsMap);
                } catch (err) {
                    console.error('Error refreshing documents:', err);
                }
            });

            return () => {
                socket.off('document_processed');
            };
        }
    }, [socket, chatId]);

    const handleReaction = async (messageId, emoji) => {
        try {
            await reactToMessage(chatId, messageId, emoji);

            // Update message in the list
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.messageId === messageId
                        ? {
                            ...msg,
                            reactions: [
                                ...msg.reactions.filter(r => r.userId !== 'me'),
                                { userId: 'me', emoji }
                            ]
                        }
                        : msg
                )
            );
        } catch (err) {
            console.error('Error adding reaction:', err);
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Loading messages...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    if (!chatId) {
        return <div className="p-4 text-center">Select a chat to view messages</div>;
    }

    if (messages.length === 0) {
        return <div className="p-4 text-center">No messages yet</div>;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => {
                const isMe = message.sender === 'me';
                const document = documents[message._id];

                return (
                    <div
                        key={message._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                                isMe ? 'bg-blue-100' : 'bg-white border'
                            }`}
                        >
                            <div className="text-xs text-gray-500 mb-1">
                                {isMe ? 'You' : message.sender}
                            </div>

                            {message.mediaType !== 'none' && (
                                <div className="mb-2">
                                    {message.mediaType === 'image' ? (
                                        <img
                                            src={message.mediaUrl}
                                            alt="Media"
                                            className="max-w-full rounded"
                                        />
                                    ) : (
                                        <div className="p-2 bg-gray-100 rounded flex items-center">
                                            <span className="mr-2">📎</span>
                                            <a
                                                href={message.mediaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                {message.mediaType} attachment
                                            </a>
                                        </div>
                                    )}

                                    {document && (
                                        <div className="mt-1 text-xs text-gray-500">
                                            {document.rawText ? (
                                                <div>
                                                    <div className="font-medium">Transcribed Content:</div>
                                                    <div className="mt-1 max-h-20 overflow-y-auto bg-gray-50 p-1 rounded">
                                                        {document.rawText.substring(0, 100)}
                                                        {document.rawText.length > 100 && '...'}
                                                    </div>
                                                </div>
                                            ) : (
                                                'Processing document...'
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {message.content && <div>{message.content}</div>}

                            {message.reactions.length > 0 && (
                                <div className="mt-1 flex space-x-1">
                                    {message.reactions.map((reaction, index) => (
                                        <span key={index} className="bg-white rounded-full px-1 text-xs">
                      {reaction.emoji}
                    </span>
                                    ))}
                                </div>
                            )}

                            <div className="mt-2 text-xs text-gray-500 flex justify-between">
                <span>
                  {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                  })}
                </span>

                                <div className="flex space-x-1">
                                    <button
                                        title="Like"
                                        onClick={() => handleReaction(message.messageId, '👍')}
                                        className="hover:bg-gray-100 rounded px-1"
                                    >
                                        👍
                                    </button>
                                    <button
                                        title="Love"
                                        onClick={() => handleReaction(message.messageId, '❤️')}
                                        className="hover:bg-gray-100 rounded px-1"
                                    >
                                        ❤️
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;