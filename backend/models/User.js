const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
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
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Personal Details
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 1,
    max: 150
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['Male', 'Female', 'Other']
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
    default: 'Unknown'
  },
  
  // Medical History
  medicalConditions: [{
    type: String,
    enum: ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease', 'Liver Disease', 'Other']
  }],
  otherMedicalConditions: {
    type: String
  },
  knownDrugAllergies: [{
    type: String
  }],
  
  // Chief Concerns / Primary Health Issues
  chiefConcerns: {
    type: String,
    trim: true
  },
  
  // Doctor Details
  doctorDetails: {
    name: {
      type: String,
      trim: true
    },
    contact: {
      type: String,
      trim: true
    },
    hospital: {
      type: String,
      trim: true
    }
  },
  
  // Emergency Contact
  emergencyContactName: {
    type: String,
    required: [true, 'Emergency contact name is required']
  },
  emergencyContactPhone: {
    type: String,
    required: [true, 'Emergency contact phone is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // System Fields
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'pharmacy', 'admin']
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
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
