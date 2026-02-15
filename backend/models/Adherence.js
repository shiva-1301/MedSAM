const mongoose = require('mongoose');

const adherenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    medicineName: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
    },
    dose: {
      type: String,
      required: [true, 'Dose is required'],
      trim: true,
    },
    instruction: {
      type: String,
      default: 'After meals',
      trim: true,
    },
    tabletsPerDose: {
      type: Number,
      required: [true, 'Tablets per dose is required'],
      min: 1,
    },
    timesPerDay: {
      type: Number,
      required: [true, 'Times per day is required'],
      min: 1,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    durationDays: {
      type: Number,
      required: [true, 'Duration (days) is required'],
      min: 1,
    },
    totalTablets: {
      type: Number,
      default: 0,
    },
    remainingTablets: {
      type: Number,
      default: 0,
    },
    reminderTimes: {
      type: [String],
      default: [],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    refillReminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before validation
adherenceSchema.pre('validate', function() {
  if (this.tabletsPerDose && this.timesPerDay && this.durationDays) {
    const total = this.tabletsPerDose * this.timesPerDay * this.durationDays;
    this.totalTablets = total;
    if (!this.remainingTablets || this.remainingTablets > total) {
      this.remainingTablets = total;
    }
  }
});

// Index for quick queries
adherenceSchema.index({ userId: 1, startDate: 1 });
adherenceSchema.index({ userId: 1, completed: 1 });

module.exports = mongoose.model('Adherence', adherenceSchema);
