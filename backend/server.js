const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { startReminderScheduler } = require('./utils/reminderScheduler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Start reminder scheduler
startReminderScheduler();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://medsam-1.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
app.use('/api/medicines', require('./routes/medicineRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/adherence', require('./routes/adherenceRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Analyx Drug Scanner API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || 'Server Error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
