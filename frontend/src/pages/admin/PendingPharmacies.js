import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const PendingPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchPendingPharmacies();
  }, []);

  const fetchPendingPharmacies = async () => {
    try {
      const { data } = await api.get('/admin/pharmacies/pending');
      setPharmacies(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending pharmacies');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this pharmacy?')) {
      try {
        await api.put(`/admin/pharmacies/${id}/approve`);
        alert('Pharmacy approved successfully!');
        setPharmacies(pharmacies.filter(p => p._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to approve pharmacy');
      }
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await api.put(`/admin/pharmacies/${id}/reject`, { reason: rejectionReason });
      alert('Pharmacy rejected');
      setPharmacies(pharmacies.filter(p => p._id !== id));
      setSelectedPharmacy(null);
      setRejectionReason('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject pharmacy');
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Pending Pharmacy Verifications ({pharmacies.length})
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {pharmacies.length > 0 ? (
          <div className="space-y-6">
            {pharmacies.map(pharmacy => (
              <div key={pharmacy._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {pharmacy.pharmacyName}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <p><strong>Owner:</strong> {pharmacy.fullName}</p>
                      <p><strong>Email:</strong> {pharmacy.email}</p>
                      <p><strong>Phone:</strong> {pharmacy.phoneNumber}</p>
                      <p><strong>License Number:</strong> {pharmacy.licenseNumber}</p>
                      {pharmacy.gstNumber && (
                        <p><strong>GST Number:</strong> {pharmacy.gstNumber}</p>
                      )}
                      <p><strong>Address:</strong> {pharmacy.pharmacyAddress}</p>
                      <p><strong>City:</strong> {pharmacy.city}, {pharmacy.state}</p>
                      <p><strong>Pincode:</strong> {pharmacy.pincode}</p>
                      <p><strong>Applied On:</strong> {new Date(pharmacy.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">License Document</h4>
                    {pharmacy.licenseDocument && (
                      <a
                        href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${pharmacy.licenseDocument}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mb-4"
                      >
                        📄 View License Document
                      </a>
                    )}

                    <h4 className="font-semibold mb-2 mt-4">Working Hours</h4>
                    <div className="text-sm space-y-1">
                      {pharmacy.workingHours && Object.entries(pharmacy.workingHours).map(([day, hours]) => (
                        <p key={day} className="capitalize">
                          <strong>{day}:</strong> {hours.open} - {hours.close}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <button
                    onClick={() => handleApprove(pharmacy._id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-medium"
                  >
                    ✅ Approve
                  </button>
                  
                  <button
                    onClick={() => setSelectedPharmacy(pharmacy._id)}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-medium"
                  >
                    ❌ Reject
                  </button>
                </div>

                {selectedPharmacy === pharmacy._id && (
                  <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      rows="3"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      placeholder="Provide a clear reason for rejection..."
                    ></textarea>
                    <div className="mt-3 flex space-x-3">
                      <button
                        onClick={() => handleReject(pharmacy._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPharmacy(null);
                          setRejectionReason('');
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              There are no pending pharmacy verifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPharmacies;
