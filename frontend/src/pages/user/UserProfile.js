import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal'); // personal, medical, doctor, security
  const [changePassword, setChangePassword] = useState(false);

  const [formData, setFormData] = useState({
    // Personal
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: '',
    city: '',
    state: '',

    // Medical
    bloodGroup: '',
    medicalConditions: [],
    otherMedicalConditions: '',
    knownDrugAllergies: [],
    chiefConcerns: '',

    // Doctor
    doctorDetails: {
      name: '',
      contact: '',
      hospital: '',
    },

    // Emergency
    emergencyContactName: '',
    emergencyContactPhone: '',

    // Security
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setFormData({
            fullName: response.data.data.fullName || '',
            phoneNumber: response.data.data.phoneNumber || '',
            age: response.data.data.age || '',
            gender: response.data.data.gender || '',
            city: response.data.data.city || '',
            state: response.data.data.state || '',
            bloodGroup: response.data.data.bloodGroup || 'Unknown',
            medicalConditions: response.data.data.medicalConditions || [],
            otherMedicalConditions: response.data.data.otherMedicalConditions || '',
            knownDrugAllergies: response.data.data.knownDrugAllergies || [],
            chiefConcerns: response.data.data.chiefConcerns || '',
            doctorDetails: response.data.data.doctorDetails || {
              name: '',
              contact: '',
              hospital: '',
            },
            emergencyContactName: response.data.data.emergencyContactName || '',
            emergencyContactPhone: response.data.data.emergencyContactPhone || '',
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } catch (err) {
        setError('Error fetching profile');
      }
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle doctor details change
  const handleDoctorChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      doctorDetails: {
        ...formData.doctorDetails,
        [name]: value,
      },
    });
  };

  // Handle medical condition toggle
  const handleMedicalConditionToggle = (condition) => {
    const conditions = formData.medicalConditions.includes(condition)
      ? formData.medicalConditions.filter((c) => c !== condition)
      : [...formData.medicalConditions, condition];
    setFormData({ ...formData, medicalConditions: conditions });
  };

  // Handle drug allergies (comma-separated input)
  const handleAllergiesChange = (e) => {
    const value = e.target.value;
    const allergies = value
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a !== '');
    setFormData({ ...formData, knownDrugAllergies: allergies });
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.phoneNumber || !formData.age) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/auth/profile', formData);

      if (response.data.success) {
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/auth/profile', {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setSuccess('Password changed successfully');
        setFormData({
          ...formData,
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setChangePassword(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">👤 My Profile</h1>
          <p className="text-gray-600">Manage your personal and medical information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-4 flex-wrap">
          {['personal', 'medical', 'doctor', 'security'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setChangePassword(false);
              }}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab === 'personal' && '👤 Personal'}
              {tab === 'medical' && '🏥 Medical'}
              {tab === 'doctor' && '👨‍⚕️ Doctor'}
              {tab === 'security' && '🔒 Security'}
            </button>
          ))}
        </div>

        {/* PERSONAL TAB */}
        {activeTab === 'personal' && (
          <form onSubmit={handleProfileUpdate} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="10-digit number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleFormChange}
                  min="1"
                  max="150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Personal Info'}
            </button>
          </form>
        )}

        {/* MEDICAL TAB */}
        {activeTab === 'medical' && (
          <form onSubmit={handleProfileUpdate} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Information</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Unknown">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Medical Conditions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease', 'Liver Disease'].map(
                    (condition) => (
                      <label key={condition} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.medicalConditions.includes(condition)}
                          onChange={() => handleMedicalConditionToggle(condition)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-2 text-gray-700">{condition}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Other Medical Conditions
                </label>
                <textarea
                  name="otherMedicalConditions"
                  value={formData.otherMedicalConditions}
                  onChange={handleFormChange}
                  placeholder="Describe any other conditions"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Known Drug Allergies
                </label>
                <input
                  type="text"
                  value={formData.knownDrugAllergies.join(', ')}
                  onChange={handleAllergiesChange}
                  placeholder="e.g., Penicillin, Aspirin, Ibuprofen (comma-separated)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Chief Concerns / Primary Health Issues
                </label>
                <textarea
                  name="chiefConcerns"
                  value={formData.chiefConcerns}
                  onChange={handleFormChange}
                  placeholder="Describe your main health concerns"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleFormChange}
                  placeholder="10-digit number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Medical Info'}
            </button>
          </form>
        )}

        {/* DOCTOR TAB */}
        {activeTab === 'doctor' && (
          <form onSubmit={handleProfileUpdate} className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Doctor Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.doctorDetails.name}
                  onChange={handleDoctorChange}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Doctor Contact
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={formData.doctorDetails.contact}
                  onChange={handleDoctorChange}
                  placeholder="Phone number or email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Hospital / Clinic Name
                </label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.doctorDetails.hospital}
                  onChange={handleDoctorChange}
                  placeholder="e.g., City Medical Center"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Save Doctor Info'}
            </button>
          </form>
        )}

        {/* SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Security</h2>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">Email Address</p>
                <p className="text-gray-600 break-all">{user?.email}</p>
              </div>

              {!changePassword ? (
                <button
                  onClick={() => setChangePassword(true)}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Old Password *
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      value={formData.oldPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      New Password *
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePassword(false);
                        setFormData({
                          ...formData,
                          oldPassword: '',
                          newPassword: '',
                          confirmPassword: '',
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
