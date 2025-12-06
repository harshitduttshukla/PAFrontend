import React from 'react';
import { X, MapPin, Phone, Mail, Globe, FileText, Building } from 'lucide-react';

interface Client {
    id: number;
    client_name: string;
    email_address: string;
    phone_number: string;
    mobile_number: string;
    active: boolean;
    gst_no: string;
    street_address: string;
    street_address_2: string;
    city: string;
    state: string;
    zip_code: string;
    fax_number: string;
    web_address: string;
    created_at: string;
    updated_at: string;
}

interface ClientViewModalProps {
    client: Client;
    isOpen: boolean;
    onClose: () => void;
}

const ClientViewModal: React.FC<ClientViewModalProps> = ({ client, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-full">
                                    <Building className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                                        {client.client_name}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${client.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {client.active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="text-sm text-gray-500">ID: {client.id}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider border-b pb-2">
                                    Contact Details
                                </h4>

                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                                        <p className="text-sm text-gray-600">{client.email_address || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Phone Numbers</p>
                                        <p className="text-sm text-gray-600">Mobile: {client.mobile_number || '-'}</p>
                                        <p className="text-sm text-gray-600">Landline: {client.phone_number || '-'}</p>
                                        <p className="text-sm text-gray-600">Fax: {client.fax_number || '-'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Website</p>
                                        {client.web_address ? (
                                            <a
                                                href={client.web_address.startsWith('http') ? client.web_address : `https://${client.web_address}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                {client.web_address}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-600">-</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider border-b pb-2">
                                    Address & Tax
                                </h4>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Address</p>
                                        <p className="text-sm text-gray-600">{client.street_address}</p>
                                        {client.street_address_2 && <p className="text-sm text-gray-600">{client.street_address_2}</p>}
                                        <p className="text-sm text-gray-600">
                                            {[client.city, client.state, client.zip_code].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">GST Information</p>
                                        <p className="text-sm text-gray-600">{client.gst_no || '-'}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientViewModal;
