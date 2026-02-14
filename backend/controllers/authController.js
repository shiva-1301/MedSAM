const { validationResult } = require('express-validator');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register/user
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create(req.body);

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new pharmacy
// @route   POST /api/auth/register/pharmacy
// @access  Public
exports.registerPharmacy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, licenseNumber } = req.body;

    // Check if pharmacy already exists
    const pharmacyExists = await Pharmacy.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });
    
    if (pharmacyExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Pharmacy already exists with this email or license number' 
      });
    }

    // Check if license document is uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'License document is required' });
    }

    // Parse working hours if it's a string
    let workingHours = req.body.workingHours;
    if (typeof workingHours === 'string') {
      try {
        workingHours = JSON.parse(workingHours);
      } catch (e) {
        workingHours = {};
      }
    }

    // Create pharmacy
    const pharmacy = await Pharmacy.create({
      ...req.body,
      licenseDocument: req.file.path,
      workingHours
    });

    // Generate token
    const token = generateToken(pharmacy._id, pharmacy.role);

    res.status(201).json({
      success: true,
      message: 'Pharmacy registered successfully. Awaiting admin verification.',
      data: {
        _id: pharmacy._id,
        fullName: pharmacy.fullName,
        email: pharmacy.email,
        pharmacyName: pharmacy.pharmacyName,
        role: pharmacy.role,
        verificationStatus: pharmacy.verificationStatus,
        phoneNumber: pharmacy.phoneNumber,
        city: pharmacy.city,
        state: pharmacy.state,
        pincode: pharmacy.pincode,
        pharmacyAddress: pharmacy.pharmacyAddress,
        gstNumber: pharmacy.gstNumber,
        licenseNumber: pharmacy.licenseNumber
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user/pharmacy
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check for user
    let user = await User.findOne({ email }).select('+password');
    let isPharmacy = false;

    // If not found in User collection, check Pharmacy
    if (!user) {
      user = await Pharmacy.findOne({ email }).select('+password');
      isPharmacy = true;
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Build user data object
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };

    // Add pharmacy-specific fields if user is a pharmacy
    if (isPharmacy) {
      userData.pharmacyName = user.pharmacyName;
      userData.verificationStatus = user.verificationStatus;
      userData.phoneNumber = user.phoneNumber;
      userData.city = user.city;
      userData.state = user.state;
      userData.pincode = user.pincode;
      userData.pharmacyAddress = user.pharmacyAddress;
      userData.gstNumber = user.gstNumber;
      userData.licenseNumber = user.licenseNumber;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: userData,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user/pharmacy profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { role } = req.user;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;

    let updatedUser;
    if (role === 'pharmacy') {
      updatedUser = await Pharmacy.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        updateData,
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
