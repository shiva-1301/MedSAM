import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VerificationStatus = () => {
  const { user } = useContext(AuthContext);

  const getStatusBadge = () => {
    switch (user?.verificationStatus) {
      case 'approved':
        return (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-3xl mr-3">✅</span>
              <div>
                <h3 className="font-bold text-lg">Approved</h3>
                <p>Your pharmacy has been verified and approved!</p>
              </div>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-3xl mr-3">❌</span>
              <div>
                <h3 className="font-bold text-lg">Rejected</h3>
                <p>Your pharmacy verification was rejected.</p>
                {user?.rejectionReason && (
                  <p className="mt-2 font-medium">Reason: {user.rejectionReason}</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-3xl mr-3">⏳</span>
              <div>
                <h3 className="font-bold text-lg">Pending Verification</h3>
                <p>Your pharmacy is awaiting admin approval.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Verification Status</h1>
          
          {getStatusBadge()}

          <div className="mt-8 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Pharmacy Details</h3>
              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <p><strong>Pharmacy Name:</strong> {user?.pharmacyName}</p>
                <p><strong>Owner Name:</strong> {user?.fullName}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Phone:</strong> {user?.phoneNumber}</p>
                <p><strong>License Number:</strong> {user?.licenseNumber}</p>
                <p><strong>Address:</strong> {user?.pharmacyAddress}</p>
                <p><strong>City:</strong> {user?.city}, {user?.state}</p>
              </div>
            </div>

            <div className="pt-6">
              {user?.verificationStatus === 'approved' ? (
                <Link
                  to="/pharmacy/dashboard"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium"
                >
                  Go to Dashboard
                </Link>
              ) : user?.verificationStatus === 'rejected' ? (
                <Link
                  to="/pharmacy/profile"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 font-medium"
                >
                  Edit Profile & Resubmit
                </Link>
              ) : (
                <div className="text-gray-600">
                  <p>Please wait for the admin to review your pharmacy.</p>
                  <p className="text-sm mt-2">This usually takes 24-48 hours.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;
