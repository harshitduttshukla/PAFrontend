import { X } from "lucide-react";
import { Reservation } from "../../types/Reservation";



// BookingHistoryModal Component (Full Details)
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
          <h2 className="text-2xl font-semibold text-gray-800">Full View</h2>
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

export default BookingHistoryModal