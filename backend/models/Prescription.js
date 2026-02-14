const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    doctorName: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    doctorContact: {
      type: String,
      required: [true, 'Doctor contact is required'],
      trim: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    visitDate: {
      type: Date,
      required: [true, 'Visit date is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File upload is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'jpeg', 'jpg', 'png'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for quick queries
prescriptionSchema.index({ userId: 1, visitDate: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
