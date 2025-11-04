// import React from "react";
// import { Reservation } from "../../types/Reservation";
// import { Home, X } from "lucide-react";

import { useRef } from "react";
import { Reservation } from "../../types/Reservation";
import { Download, Home, X } from "lucide-react";



// // Apartment View Modal Component
// interface ApartmentViewModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   booking: Reservation | null;
// }

// const ApartmentViewModal: React.FC<ApartmentViewModalProps> = ({ isOpen, onClose, booking }) => {
//   if (!isOpen || !booking) return null;

//   const apartmentFields = [
//     { label: 'Property Type', value: booking.property_type },
//     { label: 'Room Type', value: booking.room_type },
//     { label: 'City', value: booking.city },
//     { label: 'Location', value: booking.location },
//     { label: 'Address', value: `${booking.address1}, ${booking.address2}, ${booking.address3}`, fullWidth: true },
//     { label: 'Landmark', value: booking.landmark || 'N/A' },
//     { label: 'Master Bedroom', value: booking.master_bedroom?.toString() || 'N/A' },
//     { label: 'Common Bedroom', value: booking.common_bedroom?.toString() || 'N/A' },
//     { label: 'Contact Person', value: booking.contact_person || 'N/A' },
//     { label: 'Contact Number', value: booking.contact_person_number || 'N/A' },
//     { label: 'Caretaker Name', value: booking.caretaker_name || 'N/A' },
//     { label: 'Caretaker Number', value: booking.caretaker_number || 'N/A' },
//     { label: 'Property URL', value: booking.property_url || 'N/A', fullWidth: true, link: true }
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center rounded-t-lg sticky top-0">
//           <h2 className="text-xl font-semibold text-white flex items-center">
//             <Home className="mr-2" size={20} />
//             Apartment Information
//           </h2>
//           <button 
//             onClick={onClose}
//             className="text-white hover:text-gray-200 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>
        
//         <div className="p-6">
//           <div className="grid grid-cols-2 gap-4">
//             {apartmentFields.map((field, index) => (
//               <div key={index} className={`${field.fullWidth ? 'col-span-2' : ''} border-b pb-3`}>
//                 <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{field.label}</p>
//                 {field.link && field.value !== 'N/A' ? (
//                   <a 
//                     href={field.value} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="font-medium text-blue-600 hover:underline break-all"
//                   >
//                     {field.value}
//                   </a>
//                 ) : (
//                   <p className="font-medium text-gray-800">{field.value}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApartmentViewModal;







// Apartment View Modal Component
interface ApartmentViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation | null;
  onDownloadPDF: () => void;
}

const ApartmentViewModal: React.FC<ApartmentViewModalProps> = ({ isOpen, onClose, booking, onDownloadPDF }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !booking) return null;

  const apartmentFields = [
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
    { label: 'Property URL', value: booking.property_url || 'N/A', fullWidth: true, link: true }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto apartment-modal-content">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex justify-between items-center rounded-t-lg sticky top-0">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Home className="mr-2" size={20} />
            Apartment Information - {booking.reservation_no}
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
          <div className="grid grid-cols-2 gap-4">
            {apartmentFields.map((field, index) => (
              <div key={index} className={`${field.fullWidth ? 'col-span-2' : ''} border-b pb-3`}>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{field.label}</p>
                {field.link && field.value !== 'N/A' ? (
                  <a 
                    href={field.value} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline break-all"
                  >
                    {field.value}
                  </a>
                ) : (
                  <p className="font-medium text-gray-800">{field.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default ApartmentViewModal;