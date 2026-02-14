const express = require('express');
const router = express.Router();
const {
  getPharmacyProfile,
  getPharmacyDashboard,
  updatePharmacyProfile,
  updateWorkingHours,
  getNearbyPharmacies
} = require('../controllers/pharmacyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route - No authentication required
// @route   GET /api/pharmacy/nearby
// @desc    Get nearby pharmacies by geolocation
// @access  Public
router.get('/nearby', getNearbyPharmacies);

// All routes below require pharmacy role
router.use(protect);
router.use(authorize('pharmacy'));

// @route   GET /api/pharmacy/profile
// @desc    Get pharmacy profile
// @access  Private/Pharmacy
router.get('/profile', getPharmacyProfile);

// @route   GET /api/pharmacy/dashboard
// @desc    Get pharmacy dashboard data
// @access  Private/Pharmacy
router.get('/dashboard', getPharmacyDashboard);

// @route   PUT /api/pharmacy/profile
// @desc    Update pharmacy profile
// @access  Private/Pharmacy
router.put('/profile', upload.single('licenseDocument'), updatePharmacyProfile);

// @route   PUT /api/pharmacy/working-hours
// @desc    Update working hours
// @access  Private/Pharmacy
router.put('/working-hours', updateWorkingHours);

module.exports = router;
