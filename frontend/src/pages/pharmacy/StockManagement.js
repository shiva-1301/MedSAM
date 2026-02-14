import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const StockManagement = () => {
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      const [lowStockRes, expiringRes] = await Promise.all([
        api.get('/medicines/low-stock'),
        api.get('/medicines/expiring')
      ]);

      setLowStockMedicines(lowStockRes.data.data);
      setExpiringMedicines(expiringRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Stock Management</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Low Stock Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">⚠️</span>
            <h2 className="text-2xl font-semibold text-gray-900">
              Low Stock Medicines ({lowStockMedicines.length})
            </h2>
          </div>

          {lowStockMedicines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lowStockMedicines.map(medicine => (
                    <tr key={medicine._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                        {medicine.genericName && (
                          <div className="text-sm text-gray-500">{medicine.genericName}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {medicine.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-bold ${
                          medicine.stockQuantity === 0 ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {medicine.stockQuantity} units
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{medicine.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${
                          medicine.stockQuantity === 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {medicine.stockStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              All medicines are adequately stocked!
            </div>
          )}
        </div>

        {/* Expiring Soon Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">📅</span>
            <h2 className="text-2xl font-semibold text-gray-900">
              Expiring Soon ({expiringMedicines.length})
            </h2>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Medicines expiring within the next 30 days
          </p>

          {expiringMedicines.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Medicine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Days Left
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expiringMedicines.map(medicine => {
                    const daysLeft = Math.floor(
                      (new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <tr key={medicine._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{medicine.name}</div>
                          {medicine.genericName && (
                            <div className="text-sm text-gray-500">{medicine.genericName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {medicine.stockQuantity} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(medicine.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            daysLeft < 7 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {daysLeft} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No medicines expiring in the next 30 days!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
