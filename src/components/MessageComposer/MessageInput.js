import React, { useState } from 'react';
import { sendMessage } from '../../services/messageService';

const MessageInput = ({ chatId, onMessageSent }) => {
    const [message, setMessage] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [mediaType, setMediaType] = useState('');
    const [quotedMessageId, setQuotedMessageId] = useState('');
    const [mentions, setMentions] = useState([]);
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((!message && !mediaUrl) || sending) {
            return;
        }

        try {
            setSending(true);

            const messageData = {
                text: message
            };

            if (mediaUrl) {
                messageData.mediaUrl = mediaUrl;
                messageData.mediaType = mediaType || 'image';
                messageData.caption = message;
            }

            if (quotedMessageId) {
                messageData.quotedMsgId = quotedMessageId;
            }

            if (mentions.length > 0) {
                messageData.mentions = mentions;
            }

            const sentMessage = await sendMessage(chatId, messageData);

            // Clear form
            setMessage('');
            setMediaUrl('');
            setMediaType('');
            setQuotedMessageId('');
            setMentions([]);
            setShowMediaOptions(false);

            // Notify parent component
            if (onMessageSent) {
                onMessageSent(sentMessage);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleAddMention = () => {
        const phoneNumber = prompt('Enter phone number to mention:');
        if (phoneNumber) {
            setMentions([...mentions, phoneNumber]);
            setMessage(`${message} @${phoneNumber} `);
        }
    };

    return (
        <div className="bg-white border-t p-3">
            {showMediaOptions && (
                <div className="mb-3 p-3 bg-gray-50 rounded">
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media URL
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="https://example.com/image.jpg"
                            value={mediaUrl}
                            onChange={(e) => setMediaUrl(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Media Type
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={mediaType}
                            onChange={(e) => setMediaType(e.target.value)}
                        >
                            <option value="image">Image</option>
                            <option value="document">Document</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>
                    <button
                        type="button"
                        className="text-sm text-red-500"
                        onClick={() => {
                            setShowMediaOptions(false);
                            setMediaUrl('');
                            setMediaType('');
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {quotedMessageId && (
                <div className="mb-3 p-2 bg-blue-50 rounded border-l-4 border-blue-500 flex justify-between">
                    <div>Replying to a message</div>
                    <button
                        type="button"
                        className="text-sm text-red-500"
                        onClick={() => setQuotedMessageId('')}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {mentions.length > 0 && (
                <div className="mb-3">
                    <div className="text-sm text-gray-500 mb-1">Mentioning:</div>
                    <div className="flex flex-wrap gap-1">
                        {mentions.map((mention, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 rounded text-sm"
                            >
                @{mention}
                                <button
                                    type="button"
                                    className="ml-1 text-red-500"
                                    onClick={() => {
                                        const newMentions = [...mentions];
                                        newMentions.splice(index, 1);
                                        setMentions(newMentions);
                                        setMessage(message.replace(`@${mention} `, ''));
                                    }}
                                >
                  ×
                </button>
              </span>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center">
                <div className="flex space-x-2 mr-2">
                    <button
                        type="button"
                        className="text-gray-500 hover:text-blue-500"
                        onClick={() => setShowMediaOptions(!showMediaOptions)}
                        title="Attach media"
                    >
                        📎
                    </button>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-blue-500"
                        onClick={handleAddMention}
                        title="Mention someone"
                    >
                        @
                    </button>
                </div>

                <input
                    type="text"
                    className="flex-1 p-2 border rounded-l"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <button
                    type="submit"
                    className={`p-2 rounded-r ${
                        sending || (!message && !mediaUrl)
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    disabled={sending || (!message && !mediaUrl)}
                >
                    {sending ? 'Sending...' : 'Send'}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;