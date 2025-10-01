import React, { useState } from 'react';
import { X, Eye, Mail, FileText, User, Home, Calendar, XCircle, Settings } from 'lucide-react';

// Types
interface Reservation {
  id: number;
  status: 'extended' | 'new' | 'cancelled';
  booking: string;
  reservationN: string;
  guestName: string;
  room: string;
  host: string;
  client: string;
  address: string;
  guestContact?: string;
  companyName?: string;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  chargeableDays?: number;
  hostTariff?: number;
  companyTariff?: number;
  hostPayment?: string;
  guestPayment?: string;
  contactPerson?: string;
  contactNumber?: string;
  comment?: string;
}



// SubNavigation Component
// const SubNavigation: React.FC = () => {
//   return (
//     <div className="bg-white border-b px-6 py-3">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl font-semibold text-gray-800">Reservation Records</h1>
//         <div className="flex space-x-4 text-sm">
//           <button className="text-blue-600 hover:underline transition-colors">Property Form</button>
//           <button className="text-blue-600 hover:underline transition-colors">Properties View</button>
//           <button className="text-blue-600 hover:underline transition-colors">Add Properties Price</button>
//           <button className="text-blue-600 hover:underline transition-colors">Reservation Form</button>
//           <button className="text-blue-600 hover:underline transition-colors">Reservation Records</button>
//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
//             + New
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// StatusBadge Component
const StatusBadge: React.FC<{ status: Reservation['status'] }> = ({ status }) => {
  const statusConfig = {
    extended: {
      color: 'bg-green-500',
      text: '✓ Booking Extended'
    },
    new: {
      color: 'bg-blue-500',
      text: '◉ New'
    },
    cancelled: {
      color: 'bg-red-500',
      text: '⊘ Booking Cancelled'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`${config.color} text-white px-3 py-1 rounded text-xs font-semibold inline-flex items-center`}>
      {config.text}
    </span>
  );
};

// OptionsDropdown Component
interface OptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewBooking: () => void;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({ isOpen, onClose, onViewBooking }) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'Guest View', onClick: onViewBooking },
    { icon: Home, label: 'Apartment View' },
    { icon: Eye, label: 'View' },
    { icon: Calendar, label: 'Booking History', onClick: onViewBooking },
    { icon: FileText, label: 'Edit' },
    { icon: Mail, label: 'Send Email' },
    { icon: Mail, label: 'Resend Email' },
    { icon: FileText, label: 'Guest PDF' },
    { icon: FileText, label: 'Apartment PDF' },
    { icon: XCircle, label: 'Cancel Booking', danger: true }
  ];

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 transition-colors ${
            item.danger ? 'text-red-600' : 'text-gray-700'
          }`}
          onClick={() => {
            item.onClick?.();
            onClose();
          }}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// BookingHistoryModal Component
interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation | null;
}

const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;

  const fields = [
    { label: 'Reservation Date', value: booking.booking, highlight: true },
    { label: 'Reservation Number', value: booking.reservationN, highlight: true },
    { label: 'Guest Name', value: booking.guestName, highlight: true },
    { label: 'Guest Contact Number', value: booking.guestContact || 'N/A' },
    { label: 'Company Name', value: booking.companyName || booking.client, highlight: true },
    { label: 'C.I.D', value: booking.checkIn || 'N/A' },
    { label: 'C.I.T', value: booking.checkInTime || 'N/A', highlight: true },
    { label: 'C.O.D', value: booking.checkOut || 'N/A' },
    { label: 'C.O.Tariff', value: booking.checkOutTime || 'N/A', highlight: true },
    { label: 'Chargeable Days', value: booking.chargeableDays?.toString() || 'N/A', highlight: true },
    { label: 'Host Tariff', value: booking.hostTariff?.toString() || 'N/A', highlight: true },
    { label: 'Room Type', value: booking.room, highlight: true },
    { label: 'Host Mode of Payment', value: booking.hostPayment || 'N/A', highlight: true },
    { label: 'Guest Mode of Payment', value: booking.guestPayment || 'N/A', highlight: true },
    { label: 'Company Tariff', value: booking.companyTariff?.toString() || 'N/A', highlight: true },
    { label: 'Property Address', value: booking.address, highlight: true, fullWidth: true },
    { label: 'Contact Person', value: booking.contactPerson || 'N/A', highlight: true },
    { label: 'Contact Number', value: booking.contactNumber || 'N/A', highlight: true },
    { label: 'Comment', value: booking.comment || 'N/A', highlight: true },
    { label: 'URL', value: '-' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Booking History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {fields.map((field, index) => (
              <div key={index} className={field.fullWidth ? 'col-span-2' : ''}>
                <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                <p className={`font-medium ${field.highlight ? 'text-orange-600' : 'text-gray-800'}`}>
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// TableControls Component
interface TableControlsProps {
  entriesPerPage: number;
  setEntriesPerPage: (value: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const TableControls: React.FC<TableControlsProps> = ({
  entriesPerPage,
  setEntriesPerPage,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Show</span>
        <select 
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={entriesPerPage}
          onChange={(e) => setEntriesPerPage(Number(e.target.value))}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-gray-600">entries</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Search:</span>
        <input 
          type="text" 
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

// ReservationsTable Component
interface ReservationsTableProps {
  reservations: Reservation[];
  showOptions: number | null;
  setShowOptions: (id: number | null) => void;
  onViewBooking: (booking: Reservation) => void;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  showOptions,
  setShowOptions,
  onViewBooking
}) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Booking</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Reservatn-N</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Guest Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Room</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Host</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Address</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <StatusBadge status={reservation.status} />
                </td>
                <td className="px-4 py-3">{reservation.booking}</td>
                <td className="px-4 py-3 text-blue-600 font-medium">{reservation.reservationN}</td>
                <td className="px-4 py-3">{reservation.guestName}</td>
                <td className="px-4 py-3">{reservation.room}</td>
                <td className="px-4 py-3">{reservation.host}</td>
                <td className="px-4 py-3">{reservation.client}</td>
                <td className="px-4 py-3 max-w-xs truncate">{reservation.address}</td>
                <td className="px-4 py-3 relative">
                  <button 
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                    onClick={() => setShowOptions(showOptions === reservation.id ? null : reservation.id)}
                  >
                    <Settings size={16} />
                    <span>Options</span>
                  </button>
                  
                  <OptionsDropdown
                    isOpen={showOptions === reservation.id}
                    onClose={() => setShowOptions(null)}
                    onViewBooking={() => onViewBooking(reservation)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Component
const ReservationList: React.FC = () => {
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showBookingHistory, setShowBookingHistory] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const reservations: Reservation[] = [
    {
      id: 1,
      status: 'extended',
      booking: '2022-06-08',
      reservationN: 'PAR-22-06-11033',
      guestName: 'Anshu Pandey',
      room: 'One Room in 2 BHK',
      host: 'Ashok Deluxe Apartments',
      client: 'Shadowfax Technologies Pvt Ltd',
      address: 'Ashok Deluxe apartments, Ashok Nagar Bldg # 3, Off Marol Military Road, Near Mithi River, Marol, Andheri (E), Andheri E,Mumbai-400072',
      guestContact: '9889009137',
      companyName: 'Shadowfax Technologies Pvt Ltd',
      checkIn: '2022-06-08',
      checkInTime: '12:00 PM',
      checkOut: '2022-06-11',
      checkOutTime: '11:00 AM',
      chargeableDays: 3,
      hostTariff: 2240,
      companyTariff: 2800,
      hostPayment: 'Bill To PAJASA',
      guestPayment: 'Bill To Company',
      contactPerson: 'Mahesh Rao',
      contactNumber: '98337 87741',
      comment: 'Created Through Quick Booking'
    },
    {
      id: 2,
      status: 'new',
      booking: '2022-06-10',
      reservationN: 'PAR-22-06-11035',
      guestName: 'Gnana Guru',
      room: 'One Room in 2 BHK',
      host: 'Stay Wood Apartments',
      client: 'M MOSER DESIGN ASSOCIATES INDIA PVT LTD',
      address: 'Flat No 1005, 10th Floor, Sethia Grandeur, Teacher Colony, OPP. UPL House, Bandra East,Mumbai-400051'
    },
    {
      id: 3,
      status: 'new',
      booking: '2022-06-08',
      reservationN: 'PAR-22-06-11034',
      guestName: 'Rachit Jain',
      room: 'One Room in 2 BHK',
      host: 'Ashok Deluxe Apartments',
      client: 'Shadowfax Technologies Pvt Ltd',
      address: 'Ashok Deluxe apartments, Ashok Nagar Bldg # 3, Off Marol Military Road, Near Mithi River, Marol, Andheri (E), Andheri E,Mumbai-400072'
    },
    {
      id: 4,
      status: 'cancelled',
      booking: '2022-05-25',
      reservationN: 'PAR-22-05-11012',
      guestName: 'Ankit Kulkarni',
      room: 'One Room in 2 BHK',
      host: 'Ashok Deluxe Apartments',
      client: 'Shadowfax',
      address: 'Ashok Deluxe apartments, Ashok Nagar Bldg # 3, Off Marol Military Road, Near Mithi River, Marol, Andheri (E), Andheri E,Mumbai-400072'
    },
    {
      id: 5,
      status: 'extended',
      booking: '2022-05-30',
      reservationN: 'PAR-22-05-11019',
      guestName: 'Arvind kumawat +Arnold Joseph',
      room: 'Entire Studio',
      host: 'Ashok Deluxe Apartments',
      client: 'Shadowfax',
      address: 'Ashok Deluxe apartmentm, Ashok Nagar Bldg # 3, Off Marol Military Road, Near Raj Oil Mill, Marol, Andheri E,Mumbai-400072'
    },
    {
      id: 6,
      status: 'new',
      booking: '2022-06-07',
      reservationN: 'PAR-22-06-11032',
      guestName: 'Ms. PRIYANKA SAHA',
      room: 'One Room in 2 BHK',
      host: 'Ashok Deluxe Apartments',
      client: 'Shadowfax Technologies Pvt Ltd',
      address: 'Ashok Deluxe apartmentm, Ashok Nagar Bldg # 3, Off Marol Military Road, Near Raj Oil Mill, Marol, Andheri (E), Mumbai - 400 072, Andheri E,Mumbai-400072'
    },
    {
      id: 7,
      status: 'new',
      booking: '2022-06-07',
      reservationN: 'PAR-22-06-11031',
      guestName: 'Aditya Sharma',
      room: 'One Room in 3 BHK',
      host: 'Fresh Living Apartments',
      client: 'Shadowfax Technologies Pvt Ltd',
      address: 'Fresh Living Apartments Flat No. 103, 1st Floor, C-Block Image Hospital Road, Beside Reliance Fresh Madhapur,Hyderabad-500081'
    }
  ];

  const handleViewBooking = (booking: Reservation): void => {
    setSelectedBooking(booking);
    setShowBookingHistory(true);
    setShowOptions(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
     
      {/* <SubNavigation /> */}
      <h1 className="text-xl font-semibold text-gray-800">Reservation Records</h1>

      <div className="p-6">
        <TableControls
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <ReservationsTable
          reservations={reservations}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
          onViewBooking={handleViewBooking}
        />
      </div>

      <BookingHistoryModal
        isOpen={showBookingHistory}
        onClose={() => setShowBookingHistory(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default ReservationList;