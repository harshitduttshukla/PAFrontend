import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import FormInput from '../../ui/FormInput';
import FormSelect from '../../ui/FormSelect';
import FormTextarea from '../../ui/FormTextarea';

interface HostData {
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  properties: string;
  rating: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

interface PropertyFormData {
  propertyStatus: string;
  hostName: string;
  ivrNumber: string;
  pinCode: string;
  manualPinCode: string;
  city: string;
  location: string;
  postId: string;
  propertyType: string;
  manualHostName: string;
  contactPerson: string;
  contactNumber: string;
  emailId: string;
  caretakerName: string;
  caretakerNumber: string;
  note: string;
  checkInTime: string;
  checkOutTime: string;
  masterBedroom: string;
  commonBedroom: string;
  landmark: string;
  address1: string;
  address2: string;
  address3: string;
  thumbnail: string;
  propertyUrl: string;
}

const PropertyForm: React.FC = () => {
  
  const [selectedHost, setSelectedHost] = useState<string>('');
  const [showHostInfo, setShowHostInfo] = useState<boolean>(false);

  const [formData, setFormData] = useState<PropertyFormData>({
    propertyStatus: '',
    hostName: '',
    ivrNumber: '',
    pinCode: '',
    manualPinCode: '',
    city: '',
    location: '',
    postId: '',
    propertyType: '',
    manualHostName: '',
    contactPerson: '',
    contactNumber: '',
    emailId: '',
    caretakerName: '',
    caretakerNumber: '',
    note: '',
    checkInTime: '',
    checkOutTime: '',
    masterBedroom: '0',
    commonBedroom: '0',
    landmark: '',
    address1: '',
    address2: '',
    address3: '',
    thumbnail: '',
    propertyUrl: ''
  });

  const hostData: Record<string, HostData> = {
    'john_doe': {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, New York, NY',
      joinDate: '2023-01-15',
      properties: '5',
      rating: '4.8/5',
      status: 'Active',
      lastLogin: '2024-01-15 09:30 AM'
    },
    'jane_smith': {
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1-555-0124',
      address: '456 Oak Ave, Los Angeles, CA',
      joinDate: '2023-03-22',
      properties: '3',
      rating: '4.6/5',
      status: 'Active',
      lastLogin: '2024-01-14 02:15 PM'
    },
    'mike_johnson': {
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1-555-0125',
      address: '789 Pine Rd, Chicago, IL',
      joinDate: '2023-02-10',
      properties: '7',
      rating: '4.9/5',
      status: 'Active',
      lastLogin: '2024-01-13 11:45 AM'
    },
    'sarah_wilson': {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1-555-0126',
      address: '321 Elm St, Miami, FL',
      joinDate: '2023-05-18',
      properties: '2',
      rating: '4.4/5',
      status: 'Active',
      lastLogin: '2024-01-12 07:20 PM'
    },
    'david_brown': {
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1-555-0127',
      address: '654 Maple Dr, Seattle, WA',
      joinDate: '2023-04-05',
      properties: '4',
      rating: '4.7/5',
      status: 'Inactive',
      lastLogin: '2024-01-10 03:45 PM'
    }
  };


  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHostSelection = (hostKey: string) => {
    setSelectedHost(hostKey);
    setFormData(prev => ({ ...prev, hostName: hostKey }));
    
    if (hostKey && hostData[hostKey]) {
      const host = hostData[hostKey];
      setFormData(prev => ({
        ...prev,
        contactPerson: host.name,
        contactNumber: host.phone.replace('+1-', ''),
        emailId: host.email
      }));
      setShowHostInfo(true);
    } else {
      setFormData(prev => ({
        ...prev,
        contactPerson: '',
        contactNumber: '',
        emailId: ''
      }));
      setShowHostInfo(false);
    }
  };

  const handlePinCodeChange = (pinCode: string) => {
    setFormData(prev => ({ ...prev, pinCode }));
    
    const pinOptions: Record<string, string> = {
      '110001': 'New Delhi',
      '400001': 'Mumbai',
      '560001': 'Bangalore',
      '600001': 'Chennai',
      '700001': 'Kolkata'
    };

    if (pinOptions[pinCode]) {
      setFormData(prev => ({
        ...prev,
        city: pinOptions[pinCode],
        manualPinCode: pinCode
      }));
    }
  };

  const handleSave = () => {
    alert('Property saved successfully!\n\nData: ' + JSON.stringify(formData, null, 2));
    console.log('Saved property data:', formData);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setFormData({
        propertyStatus: '',
        hostName: '',
        ivrNumber: '',
        pinCode: '',
        manualPinCode: '',
        city: '',
        location: '',
        postId: '',
        propertyType: '',
        manualHostName: '',
        contactPerson: '',
        contactNumber: '',
        emailId: '',
        caretakerName: '',
        caretakerNumber: '',
        note: '',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        masterBedroom: '0',
        commonBedroom: '0',
        landmark: '',
        address1: '',
        address2: '',
        address3: '',
        thumbnail: '',
        propertyUrl: ''
      });
      setSelectedHost('');
      setShowHostInfo(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      

      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Property Form</h2>
          <div className="flex space-x-3">
            <button 
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 font-medium"
            >
              <Check className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button 
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 hover:-translate-y-0.5 font-medium"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-blue-500">
            PROPERTY DETAILS
          </h3>

          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">PROPERTY STATUS</label>
              <select 
                value={formData.propertyStatus}
                onChange={(e) => handleInputChange('propertyStatus', e.target.value)}
                // repatie this css multpile time 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white"
              >
                <option value="">Select Property Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
                <option value="booked">Booked</option>
              </select>
            </div> */}

             <FormSelect
              label="PROPERTY STATUS"
              value={formData.propertyStatus}
              onChange={e => handleInputChange('propertyStatus', e.target.value)}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'maintenance', label: 'Under Maintenance' },
                { value: 'booked', label: 'Booked' }
              ]}
            />

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">HOST NAME</label>
              <select 
                value={selectedHost}
                onChange={(e) => handleHostSelection(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white"
              >
                <option value="">--Select Host Name--</option>
                {Object.entries(hostData).map(([key, host]) => (
                  <option key={key} value={key}>{host.name}</option>
                ))}
              </select>

              {/* Host Information Panel */}
              {showHostInfo && selectedHost && hostData[selectedHost] && (
                <div className="mt-4 p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(hostData[selectedHost]).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className={`text-sm font-medium ${
                          key === 'status' 
                            ? value === 'Active' ? 'text-green-600' : 'text-red-600'
                            : 'text-gray-800'
                        }`}>
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

           
            <FormInput
            label="IVR"
            value={formData.ivrNumber}
            onChange={(e) => handleInputChange("ivrNumber", e.target.value)}
            placeholder="Enter IVR Number"
            />

          </div>

          {/* Location Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">PIN CODE</label>
              <select 
                value={formData.pinCode}
                onChange={(e) => handlePinCodeChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white"
              >
                <option value="">Select Pin Code</option>
                <option value="110001">110001 - New Delhi</option>
                <option value="400001">400001 - Mumbai</option>
                <option value="560001">560001 - Bangalore</option>
                <option value="600001">600001 - Chennai</option>
                <option value="700001">700001 - Kolkata</option>
              </select>
            </div> */}

             <FormSelect
              label="PIN CODE"
              value={formData.pinCode}
              onChange={e => handlePinCodeChange(e.target.value)}
              options={[
                { value: '110001', label: '110001 - New Delhi' },
                { value: '400001', label: '400001 - Mumbai' },
                { value: '560001', label: '560001 - Bangalore' },
                { value: '600001', label: '600001 - Chennai' },
                { value: '700001', label: '700001 - Kolkata' }
              ]}
            />
            

            <FormInput
                label="PIN CODE"
                value={formData.manualPinCode}
                onChange={(e) => handleInputChange("manualPinCode", e.target.value)}
                placeholder="Enter Pin Code"
                />

            <FormInput
                label="CITY"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter City"
            />


           <FormInput
                label="LOCATION"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter Location"
            />

            

             <FormInput
              label="POST ID"
              value={formData.postId}
              onChange={e => handleInputChange('postId', e.target.value)}
              placeholder="Enter Post ID"
            />
          
          </div>


          {/* Property and Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            
                <FormSelect
              label="PROPERTY TYPE"
              value={formData.propertyType}
              onChange={e => handleInputChange('propertyType', e.target.value)}
              options={[
                { value: 'apartment', label: 'Apartment' },
                { value: 'house', label: 'House' },
                { value: 'villa', label: 'Villa' },
                { value: 'studio', label: 'Studio' },
                { value: 'penthouse', label: 'Penthouse' }
              ]}
            />
           


            <FormInput
              label="HOST NAME (Manual)"
              value={formData.manualHostName}
              onChange={e => handleInputChange('manualHostName', e.target.value)}
              placeholder="Enter Host Name"
            />

           

             <FormInput
              label="CONTACT PERSON"
              value={formData.contactPerson}
              onChange={e => handleInputChange('contactPerson', e.target.value)}
              placeholder="Enter Contact Person"
            />

           <FormInput
              label="CONTACT NUMBER"
              type="tel"
              value={formData.contactNumber}
              onChange={e => handleInputChange('contactNumber', e.target.value)}
              placeholder="Enter Contact Number"
            />

             <FormInput
              label="EMAIL ID"
              type="email"
              value={formData.emailId}
              onChange={e => handleInputChange('emailId', e.target.value)}
              placeholder="Enter Email ID"
            />
          </div>

          {/* Caretaker and Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <FormInput
              label="CARETAKER NAME"
              value={formData.caretakerName}
              onChange={e => handleInputChange('caretakerName', e.target.value)}
              placeholder="Enter Care Taker Name"
            />

             <FormInput
              label="CARETAKER NO."
              type="tel"
              value={formData.caretakerNumber}
              onChange={e =>
                handleInputChange('caretakerNumber', e.target.value)
              }
              placeholder="Enter CareTaker Ph.No"
            />

            <FormTextarea
              label="NOTE"
              value={formData.note}
              onChange={e => handleInputChange('note', e.target.value)}
              placeholder="Note"
            />
          </div>

          {/* Times and Bedrooms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">CHECK-IN/OUT TIMES</label>
              <div className="grid grid-cols-2 gap-4">
               

                 <FormInput
                  label="C.I.T"
                  type="time"
                  value={formData.checkInTime}
                  onChange={e => handleInputChange('checkInTime', e.target.value)}
                />


               <FormInput
                  label="C.O.T"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={e => handleInputChange('checkOutTime', e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-2">BEDROOM CONFIGURATION</label>
              <div className="grid grid-cols-2 gap-4">
                
                 <FormSelect
                  label="Master Bedroom"
                  value={formData.masterBedroom}
                  onChange={e =>
                    handleInputChange('masterBedroom', e.target.value)
                  }
                  options={[0, 1, 2, 3, 4, 5].map(num => ({
                    value: num.toString(),
                    label: num === 5 ? '5+' : num.toString()
                  }))}
                />
                
                 <FormSelect
                  label="Common Bedroom"
                  value={formData.commonBedroom}
                  onChange={e =>
                    handleInputChange('commonBedroom', e.target.value)
                  }
                  options={[0, 1, 2, 3, 4, 5].map(num => ({
                    value: num.toString(),
                    label: num === 5 ? '5+' : num.toString()
                  }))}
                />



              </div>
            </div>

           <div className='mt-7'>
            <FormInput
              label="LANDMARK"
              value={formData.landmark}
              onChange={e => handleInputChange('landmark', e.target.value)}
              placeholder="Enter Landmark"
            />
           </div>
          </div>

          {/* Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              

             <FormInput
              label="ADDRESS LINE 1"
              value={formData.address1}
              onChange={e => handleInputChange('address1', e.target.value)}
              placeholder="Enter Property Address-1"
            />
          
               <FormInput
              label="ADDRESS LINE 2"
              value={formData.address2}
              onChange={e => handleInputChange('address2', e.target.value)}
              placeholder="Enter Property Address-2"
            />
            </div>
            <div className="space-y-6">
              <FormInput
              label="ADDRESS LINE 3"
              value={formData.address3}
              onChange={e => handleInputChange('address3', e.target.value)}
              placeholder="Enter Property Address-3"
            />
              
               <FormInput
              label="THUMBNAIL"
              value={formData.thumbnail}
              onChange={e => handleInputChange('thumbnail', e.target.value)}
              placeholder="Enter Property Thumbnail"
            />

            </div>
          </div>

          {/* Property URL */}
          <div className="mb-8">
            

              <FormInput
              label="PROPERTY URL"
              value={formData.propertyUrl}
              onChange={e => handleInputChange('propertyUrl', e.target.value)}
              placeholder="Enter Property URL"
            />
          </div>
        </div>
      </div> 
    </div>
  );
};

export default PropertyForm;












