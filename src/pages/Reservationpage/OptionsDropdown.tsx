// import { Calendar, Eye, FileText, Home, Mail, User, XCircle } from "lucide-react";

import { Reservation } from "../../types/Reservation";



// // OptionsDropdown Component
// interface OptionsDropdownProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onGuestView: () => void;
//   onApartmentView: () => void;
//   onBookingHistory: () => void;
// }

// const OptionsDropdown: React.FC<OptionsDropdownProps> = ({ 
//   isOpen, 
//   onClose, 
//   onGuestView,
//   onApartmentView,
//   onBookingHistory 
// }) => {
//   if (!isOpen) return null;

//   const menuItems = [
//     { icon: User, label: 'Guest View', onClick: onGuestView },
//     { icon: Home, label: 'Apartment View', onClick: onApartmentView },
//     { icon: Eye, label: 'View' },
//     { icon: Calendar, label: 'Booking History', onClick: onBookingHistory },
//     { icon: FileText, label: 'Edit' },
//     { icon: Mail, label: 'Send Email' },
//     { icon: Mail, label: 'Resend Email' },
//     { icon: FileText, label: 'Guest PDF' },
//     { icon: FileText, label: 'Apartment PDF' },
//     { icon: XCircle, label: 'Cancel Booking', danger: true }
//   ];

//   return (
//     <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
//       {menuItems.map((item, index) => (
//         <button
//           key={index}
//           className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 transition-colors ${
//             item.danger ? 'text-red-600' : 'text-gray-700'
//           }`}
//           onClick={() => {
//             item.onClick?.();
//             onClose();
//           }}
//         >
//           <item.icon size={16} />
//           <span>{item.label}</span>
//         </button>
//       ))}
//     </div>
//   );
// };


// export default OptionsDropdown;





import { Calendar, Download, Eye, FileText, Home, Mail, User, XCircle } from "lucide-react";

// OptionsDropdown Component - Fixed with proper PDF handlers
interface OptionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestView: () => void;
  onApartmentView: () => void;
  onBookingHistory: () => void;
  onGuestPDF: () => void;
  onApartmentPDF: () => void;
  booking: Reservation;
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({ 
  isOpen, 
  onClose, 
  onGuestView,
  onApartmentView,
  onBookingHistory,
  onGuestPDF,
  onApartmentPDF,
  
}) => {
  if (!isOpen) return null;

  const menuItems = [
    { icon: User, label: 'Guest View', onClick: onGuestView },
    { icon: Home, label: 'Apartment View', onClick: onApartmentView },
    { icon: Eye, label: 'View' },
    { icon: Calendar, label: 'Booking History', onClick: onBookingHistory },
    { icon: FileText, label: 'Edit' },
    { icon: Mail, label: 'Send Email' },
    { icon: Mail, label: 'Resend Email' },
    { icon: Download, label: 'Guest PDF', onClick: onGuestPDF },
    { icon: Download, label: 'Apartment PDF', onClick: onApartmentPDF },
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


export default OptionsDropdown;