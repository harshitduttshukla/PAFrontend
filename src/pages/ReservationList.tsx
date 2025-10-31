import React, { useState, useEffect } from 'react';
import { X, Eye, Mail, FileText, User, Home, Calendar, XCircle, Settings, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types matching your database structure
interface Reservation {
  id: number;
  reservation_no: string;
  client_id: number;
  property_id: number;
  guest_name: string;
  guest_email: string;
  contact_number: string;
  contact_person_number:string;
  check_in_date: string;
  check_out_date: string;
  check_in_time: string;
  check_out_time: string;
  occupancy: number;
  base_rate: string;
  taxes: string;
  total_tariff: string;
  payment_mode: string;
  tariff_type: string;
  chargeable_days: number;
  admin_email: string;
  status: string;
  created_at: string;
  reservation_id: number;
  room_type: string;
  property_status: string;
  host_id: number;
  city: string;
  location: string;
  property_type: string;
  contact_person: string;
  email_id: string;
  caretaker_name: string;
  caretaker_number: string;
  master_bedroom: number;
  common_bedroom: number;
  landmark: string;
  address1: string;
  address2: string;
  address3: string;
  property_url: string;
  client_name: string;
  gst_no: string;
  street_address: string;
  street_address_2: string;
  state: string;
  zip_code: string;
  updated_at: string;
}

// StatusBadge Component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return { color: 'bg-green-500', text: '✓ Active' };
      case 'extended':
        return { color: 'bg-blue-500', text: '✓ Extended' };
      case 'cancelled':
        return { color: 'bg-red-500', text: '⊘ Cancelled' };
      case 'completed':
        return { color: 'bg-gray-500', text: '✓ Completed' };
      default:
        return { color: 'bg-blue-500', text: '◉ New' };
    }
  };

  const config = getStatusConfig(status);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const fields = [
    { label: 'Reservation Date', value: formatDate(booking.created_at), highlight: true },
    { label: 'Reservation Number', value: booking.reservation_no, highlight: true },
    { label: 'Guest Name', value: booking.guest_name, highlight: true },
    { label: 'Guest Contact Number', value: booking.contact_number || 'N/A' },
    { label: 'Company Name', value: booking.client_name, highlight: true },
    { label: 'Guest Email', value: booking.guest_email, highlight: true },
    { label: 'Check In Date', value: formatDate(booking.check_in_date) },
    { label: 'Check In Time', value: booking.check_in_time, highlight: true },
    { label: 'Check Out Date', value: formatDate(booking.check_out_date) },
    { label: 'Check Out Time', value: booking.check_out_time, highlight: true },
    { label: 'Chargeable Days', value: booking.chargeable_days.toString(), highlight: true },
    { label: 'Base Rate', value: `₹${booking.base_rate}`, highlight: true },
    { label: 'Taxes', value: `${booking.taxes}%`, highlight: true },
    { label: 'Total Tariff', value: `₹${booking.total_tariff}`, highlight: true },
    { label: 'Room Type', value: booking.room_type, highlight: true },
    { label: 'Payment Mode', value: booking.payment_mode || 'N/A', highlight: true },
    { label: 'Tariff Type', value: booking.tariff_type || 'N/A', highlight: true },
    { label: 'Occupancy', value: booking.occupancy.toString() },
    { label: 'Property Type', value: booking.property_type, highlight: true },
    { label: 'City', value: booking.city },
    { label: 'Location', value: booking.location },
    { label: 'Property Address', value: `${booking.address1}, ${booking.address2}, ${booking.address3}`, highlight: true, fullWidth: true },
    { label: 'Landmark', value: booking.landmark || 'N/A' },
    { label: 'Contact Person', value: booking.contact_person || 'N/A', highlight: true },
    { label: 'Contact Number', value: booking.contact_person_number|| 'N/A' },
    { label: 'Caretaker Name', value: booking.caretaker_name || 'N/A' },
    { label: 'Caretaker Number', value: booking.caretaker_number || 'N/A', highlight: true },
    { label: 'GST Number', value: booking.gst_no || 'N/A' },
    { label: 'State', value: booking.state },
    { label: 'ZIP Code', value: booking.zip_code },
    { label: 'Status', value: booking.status.toUpperCase(), highlight: true },
    { label: 'Property URL', value: booking.property_url || '-', fullWidth: true }
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
  totalEntries: number;
}

const TableControls: React.FC<TableControlsProps> = ({
  entriesPerPage,
  setEntriesPerPage,
  searchTerm,
  setSearchTerm,
  totalEntries
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
        <span className="text-sm text-gray-600">entries (Total: {totalEntries})</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Search:</span>
        <input 
          type="text" 
          className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search reservations..."
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Booking Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Reservation No.</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Guest Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Room Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Property</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Client</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => (
                <tr key={reservation.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <StatusBadge status={reservation.status} />
                  </td>
                  <td className="px-4 py-3">{formatDate(reservation.created_at)}</td>
                  <td className="px-4 py-3 text-blue-600 font-medium">{reservation.reservation_no}</td>
                  <td className="px-4 py-3">{reservation.guest_name}</td>
                  <td className="px-4 py-3">{reservation.room_type}</td>
                  <td className="px-4 py-3">{reservation.property_type}</td>
                  <td className="px-4 py-3">{reservation.client_name}</td>
                  <td className="px-4 py-3">{reservation.city}, {reservation.location}</td>
                  <td className="px-4 py-3 relative">
                    <button 
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 transition-colors"
                      onClick={() => setShowOptions(showOptions === reservation.id ? null : reservation.id)}
                    >
                      <Settings size={16} />

                      <span>${reservation.id} Options</span>
                    </button>
                    
                    <OptionsDropdown
                      isOpen={showOptions === reservation.id}
                      onClose={() => setShowOptions(null)}
                      onViewBooking={() => onViewBooking(reservation)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};




// Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
};



// Main Component
const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showBookingHistory, setShowBookingHistory] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}api/getAllReservations`); // Update with your API endpoint
        
        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const result = await response.json();
        setReservations(result.data || []);
        setFilteredReservations(result.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to load reservations. Please try again.');
        // Use mock data for development
        setReservations([]);
        setFilteredReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Filter reservations based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredReservations(reservations);
      setCurrentPage(1);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = reservations.filter((reservation) => 
      reservation.reservation_no.toLowerCase().includes(searchLower) ||
      reservation.guest_name.toLowerCase().includes(searchLower) ||
      reservation.client_name.toLowerCase().includes(searchLower) ||
      reservation.room_type.toLowerCase().includes(searchLower) ||
      reservation.city.toLowerCase().includes(searchLower) ||
      reservation.location.toLowerCase().includes(searchLower)
    );

    setFilteredReservations(filtered);
    setCurrentPage(1);
  }, [searchTerm, reservations]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredReservations.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  const handleViewBooking = (booking: Reservation): void => {
    setSelectedBooking(booking);
    setShowBookingHistory(true);
    setShowOptions(null);
  };

  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading reservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Reservation Records</h1>
      </div>

      <div className="p-6">
        <TableControls
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalEntries={filteredReservations.length}
        />

        <ReservationsTable
          reservations={currentReservations}
          showOptions={showOptions}
          setShowOptions={setShowOptions}
          onViewBooking={handleViewBooking}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
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



