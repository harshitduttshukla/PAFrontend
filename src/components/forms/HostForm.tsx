import React, { useState } from 'react';
import { z } from 'zod';

// TypeScript interfaces
interface HostData {
  host_name: string;
  host_pan_number: string;
  rating: string;
  host_email: string;
  host_gst_numbers: string[];
  host_contact_number: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface SubmitStatus {
  type: 'success' | 'error';
  message: string;
}

interface ApiResponse {
  message: string;
  host: {
    host_id: number;
    host_name: string;
    host_pan_number: string;
    rating: string;
    host_email: string;
    host_contact_number: string;
  };
  gst_numbers: string[];
}

// Zod validation schema - updated to match backend
const hostSchema = z.object({
  host_name: z.string().min(3, "Name must be at least 3 characters").trim(),
  host_pan_number: z.string().length(10, "PAN must be exactly 10 characters").regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN format should be like ABCDE1234F"),
  rating: z.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  host_email: z.string().email("Invalid email format").min(1, "Email is required"),
  host_gst_numbers: z.array(z.string().min(15, "GST number must be exactly 15 characters").max(15, "GST number must be exactly 15 characters")).optional(),
  host_contact_number: z.string().regex(/^[0-9]{10}$/, "Contact must be exactly 10 digits").min(1, "Contact number is required"),
});

export default function HostDetailsForm(): React.JSX.Element {
  const [hostData, setHostData] = useState<HostData>({
    host_name: '',
    host_pan_number: '',
    rating: '',
    host_email: '',
    host_gst_numbers: [''], // Changed to array with single empty string
    host_contact_number: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleInputChange = (field: keyof HostData, value: string): void => {
    setHostData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Clear submit status when user makes changes
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  // Handle GST number changes
  const handleGSTChange = (index: number, value: string): void => {
    const newGSTNumbers = [...hostData.host_gst_numbers];
    newGSTNumbers[index] = value.toUpperCase();
    setHostData(prev => ({
      ...prev,
      host_gst_numbers: newGSTNumbers
    }));
    
    // Clear GST errors when user starts typing
    if (errors.host_gst_numbers) {
      setErrors(prev => ({
        ...prev,
        host_gst_numbers: ''
      }));
    }
    
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  // Add new GST number field
  const addGSTField = (): void => {
    setHostData(prev => ({
      ...prev,
      host_gst_numbers: [...prev.host_gst_numbers, '']
    }));
  };

  // Remove GST number field
  const removeGSTField = (index: number): void => {
    if (hostData.host_gst_numbers.length > 1) {
      const newGSTNumbers = hostData.host_gst_numbers.filter((_, i) => i !== index);
      setHostData(prev => ({
        ...prev,
        host_gst_numbers: newGSTNumbers
      }));
    }
  };

  const validateForm = (): boolean => {
    try {
      // Prepare data for validation
      const dataToValidate = {
        ...hostData,
        host_name: hostData.host_name.trim(),
        host_pan_number: hostData.host_pan_number.toUpperCase().trim(),
        rating: parseInt(hostData.rating) || 0,
        host_email: hostData.host_email.toLowerCase().trim(),
        host_gst_numbers: hostData.host_gst_numbers
          .map(gst => gst.toUpperCase().trim())
          .filter(gst => gst !== ''), // Remove empty GST numbers
        host_contact_number: hostData.host_contact_number.trim()
      };

      // Validate using Zod schema
      hostSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        const newErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
      console.error('Validation error:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // Prepare data for API - updated to match backend expectations
      const apiData = {
        host_name: hostData.host_name.trim(),
        host_pan_number: hostData.host_pan_number.toUpperCase().trim(),
        rating: parseInt(hostData.rating),
        host_email: hostData.host_email.toLowerCase().trim(),
        host_gst_numbers: hostData.host_gst_numbers
          .map(gst => gst.toUpperCase().trim())
          .filter(gst => gst !== ''), // Remove empty GST numbers
        host_contact_number: hostData.host_contact_number.trim()
      };

      // Validate using Zod schema first
      const validatedData = hostSchema.parse(apiData);
      // Replace with your actual API endpoint
      const response = await fetch('http://localhost:5000/api/hosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 400 && errorData.error) {
          // Handle validation errors from backend
          const backendErrors: ValidationErrors = {};
          errorData.error.forEach((err: any) => {
            if (err.path && err.path.length > 0) {
              backendErrors[err.path[0]] = err.message;
            }
          });
          setErrors(backendErrors);
          setSubmitStatus({ type: 'error', message: 'Please fix the validation errors' });
        } else {
          setSubmitStatus({ 
            type: 'error', 
            message: errorData.message || 'Failed to save host details' 
          });
        }
        return;
      }

      const result: ApiResponse = await response.json();
      console.log('Host created successfully:', result);
      
      // Updated success message to be more user-friendly
      const gstInfo = result.gst_numbers && result.gst_numbers.length > 0 
        ? ` GST numbers have also been registered.` 
        : '';
      
      setSubmitStatus({ 
        type: 'success', 
        message: `Great! Host "${result.host.host_name}" has been successfully created with ID #${result.host.host_id}.${gstInfo} You can now proceed to add more hosts or manage existing ones.`
      });
      
      // Reset form after successful submission
      setTimeout(() => {
        setHostData({
          host_name: '',
          host_pan_number: '',
          rating: '',
          host_email: '',
          host_gst_numbers: [''],
          host_contact_number: ''
        });
        setSubmitStatus(null);
      }, 4000); // Increased timeout to allow users to read the message

    } catch (error) {
      if (error instanceof z.ZodError && error.errors) {
        // Handle Zod validation errors
        const validationErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          if (err.path && err.path.length > 0) {
            validationErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(validationErrors);
        setSubmitStatus({ type: 'error', message: 'Please fix the validation errors' });
        return;
      }
      
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    setHostData({
      host_name: '',
      host_pan_number: '',
      rating: '',
      host_email: '',
      host_gst_numbers: [''],
      host_contact_number: ''
    });
    setErrors({});
    setSubmitStatus(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
     

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ADD HOST DETAILS</h1>
          <div className="h-1 w-32 bg-blue-600 rounded"></div>
        </div>

        {/* Success/Error Message */}
        {submitStatus && (
          <div className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === 'success' 
              ? 'bg-green-100 border border-green-300 text-green-800' 
              : 'bg-red-100 border border-red-300 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-3 ${
                submitStatus.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {submitStatus.message}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gray-100 px-8 py-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">HOST Information</h2>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Host Name */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Host Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hostData.host_name}
                  onChange={(e) => handleInputChange('host_name', e.target.value)}
                  placeholder="Enter Host Name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    errors.host_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.host_name && (
                  <p className="text-red-600 text-sm">{errors.host_name}</p>
                )}
              </div>

              {/* Host PAN Number */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Host PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={hostData.host_pan_number}
                  onChange={(e) => handleInputChange('host_pan_number', e.target.value.toUpperCase())}
                  placeholder="e.g., ABCDE1234F"
                  maxLength={10}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 uppercase ${
                    errors.host_pan_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.host_pan_number && (
                  <p className="text-red-600 text-sm">{errors.host_pan_number}</p>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Rating <span className="text-red-500">*</span>
                </label>
                <select
                  value={hostData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                    errors.rating ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
                {errors.rating && (
                  <p className="text-red-600 text-sm">{errors.rating}</p>
                )}
              </div>

              {/* Host Email */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Host Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={hostData.host_email}
                  onChange={(e) => handleInputChange('host_email', e.target.value)}
                  placeholder="Enter Host Email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    errors.host_email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.host_email && (
                  <p className="text-red-600 text-sm">{errors.host_email}</p>
                )}
              </div>

              {/* Host Contact Number */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Host Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={hostData.host_contact_number}
                  onChange={(e) => handleInputChange('host_contact_number', e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit Contact Number"
                  maxLength={10}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 ${
                    errors.host_contact_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.host_contact_number && (
                  <p className="text-red-600 text-sm">{errors.host_contact_number}</p>
                )}
              </div>

            </div>

            {/* Host GST Numbers Section */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Host GST Numbers (Optional)
                </label>
                <button
                  type="button"
                  onClick={addGSTField}
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                >
                  + Add GST Number
                </button>
              </div>
              
              <div className="space-y-4">
                {hostData.host_gst_numbers.map((gstNumber, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={gstNumber}
                        onChange={(e) => handleGSTChange(index, e.target.value)}
                        placeholder="Enter 15-digit GST Number"
                        maxLength={15}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 uppercase ${
                          errors.host_gst_numbers ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {hostData.host_gst_numbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeGSTField(index)}
                        className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Remove GST Number"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {errors.host_gst_numbers && (
                <p className="text-red-600 text-sm">{errors.host_gst_numbers}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 mt-12 pt-8 border-t">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Host Details'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}