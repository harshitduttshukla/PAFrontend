import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Eye, Edit, FileText, Receipt, Trash2, MoreVertical } from 'lucide-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  balance: number;
  active: boolean;
}

const ClientLast: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);

  const clients: Client[] = [
    { id: 1, name: "Bridgestreet Singapore Pte Ltd", email: "", phone: "", balance: 0.00, active: true },
    { id: 2, name: "Fidelity Information Services India Pvt. Ltd.", email: "", phone: "", balance: 0.00, active: true },
    { id: 3, name: "Krysalis Consultancy Services P.Ltd", email: "", phone: "", balance: 0.00, active: true },
    { id: 4, name: "Porsche Centre Bengaluru", email: "", phone: "", balance: 0.00, active: true },
    { id: 5, name: "Rolls Royce Marine India Pvt. Ltd", email: "", phone: "", balance: 0.00, active: true },
    { id: 6, name: "100X Funding Simplified", email: "", phone: "", balance: 0.00, active: true },
    { id: 7, name: "2 Wishes Unlimited", email: "", phone: "", balance: 0.00, active: true },
    { id: 8, name: "20 Microns Limited", email: "", phone: "", balance: 0.00, active: true },
    { id: 9, name: "24 The Hour Productionz", email: "", phone: "", balance: 0.00, active: true },
    { id: 10, name: "Aarde Technosoft Pvt Ltd", email: "", phone: "", balance: 0.00, active: true },
    { id: 11, name: "Aarvi Encon Ltd.", email: "", phone: "", balance: 0.00, active: true },
    { id: 12, name: "ABS Instruments Pvt. Ltd.", email: "", phone: "", balance: 0.00, active: true },
  ];

  const filteredClients = clients.filter(client => {
    if (activeFilter === 'active') return client.active;
    if (activeFilter === 'inactive') return !client.active;
    return true;
  });

  const toggleDropdown = (clientId: number) => {
    setDropdownOpen(dropdownOpen === clientId ? null : clientId);
  };

  const handleMenuAction = (action: string, clientId: number) => {
    console.log(`${action} action for client ${clientId}`);
    setDropdownOpen(null);
  };

  const buttonclass = "p-2 text-gray-400 hover:text-gray-600 transition-colors";
  const thclassName="text-left py-3 px-4 font-medium text-gray-700 text-sm"
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Title and Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex items-center bg-gray-100 rounded-md">
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${
                    activeFilter === 'active'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setActiveFilter('inactive')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === 'inactive'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inactive
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center gap-1">

               
                <button className={buttonclass}>
                  <ChevronsLeft size={16} />
                </button>
                
                <button className={buttonclass}>
                  <ChevronLeft size={16} />
                </button>
                
                <button className={buttonclass}>

                  <ChevronRight size={16} />
                </button>
                
                <button className={buttonclass}>

                  <ChevronsRight size={16} />
                </button>
              </div>

              {/* New Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors">
                <Plus size={16} />
                New
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className={thclassName}>Client Name</th>
                  <th className={thclassName}>Email Address</th>
                  <th className={thclassName}>Phone Number</th>
                  <th className={thclassName}>Balance</th>
                  <th className={thclassName}>Active</th>
                  <th className={thclassName}>Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        {client.name}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{client.email}</td>
                    <td className="py-3 px-4 text-gray-600">{client.phone}</td>
                    <td className="py-3 px-4 text-gray-900">₹{client.balance.toFixed(2)}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {client.active ? 'Yes' : 'No'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="relative">
                        <button
                          onClick={() => toggleDropdown(client.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <MoreVertical size={14} />
                          Options
                        </button>
                        
                        {dropdownOpen === client.id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleMenuAction('view', client.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Eye size={14} />
                                View
                              </button>
                              <button
                                onClick={() => handleMenuAction('edit', client.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Edit size={14} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleMenuAction('quote', client.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <FileText size={14} />
                                Create Quote
                              </button>
                              <button
                                onClick={() => handleMenuAction('invoice', client.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Receipt size={14} />
                                Create Invoice
                              </button>
                              <button
                                onClick={() => handleMenuAction('delete', client.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(null)}
        />
      )}
    </div>
  );
};

export default ClientLast;