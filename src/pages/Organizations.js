import React, { useState } from 'react';
import OrganizationList from '../components/OrganizationPanel/OrganizationList';
import OrganizationDetails from '../components/OrganizationPanel/OrganizationDetails';

const Organizations = () => {
    const [selectedOrganization, setSelectedOrganization] = useState(null);

    const handleSelectOrganization = (organization) => {
        setSelectedOrganization(organization);
    };

    const handleBack = () => {
        setSelectedOrganization(null);
    };

    const handleUpdate = (updatedOrg) => {
        // You might want to refresh the organization list here
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Organizations</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    {selectedOrganization ? (
                        <OrganizationDetails
                            organization={selectedOrganization}
                            onBack={handleBack}
                            onUpdate={handleUpdate}
                        />
                    ) : (
                        <OrganizationList onSelectOrganization={handleSelectOrganization} />
                    )}
                </div>

                {!selectedOrganization && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <div className="text-4xl mb-3">🏢</div>
                        <h3 className="text-xl font-medium mb-2">Manage Organizations</h3>
                        <p className="text-gray-500">
                            Create and manage organizations to categorize your WhatsApp chats and groups
                        </p>
                        <div className="mt-4 text-left p-4 bg-blue-50 rounded">
                            <h4 className="font-medium mb-2">Why use organizations?</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                <li>Group related chats together</li>
                                <li>Easily manage multiple client conversations</li>
                                <li>Organize by department, project, or client</li>
                                <li>Streamline team communication</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Organizations;