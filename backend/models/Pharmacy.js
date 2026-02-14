const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const pharmacySchema = new mongoose.Schema({
  // Personal Info
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phoneNumber: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Pharmacy Details
  pharmacyName: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  gstNumber: {
    type: String,
    trim: true,
    sparse: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  pharmacyAddress: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  pincode: {
    type: String,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit pincode']
  },
  
  // Geolocation (for nearby pharmacy search)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  
  // License Document
  licenseDocument: {
    type: String,
    required: [true, 'License document is required']
  },
  
  // Working Hours
  workingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  
  // Verification Status
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  
  // System Fields
  role: {
    type: String,
    default: 'pharmacy',
    enum: ['pharmacy']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
pharmacySchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
pharmacySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create 2dsphere index for geolocation queries
pharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
