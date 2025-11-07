import React, { useState, useEffect } from 'react';
import { XCircle, Loader2, } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TableControls from './Reservationpage/TableControls';
import { Reservation } from '../types/Reservation';
import Pagination from './Reservationpage/Pagination';
import BookingHistoryModal from './Reservationpage/BookingHistory';
import GuestViewModal from './Reservationpage/GuestView';
import ApartmentViewModal from './Reservationpage/ApartmentView';
import ReservationsTable from './Reservationpage/ReservationsTable';
import CancelBookingModal from './Reservationpage/CancelBookingModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Main Component - Fixed with proper PDF download functionality
const ReservationList: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [showGuestView, setShowGuestView] = useState<boolean>(false);
  const [showApartmentView, setShowApartmentView] = useState<boolean>(false);
  const [showBookingHistory, setShowBookingHistory] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
   const [showCancelBooking, setShowCancelBooking] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Cancel Booking Function
  const handleCancelBooking = async (bookingId: number) => {
    try {
      setIsCancelling(true);
      
      const response = await fetch(`${API_BASE_URL}api/deleteReservation?id=${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the local state to remove the cancelled booking
        setReservations(prev => prev.filter(booking => booking.id !== bookingId));
        setFilteredReservations(prev => prev.filter(booking => booking.id !== bookingId));
        
        // Close modals
        setShowCancelBooking(false);
        setSelectedBooking(null);
            
            // Show success message (you can use a toast notification here)
            alert('Booking cancelled successfully!');
          } else {
            throw new Error(result.message || 'Failed to cancel booking');
          }
        } catch (err) {
          console.error('Error cancelling booking:', err);
          alert('Failed to cancel booking. Please try again.');
        } finally {
          setIsCancelling(false);
        }
      };

      // Handle Cancel Booking Click
      const handleCancelBookingClick = (booking: Reservation): void => {
        setSelectedBooking(booking);
        setShowCancelBooking(true);
        setShowOptions(null);
      };

      // Confirm Cancel Booking
      const confirmCancelBooking = (): void => {
        if (selectedBooking) {
          handleCancelBooking(selectedBooking.id);
        }
      };

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}api/getAllReservations`);
        
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

  // PDF Download Functions - Fixed implementation
  const downloadGuestPDF = async (booking: Reservation) => {
    try {
      // Create a temporary element for PDF generation
      const element = document.createElement('div');
      element.className = 'p-6 bg-white';
      element.innerHTML = `
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-blue-700">Guest Information</h1>
          <p class="text-gray-600">Reservation No: ${booking.reservation_no}</p>
          <p class="text-gray-600">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="space-y-4">
          ${[
            { label: 'Guest Name', value: booking.guest_name },
            { label: 'Guest Email', value: booking.guest_email },
            { label: 'Contact Number', value: booking.contact_number || 'N/A' },
            { label: 'Company Name', value: booking.client_name },
            { label: 'Occupancy', value: booking.occupancy.toString() + ' Person(s)' },
            { label: 'Check In', value: `${new Date(booking.check_in_date).toLocaleDateString()} at ${booking.check_in_time}` },
            { label: 'Check Out', value: `${new Date(booking.check_out_date).toLocaleDateString()} at ${booking.check_out_time}` },
            { label: 'Chargeable Days', value: booking.chargeable_days.toString() }
          ].map(field => `
            <div class="border-b pb-3">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-1">${field.label}</p>
              <p class="text-lg font-medium text-gray-800">${field.value}</p>
            </div>
          `).join('')}
        </div>
      `;

      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Guest_Details_${booking.reservation_no}.pdf`);
      
      // Clean up
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating guest PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const downloadApartmentPDF = async (booking: Reservation) => {
    try {
      // Create a temporary element for PDF generation
      const element = document.createElement('div');
      element.className = 'p-6 bg-white';
      element.innerHTML = `
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-green-700">Apartment Information</h1>
          <p class="text-gray-600">Reservation No: ${booking.reservation_no}</p>
          <p class="text-gray-600">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          ${[
            { label: 'Property Type', value: booking.property_type },
            { label: 'Room Type', value: booking.room_type },
            { label: 'City', value: booking.city },
            { label: 'Location', value: booking.location },
            { label: 'Address', value: `${booking.address1}, ${booking.address2}, ${booking.address3}`, fullWidth: true },
            { label: 'Landmark', value: booking.landmark || 'N/A' },
            { label: 'Master Bedroom', value: booking.master_bedroom?.toString() || 'N/A' },
            { label: 'Common Bedroom', value: booking.common_bedroom?.toString() || 'N/A' },
            { label: 'Contact Person', value: booking.contact_person || 'N/A' },
            { label: 'Contact Number', value: booking.contact_person_number || 'N/A' },
            { label: 'Caretaker Name', value: booking.caretaker_name || 'N/A' },
            { label: 'Caretaker Number', value: booking.caretaker_number || 'N/A' },
            { label: 'Property URL', value: booking.property_url || 'N/A', fullWidth: true }
          ].map(field => `
            <div class="${field.fullWidth ? 'col-span-2' : ''} border-b pb-3">
              <p class="text-sm font-semibold text-gray-600 uppercase mb-1">${field.label}</p>
              <p class="text-lg font-medium text-gray-800">${field.value}</p>
            </div>
          `).join('')}
        </div>
      `;

      document.body.appendChild(element);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Apartment_Details_${booking.reservation_no}.pdf`);
      
      // Clean up
      document.body.removeChild(element);
    } catch (error) {
      console.error('Error generating apartment PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredReservations.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentReservations = filteredReservations.slice(startIndex, endIndex);

  const handleGuestView = (booking: Reservation): void => {
    setSelectedBooking(booking);
    setShowGuestView(true);
    setShowOptions(null);
  };

  const handleApartmentView = (booking: Reservation): void => {
    setSelectedBooking(booking);
    setShowApartmentView(true);
    setShowOptions(null);
  };

  const handleBookingHistory = (booking: Reservation): void => {
    setSelectedBooking(booking);
    setShowBookingHistory(true);
    setShowOptions(null);
  };

  const handleGuestPDF = (booking: Reservation): void => {
    downloadGuestPDF(booking);
    setShowOptions(null);
  };

  const handleApartmentPDF = (booking: Reservation): void => {
    downloadApartmentPDF(booking);
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
          onGuestView={handleGuestView}
          onApartmentView={handleApartmentView}
          onBookingHistory={handleBookingHistory}
          onGuestPDF={handleGuestPDF}
          onApartmentPDF={handleApartmentPDF}
          onCancelBooking={handleCancelBookingClick}
        />

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <GuestViewModal
        isOpen={showGuestView}
        onClose={() => setShowGuestView(false)}
        booking={selectedBooking}
        onDownloadPDF={() => selectedBooking && downloadGuestPDF(selectedBooking)}
      />

      <ApartmentViewModal
        isOpen={showApartmentView}
        onClose={() => setShowApartmentView(false)}
        booking={selectedBooking}
        onDownloadPDF={() => selectedBooking && downloadApartmentPDF(selectedBooking)}
      />

      <BookingHistoryModal
        isOpen={showBookingHistory}
        onClose={() => setShowBookingHistory(false)}
        booking={selectedBooking}
      />

       <CancelBookingModal
        isOpen={showCancelBooking}
        onClose={() => {
          setShowCancelBooking(false);
          setSelectedBooking(null);
        }}
        onConfirm={confirmCancelBooking}
        booking={selectedBooking}
        isLoading={isCancelling}
      />
    </div>
  );
};

export default ReservationList;