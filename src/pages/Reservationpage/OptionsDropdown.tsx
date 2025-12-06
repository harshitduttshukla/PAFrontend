import { Calendar, Download, Eye, FileText, Home, Mail, User, XCircle } from "lucide-react";
import { Reservation } from "../../types/Reservation";

interface OptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestView: () => void;
  onApartmentView: () => void;
  onFullView: () => void;
  onGuestPDF: () => void;
  onApartmentPDF: () => void;
  onCancelBooking: () => void;
  onSendEmail: () => void;
  onEdit: () => void;
  booking: Reservation;
  isSendingEmail?: boolean;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  isOpen,
  onClose,
  onGuestView,
  onApartmentView,
  onFullView,
  onGuestPDF,
  onApartmentPDF,
  onCancelBooking,
  onSendEmail,
  onEdit,
  isSendingEmail = false
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'Guest View', onClick: onGuestView },
    { icon: Home, label: 'Apartment View', onClick: onApartmentView },
    { icon: Eye, label: 'View', onClick: onFullView },
    { icon: Calendar, label: 'Booking History' },
    { icon: FileText, label: 'Edit', onClick: onEdit },
    {
      icon: Mail,
      label: isSendingEmail ? 'Sending...' : 'Send Email',
      onClick: onSendEmail,
      disabled: isSendingEmail
    },
    { icon: Mail, label: 'Resend Email' },
    { icon: Download, label: 'Guest PDF', onClick: onGuestPDF },
    { icon: Download, label: 'Apartment PDF', onClick: onApartmentPDF },
    {
      icon: XCircle,
      label: 'Cancel Booking',
      danger: true,
      onClick: onCancelBooking,
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 transition-colors ${item.danger ? 'text-red-600' : 'text-gray-700'
            }`}
          onClick={() => {
            if (!item.disabled) {
              item.onClick?.();
              onClose();
            }
          }}
          disabled={item.disabled}
        >
          <item.icon size={16} />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default OptionsDropdown;