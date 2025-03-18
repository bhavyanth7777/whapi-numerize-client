import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { analyzeDocument } from '../../services/documentService';

const MediaModal = ({ mediaItem, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [media, setMedia] = useState(null);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzeError, setAnalyzeError] = useState(null);

    useEffect(() => {
        const fetchMedia = async () => {
            if (!mediaItem || !mediaItem.fileId) return;

            try {
                setLoading(true);

                // Make API call to download the media using fileId
                const response = await api.get(`/media/${mediaItem.fileId}`, {
                    responseType: 'arraybuffer'
                });

                // Convert array buffer to data URL for display
                const contentType = response.headers['content-type'] || getDefaultContentType(mediaItem.fileName);
                const blob = new Blob([response.data], { type: contentType });
                const dataUrl = URL.createObjectURL(blob);

                setMedia({
                    dataUrl,
                    contentType,
                    fileName: mediaItem.fileName
                });
            } catch (err) {
                console.error('Error fetching media:', err);
                setError('Failed to load media');
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();

        // Cleanup function to revoke object URL when component unmounts
        return () => {
            if (media && media.dataUrl) {
                URL.revokeObjectURL(media.dataUrl);
            }
        };
    }, [mediaItem]);

    // Helper function to guess content type from filename
    const getDefaultContentType = (fileName) => {
        if (!fileName) return 'application/octet-stream';

        const extension = fileName.split('.').pop().toLowerCase();

        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'pdf':
                return 'application/pdf';
            case 'doc':
            case 'docx':
                return 'application/msword';
            case 'xls':
            case 'xlsx':
                return 'application/vnd.ms-excel';
            case 'ppt':
            case 'pptx':
                return 'application/vnd.ms-powerpoint';
            default:
                return 'application/octet-stream';
        }
    };

    const handleAnalyzeDocument = async () => {
        if (!mediaItem || !mediaItem.fileId) return;
        
        try {
            setAnalyzing(true);
            setAnalyzeError(null);
            
            const result = await analyzeDocument(mediaItem.fileId);
            setParsedData(result);
        } catch (err) {
            console.error('Error analyzing document:', err);
            setAnalyzeError('Failed to analyze document');
        } finally {
            setAnalyzing(false);
        }
    };

    // Render media content based on type
    const renderMedia = () => {
        if (!media) return null;

        if (media.contentType.startsWith('image/')) {
            return (
                <div className="flex justify-center">
                    <img
                        src={media.dataUrl}
                        alt={media.fileName}
                        className="max-w-full max-h-[70vh] object-contain"
                    />
                </div>
            );
        } else if (media.contentType === 'application/pdf') {
            return (
                <div className="h-[70vh]">
                    <iframe
                        src={media.dataUrl}
                        title={media.fileName}
                        className="w-full h-full border-0"
                    />
                </div>
            );
        } else {
            // For all other file types
            return (
                <div className="p-8 bg-gray-100 rounded text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <p className="text-xl mb-4">{media.fileName}</p>
                    <a
                        href={media.dataUrl}
                        download={media.fileName}
                        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
                    >
                        Download File
                    </a>
                </div>
            );
        }
    };

    // Render parsed data
    const renderParsedData = () => {
        if (!parsedData) return null;

        return (
            <div className="p-4 bg-gray-50 rounded-lg border mt-4">
                <h3 className="text-lg font-medium mb-2">Document AI Analysis</h3>
                
                {Object.keys(parsedData.parsedData).length > 0 ? (
                    <div className="overflow-auto max-h-[50vh]">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="text-left p-2 border-b">Field</th>
                                    <th className="text-left p-2 border-b">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(parsedData.parsedData).map(([key, value]) => (
                                    <tr key={key} className="border-b">
                                        <td className="p-2 font-medium">{key}</td>
                                        <td className="p-2">{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">No data could be extracted from this document.</p>
                )}
                
                {parsedData.confidence !== null && (
                    <p className="text-sm text-gray-500 mt-2">
                        Confidence score: {(parsedData.confidence * 100).toFixed(2)}%
                    </p>
                )}
            </div>
        );
    };

    if (!mediaItem) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-medium truncate">{mediaItem.fileName}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 flex-grow overflow-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 p-4">
                            {error}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {renderMedia()}
                            </div>
                            <div>
                                {parsedData ? (
                                    renderParsedData()
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        {analyzing ? (
                                            <div className="text-center">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                                                <p>Analyzing document...</p>
                                            </div>
                                        ) : (
                                            <>
                                                {analyzeError && (
                                                    <p className="text-red-500 mb-4">{analyzeError}</p>
                                                )}
                                                <button
                                                    onClick={handleAnalyzeDocument}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                >
                                                    Analyze with Document AI
                                                </button>
                                                <p className="text-sm text-gray-500 mt-4 text-center">
                                                    Click to extract information from this document using Google Document AI
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">From: {mediaItem.chatName}</p>
                        </div>
                        {media && (
                            <a
                                href={media.dataUrl}
                                download={media.fileName}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                            >
                                Download
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaModal;