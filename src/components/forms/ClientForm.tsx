import React, { useState } from 'react';
import { Save, X, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import ClientInput from '../../ui/ClientInput';

interface ClientData {
  active: boolean;
  clientName: string;
  gstNo: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  faxNumber: string;
  mobileNumber: string;
  emailAddress: string;
  webAddress: string;
}

const ClientForm: React.FC = () => {
  const [formData, setFormData] = useState<ClientData>({
    active: true,
    clientName: '',
    gstNo: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    faxNumber: '',
    mobileNumber: '',
    emailAddress: '',
    webAddress: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.clientName.trim()) {
      setMessage({ type: 'error', text: 'Client Name is required' });
      return false;
    }
    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
  if (!validateForm()) return;

  setLoading(true);
  setMessage(null);

  try {
    const response = await fetch("http://localhost:5000/api/insertClient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // sending actual form data
    });

    const data = await response.json(); // parse JSON from backend

    if (response.ok && data.success) {
      setMessage({ type: "success", text: data.message });
      // Reset form or navigate
      // setFormData(initialFormData);  // optional
    } else {
      setMessage({ type: "error", text: data.message || "Something went wrong" });
    }
  } catch (error) {
    console.error("Error saving client:", error);
    setMessage({
      type: "error",
      text: "Failed to save client. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    setFormData({
      active: true,
      clientName: '',
      gstNo: '',
      streetAddress: '',
      streetAddress2: '',
      city: '',
      state: '',
      zipCode: '',
      phoneNumber: '',
      faxNumber: '',
      mobileNumber: '',
      emailAddress: '',
      webAddress: ''
    });
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
        
          
          <div className="flex items-center space-x-4">
            <HelpCircle className="h-5 w-5 hover:text-blue-200 cursor-pointer" />
            <Settings className="h-5 w-5 hover:text-blue-200 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Paras</span>
            </div>
            <LogOut className="h-5 w-5 hover:text-blue-200 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md">
          {/* Form Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-800">Client Form</h1>
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
            <div className={`mx-6 mt-4 p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                  />

                  <ClientInput
                    label="Street Address:"
                    name="streetAddress"
                    type="text"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="Street Address 2:"
                    name="streetAddress2"
                    type="text"
                    value={formData.streetAddress2}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="City:"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="State:"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="Zip Code:"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleInputChange}
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
                  />

                  <ClientInput
                    label="Fax Number:"
                    name="faxNumber"
                    type="tel"
                    value={formData.faxNumber}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="Mobile Number:"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="Email Address:"
                    name="emailAddress"
                    type="email"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                  />

                  <ClientInput
                    label="Web Address:"
                    name="webAddress"
                    type="url"
                    value={formData.webAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForm;