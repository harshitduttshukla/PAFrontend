import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import { Reservation } from '../../types/Reservation';
import ReservationPicker from '../ReservationPicker';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface FormData {
  stateForBilling: string;
  displayFoodCharge: string;
  extraServices: string;
  servicesName: string;
  servicesAmount: string;
  date: string;
  pan: string;
  roundOffValue: string;
  guestNameWidth: string;
  displayCurrencyConversion: string;
  status: string;
  paymentMethod: string;
  pdfPassword: string;
  invoiceTo: string;
  pageBreak: string;
  displayTaxes: string;
  apartmentBillNo: string;
  currency: string;
  conversionRate: string;
}

interface CompanyInfo {
  name: string;
  address: string;
  email: string;
}

const InvoiceForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    stateForBilling: 'Maharashtra',
    displayFoodCharge: 'Yes',
    extraServices: 'No',
    servicesName: '',
    servicesAmount: '0.00',
    date: new Date().toLocaleDateString(),
    pan: '',
    roundOffValue: '',
    guestNameWidth: '18.00',
    displayCurrencyConversion: 'No',
    status: 'Draft',
    paymentMethod: 'Select the Payment Method',
    pdfPassword: '',
    invoiceTo: '',
    pageBreak: '5',
    displayTaxes: 'SGST & CGST',
    apartmentBillNo: '',
    currency: 'INR',
    conversionRate: '1.0000'
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Snowfax Technologies Pvt Ltd, Bhiwandi, Thana District',
    address: 'Floor, A/7, Gala No. 1,2,3,27,28,29,\nPooja Market, Anjur Phata,\nThana District, Maharashtra, 421302',
    email: 'hello@snowfax.in'
  });

  const [lineItems, setLineItems] = useState([
    { location: '', foodTariff: '', gstId: '', cgstId: '', days: '', tariff: '', tax: '', sgst: '', cgst: '', igst: '', total: '' }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState<boolean>(false);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoadingReservations(true);
        const response = await fetch(`${API_BASE_URL}api/getAllReservations`);
        if (response.ok) {
          const result = await response.json();
          setReservations(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoadingReservations(false);
      }
    };
    fetchReservations();
  }, []);

  const handleReservationSelect = (reservation: Reservation) => {
    setFormData(prev => ({
      ...prev,
      invoiceTo: reservation.guest_name || reservation.client_name || '',
      date: reservation.check_in_date ? new Date(reservation.check_in_date).toLocaleDateString() : prev.date,
      apartmentBillNo: reservation.reservation_no || '',
      stateForBilling: reservation.state || prev.stateForBilling,
    }));

    // Construct address from reservation details
    const addressParts = [
      reservation.address1,
      reservation.address2,
      reservation.address3,
      reservation.city,
      reservation.state,
      reservation.zip_code
    ].filter(Boolean);

    setCompanyInfo({
      name: reservation.client_name || 'Snowfax Technologies Pvt Ltd',
      address: addressParts.length > 0 ? addressParts.join(', ') : 'Address not available',
      email: reservation.email_id || 'hello@snowfax.in'
    });

    setLineItems([{
      location: reservation.location || reservation.city || '',
      foodTariff: '0',
      gstId: '0',
      cgstId: '0',
      days: reservation.chargeable_days?.toString() || '0',
      tariff: reservation.base_rate || '0',
      tax: reservation.taxes || '0',
      sgst: '',
      cgst: '',
      igst: '',
      total: reservation.total_tariff || '0'
    }]);

    setIsPickerOpen(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate Totals
  const calculateTotals = () => {
    let totalWithoutGST = 0;
    let totalTax = 0;
    let totalWithGST = 0;

    lineItems.forEach(item => {
      const tariff = parseFloat(item.tariff) || 0;
      totalWithoutGST += tariff;
      totalTax += parseFloat(item.tax) || 0;
      totalWithGST += parseFloat(item.total) || 0;
    });

    let sgst = 0;
    let cgst = 0;
    let igst = 0;

    if (formData.displayTaxes === 'SGST & CGST') {
      sgst = totalTax / 2;
      cgst = totalTax / 2;
    } else {
      igst = totalTax;
    }

    return {
      totalWithoutGST: totalWithoutGST.toFixed(2),
      sgst: sgst.toFixed(2),
      cgst: cgst.toFixed(2),
      igst: igst.toFixed(2),
      totalWithGST: totalWithGST.toFixed(2)
    };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      {/* Success Message */}
      <div className="bg-green-100 text-green-800 px-6 py-3 border-b border-green-200">
        Successfully created
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Company Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-blue-600 mb-2">
            {companyInfo.name}
          </h1>
          <p className="text-gray-600 text-sm whitespace-pre-line">
            {companyInfo.address}
          </p>
          <p className="text-gray-600 text-sm mt-2">{companyInfo.email}</p>
        </div>

        {/* Reservation Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Reservation to Populate Invoice
          </label>
          <button
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loadingReservations}
          >
            <Search size={18} />
            {loadingReservations ? 'Loading Reservations...' : 'Select Reservation'}
          </button>
        </div>

        <ReservationPicker
          reservations={reservations}
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelect={handleReservationSelect}
        />

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State For Billing
              </label>
              <select
                value={formData.stateForBilling}
                onChange={(e) => handleInputChange('stateForBilling', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Maharashtra</option>
                <option>Gujarat</option>
                <option>Karnataka</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Food Charge
              </label>
              <select
                value={formData.displayFoodCharge}
                onChange={(e) => handleInputChange('displayFoodCharge', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extra Services
              </label>
              <select
                value={formData.extraServices}
                onChange={(e) => handleInputChange('extraServices', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Name #
              </label>
              <input
                type="text"
                value={formData.servicesName}
                onChange={(e) => handleInputChange('servicesName', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services Amount #
              </label>
              <input
                type="text"
                value={formData.servicesAmount}
                onChange={(e) => handleInputChange('servicesAmount', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN #
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Round off Value
              </label>
              <input
                type="text"
                value={formData.roundOffValue}
                onChange={(e) => handleInputChange('roundOffValue', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guest Name Width
              </label>
              <input
                type="text"
                value={formData.guestNameWidth}
                onChange={(e) => handleInputChange('guestNameWidth', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Currency Conversion
              </label>
              <select
                value={formData.displayCurrencyConversion}
                onChange={(e) => handleInputChange('displayCurrencyConversion', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-gray-400">(Can be changed)</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Draft</option>
                <option>Sent</option>
                <option>Paid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Select the Payment Method</option>
                <option>Cash</option>
                <option>Credit Card</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF password (optional)
              </label>
              <input
                type="text"
                value={formData.pdfPassword}
                onChange={(e) => handleInputChange('pdfPassword', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice To
              </label>
              <input
                type="text"
                value={formData.invoiceTo}
                onChange={(e) => handleInputChange('invoiceTo', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Break
              </label>
              <input
                type="text"
                value={formData.pageBreak}
                onChange={(e) => handleInputChange('pageBreak', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Taxes
              </label>
              <select
                value={formData.displayTaxes}
                onChange={(e) => handleInputChange('displayTaxes', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>SGST & CGST</option>
                <option>IGST</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment Bill No.
              </label>
              <input
                type="text"
                value={formData.apartmentBillNo}
                onChange={(e) => handleInputChange('apartmentBillNo', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conversion Rate
              </label>
              <input
                type="text"
                value={formData.conversionRate}
                onChange={(e) => handleInputChange('conversionRate', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Location</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Food Tariff</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">G.I.D</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">C.G.I.D</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Days</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Tariff</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Tax</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">SGST</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">CGST</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">IGST</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.location}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>Food Tariff</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>Food Tax</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
                      <option>C.G.I.D</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.days}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.tariff}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.tax}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      readOnly
                    />
                  </td>
                  <td className="px-3 py-2 text-sm">SGST</td>
                  <td className="px-3 py-2 text-sm">CGST</td>
                  <td className="px-3 py-2 text-sm">IGST</td>
                  <td className="px-3 py-2 text-sm">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option>Food Charges</option>
            </select>
          </div>
          <div className="px-4 pb-4">
            <div className="text-sm text-gray-600 mb-2">Food SGST &nbsp;&nbsp;&nbsp; Food CGST &nbsp;&nbsp;&nbsp; Food IGST</div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">+ Add Reservation</button>
          </div>
        </div>

        {/* Totals Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Total Amount without GST</span>
              <span className="font-semibold">₹{totals.totalWithoutGST}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">SGST</span>
              <span className="font-semibold">₹{totals.sgst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">CGST</span>
              <span className="font-semibold">₹{totals.cgst}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">IGST</span>
              <span className="font-semibold">₹{totals.igst}</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-3 border-t">
              <span>Total Amount with GST</span>
              <span>₹{totals.totalWithGST}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Options
          </button>
          <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2">
            <span>✓</span> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;