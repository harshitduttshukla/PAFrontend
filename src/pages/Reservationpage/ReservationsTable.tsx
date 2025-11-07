import { Settings } from "lucide-react";
import { Reservation } from "../../types/Reservation";
import OptionsDropdown from "./OptionsDropdown";
import StatusBadge from "./StatusBadge";

interface ReservationsTableProps {
  reservations: Reservation[];
  showOptions: number | null;
  setShowOptions: (id: number | null) => void;
  onGuestView: (booking: Reservation) => void;
  onApartmentView: (booking: Reservation) => void;
  onBookingHistory: (booking: Reservation) => void;
  onGuestPDF: (booking: Reservation) => void;
  onApartmentPDF: (booking: Reservation) => void;
  onCancelBooking: (booking: Reservation) => void;
}

const ReservationsTable: React.FC<ReservationsTableProps> = ({
  reservations,
  showOptions,
  setShowOptions,
  onGuestView,
  onApartmentView,
  onBookingHistory,
  onGuestPDF,
  onApartmentPDF,
   onCancelBooking
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
                      <span>Options</span>
                    </button>
                    
                    {showOptions === reservation.id && (
                      <OptionsDropdown
                      isOpen={showOptions === reservation.id}
                        onClose={() => setShowOptions(null)}
                        onGuestView={() => onGuestView(reservation)}
                        onApartmentView={() => onApartmentView(reservation)}
                        onBookingHistory={() => onBookingHistory(reservation)}
                        onGuestPDF={() => onGuestPDF(reservation)}
                        onApartmentPDF={() => onApartmentPDF(reservation)}
                        onCancelBooking={() => onCancelBooking(reservation)}
                        booking={reservation}
                      />
                    )}
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
  export default ReservationsTable