import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Eye, Edit, FileText, Receipt, Trash2, MoreVertical } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; 

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

const ClientLast: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive' | 'all'>('active');
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients from API
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Replace this URL with your actual API endpoint
      const response = await fetch(`${API_BASE_URL}api/clients`); // Adjust this to your API endpoint
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setClients(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch clients');
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      // Fallback to mock data for demonstration
      setClients([
        { 
          id: 1, 
          client_name: "Demo Client 1", 
          email_address: "demo1@example.com", 
          phone_number: "123-456-7890",
          mobile_number: "987-654-3210",
          active: true,
          gst_no: "GSTIN123",
          street_address: "123 Demo St",
          street_address_2: "",
          city: "Demo City",
          state: "Demo State",
          zip_code: "12345",
          fax_number: "",
          web_address: "https://demo1.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Delete client
  const deleteClient = async (clientId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}api/deleteClient/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.message) {
        // Remove client from state
        setClients(prevClients => prevClients.filter(client => client.id !== clientId));
        alert('Client deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting client:', err);
      alert('Failed to delete client');
    }
  };

  // Update client status
  const updateClientStatus = async (clientId: number, active: boolean) => {
    try {
      const clientToUpdate = clients.find(c => c.id === clientId);
      if (!clientToUpdate) return;

      const response = await fetch(`${API_BASE_URL}api/updateClient/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...clientToUpdate,
          active: active
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update client in state
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === clientId ? { ...client, active } : client
          )
        );
        alert(`Client ${active ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (err) {
      console.error('Error updating client:', err);
      alert('Failed to update client');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    if (activeFilter === 'active') return client.active;
    if (activeFilter === 'inactive') return !client.active;
    return true;
  });

  const toggleDropdown = (clientId: number) => {
    setDropdownOpen(dropdownOpen === clientId ? null : clientId);
  };

  const handleMenuAction = (action: string, clientId: number, client: Client) => {
    console.log(`${action} action for client ${clientId}`);
    
    switch (action) {
      case 'view':
        // Navigate to client view page or show modal
        console.log('Viewing client:', client);
        break;
      case 'edit':
        // Navigate to client edit page or show modal
        console.log('Editing client:', client);
        break;
      case 'quote':
        // Navigate to create quote page
        console.log('Creating quote for client:', client);
        break;
      case 'invoice':
        // Navigate to create invoice page
        console.log('Creating invoice for client:', client);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${client.client_name}?`)) {
          deleteClient(clientId);
        }
        break;
      case 'toggle-status':
        updateClientStatus(clientId, !client.active);
        break;
      default:
        break;
    }
    
    setDropdownOpen(null);
  };

  const buttonclass = "p-2 text-gray-400 hover:text-gray-600 transition-colors";
  const thclassName = "text-left py-3 px-4 font-medium text-gray-700 text-sm";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Title and Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Clients</h1>
              {error && (
                <p className="text-sm text-red-600 mt-1">
                  {error} (Showing demo data)
                </p>
              )}
            </div>
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
                  Active ({clients.filter(c => c.active).length})
                </button>
                <button
                  onClick={() => setActiveFilter('inactive')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilter === 'inactive'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Inactive ({clients.filter(c => !c.active).length})
                </button>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${
                    activeFilter === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All ({clients.length})
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
              <button 
                onClick={() => console.log('Navigate to create new client')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                New
              </button>

              {/* Refresh Button */}
              <button 
                onClick={fetchClients}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
              >
                Refresh
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
                  <th className={thclassName}>Mobile Number</th>
                  <th className={thclassName}>City</th>
                  <th className={thclassName}>GST No</th>
                  <th className={thclassName}>Active</th>
                  <th className={thclassName}>Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 px-4 text-center text-gray-500">
                      No clients found matching the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                          {client.client_name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{client.email_address || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{client.phone_number || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{client.mobile_number || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{client.city || '-'}</td>
                      <td className="py-3 px-4 text-gray-600">{client.gst_no || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          client.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.active ? 'Active' : 'Inactive'}
                        </span>
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
                            <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  onClick={() => handleMenuAction('view', client.id, client)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Eye size={14} />
                                  View
                                </button>
                                <button
                                  onClick={() => handleMenuAction('edit', client.id, client)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleMenuAction('toggle-status', client.id, client)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit size={14} />
                                  {client.active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleMenuAction('quote', client.id, client)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <FileText size={14} />
                                  Create Quote
                                </button>
                                <button
                                  onClick={() => handleMenuAction('invoice', client.id, client)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Receipt size={14} />
                                  Create Invoice
                                </button>
                                <button
                                  onClick={() => handleMenuAction('delete', client.id, client)}
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
                  ))
                )}
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