const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  // Medicine Details
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required']
  },
  
  // Classification
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Other']
  },
  composition: {
    type: String,
    required: [true, 'Composition is required']
  },
  
  // Stock & Price
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: 0,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  mrp: {
    type: Number,
    required: [true, 'MRP is required'],
    min: 0
  },
  
  // Dates
  manufacturingDate: {
    type: Date,
    required: [true, 'Manufacturing date is required']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  
  // Additional Info
  description: {
    type: String
  },
  dosage: {
    type: String
  },
  sideEffects: [{
    type: String
  }],
  precautions: [{
    type: String
  }],
  
  // Image
  image: {
    type: String
  },
  
  // Prescription Required
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  
  // Pharmacy Reference
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  
  // System Fields
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for prefix search on medicine name
medicineSchema.index({ name: 1 });

// Virtual field for stock status
medicineSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity === 0) return 'Out of Stock';
  if (this.stockQuantity < 10) return 'Low Stock';
  return 'In Stock';
});

// Virtual field for expiry status
medicineSchema.virtual('expiryStatus').get(function() {
  const today = new Date();
  const daysUntilExpiry = Math.floor((this.expiryDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'Expired';
  if (daysUntilExpiry < 30) return 'Expiring Soon';
  return 'Valid';
});

// Include virtuals in JSON
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Medicine', medicineSchema);
