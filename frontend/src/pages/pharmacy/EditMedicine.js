import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const EditMedicine = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    manufacturer: '',
    category: '',
    composition: '',
    stockQuantity: '',
    price: '',
    mrp: '',
    manufacturingDate: '',
    expiryDate: '',
    description: '',
    dosage: '',
    sideEffects: '',
    precautions: '',
    prescriptionRequired: false
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Other'];

  useEffect(() => {
    fetchMedicine();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMedicine = async () => {
    try {
      const { data } = await api.get(`/medicines/${id}`);
      const medicine = data.data;
      
      setFormData({
        name: medicine.name || '',
        genericName: medicine.genericName || '',
        manufacturer: medicine.manufacturer || '',
        category: medicine.category || '',
        composition: medicine.composition || '',
        stockQuantity: medicine.stockQuantity || '',
        price: medicine.price || '',
        mrp: medicine.mrp || '',
        manufacturingDate: medicine.manufacturingDate?.split('T')[0] || '',
        expiryDate: medicine.expiryDate?.split('T')[0] || '',
        description: medicine.description || '',
        dosage: medicine.dosage || '',
        sideEffects: medicine.sideEffects?.join(', ') || '',
        precautions: medicine.precautions?.join(', ') || '',
        prescriptionRequired: medicine.prescriptionRequired || false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load medicine');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'sideEffects' || key === 'precautions') {
        const array = formData[key].split(',').map(item => item.trim()).filter(item => item);
        submitData.append(key, JSON.stringify(array));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    if (image) {
      submitData.append('image', image);
    }

    try {
      await api.put(`/medicines/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Medicine updated successfully!');
      navigate('/pharmacy/medicines');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update medicine');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Medicine</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Generic Name
                </label>
                <input
                  type="text"
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  required
                  min="0"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  required
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/pharmacy/medicines')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-600 text-white px-8 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Updating...' : 'Update Medicine'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMedicine;
