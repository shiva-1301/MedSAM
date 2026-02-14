import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, lowStockRes, expiringRes] = await Promise.all([
        api.get('/pharmacy/dashboard'),
        api.get('/medicines/low-stock'),
        api.get('/medicines/expiring')
      ]);

      setDashboardData(dashboardRes.data.data);
      setLowStockMedicines(lowStockRes.data.data || []);
      setExpiringMedicines(expiringRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = (medicineId) => {
    navigate(`/pharmacy/medicines`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Medicines */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Total Medicines</p>
            <h2 className="text-3xl font-bold text-blue-600">{stats.totalMedicines || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Inventory size</p>
          </div>

          {/* Low Stock */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Low Stock</p>
            <h2 className="text-3xl font-bold text-yellow-600">{stats.lowStockMedicines || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Needs restock</p>
          </div>

          {/* Out of Stock */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
            <h2 className="text-3xl font-bold text-red-600">{stats.outOfStockMedicines || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Urgent</p>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Expiring Soon</p>
            <h2 className="text-3xl font-bold text-orange-600">{stats.expiringMedicines || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Time-sensitive</p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Low Stock Table (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Medicines</h3>
              <Link to="/pharmacy/stock" className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            {lowStockMedicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>✓ All medicines are well stocked</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Medicine</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Stock</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Price</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockMedicines.slice(0, 8).map((medicine) => (
                      <tr 
                        key={medicine._id} 
                        className="border-b border-gray-100 hover:bg-blue-50 transition"
                      >
                        <td className="py-3 px-2">
                          <p className="text-gray-800 font-medium text-sm">{medicine.name}</p>
                          <p className="text-gray-500 text-xs">{medicine.category}</p>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${
                            medicine.stockQuantity === 0 ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {medicine.stockQuantity}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-gray-700 text-sm">
                          ₹{medicine.price}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleUpdateStock(medicine._id)}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column - Expiring Soon (1/3 width) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Expiring Soon</h4>
              
              {expiringMedicines.length === 0 ? (
                <p className="text-gray-500 text-sm">No medicines expiring soon</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {expiringMedicines.map((medicine) => {
                    const daysLeft = Math.floor(
                      (new Date(medicine.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div 
                        key={medicine._id}
                        className={`p-3 rounded-lg border ${
                          daysLeft < 7 ? 'border-red-300 bg-red-50' : 'border-orange-200 bg-orange-50'
                        }`}
                      >
                        <p className="text-gray-800 font-medium text-sm">{medicine.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(medicine.expiryDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className={`text-xs font-semibold mt-1 ${
                          daysLeft < 7 ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {daysLeft} days left
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Medicines Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Medicines Added</h3>
            <Link to="/pharmacy/medicines" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {dashboardData?.recentMedicines?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Name</th>
                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Category</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Stock</th>
                    <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Added Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentMedicines.slice(0, 5).map((medicine) => (
                    <tr 
                      key={medicine._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => navigate('/pharmacy/medicines')}
                    >
                      <td className="py-3 px-2 text-gray-800 font-medium text-sm">
                        {medicine.name}
                      </td>
                      <td className="py-3 px-2 text-gray-600 text-sm">
                        {medicine.category}
                      </td>
                      <td className="py-3 px-2 text-right text-gray-700 text-sm">
                        {medicine.stockQuantity}
                      </td>
                      <td className="py-3 px-2 text-right text-gray-500 text-xs">
                        {new Date(medicine.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No medicines added yet</p>
              <Link
                to="/pharmacy/medicines/add"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Your First Medicine
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/pharmacy/medicines/add"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform">➕</div>
            <p className="text-gray-800 font-medium">Add Medicine</p>
            <p className="text-gray-500 text-xs mt-1">New inventory item</p>
          </Link>

          <Link
            to="/pharmacy/stock"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-yellow-600 text-3xl mb-2 group-hover:scale-110 transition-transform">📦</div>
            <p className="text-gray-800 font-medium">Manage Stock</p>
            <p className="text-gray-500 text-xs mt-1">Update quantities</p>
          </Link>

          <Link
            to="/pharmacy/medicines"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-blue-600 text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
            <p className="text-gray-800 font-medium">View All Medicines</p>
            <p className="text-gray-500 text-xs mt-1">Full inventory</p>
          </Link>

          <Link
            to="/pharmacy/profile"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-purple-600 text-3xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-gray-800 font-medium">Update Profile</p>
            <p className="text-gray-500 text-xs mt-1">Pharmacy settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
