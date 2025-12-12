import React, { useEffect, useState } from "react";
import { X, History, ChevronRight, ChevronDown } from "lucide-react";
import { Reservation } from "../../types/Reservation";

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation | null;
}

const BookingHistoryModal: React.FC<BookingHistoryModalProps> = ({ isOpen, onClose, booking }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  console.log("Bokking ", booking);


  useEffect(() => {
    if (isOpen && booking) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [isOpen, booking]);

  const fetchHistory = async () => {
    if (!booking) return;
    try {
      setLoadingHistory(true);
      const response = await fetch(`${API_BASE_URL}api/getReservationHistory?id=${booking.id}`);
      const result = await response.json();
      if (result.success) {
        setHistory(result.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!isOpen || !booking) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentFields = [
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
    { label: 'Chargeable Days', value: booking.chargeable_days?.toString(), highlight: true },
    { label: 'Base Rate', value: `₹${booking.base_rate}`, highlight: true },
    { label: 'Taxes', value: `${booking.taxes}%`, highlight: true },
    { label: 'Total Tariff', value: `₹${booking.total_tariff}`, highlight: true },
    { label: 'Room Type', value: booking.room_type, highlight: true },
    { label: 'Payment Mode of Guest', value: booking.payment_mode || 'N/A', highlight: true },
    { label: 'Tariff Type of Guest', value: booking.tariff_type || 'N/A', highlight: true },
    { label: 'Occupancy', value: booking.occupancy?.toString() },
    { label: 'Apartment Type', value: booking.apartment_type, highlight: true },
    { label: 'Host Payment Mode', value: booking.host_payment_mode, highlight: true },
    { label: 'Property Type', value: booking.property_type, highlight: true },
    { label: 'City', value: booking.city },
    { label: 'Location', value: booking.location },
    { label: 'Property Address', value: `${booking.address1}, ${booking.address2}, ${booking.address3}`, highlight: true, fullWidth: true },
    { label: 'Landmark', value: booking.landmark || 'N/A' },
    { label: 'Contact Person', value: booking.contact_person || 'N/A', highlight: true },
    { label: 'Contact Number', value: booking.contact_person_number || 'N/A' },
    { label: 'Caretaker Name', value: booking.caretaker_name || 'N/A' },
    { label: 'Caretaker Number', value: booking.caretaker_number || 'N/A', highlight: true },
    { label: 'GST Number', value: booking.gst_no || 'N/A' },
    { label: 'State', value: booking.state },
    { label: 'ZIP Code', value: booking.zip_code },
    { label: 'Status', value: booking.status?.toUpperCase(), highlight: true },
    { label: 'Property URL', value: booking.property_url || '-', fullWidth: true }
  ];

  const toggleVersion = (index: number) => {
    setExpandedVersion(expandedVersion === index ? null : index);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            Booking History
            <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {booking.reservation_no}
            </span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Current Version */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
              Current Version
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
              {currentFields.map((field, index) => (
                <div key={index} className={field.fullWidth ? 'col-span-full' : ''}>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{field.label}</p>
                  <p className={`font-medium break-words ${field.highlight ? 'text-gray-900' : 'text-gray-700'}`}>
                    {field.value || '-'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Previous Versions */}
          <div>
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
              <History className="mr-2" size={20} />
              Previous Versions
            </h3>

            {loadingHistory ? (
              <div className="text-center py-8 text-gray-500">Loading history...</div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-gray-100">
                No previous versions found.
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((version, index) => {
                  const data = version.snapshot_data;
                  // Helper to parse if data is string (double serialization check)
                  const snapshot = typeof data === 'string' ? JSON.parse(data) : data;

                  return (
                    <div key={version.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => toggleVersion(index)}
                      >
                        <div className="flex items-center space-x-4">
                          {expandedVersion === index ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
                          <div>
                            <p className="font-medium text-gray-800">Version {history.length - index}</p>
                            <p className="text-sm text-gray-500">{new Date(version.change_date).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {snapshot.guest_name} • {snapshot.reservation_no}
                        </div>
                      </div>

                      {expandedVersion === index && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                              { l: 'Guest Name', v: snapshot.guest_name },
                              { l: 'Check In', v: formatDate(snapshot.check_in_date) },
                              { l: 'Check Out', v: formatDate(snapshot.check_out_date) },
                              { l: 'Total Tariff', v: `₹${snapshot.total_tariff}` },
                              { l: 'Occupancy', v: snapshot.occupancy },
                              { l: 'Room Type', v: snapshot.room_type },
                              { l: 'Status', v: snapshot.status },
                            ].map((item, i) => (
                              <div key={i}>
                                <p className="text-xs text-gray-500 uppercase">{item.l}</p>
                                <p className="font-medium text-gray-800">{item.v}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Full Snapshot Data (Debug)</h4>
                            <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(snapshot, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryModal;