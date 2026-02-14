import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const PharmacyRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    pharmacyName: '',
    licenseNumber: '',
    gstNumber: '',
    pharmacyAddress: '',
    city: '',
    state: '',
    pincode: '',
    workingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '18:00' }
    }
  });

  const [licenseDocument, setLicenseDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLicenseDocument(e.target.files[0]);
  };

  const handleWorkingHoursChange = (day, type, value) => {
    setFormData({
      ...formData,
      workingHours: {
        ...formData.workingHours,
        [day]: {
          ...formData.workingHours[day],
          [type]: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (!licenseDocument) {
      setErrors({ licenseDocument: 'License document is required' });
      setLoading(false);
      return;
    }

    // Prepare form data for multipart upload
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'confirmPassword') {
        if (key === 'workingHours') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });
    submitData.append('licenseDocument', licenseDocument);

    try {
      const { data } = await api.post('/auth/register/pharmacy', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.data));
      
      navigate('/pharmacy/verification');
    } catch (error) {
      setErrors({ 
        submit: error.response?.data?.message || 'Registration failed' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Pharmacy Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    pattern="[0-9]{10}"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Pharmacy Details */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Pharmacy Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pharmacy Name *
                  </label>
                  <input
                    type="text"
                    name="pharmacyName"
                    required
                    value={formData.pharmacyName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drug License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Document (PDF/Image) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                  {errors.licenseDocument && (
                    <p className="text-red-600 text-sm mt-1">{errors.licenseDocument}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pharmacy Address *
                  </label>
                  <textarea
                    name="pharmacyAddress"
                    required
                    rows="3"
                    value={formData.pharmacyAddress}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
              <div className="space-y-3">
                {Object.keys(formData.workingHours).map(day => (
                  <div key={day} className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-medium capitalize">{day}</div>
                    <div>
                      <input
                        type="time"
                        value={formData.workingHours[day].open}
                        onChange={(e) => handleWorkingHoursChange(day, 'open', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        type="time"
                        value={formData.workingHours[day].close}
                        onChange={(e) => handleWorkingHoursChange(day, 'close', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Link to="/login" className="text-primary-600 hover:text-primary-500">
                Already have an account? Sign in
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-8 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Registering...' : 'Register Pharmacy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyRegister;
