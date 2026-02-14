const express = require('express');
const router = express.Router();
const {
  getAllPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
  getAllPharmacies,
  getAllUsers,
  getSystemStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Private/Admin
router.get('/stats', getSystemStats);

// @route   GET /api/admin/pharmacies/pending
// @desc    Get all pending pharmacies
// @access  Private/Admin
router.get('/pharmacies/pending', getAllPendingPharmacies);

// @route   GET /api/admin/pharmacies
// @desc    Get all pharmacies
// @access  Private/Admin
router.get('/pharmacies', getAllPharmacies);

// @route   PUT /api/admin/pharmacies/:id/approve
// @desc    Approve pharmacy
// @access  Private/Admin
router.put('/pharmacies/:id/approve', approvePharmacy);

// @route   PUT /api/admin/pharmacies/:id/reject
// @desc    Reject pharmacy
// @access  Private/Admin
router.put('/pharmacies/:id/reject', rejectPharmacy);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', getAllUsers);

module.exports = router;
