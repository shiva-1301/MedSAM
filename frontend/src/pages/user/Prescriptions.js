import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Prescriptions = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    doctorName: '',
    doctorContact: '',
    hospitalName: '',
    visitDate: '',
    notes: '',
    file: null,
  });

  // Fetch prescriptions
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/prescriptions');
      if (response.data.success) {
        setPrescriptions(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // Handle form input change
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle upload prescription
  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      !formData.doctorName ||
      !formData.doctorContact ||
      !formData.hospitalName ||
      !formData.visitDate ||
      !formData.file
    ) {
      setError('All fields including file are required');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('doctorName', formData.doctorName);
      uploadFormData.append('doctorContact', formData.doctorContact);
      uploadFormData.append('hospitalName', formData.hospitalName);
      uploadFormData.append('visitDate', formData.visitDate);
      uploadFormData.append('notes', formData.notes);
      uploadFormData.append('file', formData.file);

      const response = await api.post('/prescriptions/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setSuccess('Prescription uploaded successfully');
        setFormData({
          doctorName: '',
          doctorContact: '',
          hospitalName: '',
          visitDate: '',
          notes: '',
          file: null,
        });
        setShowUploadForm(false);
        fetchPrescriptions();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error uploading prescription'
      );
    }
  };

  // Handle delete prescription
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        const response = await api.delete(`/prescriptions/${id}`);
        if (response.data.success) {
          fetchPrescriptions();
          setSuccess('Prescription deleted successfully');
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || 'Error deleting prescription'
        );
      }
    }
  };

  // Handle download prescription
  const handleDownload = (fileUrl, doctorName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `Prescription_${doctorName}_${new Date().getTime()}`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Digital Prescriptions
          </h1>
          <p className="text-gray-600">
            Upload and manage your medical prescriptions
          </p>
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

        {/* Upload Button */}
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="mb-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          {showUploadForm ? 'Cancel' : '+ Upload Prescription'}
        </button>

        {/* Upload Form */}
        {showUploadForm && (
          <form
            onSubmit={handleUpload}
            className="mb-6 bg-white rounded-lg shadow-md p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleFormChange}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Doctor Contact *
                </label>
                <input
                  type="text"
                  name="doctorContact"
                  value={formData.doctorContact}
                  onChange={handleFormChange}
                  placeholder="e.g., +1-800-123-4567"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Hospital/Clinic Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleFormChange}
                  placeholder="e.g., City Medical Center"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Visit Date *
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Any additional notes (optional)"
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2">
                  Upload File (PDF, JPEG, PNG) - Max 5MB *
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFormChange}
                  accept=".pdf,.jpeg,.jpg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formData.file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              Upload Prescription
            </button>
          </form>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {prescription.doctorName}
                  </h3>
                  <p className="text-yellow-600 font-semibold mb-2">
                    📍 {prescription.hospitalName}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>Contact:</strong> {prescription.doctorContact}
                    </p>
                    <p>
                      <strong>Visit Date:</strong>{' '}
                      {new Date(prescription.visitDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>File Type:</strong>{' '}
                      <span className="uppercase">{prescription.fileType}</span>
                    </p>
                  </div>
                  {prescription.notes && (
                    <p className="text-sm text-gray-700 mt-3 bg-gray-50 p-3 rounded">
                      <strong>Notes:</strong> {prescription.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() =>
                      handleDownload(
                        prescription.fileUrl,
                        prescription.doctorName
                      )
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => handleDelete(prescription._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No prescriptions uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
