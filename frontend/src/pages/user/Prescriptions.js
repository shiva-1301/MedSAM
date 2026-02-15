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
  const handleDownload = async (fileUrl, doctorName) => {
    try {
      const backendURL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';
      const cleanFileUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
      const fullUrl = `${backendURL}${cleanFileUrl}`;
      
      // Fetch the file as a blob
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error('Failed to download prescription');
      }
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create download link and trigger it
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `Prescription_${doctorName}_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download prescription. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Medical Prescriptions
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Upload and manage your medical prescriptions
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded">
            {success}
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="mb-6 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm text-sm md:text-base w-full md:w-auto"
        >
          {showUploadForm ? 'Cancel' : '+ Upload Prescription'}
        </button>

        {/* Upload Form */}
        {showUploadForm && (
          <form
            onSubmit={handleUpload}
            className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleFormChange}
                  placeholder="e.g., Dr. John Smith"
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Doctor Contact *
                </label>
                <input
                  type="text"
                  name="doctorContact"
                  value={formData.doctorContact}
                  onChange={handleFormChange}
                  placeholder="e.g., +1-800-123-4567"
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Hospital/Clinic Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleFormChange}
                  placeholder="e.g., City Medical Center"
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Visit Date *
                </label>
                <input
                  type="date"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleFormChange}
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  placeholder="Any additional notes (optional)"
                  rows="2"
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Upload File (PDF, JPEG, PNG) - Max 5MB *
                </label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFormChange}
                  accept=".pdf,.jpeg,.jpg,.png"
                  className="w-full px-3 md:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.file && (
                  <p className="text-sm text-blue-600 mt-2">
                    Selected: {formData.file.name}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full px-6 py-2 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm text-sm md:text-base"
            >
              Upload Prescription
            </button>
          </form>
        )}

        {/* Prescriptions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading prescriptions...</p>
          </div>
        ) : prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {prescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition"
              >
                <div className="mb-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                    {prescription.doctorName}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start flex-col md:flex-row">
                      <span className="text-gray-500 text-xs md:text-sm font-medium md:w-24">Hospital:</span>
                      <span className="text-gray-700 text-xs md:text-sm flex-1">{prescription.hospitalName}</span>
                    </div>
                    <div className="flex items-start flex-col md:flex-row">
                      <span className="text-gray-500 text-xs md:text-sm font-medium md:w-24">Contact:</span>
                      <span className="text-gray-700 text-xs md:text-sm flex-1">{prescription.doctorContact}</span>
                    </div>
                    <div className="flex items-start flex-col md:flex-row">
                      <span className="text-gray-500 text-xs md:text-sm font-medium md:w-24">Visit Date:</span>
                      <span className="text-gray-700 text-xs md:text-sm flex-1">
                        {new Date(prescription.visitDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-start flex-col md:flex-row">
                      <span className="text-gray-500 text-xs md:text-sm font-medium md:w-24">File Type:</span>
                      <span className="text-gray-700 text-xs md:text-sm uppercase flex-1">{prescription.fileType}</span>
                    </div>
                  </div>
                  {prescription.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200">
                      <p className="text-xs font-medium text-gray-500 mb-1">Notes:</p>
                      <p className="text-sm text-gray-700">{prescription.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleDownload(
                        prescription.fileUrl,
                        prescription.doctorName
                      )
                    }
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs md:text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(prescription._id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-xs md:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">No prescriptions uploaded yet</p>
            <p className="text-gray-500 text-sm mt-2">Click the button above to upload your first prescription</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Prescriptions;
