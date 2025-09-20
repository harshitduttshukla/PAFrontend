import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Save, X, Check, AlertCircle } from 'lucide-react';

// Types
interface Client {
  id: string;
  name: string;
}

interface Address {
  id: string;
  address: string;
  clientId: string;
}

interface GuestInfo {
  companyName: string;
  guestName: string;
  guestEmail: string;
  cid: string;
  contactNumber: string;
  baseRate: string;
  taxes: string;
  totalTariff: string;
  paymentMode: string;
  tariffType: string;
  occupancy: string;
  checkInTime: string;
  checkOutTime: string;
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
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  chargeableDays: string;
  hostTariffType: string;
  hostPaymentMethod: string;
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

interface RoomSelection {
  masterBedroom1: boolean;
  masterBedroom2: boolean;
  masterBedroom3: boolean;
}

const ReservationManagementSystem: React.FC = () => {
  // State management
  const [activeSection, setActiveSection] = useState<string>('guest');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [showAvailability, setShowAvailability] = useState<boolean>(false);
  const [roomAvailable, setRoomAvailable] = useState<boolean>(false);
  
  // Form data
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    companyName: '',
    guestName: '',
    guestEmail: '',
    cid: '',
    contactNumber: '',
    baseRate: '',
    taxes: '',
    totalTariff: '',
    paymentMode: '',
    tariffType: '',
    occupancy: '',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
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
    checkInDate: '',
    checkOutDate: '',
    checkInTime: '12:00 PM',
    checkOutTime: '11:00 AM',
    chargeableDays: '',
    hostTariffType: '',
    hostPaymentMethod: ''
  });

  const [pajasaInfo, setPajasaInfo] = useState<PajasaInfo>({
    comments: '',
    services: {
      morningBreakfast: true,
      vegLunch: false,
      nonVegLunch: false,
      vegDinner: false,
      nonVegDinner: false,
      wifi: true
    },
    note: ''
  });

  const [roomSelection, setRoomSelection] = useState<RoomSelection>({
    masterBedroom1: true,
    masterBedroom2: true,
    masterBedroom3: true
  });

  // Mock data
  const clients: Client[] = [
    { id: '1', name: 'BG Exploration and Production India Ltd' },
    { id: '2', name: 'ABC Corp' },
    { id: '3', name: 'XYZ Industries' }
  ];

  const addresses: Address[] = [
    { id: '1', address: 'Mumbai Office', clientId: '1' },
    { id: '2', address: 'Delhi Branch', clientId: '1' },
    { id: '3', address: 'Bangalore Office', clientId: '2' }
  ];

  const reservations: Reservation[] = [
    { id: '11030', guestName: 'Aditya Sharma', roomType: 'Master Bedroom-3', checkIn: '15 June,2022', checkOut: '17 June,2022', reservationNo: '11030' },
    { id: '11028', guestName: 'Abhishek Ghosh', roomType: 'Master Bedroom-1', checkIn: '15 June,2022', checkOut: '19 June,2022', reservationNo: '11028' }
  ];

  // Check room availability
  const checkAvailability = () => {
    setShowAvailability(true);
    // Simulate API call
    setTimeout(() => {
      setRoomAvailable(false); // Set to false to show "Room Is Not Available" message
    }, 1000);
  };

  // Section toggle
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  // Handle form submission
  const handleSave = async () => {
    const reservationData = {
      client: selectedClient,
      address: selectedAddress,
      property: selectedProperty,
      guestInfo,
      apartmentInfo,
      pajasaInfo,
      roomSelection
    };

    try {
      // Mock API call
      console.log('Saving reservation:', reservationData);
      alert('Reservation saved successfully!');
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Error saving reservation');
    }
  };

  const handleCancel = () => {
    // Reset all form data
    setSelectedClient('');
    setSelectedAddress('');
    setSelectedProperty('');
    setShowAvailability(false);
    setGuestInfo({
      companyName: '',
      guestName: '',
      guestEmail: '',
      cid: '',
      contactNumber: '',
      baseRate: '',
      taxes: '',
      totalTariff: '',
      paymentMode: '',
      tariffType: '',
      occupancy: '',
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
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
      checkInDate: '',
      checkOutDate: '',
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      chargeableDays: '',
      hostTariffType: '',
      hostPaymentMethod: ''
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-6">
            <span className="cursor-pointer hover:text-blue-200">Dashboard</span>
            <span className="cursor-pointer hover:text-blue-200">Clients</span>
            <span className="cursor-pointer hover:text-blue-200">Invoices</span>
            <span className="cursor-pointer hover:text-blue-200">Property Details</span>
            <span className="cursor-pointer hover:text-blue-200">Reservation Details</span>
            <span className="cursor-pointer hover:text-blue-200">Reports</span>
          </nav>
          <div className="flex items-center space-x-4">
            <span>Paras</span>
            <button className="p-1 hover:bg-blue-700 rounded">
              <span className="text-sm">?</span>
            </button>
          </div>
        </div>
      </div>

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
            <div>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">Select Client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
              >
                <option value="">Select Address</option>
                {addresses.filter(addr => addr.clientId === selectedClient).map(address => (
                  <option key={address.id} value={address.id}>{address.address}</option>
                ))}
              </select>
            </div>
            <div>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <option value="">Select</option>
                <option value="property1">Property 1</option>
                <option value="property2">Property 2</option>
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
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online Transfer</option>
                </select>
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.tariffType}
                  onChange={(e) => setGuestInfo({...guestInfo, tariffType: e.target.value})}
                >
                  <option value="">Select Tariff Type</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Select Guest Email From Ticket"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.adminEmail}
                  onChange={(e) => setGuestInfo({...guestInfo, adminEmail: e.target.value})}
                />
                
                <input 
                  type="text" 
                  placeholder="C.I.D"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.cid}
                  onChange={(e) => setGuestInfo({...guestInfo, cid: e.target.value})}
                />
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.checkInTime}
                  onChange={(e) => setGuestInfo({...guestInfo, checkInTime: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="C.O.D"
                  className="p-2 border border-gray-300 rounded"
                />
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.checkOutTime}
                  onChange={(e) => setGuestInfo({...guestInfo, checkOutTime: e.target.value})}
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
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.chargeableDays}
                  onChange={(e) => setGuestInfo({...guestInfo, chargeableDays: e.target.value})}
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
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.totalTariff}
                  onChange={(e) => setGuestInfo({...guestInfo, totalTariff: e.target.value})}
                />
                <input 
                  type="email" 
                  placeholder="Enter Admin/Guest Email Id"
                  className="p-2 border border-gray-300 rounded"
                  value={guestInfo.adminEmail}
                  onChange={(e) => setGuestInfo({...guestInfo, adminEmail: e.target.value})}
                />
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

              <div className="mt-4 flex justify-end">
                <button 
                  onClick={checkAvailability}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>Availability</span>
                </button>
              </div>

              {/* Room Selection and Availability */}
              {showAvailability && (
                <div className="mt-6 space-y-4">
                  {/* Sample data display */}
                  <div className="grid grid-cols-4 gap-4">
                    <input type="text" value="BG Exploration and Production India Ltd" className="p-2 border border-gray-300 rounded" readOnly />
                    <select className="p-2 border border-gray-300 rounded">
                      <option>Direct Payment</option>
                    </select>
                    <select className="p-2 border border-gray-300 rounded">
                      <option>As Per Contract</option>
                    </select>
                    <input type="text" placeholder="Select Guest Email From Ticket" className="p-2 border border-gray-300 rounded" />
                    
                    <input type="text" value="15 June, 2022" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="text" value="12:00 PM" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="text" value="25 June, 2022" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="text" value="11:00 AM" className="p-2 border border-gray-300 rounded" readOnly />
                    
                    <input type="text" placeholder="Guest Name" className="p-2 border border-gray-300 rounded" />
                    <input type="text" placeholder="Guest Contact Number" className="p-2 border border-gray-300 rounded" />
                    <select className="p-2 border border-gray-300 rounded">
                      <option>Select Occupancy</option>
                    </select>
                    <input type="text" value="10" className="p-2 border border-gray-300 rounded" readOnly />
                    
                    <input type="text" value="3000" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="text" value="12" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="text" value="3360" className="p-2 border border-gray-300 rounded" readOnly />
                    <input type="email" value="Test@gmail.com" className="p-2 border border-gray-300 rounded" readOnly />
                  </div>

                  {/* Room Selection */}
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={roomSelection.masterBedroom1}
                        onChange={(e) => setRoomSelection({...roomSelection, masterBedroom1: e.target.checked})}
                        className="rounded"
                      />
                      <span>Master Bedroom-1</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={roomSelection.masterBedroom2}
                        onChange={(e) => setRoomSelection({...roomSelection, masterBedroom2: e.target.checked})}
                        className="rounded"
                      />
                      <span>Master Bedroom-2</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        checked={roomSelection.masterBedroom3}
                        onChange={(e) => setRoomSelection({...roomSelection, masterBedroom3: e.target.checked})}
                        className="rounded"
                      />
                      <span>Master Bedroom-3</span>
                    </label>
                  </div>

                  <input type="email" placeholder="Guest Email" className="w-full p-2 border border-gray-300 rounded" />

                  {/* Availability Status */}
                  {!roomAvailable && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <span>Room Is Not Available.</span>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button 
                      onClick={checkAvailability}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center space-x-2"
                    >
                      <Check size={16} />
                      <span>Availability</span>
                    </button>
                  </div>

                  {/* Reservations Table */}
                  <div className="mt-6">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Reservation No.</th>
                          <th className="border border-gray-300 p-2">C.I.D</th>
                          <th className="border border-gray-300 p-2">C.O.D</th>
                          <th className="border border-gray-300 p-2">Guest Name</th>
                          <th className="border border-gray-300 p-2">Room Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((reservation) => (
                          <tr key={reservation.id}>
                            <td className="border border-gray-300 p-2">{reservation.reservationNo}</td>
                            <td className="border border-gray-300 p-2">{reservation.checkIn}</td>
                            <td className="border border-gray-300 p-2">{reservation.checkOut}</td>
                            <td className="border border-gray-300 p-2">{reservation.guestName}</td>
                            <td className="border border-gray-300 p-2">{reservation.roomType}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Host Base Rate"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostBaseRate}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostBaseRate: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Host Taxes"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostTaxes}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostTaxes: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Host Total Amount"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.hostTotalAmount}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostTotalAmount: e.target.value})}
                />
                <select 
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.hostPaymentMethod}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, hostPaymentMethod: e.target.value})}
                >
                  <option value="">Select Host Payment Method</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                </select>

                <input 
                  type="text" 
                  placeholder="Property URL"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.propertyUrl}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, propertyUrl: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Property Thumbnail"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.propertyThumbnail}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, propertyThumbnail: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Contact Person"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
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
                  placeholder="Apt Check In Date"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.checkInDate}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, checkInDate: e.target.value})}
                />
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.checkInTime}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, checkInTime: e.target.value})}
                />
                <input 
                  type="date" 
                  placeholder="Apt Check Out Date"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.checkOutDate}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, checkOutDate: e.target.value})}
                />
                <input 
                  type="time" 
                  className="p-2 border border-gray-300 rounded"
                  value={apartmentInfo.checkOutTime}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, checkOutTime: e.target.value})}
                />

                <input 
                  type="text" 
                  placeholder="Apt Chargeable Days"
                  className="p-2 border border-gray-300 rounded bg-gray-100"
                  value={apartmentInfo.chargeableDays}
                  onChange={(e) => setApartmentInfo({...apartmentInfo, chargeableDays: e.target.value})}
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