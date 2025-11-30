import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Reservation } from '../types/Reservation';

interface ReservationPickerProps {
    reservations: Reservation[];
    isOpen: boolean;
    onClose: () => void;
    onSelect: (reservation: Reservation) => void;
}

const ReservationPicker: React.FC<ReservationPickerProps> = ({
    reservations,
    isOpen,
    onClose,
    onSelect,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredReservations = reservations.filter(
        (res) =>
            res.guest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.reservation_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Select Reservation</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="p-4 border-b bg-gray-50">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by Guest Name, Reservation No, or Client Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-y-auto flex-1 p-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-sm text-gray-500 border-b">
                                <th className="py-2 px-3 font-medium">Select</th>
                                <th className="py-2 px-3 font-medium">Res No.</th>
                                <th className="py-2 px-3 font-medium">Guest Name</th>
                                <th className="py-2 px-3 font-medium">Check-in</th>
                                <th className="py-2 px-3 font-medium">Check-out</th>
                                <th className="py-2 px-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.length > 0 ? (
                                filteredReservations.map((res) => (
                                    <tr key={res.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-3">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                onChange={() => onSelect(res)}
                                            />
                                        </td>
                                        <td className="py-3 px-3 text-sm text-gray-700">{res.reservation_no}</td>
                                        <td className="py-3 px-3 text-sm font-medium text-gray-900">
                                            {res.guest_name || res.client_name}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-gray-600">
                                            {res.check_in_date ? new Date(res.check_in_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-gray-600">
                                            {res.check_out_date ? new Date(res.check_out_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-3">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${res.status === 'Confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : res.status === 'Pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        No reservations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationPicker;
