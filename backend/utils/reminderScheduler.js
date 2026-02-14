const cron = require('node-cron');
const Adherence = require('../models/Adherence');

let pendingReminders = new Map();

const getCourseEndDate = (startDate, durationDays) => {
  const end = new Date(startDate);
  end.setDate(end.getDate() + durationDays - 1);
  end.setHours(23, 59, 59, 999);
  return end;
};

const startReminderScheduler = () => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const reminders = new Map();

    try {
      const courses = await Adherence.find({
        completed: false,
        reminderTimes: currentTime,
      }).lean();

      for (const course of courses) {
        const endDate = getCourseEndDate(course.startDate, course.durationDays);
        if (course.startDate > now || endDate < now || course.remainingTablets <= 0) {
          continue;
        }

        const userKey = course.userId.toString();
        const list = reminders.get(userKey) || [];
        list.push({
          courseId: course._id,
          medicineName: course.medicineName,
          time: currentTime,
          remainingTablets: course.remainingTablets,
        });
        reminders.set(userKey, list);
      }

      pendingReminders = reminders;
    } catch (error) {
      console.error('Reminder scheduler error:', error.message);
    }
  });
};

const getPendingReminders = (userId) => {
  return pendingReminders.get(userId.toString()) || [];
};

module.exports = {
  startReminderScheduler,
  getPendingReminders,
};
