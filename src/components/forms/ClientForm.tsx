import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { z } from 'zod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ClientFormData {
  id?: number;
  clientName: string;
  emailAddress: string;
  phoneNumber: string;
  mobileNumber: string;
  active: boolean;
  gstNo: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;
  faxNumber: string;
  webAddress: string;
}

interface ClientInputProps {
  label: string;
  name: string;
  type?: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const ClientInput = ({ label, name, type = "text", value, onChange, placeholder, error }: ClientInputProps) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Zod Schema
const clientSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  emailAddress: z.string().email("Invalid email address").optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  active: z.boolean(),
  // GST Validation: Exactly 15 chars, strict regex
  gstNo: z.string()
    .length(15, "GST Number must be exactly 15 characters")
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST Number format (e.g., 22AAAAA0000A1Z5)")
    .optional()
    .or(z.literal('')),
  streetAddress: z.string().optional(),
  streetAddress2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  faxNumber: z.string().optional(),
  webAddress: z.string().optional(),
});


const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ClientFormData>({
    clientName: '',
    emailAddress: '',
    phoneNumber: '',
    mobileNumber: '',
    active: true,
    gstNo: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipCode: '',
    faxNumber: '',
    webAddress: ''
  });

  useEffect(() => {
    if (location.state && location.state.client) {
      const client = location.state.client;
      setIsEditMode(true);
      setFormData({
        id: client.id,
        clientName: client.client_name,
        emailAddress: client.email_address,
        phoneNumber: client.phone_number,
        mobileNumber: client.mobile_number,
        active: client.active,
        gstNo: client.gst_no,
        streetAddress: client.street_address,
        streetAddress2: client.street_address_2,
        city: client.city,
        state: client.state,
        zipCode: client.zip_code,
        faxNumber: client.fax_number,
        webAddress: client.web_address
      });
    }
  }, [location.state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for field on change
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCancel = () => {
    navigate('/ClientLast');
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    setErrors({});

    // Zod Validation
    const validationResult = clientSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach(issue => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setLoading(false);
      // Optional: Show a general error message
      setMessage({ type: 'error', text: 'Please fix the validation errors.' });
      return;
    }

    try {
      const url = isEditMode
        ? `${API_BASE_URL}api/updateClient/${formData.id}`
        : `${API_BASE_URL}api/insertClient`;

      const method = isEditMode ? 'PUT' : 'POST';

      const payload = {
        client_name: formData.clientName,
        email_address: formData.emailAddress,
        phone_number: formData.phoneNumber,
        mobile_number: formData.mobileNumber,
        active: formData.active,
        gst_no: formData.gstNo,
        street_address: formData.streetAddress,
        street_address_2: formData.streetAddress2,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        fax_number: formData.faxNumber,
        web_address: formData.webAddress
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success || result.message) {
        setMessage({ type: 'success', text: `Client ${isEditMode ? 'updated' : 'created'} successfully!` });
        setTimeout(() => {
          navigate('/ClientLast');
        }, 1500);
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error saving client:', err);
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save client' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Form Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">{isEditMode ? 'Edit Client' : 'New Client'}</h1>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="Client Name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.clientName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address and Contact Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Address</h3>
              <div className="space-y-4">
                <ClientInput
                  label="GST NO:"
                  name="gstNo"
                  type="text"
                  value={formData.gstNo}
                  onChange={handleInputChange}
                  error={errors.gstNo}
                />

                <ClientInput
                  label="Street Address:"
                  name="streetAddress"
                  type="text"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  error={errors.streetAddress}
                />

                <ClientInput
                  label="Street Address 2:"
                  name="streetAddress2"
                  type="text"
                  value={formData.streetAddress2}
                  onChange={handleInputChange}
                  error={errors.streetAddress2}
                />

                <ClientInput
                  label="City:"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={errors.city}
                />

                <ClientInput
                  label="State:"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={errors.state}
                />

                <ClientInput
                  label="Zip Code:"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  error={errors.zipCode}
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <ClientInput
                  label="Phone Number:"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  error={errors.phoneNumber}
                />

                <ClientInput
                  label="Fax Number:"
                  name="faxNumber"
                  type="tel"
                  value={formData.faxNumber}
                  onChange={handleInputChange}
                  error={errors.faxNumber}
                />

                <ClientInput
                  label="Mobile Number:"
                  name="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  error={errors.mobileNumber}
                />

                <ClientInput
                  label="Email Address:"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  error={errors.emailAddress}
                />

                <ClientInput
                  label="Web Address:"
                  name="webAddress"
                  type="url"
                  value={formData.webAddress}
                  onChange={handleInputChange}
                  error={errors.webAddress}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientForm;