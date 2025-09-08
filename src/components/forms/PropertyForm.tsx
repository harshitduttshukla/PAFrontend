import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Search } from 'lucide-react';
import FormInput from "../../ui/FormInput"
import FormSelect from "../../ui/FormSelect"
import FormTextarea from "../../ui/FormTextarea"


// Types
interface HostData {
  host_id: number;
  host_name: string;
  host_pan_number?: string;
  rating?: number;
  host_email: string;
  host_contact_number: string;
  created_at?: string;
}

interface PincodeData {
  pincode_id: number;
  pincode: string;
  city?: string;
  state?: string;
  district?: string;
}

interface PropertyFormData {
  propertyStatus: string;
  hostId: number | null;
  hostName: string;
  ivrNumber: string;
  pincodeId: number | null;
  pinCode: string;
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

// Reusable Search Input Component
interface SearchInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: any) => void;
  searchResults: any[];
  isLoading: boolean;
  placeholder: string;
  displayKey: string;
  noResultsText: string;
  selectedInfo?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({
  label,
  value,
  onChange,
  onSelect,
  searchResults,
  isLoading,
  placeholder,
  displayKey,
  noResultsText,
  selectedInfo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setIsOpen(inputValue.length > 0);
  };

  const handleSelect = (item: any) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-all duration-300"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          ) : (
            <Search className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => (
              <div
                key={item[displayKey === 'host_name' ? 'host_id' : 'pincode_id'] || index}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-800">
                  {displayKey === 'host_name' ? item.host_name : `${item.pincode}${item.city ? ` - ${item.city}` : ''}`}
                </div>
                {displayKey === 'host_name' && (
                  <div className="text-sm text-gray-500 mt-1">
                    {item.host_email} • {item.host_contact_number}
                  </div>
                )}
              </div>
            ))
          ) : value.length > 0 && !isLoading ? (
            <div className="px-4 py-3 text-gray-500 text-center">{noResultsText}</div>
          ) : null}
        </div>
      )}

      {selectedInfo && (
        <div className="mt-4">
          {selectedInfo}
        </div>
      )}
    </div>
  );
};





const PropertyForm: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyStatus: '',
    hostId: null,
    hostName: '',
    ivrNumber: '',
    pincodeId: null,
    pinCode: '',
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

  // Search states
  const [hostSearchTerm, setHostSearchTerm] = useState('');
  const [hostSearchResults, setHostSearchResults] = useState<HostData[]>([]);
  const [isHostLoading, setIsHostLoading] = useState(false);
  const [selectedHost, setSelectedHost] = useState<HostData | null>(null);

  const [pincodeSearchTerm, setPincodeSearchTerm] = useState('');
  const [pincodeSearchResults, setPincodeSearchResults] = useState<PincodeData[]>([]);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<PincodeData | null>(null);

  // Debounce hook
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedHostSearch = useDebounce(hostSearchTerm, 300);
  const debouncedPincodeSearch = useDebounce(pincodeSearchTerm, 300);

  // API call functions
  const searchHosts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setHostSearchResults([]);
      return;
    }

    setIsHostLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/host?hostname=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setHostSearchResults(Array.isArray(data) ? data : []);
      } else {
        setHostSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching hosts:', error);
      setHostSearchResults([]);
    } finally {
      setIsHostLoading(false);
    }
  };

  const searchPincodes = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPincodeSearchResults([]);
      return;
    }

    setIsPincodeLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/PinCode?pincode=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setPincodeSearchResults(Array.isArray(data) ? data : []);
      } else {
        setPincodeSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching pincodes:', error);
      setPincodeSearchResults([]);
    } finally {
      setIsPincodeLoading(false);
    }
  };

  // Search effects
  useEffect(() => {
    searchHosts(debouncedHostSearch);
  }, [debouncedHostSearch]);

  useEffect(() => {
    searchPincodes(debouncedPincodeSearch);
  }, [debouncedPincodeSearch]);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHostSelect = (host: HostData) => {
    setSelectedHost(host);
    setHostSearchTerm(host.host_name);
    setFormData(prev => ({
      ...prev,
      hostId: host.host_id,
      hostName: host.host_name,
      contactPerson: host.host_name,
      contactNumber: host.host_contact_number.replace('+1-', ''),
      emailId: host.host_email
    }));
  };

  const handlePincodeSelect = (pincode: PincodeData) => {
    setSelectedPincode(pincode);
    setPincodeSearchTerm(pincode.pincode);
    setFormData(prev => ({
      ...prev,
      pincodeId: pincode.pincode_id,
      pinCode: pincode.pincode,
      city: pincode.city || ''
    }));
  };

  // const handleSave = async () => {
  //   try {
  //     // Prepare data for API - send IDs instead of names
  //     const propertyData = {
  //       property_status: formData.propertyStatus,
  //       host_id: formData.hostId,
  //       ivr_number: formData.ivrNumber,
  //       pincode_id: formData.pincodeId,
  //       city: formData.city,
  //       location: formData.location,
  //       post_id: formData.postId,
  //       property_type: formData.propertyType,
  //       contact_person: formData.contactPerson,
  //       contact_number: formData.contactNumber,
  //       email_id: formData.emailId,
  //       caretaker_name: formData.caretakerName,
  //       caretaker_number: formData.caretakerNumber,
  //       note: formData.note,
  //       check_in_time: formData.checkInTime,
  //       check_out_time: formData.checkOutTime,
  //       master_bedroom: parseInt(formData.masterBedroom),
  //       common_bedroom: parseInt(formData.commonBedroom),
  //       landmark: formData.landmark,
  //       address1: formData.address1,
  //       address2: formData.address2,
  //       address3: formData.address3,
  //       thumbnail: formData.thumbnail,
  //       property_url: formData.propertyUrl
  //     };

  //     const response = await fetch('http://localhost:5000/api/properties', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(propertyData)
  //     });

  //     if (response.ok) {
  //       const result = await response.json();
  //       alert('Property saved successfully!\n\nProperty ID: ' + result.property.property_id);
  //       console.log('Saved property:', result);
  //     } else {
  //       const error = await response.json();
  //       alert('Error saving property: ' + (error.error || 'Unknown error'));
  //     }
  //   } catch (error) {
  //     console.error('Error saving property:', error);
  //     alert('Error saving property. Please try again.');
  //   }
  // };

  const handleSave = async () => {
  try {
    const propertyData = {
      property_status: formData.propertyStatus,
      host_id: formData.hostId,
      pincode_id: formData.pincodeId
      //  ✅ only include columns that exist in DB
    };

    const response = await fetch("http://localhost:5000/api/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(propertyData),
    });

    if (response.ok) {
      const result = await response.json();
      alert(
        "Property saved successfully!\n\nProperty ID: " +
          result.property.property_id
      );
      console.log("Saved property:", result);
    } else {
      const error = await response.json();
      alert("Error saving property: " + (error.error || "Unknown error"));
    }
  } catch (error) {
    console.error("Error saving property:", error);
    alert("Error saving property. Please try again.");
  }
};

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setFormData({
        propertyStatus: '',
        hostId: null,
        hostName: '',
        ivrNumber: '',
        pincodeId: null,
        pinCode: '',
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
      setSelectedHost(null);
      setSelectedPincode(null);
      setHostSearchTerm('');
      setPincodeSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

            <SearchInput
              label="HOST NAME"
              value={hostSearchTerm}
              onChange={setHostSearchTerm}
              onSelect={handleHostSelect}
              searchResults={hostSearchResults}
              isLoading={isHostLoading}
              placeholder="Search for host..."
              displayKey="host_name"
              noResultsText="No hosts found"
              selectedInfo={selectedHost && (
                <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Host ID</span>
                      <p className="text-sm font-medium text-gray-800">{selectedHost.host_id}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Email</span>
                      <p className="text-sm font-medium text-gray-800">{selectedHost.host_email}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 uppercase">Contact</span>
                      <p className="text-sm font-medium text-gray-800">{selectedHost.host_contact_number}</p>
                    </div>
                    {selectedHost.rating && (
                      <div>
                        <span className="text-xs font-semibold text-gray-500 uppercase">Rating</span>
                        <p className="text-sm font-medium text-gray-800">{selectedHost.rating}/5</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            />

            <FormInput
              label="IVR"
              value={formData.ivrNumber}
              onChange={(e) => handleInputChange("ivrNumber", e.target.value)}
              placeholder="Enter IVR Number"
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <SearchInput
              label="PIN CODE"
              value={pincodeSearchTerm}
              onChange={setPincodeSearchTerm}
              onSelect={handlePincodeSelect}
              searchResults={pincodeSearchResults}
              isLoading={isPincodeLoading}
              placeholder="Search pincode..."
              displayKey="pincode"
              noResultsText="No pincodes found"
              selectedInfo={selectedPincode && (
                <div className="p-2 bg-blue-50 rounded text-sm">
                  <strong>ID:</strong> {selectedPincode.pincode_id}
                  {selectedPincode.city && <div><strong>City:</strong> {selectedPincode.city}</div>}
                </div>
              )}
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

          {/* Third Row */}
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
              onChange={e => handleInputChange('caretakerNumber', e.target.value)}
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
                  onChange={e => handleInputChange('masterBedroom', e.target.value)}
                  options={[0, 1, 2, 3, 4, 5].map(num => ({
                    value: num.toString(),
                    label: num === 5 ? '5+' : num.toString()
                  }))}
                />

                <FormSelect
                  label="Common Bedroom"
                  value={formData.commonBedroom}
                  onChange={e => handleInputChange('commonBedroom', e.target.value)}
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