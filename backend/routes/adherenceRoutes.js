const router = require('express').Router();
const {
  addCourse,
  getActiveCourses,
  markDoseTaken,
  getRefillAlerts,
  getDailyReminders,
} = require('../controllers/adherenceController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes - User only
router.use(protect);
router.use(authorize('user'));

// Add medicine course
router.post('/add-course', addCourse);

// Get active courses
router.get('/active', getActiveCourses);

// Mark dose taken
router.put('/mark-dose/:id', markDoseTaken);

// Get refill alerts
router.get('/refill-alerts', getRefillAlerts);

// Get daily reminders
router.get('/daily-reminders', getDailyReminders);

module.exports = router;
