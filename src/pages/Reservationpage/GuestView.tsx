import { useRef } from "react";
import { Reservation } from "../../types/Reservation";
import { Download, User, X } from "lucide-react";

// Guest View Modal Component
interface GuestViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation | null;
  onDownloadPDF: () => void;
}

const GuestViewModal: React.FC<GuestViewModalProps> = ({ isOpen, onClose, booking, onDownloadPDF }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const guestFields = [
    { label: 'Guest Name', value: booking.guest_name },
    { label: 'Guest Email', value: booking.guest_email },
    { label: 'Contact Number', value: booking.contact_number || 'N/A' },
    { label: 'Company Name', value: booking.client_name },
    { label: 'Occupancy', value: booking.occupancy.toString() + ' Person(s)' },
    { label: 'Check In', value: `${formatDate(booking.check_in_date)} at ${booking.check_in_time}` },
    { label: 'Check Out', value: `${formatDate(booking.check_out_date)} at ${booking.check_out_time}` },
    { label: 'Chargeable Days', value: booking.chargeable_days.toString() }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-md w-full guest-modal-content">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <User className="mr-2" size={20} />
            Guest Information - {booking.reservation_no}
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={onDownloadPDF}
              className="text-white hover:text-gray-200 transition-colors flex items-center space-x-1"
              title="Download as PDF"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {guestFields.map((field, index) => (
              <div key={index} className="border-b pb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{field.label}</p>
                <p className="font-medium text-gray-800">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default GuestViewModal;