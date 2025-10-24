import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Save, X, Check, AlertCircle, Search } from 'lucide-react';

// Types
interface Client {
  id: string;
  client_name: string;
  email?: string;
  phone?: string;
}

// interface Property {
//   property_id: string;
//   property_name: string;
//   address1: string;
//   address2?: string;
//   address3?: string;
//   host_name?: string;
//   host_email?: string;
//   contact_person?: string; 
//   contact_number?: string;
//   thumbnail?: string;
//   property_url?: string;

// }

interface Property {
  property_id: number;
  property_status: string;
  host_id: number;
  property_name: string;
  ivr_number: string;
  pincode_id: number;
  manual_pincode?: string | null;
  city: string;
  location: string;
  post_id: string;
  property_type: string;
  manual_host_name?: string | null;
  contact_person?: string;
  contact_number?: string;
  email_id?: string;
  caretaker_name?: string;
  caretaker_number?: string;
  note?: string;
  check_in_time?: string;
  check_out_time?: string;
  master_bedroom?: number;
  common_bedroom?: number;
  landmark?: string;
  address1: string;
  address2?: string;
  address3?: string;
  thumbnail?: string;
  property_url?: string;
  
  // Host info from joined table
  host_name?: string;
  host_email?: string;
  host_contact_number?: string;
}


interface GuestInfo {
  companyName: string;
  guestName: string;
  guestEmail: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  contactNumber: string;
  baseRate: string;
  taxes: string;
  totalTariff: string;
  paymentMode: string;
  tariffType: string;
  occupancy: string;
  chargeableDays: string;
  adminEmail: string;
}

interface ApartmentInfo {
  hostName: string;
  hostEmail: string;
  hostBaseRate: string;
  propertyAddress: string;
  propertyUrl: string;
  propertyThumbnail: string;
  hostTaxes: string;
  hostTotalAmount: string;
  contactPerson: string;
  contactNumber: string;
  hostTariffType: string;
  hostPaymentMethod: string;
  chargeableDays: string;
}

interface PajasaInfo {
  comments: string;
  services: {
    morningBreakfast: boolean;
    vegLunch: boolean;
    nonVegLunch: boolean;
    vegDinner: boolean;
    nonVegDinner: boolean;
    wifi: boolean;
  };
  note: string;
}

interface Reservation {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  reservationNo: string;
}

interface RoomAvailability {
  roomType: string;
  isAvailable: boolean;
  conflictingReservations?: Reservation[];
}

const ReservationManagementSystem: React.FC = () => {
  // State management
  const [activeSection, setActiveSection] = useState<string>('guest');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAvailability, setShowAvailability] = useState<boolean>(false);
  const [roomAvailability, setRoomAvailability] = useState<RoomAvailability[]>([]);
  
  // Search states
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [clientSearchResults, setClientSearchResults] = useState<Client[]>([]);
  const [showClientDropdown, setShowClientDropdown] = useState<boolean>(false);
  const [isClientLoading, setIsClientLoading] = useState<boolean>(false);
  
  const [propertySearchTerm, setPropertySearchTerm] = useState<string>('');
  const [propertySearchResults, setPropertySearchResults] = useState<Property[]>([]);
  const [showPropertyDropdown, setShowPropertyDropdown] = useState<boolean>(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState<boolean>(false);
  
  // Refs for dropdown handling
  const clientDropdownRef = useRef<HTMLDivElement>(null);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);
  
  // Form data
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    companyName: '',
    guestName: '',
    guestEmail: '',
    checkInDate: '',
    checkInTime: '14:00',
    checkOutDate: '',
    checkOutTime: '11:00',
    contactNumber: '',
    baseRate: '',
    taxes: '',
    totalTariff: '',
    paymentMode: '',
    tariffType: '',
    occupancy: '',
    chargeableDays: '',
    adminEmail: ''
  });

  const [apartmentInfo, setApartmentInfo] = useState<ApartmentInfo>({
    hostName: '',
    hostEmail: '',
    hostBaseRate: '',
    propertyAddress: '',
    propertyUrl: '',
    propertyThumbnail: '',
    hostTaxes: '',
    hostTotalAmount: '',
    contactPerson: '',
    contactNumber: '',
    hostTariffType: '',
    hostPaymentMethod: '',
    chargeableDays: ''
  });

  const [pajasaInfo, setPajasaInfo] = useState<PajasaInfo>({
    comments: '',
    services: {
      morningBreakfast: false,
      vegLunch: false,
      nonVegLunch: false,
      vegDinner: false,
      nonVegDinner: false,
      wifi: false
    },
    note: ''
  });

  const [roomSelection, setRoomSelection] = useState<string[]>([]);

  // Shared dates and times state
  const [sharedCheckInDate, setSharedCheckInDate] = useState<string>('');
  const [sharedCheckInTime, setSharedCheckInTime] = useState<string>('14:00');
  const [sharedCheckOutDate, setSharedCheckOutDate] = useState<string>('');
  const [sharedCheckOutTime, setSharedCheckOutTime] = useState<string>('11:00');

  // Calculate chargeable days
  const calculateChargeableDays = (checkInDate: string, checkOutDate: string): string => {
    if (!checkInDate || !checkOutDate) return '';
    
    try {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      
      if (checkOut <= checkIn) return '';
      
      // Calculate difference in milliseconds
      const diffTime = checkOut.getTime() - checkIn.getTime();
      
      // Convert to hours
      const diffHours = diffTime / (1000 * 60 * 60);
      
      // If more than 24 hours, return 2 days, otherwise use ceil
      let days = Math.ceil(diffHours / 24);
      
      return days.toString();
    } catch (error) {
      return '';
    }
  };

  // Calculate company total tariff
  useEffect(() => {
    const baseRate = parseFloat(guestInfo.baseRate) || 0;
    const taxesPercent = parseFloat(guestInfo.taxes) || 0;
    const chargeableDays = parseFloat(guestInfo.chargeableDays) || 0;
    
    if (chargeableDays > 0 && baseRate > 0) {
      const taxAmount = (baseRate * taxesPercent) / 100;
      const totalPerDay = baseRate + taxAmount;
      const totalTariff = (totalPerDay * chargeableDays).toFixed(2);
      setGuestInfo(prev => ({
        ...prev,
        totalTariff: totalTariff
      }));
    }
  }, [guestInfo.baseRate, guestInfo.taxes, guestInfo.chargeableDays]);

  // Calculate host total amount
  useEffect(() => {
    const hostBaseRate = parseFloat(apartmentInfo.hostBaseRate) || 0;
    const hostTaxesPercent = parseFloat(apartmentInfo.hostTaxes) || 0;
    const chargeableDays = parseFloat(apartmentInfo.chargeableDays) || 0;
    
    if (chargeableDays > 0 && hostBaseRate > 0) {
      const taxAmount = (hostBaseRate * hostTaxesPercent) / 100;
      const totalPerDay = hostBaseRate + taxAmount;
      const hostTotalAmount = (totalPerDay * chargeableDays).toFixed(2);
      setApartmentInfo(prev => ({
        ...prev,
        hostTotalAmount: hostTotalAmount
      }));
    }
  }, [apartmentInfo.hostBaseRate, apartmentInfo.hostTaxes, apartmentInfo.chargeableDays]);

  // Sync shared dates to guestInfo and apartmentInfo
  useEffect(() => {
    const chargeableDays = calculateChargeableDays(sharedCheckInDate, sharedCheckOutDate);
    
    setGuestInfo(prev => ({
      ...prev,
      checkInDate: sharedCheckInDate,
      checkInTime: sharedCheckInTime,
      checkOutDate: sharedCheckOutDate,
      checkOutTime: sharedCheckOutTime,
      chargeableDays: chargeableDays
    }));

    setApartmentInfo(prev => ({
      ...prev,
      chargeableDays: chargeableDays
    }));
  }, [sharedCheckInDate, sharedCheckInTime, sharedCheckOutDate, sharedCheckOutTime]);

  // API Base URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Client search functionality
  const searchClients = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setClientSearchResults([]);
      return;
    }

    setIsClientLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/clientRM?clientname=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data.success && data.data) {
        setClientSearchResults(data.data);
        setShowClientDropdown(true);
      } else {
        setClientSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      setClientSearchResults([]);
    } finally {
      setIsClientLoading(false);
    }
  };

  // Property search functionality
  const searchProperties = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setPropertySearchResults([]);
      return;
    }

    setIsPropertyLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}api/Property?Address=${encodeURIComponent(searchTerm)}`);
      

      if (!response.ok) throw new Error('Network response was not ok');
    
      
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        setPropertySearchResults(data.data);
        setShowPropertyDropdown(true);
      } else {
        setPropertySearchResults([]);
      }
    } catch (error) {
      console.error('Error searching properties:', error);
      setPropertySearchResults([]);
    } finally {
      setIsPropertyLoading(false);
    }
  };

  // Debounced search effects
  useEffect(() => {
    const timer = setTimeout(() => {
      if (clientSearchTerm) {
        searchClients(clientSearchTerm);
      } else {
        setClientSearchResults([]);
        setShowClientDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [clientSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (propertySearchTerm) {
        searchProperties(propertySearchTerm);
      } else {
        setPropertySearchResults([]);
        setShowPropertyDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [propertySearchTerm]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target as Node)) {
        setShowPropertyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setClientSearchTerm(client.client_name);
    setShowClientDropdown(false);
    setGuestInfo(prev => ({ ...prev, companyName: client.client_name }));
  };

  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    console.log("property.contact_person",property.contact_person);
    setPropertySearchTerm(`${property.address1}`);
    setShowPropertyDropdown(false);
    setApartmentInfo(prev => ({
      ...prev,
      propertyAddress: property.address1,
      hostName: property.host_name || '',
      hostEmail: property.host_email || '',
      contactPerson: property.contact_person || '',
      contactNumber: property.contact_number || '',
      propertyThumbnail: property.thumbnail || '',
      propertyUrl:property.property_url || ''
    }));
  };

  // Check room availability
  const checkAvailability = async () => {
    if (!selectedProperty || !sharedCheckInDate || !sharedCheckOutDate) {
      alert('Please select property and fill check-in/check-out dates');
      return;
    }

    if (roomSelection.length === 0) {
      alert('Please select at least one room type');
      return;
    }

    setShowAvailability(true);

    try {
      const response = await fetch(`${API_BASE_URL}api/checkRoomAvailability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: selectedProperty.property_id,
          checkInDate: sharedCheckInDate,
          checkOutDate: sharedCheckOutDate,
          roomTypes: roomSelection
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.success && data.availability) {
        setRoomAvailability(data.availability);
      } else {
        console.error('Error checking availability:', data.message);
        alert('Error checking room availability');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      alert('Error checking room availability');
    }
  };

  // Section toggle
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Handle form submission
  const handleSave = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    
    if (!selectedProperty) {
      alert('Please select a property');
      return;
    }
    
    if (!guestInfo.guestName || !guestInfo.guestEmail || !guestInfo.contactNumber) {
      alert('Please fill in required guest information');
      return;
    }
    
    if (roomSelection.length === 0) {
      alert('Please select at least one room');
      return;
    }

    const reservationData = {
      clientId: selectedClient.id,
      propertyId: selectedProperty.property_id,
      guestInfo,
      apartmentInfo,
      pajasaInfo,
      roomSelection,
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE_URL}api/Reservation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.success) {
        alert(`Reservation saved successfully! Reservation No: ${data.reservationNo}`);
        handleCancel();
      } else {
        alert(`Error saving reservation: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Error saving reservation');
    }
  };

  const handleCancel = () => {
    setSelectedClient(null);
    setSelectedProperty(null);
    setClientSearchTerm('');
    setPropertySearchTerm('');
    setShowAvailability(false);
    setRoomAvailability([]);
    setRoomSelection([]);
    setSharedCheckInDate('');
    setSharedCheckInTime('14:00');
    setSharedCheckOutDate('');
    setSharedCheckOutTime('11:00');
    setGuestInfo({
      companyName: '',
      guestName: '',
      guestEmail: '',
      checkInDate: '',
      checkInTime: '14:00',
      checkOutDate: '',
      checkOutTime: '11:00',
      contactNumber: '',
      baseRate: '',
      taxes: '',
      totalTariff: '',
      paymentMode: '',
      tariffType: '',
      occupancy: '',
      chargeableDays: '',
      adminEmail: ''
    });
    setApartmentInfo({
      hostName: '',
      hostEmail: '',
      hostBaseRate: '',
      propertyAddress: '',
      propertyUrl: '',
      propertyThumbnail: '',
      hostTaxes: '',
      hostTotalAmount: '',
      contactPerson: '',
      contactNumber: '',
      hostTariffType: '',
      hostPaymentMethod: '',
      chargeableDays: ''
    });
    setPajasaInfo({
      comments: '',
      services: {
        morningBreakfast: false,
        vegLunch: false,
        nonVegLunch: false,
        vegDinner: false,
        nonVegDinner: false,
        wifi: false
      },
      note: ''
    });
  };

  const handleRoomSelectionChange = (roomType: string, checked: boolean) => {
    if (checked) {
      setRoomSelection([...roomSelection, roomType]);
    } else {
      setRoomSelection(roomSelection.filter(room => room !== roomType));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Action Buttons */}
      <div className="bg-white p-4 flex justify-end space-x-2 border-b">
        <button 
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        <button 
          onClick={handleCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2"
        >
          <X size={16} />
          <span>Cancel</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Top Selection Row */}
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="grid grid-cols-3 gap-4">
            {/* Client Search Dropdown */}
            <div className="relative" ref={clientDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded pr-8"
                  placeholder="Search Company / Guest"
                  value={clientSearchTerm}
                  onChange={(e) => {
                    setClientSearchTerm(e.target.value);
                    if (e.target.value) {
                      setShowClientDropdown(true);
                    }
                  }}
                  onFocus={() => clientSearchTerm && setShowClientDropdown(true)}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                {isClientLoading && (
                  <div className="absolute right-8 top-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {showClientDropdown && clientSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {clientSearchResults.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleClientSelect(client)}
                    >
                      <div className="font-medium text-gray-900">{client.client_name}</div>
                      {client.email && (
                        <div className="text-sm text-gray-500">{client.email}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Search Dropdown */}
            <div className="relative" ref={propertyDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded pr-8"
                  placeholder="Search Property Address"
                  value={propertySearchTerm}
                  onChange={(e) => {
                    setPropertySearchTerm(e.target.value);
                    if (e.target.value) {
                      setShowPropertyDropdown(true);
                    }
                  }}
                  onFocus={() => propertySearchTerm && setShowPropertyDropdown(true)}
                />
                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                {isPropertyLoading && (
                  <div className="absolute right-8 top-2.5">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
              
              {showPropertyDropdown && propertySearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {propertySearchResults.map((property) => (
                    <div
                      key={property.property_id}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handlePropertySelect(property)}
                    >
                      <div className="font-medium text-gray-900">{property.property_name}</div>
                      <div className="text-sm text-gray-500">{property.address1}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="">Select Third Option</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guest Information Section */}
        <div className="bg-white rounded shadow-sm">
          <div 
            className="bg-blue-600 text-white p-3 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('guest')}
          >
            <span>Guest Information</span>
            {activeSection === 'guest' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {activeSection === 'guest' && (
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <input 
                  type="text" 
                  placeholder="Enter company Name"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.companyName}
                  onChange={(e) => setGuestInfo({...guestInfo, companyName: e.target.value})}
                />
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.paymentMode}
                  onChange={(e) => setGuestInfo({...guestInfo, paymentMode: e.target.value})}
                >
                  <option value="">Select Mode Of Payment</option>
                  <option value="Direct Payment">Direct Payment</option>
                  <option value="BTC">BTC</option>
                </select>
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.tariffType}
                  onChange={(e) => setGuestInfo({...guestInfo, tariffType: e.target.value})}
                >
                  <option value="">Select Tariff Type</option>
                  <option value="As Per Contract">As Per Contract</option>
                  <option value="As Per Email">As Per Email</option>
                </select>
                <input 
                  type="email" 
                  placeholder="Select Guest Email From Ticket"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.adminEmail}
                  onChange={(e) => setGuestInfo({...guestInfo, adminEmail: e.target.value})}
                />
                
                <input 
                  type="date"
                  placeholder="Check In Date"
                  className="p-2 border border-gray-300 rounded"
                  value={sharedCheckInDate}
                  onChange={(e) => setSharedCheckInDate(e.target.value)}
                />
                <input 
                  type="time"
                  className="p-2 border border-gray-300 rounded"
                  value={sharedCheckInTime}
                  onChange={(e) => setSharedCheckInTime(e.target.value)}
                />
                <input 
                  type="date"
                  placeholder="Check Out Date"
                  className="p-2 border border-gray-300 rounded"
                  value={sharedCheckOutDate}
                  onChange={(e) => setSharedCheckOutDate(e.target.value)}
                />
                <input 
                  type="time"
                  className="p-2 border border-gray-300 rounded"
                  value={sharedCheckOutTime}
                  onChange={(e) => setSharedCheckOutTime(e.target.value)}
                />
                
                <input 
                  type="text" 
                  placeholder="Guest Name"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.guestName}
                  onChange={(e) => setGuestInfo({...guestInfo, guestName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Guest Contact Number"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.contactNumber}
                  onChange={(e) => setGuestInfo({...guestInfo, contactNumber: e.target.value})}
                />
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.occupancy}
                  onChange={(e) => setGuestInfo({...guestInfo, occupancy: e.target.value})}
                >
                  <option value="">Select Occupancy</option>
                  <option value="1">Single</option>
                  <option value="2">Double</option>
                  <option value="3">Triple</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Chargeable Days"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={guestInfo.chargeableDays}
                  readOnly
                />
                
                <input 
                  type="text" 
                  placeholder="Company Base Rate"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.baseRate}
                  onChange={(e) => setGuestInfo({...guestInfo, baseRate: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Company Taxes"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.taxes}
                  onChange={(e) => setGuestInfo({...guestInfo, taxes: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Company Total Tariff"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={guestInfo.totalTariff}
                  readOnly
                />
                <div></div>
              </div>
              
              <div className="mt-4">
                <input 
                  type="email" 
                  placeholder="Guest Email"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={guestInfo.guestEmail}
                  onChange={(e) => setGuestInfo({...guestInfo, guestEmail: e.target.value})}
                />
              </div>

              {/* Room Selection */}
              <div className="mt-4">
                <h4 className="font-medium mb-2">Select Rooms:</h4>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={roomSelection.includes('Master Bedroom-1')}
                      onChange={(e) => handleRoomSelectionChange('Master Bedroom-1', e.target.checked)}
                      className="rounded"
                    />
                    <span>Master Bedroom-1</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={roomSelection.includes('Master Bedroom-2')}
                      onChange={(e) => handleRoomSelectionChange('Master Bedroom-2', e.target.checked)}
                      className="rounded"
                    />
                    <span>Master Bedroom-2</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={roomSelection.includes('Master Bedroom-3')}
                      onChange={(e) => handleRoomSelectionChange('Master Bedroom-3', e.target.checked)}
                      className="rounded"
                    />
                    <span>Master Bedroom-3</span>
                  </label>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={checkAvailability}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2"
                  disabled={!selectedProperty || !sharedCheckInDate || !sharedCheckOutDate || roomSelection.length === 0}
                >
                  <Check size={16} />
                  <span>Check Availability</span>
                </button>
              </div>

              {/* Room Availability Results */}
              {showAvailability && roomAvailability.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="font-medium">Room Availability Results:</h4>
                  
                  {roomAvailability.some(room => !room.isAvailable) ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <span>Some rooms are not available for the selected dates.</span>
                    </div>
                  ) : (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center space-x-2">
                      <Check size={20} />
                      <span>All selected rooms are available!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4">
                    {roomAvailability.map((room) => (
                      <div key={room.roomType} className={`p-3 border rounded ${room.isAvailable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="font-medium">{room.roomType}</div>
                        <div className={`text-sm ${room.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                          {room.isAvailable ? 'Available' : 'Not Available'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {roomAvailability.some(room => room.conflictingReservations && room.conflictingReservations.length > 0) && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Conflicting Reservations:</h4>
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Reservation No.</th>
                            <th className="border border-gray-300 p-2">Guest Name</th>
                            <th className="border border-gray-300 p-2">Room Type</th>
                            <th className="border border-gray-300 p-2">Check In</th>
                            <th className="border border-gray-300 p-2">Check Out</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomAvailability
                            .filter(room => room.conflictingReservations && room.conflictingReservations.length > 0)
                            .flatMap(room => room.conflictingReservations!)
                            .map((reservation) => (
                              <tr key={reservation.id}>
                                <td className="border border-gray-300 p-2">{reservation.reservationNo}</td>
                                <td className="border border-gray-300 p-2">{reservation.guestName}</td>
                                <td className="border border-gray-300 p-2">{reservation.roomType}</td>
                                <td className="border border-gray-300 p-2">{reservation.checkIn}</td>
                                <td className="border border-gray-300 p-2">{reservation.checkOut}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Apartments Information Section */}
        <div className="bg-white rounded shadow-sm">
          <div 
            className="bg-blue-600 text-white p-3 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('apartments')}
          >
            <span>Apartments Information</span>
            {activeSection === 'apartments' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {activeSection === 'apartments' && (
            <div className="p-4">
              <div className="grid grid-cols-4 gap-4">
                <input 
                  type="text" 
                  placeholder="Host Name"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostName}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Property Address"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.propertyAddress}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, propertyAddress: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Host Email-ID"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostEmail}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostEmail: e.target.value})}
                />
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.hostTariffType}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostTariffType: e.target.value})}
                >
                  <option value="">Select Host Tariff Type</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Host Base Rate"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.hostBaseRate}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostBaseRate: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Host Taxes"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.hostTaxes}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostTaxes: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Host Total Amount"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostTotalAmount}
                  readOnly
                />
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.hostPaymentMethod}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostPaymentMethod: e.target.value})}
                >
                  <option value="">Select Host Payment Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Property URL"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.propertyUrl}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, propertyUrl: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Property Thumbnail"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.propertyThumbnail}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, propertyThumbnail: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Contact Person"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.contactPerson}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, contactPerson: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Contact Number"
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.contactNumber}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, contactNumber: e.target.value})}
                />

                <input 
                  type="date"
                  placeholder="Check In Date"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={sharedCheckInDate}
                  readOnly
                />
                <input 
                  type="time"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={sharedCheckInTime}
                  readOnly
                />
                <input 
                  type="date"
                  placeholder="Check Out Date"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={sharedCheckOutDate}
                  readOnly
                />
                <input 
                  type="time"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={sharedCheckOutTime}
                  readOnly
                />

                <input 
                  type="text" 
                  placeholder="Apt Chargeable Days"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.chargeableDays}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>

        {/* Pajasa Information Section */}
        <div className="bg-white rounded shadow-sm">
          <div 
            className="bg-blue-600 text-white p-3 cursor-pointer flex items-center justify-between"
            onClick={() => toggleSection('pajasa')}
          >
            <span>Pajasa information</span>
            {activeSection === 'pajasa' ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          
          {activeSection === 'pajasa' && (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">For Comments Only</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded h-32"
                    value={pajasaInfo.comments}
                    onChange={(e) => setPajasaInfo({...pajasaInfo, comments: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complementary Services</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.morningBreakfast}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, morningBreakfast: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Morning Breakfast</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.vegLunch}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, vegLunch: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Veg Lunch</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.nonVegLunch}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, nonVegLunch: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Non Veg Lunch</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.vegDinner}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, vegDinner: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Veg Dinner</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.nonVegDinner}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, nonVegDinner: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Non Veg Dinner</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={pajasaInfo.services.wifi}
                        onChange={(e) => setPajasaInfo({
                          ...pajasaInfo, 
                          services: {...pajasaInfo.services, wifi: e.target.checked}
                        })}
                        className="rounded"
                      />
                      <span>Wi-fi</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">(*)</span> Note :
                  </label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded h-32"
                    value={pajasaInfo.note}
                    onChange={(e) => setPajasaInfo({...pajasaInfo, note: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationManagementSystem;