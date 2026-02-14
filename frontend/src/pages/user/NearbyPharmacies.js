import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationFetched, setLocationFetched] = useState(false);
  const [radiusKm, setRadiusKm] = useState(10);
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      setError('');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setLocationFetched(true);
          fetchNearbyPharmacies(latitude, longitude);
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  // Fetch nearby pharmacies
  const fetchNearbyPharmacies = async (lat, lng) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/pharmacy/nearby?lat=${lat}&lng=${lng}&radiusKm=${radiusKm}`
      );

      if (response.data.success) {
        setPharmacies(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching nearby pharmacies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  // Handle radius change
  const handleRadiusChange = (e) => {
    const newRadius = parseFloat(e.target.value);
    setRadiusKm(newRadius);

    if (userLocation) {
      fetchNearbyPharmacies(userLocation.latitude, userLocation.longitude);
    }
  };

  // Handle manual search
  const handleManualSearch = async () => {
    if (userLocation) {
      fetchNearbyPharmacies(userLocation.latitude, userLocation.longitude);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏥 Nearby Pharmacies
          </h1>
          <p className="text-gray-600">
            Find verified pharmacies near your location
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Location Status and Controls */}
        {locationFetched && userLocation && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm font-semibold mb-1">
                  Your Location
                </p>
                <p className="text-gray-800 font-semibold">
                  {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                </p>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Search Radius (km)
                </label>
                <select
                  value={radiusKm}
                  onChange={handleRadiusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={15}>15 km</option>
                  <option value={20}>20 km</option>
                  <option value={30}>30 km</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleManualSearch}
                  className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Search Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Get Location Button */}
        {!locationFetched && (
          <div className="mb-6 text-center">
            <button
              onClick={getUserLocation}
              className="px-8 py-3 bg-green-600 text-white text-lg rounded-lg hover:bg-green-700 transition font-semibold"
            >
              📍 Get My Location
            </button>
          </div>
        )}

        {/* Pharmacies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-gray-600 mt-4">Finding nearby pharmacies...</p>
          </div>
        ) : pharmacies.length > 0 ? (
          <>
            <div className="mb-6 text-gray-700 text-lg font-semibold">
              Found {pharmacies.length} pharmacies within {radiusKm} km
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
                >
                  {/* Distance Badge */}
                  {pharmacy.distance && (
                    <div className="float-right">
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {pharmacy.distance} km
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {pharmacy.pharmacyName}
                  </h3>

                  <div className="text-gray-600 mb-4 space-y-2">
                    <p className="text-sm">
                      <strong>Contact:</strong> {pharmacy.phoneNumber}
                    </p>
                    <p className="text-sm">
                      <strong>Address:</strong> {pharmacy.pharmacyAddress}
                    </p>
                    <p className="text-sm">
                      <strong>City:</strong> {pharmacy.city}, {pharmacy.state} -{' '}
                      {pharmacy.pincode}
                    </p>
                    <p className="text-sm">
                      <strong>License:</strong> {pharmacy.licenseNumber}
                    </p>
                    {pharmacy.gstNumber && (
                      <p className="text-sm">
                        <strong>GST:</strong> {pharmacy.gstNumber}
                      </p>
                    )}
                  </div>

                  {/* Working Hours */}
                  {pharmacy.workingHours && (
                    <div className="mb-4 border-t pt-4">
                      <p className="font-semibold text-gray-800 mb-2">Hours Today</p>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const today = new Date();
                          const days = [
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thursday',
                            'friday',
                            'saturday',
                          ];
                          const todayKey = days[today.getDay()];
                          const hours = pharmacy.workingHours[todayKey];

                          return hours && hours.open && hours.close ? (
                            <p>
                              {hours.open} - {hours.close}
                            </p>
                          ) : (
                            <p className="text-red-600">Closed</p>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Verification Badge */}
                  <div className="pt-4 border-t">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ Verified Pharmacy
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No pharmacies found within {radiusKm} km radius
            </p>
            <p className="text-gray-500">Try increasing the search radius</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyPharmacies;
