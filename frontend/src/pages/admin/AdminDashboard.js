import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingPharmacies, setPendingPharmacies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pharmacies/pending')
      ]);

      setStats(statsRes.data.data);
      setPendingPharmacies(pendingRes.data.data || []);
      
      // Mock recent activity from stats
      const activity = [];
      if (statsRes.data.data) {
        activity.push(
          { type: 'users', text: `${statsRes.data.data.totalUsers} total users registered`, time: 'Today' },
          { type: 'pharmacies', text: `${statsRes.data.data.approvedPharmacies} pharmacies approved`, time: 'This week' },
          { type: 'medicines', text: `${statsRes.data.data.totalMedicines} medicines in inventory`, time: 'Live' }
        );
      }
      setRecentActivity(activity);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this pharmacy?')) {
      try {
        await api.put(`/admin/pharmacies/${id}/approve`);
        setPendingPharmacies(pendingPharmacies.filter(p => p._id !== id));
        fetchDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to approve');
      }
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await api.put(`/admin/pharmacies/${id}/reject`, { reason });
      setPendingPharmacies(pendingPharmacies.filter(p => p._id !== id));
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Users */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Total Users</p>
            <h2 className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Platform growth</p>
          </div>

          {/* Total Pharmacies */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Total Pharmacies</p>
            <h2 className="text-3xl font-bold text-blue-600">{stats?.totalPharmacies || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Marketplace size</p>
          </div>

          {/* Approved Pharmacies */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Approved Pharmacies</p>
            <h2 className="text-3xl font-bold text-green-600">{stats?.approvedPharmacies || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Verified</p>
          </div>

          {/* Pending Approvals */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
            <h2 className="text-3xl font-bold text-yellow-600">{stats?.pendingPharmacies || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Needs action</p>
          </div>

          {/* Total Medicines */}
          <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition">
            <p className="text-sm text-gray-600 mb-1">Total Medicines</p>
            <h2 className="text-3xl font-bold text-purple-600">{stats?.totalMedicines || 0}</h2>
            <p className="text-xs text-gray-500 mt-2">Inventory scale</p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Pharmacy Approvals (2/3 width) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Pending Pharmacy Approvals</h3>
              <Link to="/admin/pharmacies/pending" className="text-sm text-blue-600 hover:text-blue-700">
                View Details →
              </Link>
            </div>

            {pendingPharmacies.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-2xl mb-2">✔</p>
                <p className="font-medium">All pharmacies reviewed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Pharmacy Name</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">License</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Location</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPharmacies.slice(0, 5).map((pharmacy) => (
                      <tr 
                        key={pharmacy._id} 
                        className="border-b border-gray-100 hover:bg-blue-50 transition"
                      >
                        <td className="py-3 px-2">
                          <p className="text-gray-800 font-medium text-sm">{pharmacy.pharmacyName}</p>
                          <p className="text-gray-500 text-xs">{pharmacy.email}</p>
                        </td>
                        <td className="py-3 px-2 text-gray-700 text-sm">
                          {pharmacy.licenseNumber}
                        </td>
                        <td className="py-3 px-2 text-gray-600 text-sm">
                          {pharmacy.city}, {pharmacy.state}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleApprove(pharmacy._id)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(pharmacy._id)}
                              className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column - System Health & Activity (1/3 width) */}
          <div className="space-y-4">
            {/* System Health */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">System Health</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Server Status</span>
                  <span className="text-green-600 font-medium">✔ Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Database</span>
                  <span className="text-green-600 font-medium">✔ Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-500 text-xs">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                    <p className="text-sm text-gray-700">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Registrations Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Registrations</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* New Users */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">New Users</h4>
                <button className="text-xs text-blue-600 hover:text-blue-700">View All →</button>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-sm text-gray-800 font-medium">User {i}</p>
                    <p className="text-xs text-gray-500">user{i}@example.com</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* New Pharmacies */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">New Pharmacies</h4>
                <Link to="/admin/pharmacies/pending" className="text-xs text-blue-600 hover:text-blue-700">
                  View All →
                </Link>
              </div>
              <div className="space-y-2">
                {pendingPharmacies.slice(0, 3).map((pharmacy) => (
                  <div key={pharmacy._id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <p className="text-sm text-gray-800 font-medium">{pharmacy.pharmacyName}</p>
                    <p className="text-xs text-gray-500">{pharmacy.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(pharmacy.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
                {pendingPharmacies.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">No new pharmacies</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
