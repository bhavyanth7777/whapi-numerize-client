import React, { useState, useEffect } from 'react';
import { getAllDocuments } from '../../services/documentService';

const DocumentList = ({ onSelectDocument }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const data = await getAllDocuments();
            setDocuments(data);
            setError(null);
        } catch (err) {
            setError('Failed to load documents. Please try again.');
            console.error('Error fetching documents:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDocuments = documents.filter(doc =>
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.rawText?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getDocumentIcon = (fileType) => {
        switch (fileType) {
            case 'image':
                return '🖼️';
            case 'pdf':
                return '📄';
            case 'doc':
                return '📝';
            default:
                return '📁';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Documents</h2>
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Search documents..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-4 text-center">Loading documents...</div>
            ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
            ) : (
                <div className="divide-y overflow-y-auto max-h-96">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <div
                                key={doc._id}
                                className="p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => onSelectDocument(doc)}
                            >
                                <div className="flex items-start">
                                    <div className="text-2xl mr-3">
                                        {getDocumentIcon(doc.fileType)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{doc.fileName}</h3>
                                        <p className="text-sm text-gray-500">
                                            From: {doc.chat?.name || 'Unknown chat'}
                                        </p>
                                        {doc.rawText && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {doc.rawText.substring(0, 100)}
                                                {doc.rawText.length > 100 && '...'}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(doc.processedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            {searchTerm
                                ? `No documents found matching "${searchTerm}"`
                                : 'No documents processed yet'}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentList;