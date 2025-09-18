import { useState, useEffect } from 'react';
import TableHeader from '../ui/TableHeader'
import Tablebody from '../ui/Tablebody'
import LableAndValue from '../ui/LableAndValue'
import { ChevronDown, Search, Plus, Edit, Eye, Trash2, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PropertyDashboard = () => {
  const [showEntries, setShowEntries] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(null);
  
  // New state for API integration
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });

  const Columns = [
    "Post ID",
    "City",
    "Locations",
    "Host Owner",
    "Address",
    "Landmark",
    "Type",
    "Name",
  ];

  // Fetch properties from API
  const fetchProperties = async (page = 1, limit = 30) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}api/properties?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const result = await response.json();
      
      setProperties(result.data || []);
      setPagination(result.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false
      });
      
    } catch (err:any) {
      setError(err.message);
      console.error('Error fetching properties:', err);
      // Fallback to empty array if API fails
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties(1, parseInt(showEntries));
  }, []);

  // Reload when showEntries changes
  useEffect(() => {
    fetchProperties(1, parseInt(showEntries));
  }, [showEntries]);

  // Filter data based on search term
  const filteredData = properties.filter(item =>
    Object.values(item).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOptionsClick = (index:any, e:any) => {
    e.stopPropagation();
    setShowOptionsDropdown(showOptionsDropdown === index ? null : index);
  };

  const handleEdit = (item:any) => {
    console.log('Edit item:', item);
    setShowOptionsDropdown(null);
    // You can implement edit functionality here
  };

  const handleView = (item:any) => {
    setSelectedProperty(item);
    setShowOptionsDropdown(null);
  };

  const handleDelete = async (item:any) => {
    if (!confirm(`Are you sure you want to delete property ${item.property_id }?`)) {
      return;
    }

    try {
      const propertyId = item.property_id ;
      const response = await fetch(`${API_BASE_URL}api/deleteProperty/${propertyId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete property');
      }
      
      const result = await response.json();
      alert(result.message || 'Property deleted successfully');
      
      // Refresh the data
      fetchProperties(pagination.currentPage, parseInt(showEntries));
      
    } catch (err:any) {
      setError(err.message);
      console.error('Error deleting property:', err);
      alert('Failed to delete property: ' + err.message);
    }
    
    setShowOptionsDropdown(null);
  };

  const PropertyDetailsModal = ({ property, onClose }:{
    property : any,
    onClose : any,
  }) => {
    if (!property) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 lg:p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-800">PROPERTY DETAILS</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <LableAndValue value={property.property_id} lable='Property Id'/>
              <LableAndValue value={property.city} lable='City'/>
              <LableAndValue value={property.property_status} lable='Status'/>
              {/* want to add */}
              <LableAndValue value={property.host} lable='Host'/>  
              <LableAndValue value={property.ivr_number} lable='IVR Number'/>  
              <LableAndValue value={property.contact_person} lable='Contact Person'/>   
              <LableAndValue value={property.contact_person} lable='Contact Person'/>
              <LableAndValue value={property.email_id} lable='Email-Id'/>
              <LableAndValue value={property.address1} lable='Address 1'/> 
              <LableAndValue value={property.address2} lable='Address 2'/> 
              <LableAndValue value={property.address3} lable='Address 3'/> 
              
              <div className="flex flex-col sm:flex-row">
                <span className="font-medium text-gray-700 w-full sm:w-32 mb-1 sm:mb-0">URL</span>
                <span className="text-blue-600 break-all">: 
                  {property.property_url ? (
                    <a href={property.property_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {property.property_url}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <LableAndValue value={property.post_id || property.postId} lable='Post Id'/>
              <LableAndValue value={property.location} lable='Location'/>
              <LableAndValue value={property.property_type} lable='Apartments Type'/>
              <LableAndValue value={property.contact_number || property.contactNo} lable='Contact No.'/>
              <LableAndValue value={property.landmark} lable='Landmark'/>
              <LableAndValue value={property.caretaker_name} lable='Caretaker Name'/>
              <LableAndValue value={property.caretaker_number} lable='Caretaker Number'/>
              <LableAndValue value={property.master_bedroom} lable='Master Bedroom'/>
              <LableAndValue value={property.common_bedroom} lable='Common bedroom'/>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-4 lg:px-6 py-2 rounded-md transition-colors text-sm lg:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      fetchProperties(pagination.currentPage - 1, parseInt(showEntries));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchProperties(pagination.currentPage + 1, parseInt(showEntries));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Reservation Records</h1>
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-700 transition-colors">Property Form</button>
            <button className="text-blue-600 hover:text-blue-700 transition-colors">Properties View</button>
            <button className="text-blue-600 hover:text-blue-700 transition-colors">Add Properties Price</button>
            <button className="text-blue-600 hover:text-blue-700 transition-colors">Reservation Form</button>
            <button className="text-blue-600 hover:text-blue-700 transition-colors">Reservation Records</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Show</span>
            <select
              className="border border-gray-300 rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={showEntries}
              onChange={(e) => setShowEntries(e.target.value)}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="text-gray-700">entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Search:</span>
            <div className="relative">
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-1 pl-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 absolute left-2 top-1.5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="text-lg text-gray-600">Loading properties...</div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <TableHeader Columns={Columns} />
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? filteredData.map((item:any, index) => (
                    <tr key={item.property_id || item.propertyId || index} className="hover:bg-gray-50 transition-colors">
                      <Tablebody value={item.post_id || item.postId || '0'}/>
                      <Tablebody value={item.city || 'N/A'}/>
                      <Tablebody value={item.location || 'N/A'}/>
                      <Tablebody value={item.contact_person || 'N/A'}/>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.address1 || 'N/A'}</td>
                      <Tablebody value={item.landmark || 'N/A'}/>
                      <Tablebody value={item.type || 'N/A'}/>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="relative">
                          <button
                            onClick={(e) => handleOptionsClick(index, e)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 transition-colors"
                          >
                            <span>Options</span>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          
                          {showOptionsDropdown === index && (
                            <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                              <button
                                onClick={() => handleEdit(item)}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleView(item)}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDelete(item)}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                        No properties found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Info and Controls */}
        {!loading && (
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * parseInt(showEntries)) + 1} to {Math.min(pagination.currentPage * parseInt(showEntries), pagination.totalItems)} of {pagination.totalItems} entries
            </div>
            
            {pagination.totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrev}
                  className={`px-3 py-1 rounded text-sm ${
                    pagination.hasPrev
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext}
                  className={`px-3 py-1 rounded text-sm ${
                    pagination.hasNext
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Property Details Modal */}
      <PropertyDetailsModal 
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* Click outside to close dropdown */}
      {showOptionsDropdown !== null && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setShowOptionsDropdown(null)}
        />
      )}
    </div>
  );
};

export default PropertyDashboard;