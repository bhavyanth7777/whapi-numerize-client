import React from 'react';

const DocumentDetail = ({ document, onBack }) => {
    if (!document) {
        return <div className="p-4 text-center">No document selected</div>;
    }

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

    // Function to render tables from document transcription
    const renderTables = () => {
        if (!document.transcription?.tables || document.transcription.tables.length === 0) {
            return null;
        }

        return (
            <div className="mt-4">
                <h4 className="font-medium mb-2">Extracted Tables</h4>
                <div className="space-y-4">
                    {document.transcription.tables.map((table, tableIndex) => (
                        <div key={tableIndex} className="border rounded overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <tbody className="bg-white divide-y divide-gray-200">
                                {table.rows.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={row.isHeader ? 'bg-gray-50' : ''}>
                                        {row.cells.map((cell, cellIndex) => {
                                            const CellTag = row.isHeader ? 'th' : 'td';
                                            return (
                                                <CellTag
                                                    key={cellIndex}
                                                    className="px-3 py-2 text-sm text-gray-500 border"
                                                    rowSpan={cell.rowSpan}
                                                    colSpan={cell.colSpan}
                                                >
                                                    {cell.text}
                                                </CellTag>
                                            );
                                        })}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Function to render entities from document transcription
    const renderEntities = () => {
        if (!document.transcription?.entities || document.transcription.entities.length === 0) {
            return null;
        }

        return (
            <div className="mt-4">
                <h4 className="font-medium mb-2">Extracted Entities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {document.transcription.entities.map((entity, index) => (
                        <div key={index} className="border rounded p-2 bg-gray-50">
                            <div className="text-xs font-medium text-gray-500">{entity.type}</div>
                            <div>{entity.mentionText}</div>
                            <div className="text-xs text-gray-400">
                                Confidence: {(entity.confidence * 100).toFixed(1)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center">
                <button
                    className="mr-2 text-blue-500"
                    onClick={onBack}
                >
                    ← Back
                </button>
                <h2 className="text-xl font-semibold">Document Details</h2>
            </div>

            <div className="p-4">
                <div className="flex items-start mb-4">
                    <div className="text-3xl mr-4">
                        {getDocumentIcon(document.fileType)}
                    </div>
                    <div>
                        <h3 className="text-xl font-medium">{document.fileName}</h3>
                        <p className="text-gray-500">
                            From: {document.chat?.name || 'Unknown chat'}
                        </p>
                        <p className="text-sm text-gray-400">
                            Processed: {new Date(document.processedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="mb-4">
                    <a
                        href={document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        View Original File
                    </a>
                </div>

                {document.rawText && (
                    <div className="mb-4">
                        <h4 className="font-medium mb-2">Extracted Text</h4>
                        <div className="bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto whitespace-pre-wrap">
                            {document.rawText}
                        </div>
                    </div>
                )}

                {renderTables()}
                {renderEntities()}

                {document.transcription?.pages && document.transcription.pages.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-medium mb-2">Page Information</h4>
                        <div className="space-y-2">
                            {document.transcription.pages.map((page, pageIndex) => (
                                <div key={pageIndex} className="p-2 border rounded">
                                    <div className="font-medium">Page {page.pageNumber}</div>
                                    <div className="text-sm">
                                        Dimensions: {page.width} x {page.height}
                                    </div>
                                    <div className="text-sm">
                                        Blocks: {page.blocks?.length || 0}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocumentDetail;