import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Adherence = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminderTime, setNewReminderTime] = useState('');
  const [formData, setFormData] = useState({
    medicineName: '',
    dose: '',
    tabletsPerDose: 1,
    timesPerDay: 1,
    durationDays: 1,
    startDate: new Date().toISOString().split('T')[0],
    reminderTimes: [],
  });

  const fetchActiveCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/adherence/active');
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching active courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchRefillAlerts = async () => {
    try {
      const response = await api.get('/adherence/refill-alerts');
      if (response.data.success) {
        setRefillAlerts(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching refill alerts');
    }
  };

  const fetchReminders = async () => {
    try {
      const response = await api.get('/adherence/daily-reminders');
      if (response.data.success) {
        setReminders(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reminders');
    }
  };

  useEffect(() => {
    fetchActiveCourses();
    fetchRefillAlerts();
    fetchReminders();

    const interval = setInterval(fetchReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'medicineName' || name === 'dose' || name === 'startDate'
        ? value
        : Number(value),
    }));
  };

  const addReminderTime = () => {
    if (!newReminderTime) return;
    if (formData.reminderTimes.includes(newReminderTime)) return;
    setFormData((prev) => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, newReminderTime].sort(),
    }));
    setNewReminderTime('');
  };

  const removeReminderTime = (time) => {
    setFormData((prev) => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((t) => t !== time),
    }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.medicineName || !formData.dose || !formData.startDate) {
      setError('Medicine name, dose, and start date are required');
      return;
    }

    try {
      const response = await api.post('/adherence/add-course', formData);
      if (response.data.success) {
        setSuccess('Medicine course added successfully');
        setFormData({
          medicineName: '',
          dose: '',
          tabletsPerDose: 1,
          timesPerDay: 1,
          durationDays: 1,
          startDate: new Date().toISOString().split('T')[0],
          reminderTimes: [],
        });
        setShowAddForm(false);
        fetchActiveCourses();
        fetchRefillAlerts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding course');
    }
  };

  const handleMarkDose = async (id) => {
    try {
      const response = await api.put(`/adherence/mark-dose/${id}`);
      if (response.data.success) {
        fetchActiveCourses();
        fetchRefillAlerts();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error marking dose');
    }
  };

  const handleFindPharmacies = (medicineName) => {
    navigate('/user/pharmacies', { state: { query: medicineName } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Medicine Adherence</h1>
          <p className="text-gray-600">Manage courses, reminders, and refills</p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Active Courses</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                {showAddForm ? 'Cancel' : '+ Add Course'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddCourse} className="mb-6 bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Medicine Name *</label>
                    <input
                      type="text"
                      name="medicineName"
                      value={formData.medicineName}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Dose *</label>
                    <input
                      type="text"
                      name="dose"
                      value={formData.dose}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tablets per Dose *</label>
                    <input
                      type="number"
                      min="1"
                      name="tabletsPerDose"
                      value={formData.tabletsPerDose}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Times per Day *</label>
                    <input
                      type="number"
                      min="1"
                      name="timesPerDay"
                      value={formData.timesPerDay}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Duration (Days) *</label>
                    <input
                      type="number"
                      min="1"
                      name="durationDays"
                      value={formData.durationDays}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Start Date *</label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-semibold mb-2">Reminder Times</label>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={newReminderTime}
                      onChange={(e) => setNewReminderTime(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={addReminderTime}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Add Time
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.reminderTimes.map((time) => (
                      <span
                        key={time}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {time}
                        <button
                          type="button"
                          onClick={() => removeReminderTime(time)}
                          className="ml-2 text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Save Course
                </button>
              </form>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Medicine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Remaining</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Days Left</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reminder Times</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <tr key={course._id} className="border-t">
                        <td className="px-4 py-3 text-gray-800">
                          <div className="font-semibold">{course.medicineName}</div>
                          <div className="text-xs text-gray-500">{course.dose}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{course.remainingTablets}</td>
                        <td className="px-4 py-3 text-gray-700">{course.daysLeft}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {course.reminderTimes?.length ? course.reminderTimes.join(', ') : '—'}
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          <button
                            onClick={() => handleMarkDose(course._id)}
                            className="px-3 py-1 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700"
                          >
                            Mark Taken
                          </button>
                          {course.refillWarning && (
                            <button
                              onClick={() => handleFindPharmacies(course.medicineName)}
                              className="px-3 py-1 rounded-lg text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600"
                            >
                              Find Pharmacies
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                        No active courses
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Upcoming Reminders</h3>
              {reminders.length ? (
                <ul className="space-y-2 text-sm text-gray-700">
                  {reminders.map((reminder) => (
                    <li key={`${reminder.courseId}-${reminder.time}`} className="flex justify-between">
                      <span>{reminder.medicineName}</span>
                      <span className="text-gray-500">{reminder.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No reminders right now.</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Refill Alerts</h3>
              {refillAlerts.length ? (
                <ul className="space-y-3">
                  {refillAlerts.map((alert) => (
                    <li key={alert._id} className="text-sm text-gray-700">
                      <div className="font-semibold">{alert.medicineName}</div>
                      <div className="text-gray-500">{alert.remainingTablets} tablets left</div>
                      <button
                        onClick={() => handleFindPharmacies(alert.medicineName)}
                        className="mt-2 px-3 py-1 rounded-lg text-sm font-semibold bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        Find Nearby Pharmacies
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No refill alerts.</p>
              )}
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Adherence;
