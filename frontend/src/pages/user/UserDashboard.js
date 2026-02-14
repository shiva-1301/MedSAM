import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [todayStats, setTodayStats] = useState({ total: 0, taken: 0, remaining: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [coursesRes, remindersRes, refillRes, prescriptionsRes] = await Promise.all([
        api.get('/adherence/active'),
        api.get('/adherence/daily-reminders'),
        api.get('/adherence/refill-alerts'),
        api.get('/prescriptions')
      ]);

      setActiveCourses(coursesRes.data.data || []);
      setReminders(remindersRes.data.data || []);
      setRefillAlerts(refillRes.data.data || []);
      setPrescriptions((prescriptionsRes.data.data || []).slice(0, 3));

      // Calculate today's stats
      const courses = coursesRes.data.data || [];
      const total = courses.reduce((sum, c) => sum + (c.timesPerDay || 0), 0);
      const taken = courses.reduce((sum, c) => sum + Math.max(0, (c.timesPerDay || 0) - Math.ceil((c.remainingTablets || 0) / (c.tabletsPerDose || 1))), 0);
      setTodayStats({ total, taken, remaining: total - taken });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const completionPercentage = todayStats.total > 0 ? Math.round((todayStats.taken / todayStats.total) * 100) : 0;
  const nextReminder = reminders.length > 0 ? reminders[0] : null;
  const urgentRefill = refillAlerts.length > 0 ? refillAlerts[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Today's Medication</h2>
              <p className="text-sm text-gray-600 mt-1">{todayStats.total} doses scheduled</p>
            </div>
            <div className="text-right">
              <p className="text-green-600 font-semibold">Taken: {todayStats.taken}</p>
              <p className="text-red-600 mt-1">Remaining: {todayStats.remaining}</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-green-500 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {completionPercentage === 100 ? '🎉 All doses completed today!' : 'Stay consistent for better recovery.'}
            </p>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Courses (2/3 width on desktop) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Courses</h3>
              <Link to="/user/adherence" className="text-sm text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            {activeCourses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">No active medicine courses</p>
                <Link
                  to="/user/adherence"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Your First Course
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Medicine</th>
                      <th className="text-left py-2 px-2 text-xs font-medium text-gray-600">Dose</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Days Left</th>
                      <th className="text-right py-2 px-2 text-xs font-medium text-gray-600">Tablets Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCourses.slice(0, 5).map((course) => (
                      <tr 
                        key={course._id} 
                        className="border-b border-gray-100 hover:bg-blue-50 transition cursor-pointer"
                        onClick={() => navigate('/user/adherence')}
                      >
                        <td className="py-3 px-2 text-gray-800 font-medium">{course.medicineName}</td>
                        <td className="py-3 px-2 text-gray-600 text-sm">{course.dose}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${course.daysLeft <= 3 ? 'text-red-600' : 'text-gray-700'}`}>
                            {course.daysLeft} days
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <span className={`text-sm font-medium ${course.refillWarning ? 'text-red-600' : 'text-gray-700'}`}>
                            {course.remainingTablets}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column - Reminders & Alerts (1/3 width) */}
          <div className="space-y-4">
            {/* Upcoming Reminder */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Upcoming Dose</h4>
              {nextReminder ? (
                <div>
                  <p className="text-gray-800 font-medium">{nextReminder.medicineName}</p>
                  <p className="text-green-600 text-2xl font-bold mt-1">{nextReminder.time}</p>
                  <p className="text-xs text-gray-500 mt-2">{nextReminder.remainingTablets} tablets remaining</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reminders for today</p>
              )}
            </div>

            {/* Refill Alert */}
            {urgentRefill ? (
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-red-200">
                <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <span>⚠️</span> Running Low
                </h4>
                <p className="text-gray-800 font-medium">{urgentRefill.medicineName}</p>
                <p className="text-red-600 text-sm mt-1">{urgentRefill.daysLeft} days remaining</p>
                <button
                  onClick={() => navigate('/user/pharmacies', { state: { query: urgentRefill.medicineName } })}
                  className="mt-3 w-full bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Find Pharmacies
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Refill Status</h4>
                <p className="text-green-600 text-sm">✓ All medicines stocked</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Prescriptions</h3>
            <Link to="/user/prescriptions" className="text-sm text-blue-600 hover:text-blue-700">
              View All →
            </Link>
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No prescriptions uploaded yet</p>
              <Link
                to="/user/prescriptions"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Upload Prescription
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {prescriptions.map((rx) => (
                <div 
                  key={rx._id} 
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate('/user/prescriptions')}
                >
                  <div>
                    <p className="text-gray-800 font-medium">{rx.doctorName}</p>
                    <p className="text-gray-600 text-sm">{rx.hospitalName}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(rx.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <a
                    href={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${rx.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/user/adherence"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-green-600 text-3xl mb-2 group-hover:scale-110 transition-transform">💊</div>
            <p className="text-gray-800 font-medium">Add Medicine</p>
            <p className="text-gray-500 text-xs mt-1">Track new course</p>
          </Link>

          <Link
            to="/search"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-blue-600 text-3xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
            <p className="text-gray-800 font-medium">Search Medicine</p>
            <p className="text-gray-500 text-xs mt-1">Find nearby stock</p>
          </Link>

          <Link
            to="/user/pharmacies"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-purple-600 text-3xl mb-2 group-hover:scale-110 transition-transform">📍</div>
            <p className="text-gray-800 font-medium">Nearby Pharmacies</p>
            <p className="text-gray-500 text-xs mt-1">Locate stores</p>
          </Link>

          <Link
            to="/user/prescriptions"
            className="bg-white rounded-xl p-5 hover:shadow-xl transition cursor-pointer shadow-lg group"
          >
            <div className="text-orange-600 text-3xl mb-2 group-hover:scale-110 transition-transform">📄</div>
            <p className="text-gray-800 font-medium">Upload Prescription</p>
            <p className="text-gray-500 text-xs mt-1">Store digitally</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
