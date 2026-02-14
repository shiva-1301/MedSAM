const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerUser,
  registerPharmacy,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// User Registration
router.post('/register/user', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('age').isInt({ min: 1, max: 150 }).withMessage('Valid age is required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Valid gender is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('emergencyContactName').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContactPhone').matches(/^[0-9]{10}$/).withMessage('Valid emergency contact phone is required')
], registerUser);

// Pharmacy Registration
router.post('/register/pharmacy', upload.single('licenseDocument'), [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('pharmacyName').notEmpty().withMessage('Pharmacy name is required'),
  body('licenseNumber').notEmpty().withMessage('License number is required'),
  body('pharmacyAddress').notEmpty().withMessage('Pharmacy address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode is required')
], registerPharmacy);

// Login (for all roles)
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

// Get Profile (protected)
router.get('/profile', protect, getProfile);

// Update Profile (protected)
router.put('/profile', protect, updateProfile);

module.exports = router;
