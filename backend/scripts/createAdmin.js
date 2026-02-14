const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Script to create initial admin user
// Usage: node scripts/createAdmin.js

const User = require('../models/User');
const connectDB = require('../config/db');

async function createAdmin() {
  try {
    // Connect to database
    await connectDB();

    console.log('\n========================================');
    console.log('Creating Admin User...');
    console.log('========================================\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@analyx.com' });
    
    if (existingAdmin) {
      console.log('❌ Admin user already exists!');
      console.log('Email: admin@analyx.com');
      console.log('\nIf you want to reset the password, delete the existing user first.');
      process.exit(0);
    }

    // Create admin user
    const adminUser = await User.create({
      fullName: 'Admin User',
      email: 'admin@analyx.com',
      password: 'admin123', // Will be hashed by the model pre-save hook
      phoneNumber: '1234567890',
      age: 30,
      gender: 'Other',
      city: 'Admin City',
      state: 'Admin State',
      emergencyContactName: 'Emergency Contact',
      emergencyContactPhone: '0987654321',
      role: 'admin',
      isActive: true,
      medicalConditions: [],
      knownDrugAllergies: []
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Email: admin@analyx.com');
    console.log('Password: admin123');
    console.log('\n⚠️  Please change the password after first login!\n');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
