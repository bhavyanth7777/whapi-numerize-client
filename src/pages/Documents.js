import React, { useState } from 'react';
import DocumentList from '../components/DocumentViewer/DocumentList';
import DocumentDetail from '../components/DocumentViewer/DocumentDetail';

const Documents = () => {
    const [selectedDocument, setSelectedDocument] = useState(null);

    const handleSelectDocument = (document) => {
        setSelectedDocument(document);
    };

    const handleBack = () => {
        setSelectedDocument(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Documents</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    {selectedDocument ? (
                        <DocumentDetail
                            document={selectedDocument}
                            onBack={handleBack}
                        />
                    ) : (
                        <DocumentList onSelectDocument={handleSelectDocument} />
                    )}
                </div>

                {!selectedDocument && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="text-4xl mb-3">📄</div>
                        <h3 className="text-xl font-medium mb-2">Document Processing</h3>
                        <p className="text-gray-500">
                            View and search transcribed documents from your WhatsApp chats
                        </p>
                        <div className="mt-4 text-left p-4 bg-amber-50 rounded">
                            <h4 className="font-medium mb-2">Document AI Features</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Automatic text extraction from images and PDFs</li>
                                <li>Table detection and extraction</li>
                                <li>Entity recognition for key information</li>
                                <li>Full-text search across all documents</li>
                                <li>Organize documents by chat or organization</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documents;