import  { useState } from 'react';
import TableHeader from '../ui/TableHeader'
import Tablebody from '../ui/Tablebody'
import LableAndValue from '../ui/LableAndValue'
import { ChevronDown, Search, Plus, Edit, Eye, Trash2, X } from 'lucide-react';
const PropertyDashboard = () => {
  const [showEntries, setShowEntries] = useState('10');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(null);

  const reservationData = [
    {
      postId: '23935',
      city: 'Thane',
      locations: 'Mumbai',
      host: 'Business Stay Solution',
      address: '701- IXORA, Hiranandani Meadows, Near Club House, Off Kashinath Ghanekar Road, Thane West 400604',
      landmark: 'Club House',
      type: '4 BHK',
      propertyId: '400604003',
      contactPerson: 'Karan',
      contactNo: '8879124830',
      email: 'poonam@businessstay.co.in',
      url: 'https://www.pajasaapartments.com/?p=8020'
    },
    {
      postId: '0',
      city: 'Thane',
      locations: '',
      host: 'Go BnB',
      address: 'D 103, 1st Floor, Vasant Fiona-D,Majiwade Vasant Fiona Eastern Express High way,near Jupitor Hospital, Thane 400601400601',
      landmark: '',
      type: '1 BHK',
      propertyId: '400601001',
      contactPerson: 'Rahul',
      contactNo: '9876543210',
      email: 'info@gobnb.co.in',
      url: ''
    },
    {
      postId: '0',
      city: 'Thane',
      locations: 'GB Road',
      host: 'Go BnB',
      address: 'F-2, 1703, Hyde Park,Near Hiranandani MeadowsThane, 400610400610',
      landmark: '',
      type: '3 BHK',
      propertyId: '400610002',
      contactPerson: 'Priya',
      contactNo: '9123456789',
      email: 'priya@gobnb.co.in',
      url: ''
    },
    {
      postId: '0',
      city: 'Rajkot',
      locations: 'Rajkot',
      host: 'Dev Abode',
      address: 'Dev Abode 41 New Jagnath Plot Dr. Yagnik Road360001',
      landmark: 'Dr. Yagnik Road',
      type: 'Studio',
      propertyId: '360001001',
      contactPerson: 'Dev',
      contactNo: '9988776655',
      email: 'dev@devabode.com',
      url: ''
    },
    {
      postId: '19813',
      city: 'Rajkot',
      locations: 'Rajkot',
      host: 'Demo Property',
      address: '360001',
      landmark: '',
      type: '1 BHK',
      propertyId: '360001002',
      contactPerson: 'Demo User',
      contactNo: '1234567890',
      email: 'demo@example.com',
      url: ''
    },
    {
      postId: '19817',
      city: 'Rajkot',
      locations: 'Rajkot',
      host: 'Demo Property',
      address: '360001',
      landmark: '',
      type: 'Studio',
      propertyId: '360001003',
      contactPerson: 'Demo User',
      contactNo: '1234567890',
      email: 'demo@example.com',
      url: ''
    },
    {
      postId: '3299',
      city: 'Pune',
      locations: 'Baner',
      host: 'Corporate Stays',
      address: 'Flat No. 304, 9- Shayadri Farms, 411045',
      landmark: 'opp Prabhavee Tech Park',
      type: '1 BHK',
      propertyId: '411045001',
      contactPerson: 'Amit',
      contactNo: '8765432109',
      email: 'amit@corporatestays.com',
      url: ''
    },
    {
      postId: '3289',
      city: 'Pune',
      locations: 'Baner',
      host: 'Corporate Stays',
      address: 'Flat No. 301, 9- Shayadri Farms, 411045',
      landmark: 'opp Prabhavee Tech Park',
      type: '1 BHK',
      propertyId: '411045002',
      contactPerson: 'Amit',
      contactNo: '8765432109',
      email: 'amit@corporatestays.com',
      url: ''
    },
    {
      postId: '3309',
      city: 'Pune',
      locations: 'Baner',
      host: 'Cozy Nest Service Apartments',
      address: 'Flat No. 201, B/H Ganaraj Mangal Karyalaya, 411045',
      landmark: 'Behind Ganaraj Mangal Karyalaya',
      type: '3 BHK',
      propertyId: '411045003',
      contactPerson: 'Neha',
      contactNo: '7654321098',
      email: 'neha@cozynest.com',
      url: ''
    }
  ];


    const Columns = [
    "Post ID",
    "City",
    "Locations",
    "Host",
    "Address",
    "Landmark",
    "Type",
    "Name",
  ];


  const filteredData = reservationData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOptionsClick = (index:any, e:any) => {
    e.stopPropagation();
    setShowOptionsDropdown(showOptionsDropdown === index ? null : index);
  };

  const handleEdit = (item:any) => {
    console.log('Edit item:', item);
    setShowOptionsDropdown(null);
  };

  const handleView = (item:any) => {
    setSelectedProperty(item);
    setShowOptionsDropdown(null);
  };

  const handleDelete = (item:any) => {
    console.log('Delete item:', item);
    setShowOptionsDropdown(null);
  };

  const PropertyDetailsModal = ({ property, onClose }) => {
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
              
              <LableAndValue value={property.propertyId} lable='Property Id'/>
              <LableAndValue value={property.city} lable='City'/>
              <LableAndValue value={property.host}lable='Host'/>
              <LableAndValue value={property.contactPerson}lable='Contact Person'/>
              <LableAndValue value={property.email}lable='Email-Id'/>
              {/* <LableAndValue value={}lable='Caretaker Name'/> */}
              <LableAndValue value={property.address}lable='Address'/>
              
              
              
              
            
              <div className="flex flex-col sm:flex-row">
                <span className="font-medium text-gray-700 w-full sm:w-32 mb-1 sm:mb-0">URL</span>
                <span className="text-blue-600 break-all">: 
                  {property.url ? (
                    <a href={property.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {property.url}
                    </a>
                  ) : (
                    'N/A'
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <LableAndValue value={property.postId}lable='Post Id'/>
              <LableAndValue value={property.locations}lable='Location'/>
              <LableAndValue value={property.type}lable='Apartments Type'/>
              <LableAndValue value={property.contactNo}lable='Contact No.'/>
              <LableAndValue value={property.landmark}lable='Landmark'/>
              {/* <LableAndValue value={property.landmark}lable='Care Taker No.'/> */}
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      

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

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHeader Columns={Columns} />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, parseInt(showEntries)).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.postId}</td> */}
                    <Tablebody value={item.postId}/>
                    <Tablebody value={item.city}/>
                    <Tablebody value={item.locations}/>
                    <Tablebody value={item.host}/>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.address}</td>
                    <Tablebody value={item.landmark}/>
                    <Tablebody value={item.type}/>
                    
                  
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info */}
        <div className="mt-4 text-sm text-gray-700">
          Showing 1 to {Math.min(parseInt(showEntries), filteredData.length)} of {filteredData.length} entries
        </div>
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

