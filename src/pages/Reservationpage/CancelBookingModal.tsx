// Cancel Booking Modal Component
import { X, AlertTriangle, Loader2, XCircle } from 'lucide-react';
import { Reservation } from '../../types/Reservation';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  booking: Reservation | null;
  isLoading?: boolean;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  booking, 
  isLoading = false 
}) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <AlertTriangle className="mr-2" size={20} />
            Cancel Booking
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Are you sure you want to cancel this booking?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">
                Reservation: {booking.reservation_no}
              </p>
              <p className="text-red-700">
                Guest: {booking.guest_name}
              </p>
              <p className="text-red-700 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <XCircle size={16} />
              )}
              <span>Cancel Booking</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal