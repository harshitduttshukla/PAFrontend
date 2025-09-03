import React, { useState, useEffect } from 'react';

// TypeScript interfaces
interface Host {
  host_id: number;
  host_name: string;
  host_pan_number: string;
  rating: string;
  host_email: string;
  host_contact_number: string;
  gst_numbers?: string[];
  created_at?: string;
  updated_at?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse {
  hosts: Host[];
  pagination: PaginationData;
}

interface HostDetailModalProps {
  host: Host | null;
  isOpen: boolean;
  onClose: () => void;
}

// Backend API Functions
const hostAPI = {
  // Get all hosts with pagination
  getHosts: async (page: number = 1, limit: number = 10): Promise<ApiResponse> => {
    try {
      const response = await fetch(`http://localhost:5000/api/hosts?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hosts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching hosts:', error);
      throw error;
    }
  },

  // Get single host by ID
  getHostById: async (hostId: number): Promise<Host> => {
    try {
      const response = await fetch(`http://localhost:5000/api/hosts/${hostId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch host details');
      }
      const data = await response.json();
      return data.host;
    } catch (error) {
      console.error('Error fetching host details:', error);
      throw error;
    }
  },

  // Update host
  updateHost: async (hostId: number, hostData: Partial<Host>): Promise<Host> => {
    try {
      const response = await fetch(`http://localhost:5000/api/hosts/${hostId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(hostData)
      });
      if (!response.ok) {
        throw new Error('Failed to update host');
      }
      const data = await response.json();
      return data.host;
    } catch (error) {
      console.error('Error updating host:', error);
      throw error;
    }
  },

  // Delete host
  deleteHost: async (hostId: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:5000/api/hosts/${hostId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete host');
      }
    } catch (error) {
      console.error('Error deleting host:', error);
      throw error;
    }
  }
};

// Host Detail Modal Component
const HostDetailModal: React.FC<HostDetailModalProps> = ({ host, isOpen, onClose }) => {
  if (!isOpen || !host) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-90vh overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Host Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Host ID</label>
              <p className="text-lg font-semibold text-blue-600">#{host.host_id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Host Name</label>
              <p className="text-lg text-gray-900">{host.host_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">PAN Number</label>
              <p className="text-lg text-gray-900 font-mono">{host.host_pan_number}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Rating</label>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= parseFloat(host.rating) ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({host.rating}/5)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg text-gray-900">{host.host_email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600">Contact Number</label>
              <p className="text-lg text-gray-900">{host.host_contact_number}</p>
            </div>
            
            {host.gst_numbers && host.gst_numbers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-600">GST Numbers</label>
                <div className="space-y-1">
                  {host.gst_numbers.map((gst, index) => (
                    <p key={index} className="text-lg text-gray-900 font-mono">{gst}</p>
                  ))}
                </div>
              </div>
            )}
            
            {host.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Created At</label>
                <p className="text-sm text-gray-700">{new Date(host.created_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Host Data Table Component
export default function HostDataTable(): React.JSX.Element {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Fetch hosts data
  const fetchHosts = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      setError(null);
      const data = await hostAPI.getHosts(page, limit);
      setHosts(data.hosts);
      setPagination(data.pagination);
    } catch (err) {
      setError('Failed to load hosts data');
      console.error('Error fetching hosts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchHosts(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page
  };

  // Handle view details
  const handleViewDetails = async (hostId: number) => {
    try {
      const hostDetails = await hostAPI.getHostById(hostId);
      setSelectedHost(hostDetails);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching host details:', error);
      alert('Failed to load host details');
    }
  };

  // Handle edit (placeholder - you can implement edit modal)
  const handleEdit = (host: Host) => {
    alert(`Edit functionality for ${host.host_name} - Implement edit modal here`);
    // You can implement edit modal similar to detail modal
  };

  // Handle delete
  const handleDelete = async (host: Host) => {
    if (window.confirm(`Are you sure you want to delete ${host.host_name}?`)) {
      try {
        await hostAPI.deleteHost(host.host_id);
        fetchHosts(currentPage, itemsPerPage); // Refresh data
        alert('Host deleted successfully');
      } catch (error) {
        console.error('Error deleting host:', error);
        alert('Failed to delete host');
      }
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
   
  }

  if (error) {
  
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      

      {/* Main Content */}
      <div className="p-6">
        {/* Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Show</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-700">entries</span>
          </div>
          
          <div className="text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} entries
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">HOST NAME</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">PAN NUMBER</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">RATING</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">EMAIL</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">CONTACT</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host, index) => (
                <tr
                  key={host.host_id}
                  className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-3 px-4 text-gray-900">{host.host_name}</td>
                  <td className="py-3 px-4 text-gray-600 font-mono">{host.host_pan_number}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={star <= parseFloat(host.rating) ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-1 text-gray-600 text-sm">({host.rating})</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{host.host_email}</td>
                  <td className="py-3 px-4 text-gray-600">{host.host_contact_number}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(host.host_id)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(host)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(host)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} entries
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-l bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 border-t border-b border-r border-gray-300 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-r bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Host Detail Modal */}
      <HostDetailModal
        host={selectedHost}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedHost(null);
        }}
      />
    </div>
  );
}
