import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const PharmacyProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    pharmacyAddress: '',
    city: '',
    state: '',
    pincode: '',
    phoneNumber: '',
    gstNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        pharmacyAddress: user.pharmacyAddress || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        phoneNumber: user.phoneNumber || '',
        gstNumber: user.gstNumber || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/pharmacy/profile', formData);
      console.log('Update response:', response.data);
      
      // Fetch the latest data from backend to ensure sync
      const profileResponse = await api.get('/pharmacy/profile');
      const updatedData = profileResponse.data.data;
      
      // Update user context
      const updatedUser = { ...user, ...updatedData };
      updateUser(updatedUser);
      
      // Update form data with the latest values from server
      setFormData({
        pharmacyAddress: updatedData.pharmacyAddress || '',
        city: updatedData.city || '',
        state: updatedData.state || '',
        pincode: updatedData.pincode || '',
        phoneNumber: updatedData.phoneNumber || '',
        gstNumber: updatedData.gstNumber || ''
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Update error:', err);
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Pharmacy Profile</h1>

          {message.text && (
            <div className={`px-4 py-3 rounded mb-6 ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message.text}
            </div>
          )}

          {/* Read-only Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Basic Information</h2>
            <div className="bg-gray-50 p-4 rounded-md space-y-2">
              <p><strong>Pharmacy Name:</strong> {user?.pharmacyName}</p>
              <p><strong>Owner Name:</strong> {user?.fullName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>License Number:</strong> {user?.licenseNumber}</p>
              <p><strong>Verification Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  user?.verificationStatus === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : user?.verificationStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user?.verificationStatus}
                </span>
              </p>
            </div>
          </div>

          {/* Editable Information */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Contact & Location</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pharmacy Address
                </label>
                <textarea
                  name="pharmacyAddress"
                  rows="3"
                  value={formData.pharmacyAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-8 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProfile;
