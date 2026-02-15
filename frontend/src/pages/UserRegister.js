import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    age: '',
    gender: '',
    city: '',
    state: '',
    bloodGroup: '',
    medicalConditions: [],
    otherMedicalConditions: '',
    knownDrugAllergies: [],
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedArray = checked
        ? [...formData.medicalConditions, value]
        : formData.medicalConditions.filter(item => item !== value);
      setFormData({ ...formData, medicalConditions: updatedArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAllergiesChange = (e) => {
    const allergies = e.target.value.split(',').map(item => item.trim());
    setFormData({ ...formData, knownDrugAllergies: allergies });
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

    const submitData = { ...formData };
    delete submitData.confirmPassword;

    const result = await register(submitData, 'user');

    if (result.success) {
      navigate('/user/dashboard');
    } else {
      setErrors({ submit: result.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">User Registration</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {errors.submit}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="1"
                  max="150"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select Blood Group</option>
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
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Existing Medical Conditions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease', 'Liver Disease', 'Other'].map(condition => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      value={condition}
                      checked={formData.medicalConditions.includes(condition)}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">{condition}</span>
                  </label>
                ))}
              </div>
              {formData.medicalConditions.includes('Other') && (
                <input
                  type="text"
                  name="otherMedicalConditions"
                  value={formData.otherMedicalConditions}
                  onChange={handleChange}
                  placeholder="Specify other conditions"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              )}
            </div>

            {/* Drug Allergies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Drug Allergies
              </label>
              <input
                type="text"
                placeholder="Enter allergies separated by commas"
                onChange={handleAllergiesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-sm text-gray-500 mt-1">Example: Penicillin, Aspirin</p>
            </div>

            {/* Emergency Contact */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  required
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  required
                  pattern="[0-9]{10}"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link to="/login" className="text-primary-600 hover:text-primary-500">
                Already have an account? Sign in
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 text-white px-8 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
