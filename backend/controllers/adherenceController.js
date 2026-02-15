const Adherence = require('../models/Adherence');
const { getPendingReminders } = require('../utils/reminderScheduler');

const getCourseEndDate = (startDate, durationDays) => {
  const end = new Date(startDate);
  end.setDate(end.getDate() + durationDays - 1);
  end.setHours(23, 59, 59, 999);
  return end;
};

const getThreshold = (course) => course.tabletsPerDose * course.timesPerDay * 3;

const addComputedFields = (course) => {
  const threshold = getThreshold(course);
  const daily = course.tabletsPerDose * course.timesPerDay;
  const daysLeft = daily > 0 ? Math.ceil(course.remainingTablets / daily) : 0;

  return {
    ...course,
    threshold,
    daysLeft,
    refillWarning: course.remainingTablets <= threshold,
  };
};

const checkRefillStatus = async (course) => {
  const threshold = getThreshold(course);
  if (course.remainingTablets <= threshold && !course.refillReminderSent) {
    course.refillReminderSent = true;
    await course.save();
    return true;
  }
  return false;
};

// @desc    Add medicine course
// @route   POST /api/adherence/add-course
// @access  Private (User only)
exports.addCourse = async (req, res) => {
  try {
    const {
      medicineName,
      dose,
      instruction,
      tabletsPerDose,
      timesPerDay,
      startDate,
      durationDays,
      reminderTimes = [],
    } = req.body;

    if (!medicineName || !dose || !tabletsPerDose || !timesPerDay || !startDate || !durationDays) {
      return res.status(400).json({
        success: false,
        message: 'Required: medicineName, dose, tabletsPerDose, timesPerDay, startDate, durationDays',
      });
    }

    const course = await Adherence.create({
      userId: req.user.id,
      medicineName,
      dose,
      instruction: instruction || 'After meals',
      tabletsPerDose,
      timesPerDay,
      startDate: new Date(startDate),
      durationDays,
      reminderTimes,
    });

    res.status(201).json({
      success: true,
      message: 'Medicine course added successfully',
      data: addComputedFields(course.toObject()),
    });
  } catch (error) {
    console.error('addCourse error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding medicine course',
      error: error.message,
    });
  }
};

// @desc    Get active courses
// @route   GET /api/adherence/active
// @access  Private (User only)
exports.getActiveCourses = async (req, res) => {
  try {
    const now = new Date();
    const courses = await Adherence.find({
      userId: req.user.id,
      completed: false,
    }).sort({ createdAt: -1 });

    const active = courses.filter((course) => {
      const endDate = getCourseEndDate(course.startDate, course.durationDays);
      return course.startDate <= now && endDate >= now && course.remainingTablets > 0;
    });

    res.status(200).json({
      success: true,
      message: 'Active courses retrieved',
      data: active.map((course) => addComputedFields(course.toObject())),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching active courses',
      error: error.message,
    });
  }
};

// @desc    Mark dose taken
// @route   PUT /api/adherence/mark-dose/:id
// @access  Private (User only)
exports.markDoseTaken = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Adherence.findOne({ _id: id, userId: req.user.id });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    if (course.completed) {
      return res.status(400).json({
        success: false,
        message: 'Course already completed',
      });
    }

    course.remainingTablets = Math.max(0, course.remainingTablets - course.tabletsPerDose);
    if (course.remainingTablets <= 0) {
      course.completed = true;
    }

    const refillTriggered = await checkRefillStatus(course);
    if (!refillTriggered) {
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: 'Dose marked as taken',
      refillTriggered,
      data: addComputedFields(course.toObject()),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking dose',
      error: error.message,
    });
  }
};

// @desc    Get refill alerts
// @route   GET /api/adherence/refill-alerts
// @access  Private (User only)
exports.getRefillAlerts = async (req, res) => {
  try {
    const courses = await Adherence.find({
      userId: req.user.id,
      completed: false,
    });

    const alerts = [];
    for (const course of courses) {
      await checkRefillStatus(course);
      const threshold = getThreshold(course);
      if (course.remainingTablets <= threshold) {
        alerts.push(addComputedFields(course.toObject()));
      }
    }

    res.status(200).json({
      success: true,
      message: 'Refill alerts retrieved',
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching refill alerts',
      error: error.message,
    });
  }
};

// @desc    Get daily reminders
// @route   GET /api/adherence/daily-reminders
// @access  Private (User only)
exports.getDailyReminders = async (req, res) => {
  try {
    const reminders = getPendingReminders(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Daily reminders retrieved',
      data: reminders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily reminders',
      error: error.message,
    });
  }
};
