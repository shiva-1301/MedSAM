const bcrypt = require('bcryptjs');

// Script to create hashed password for admin user
// Usage: node scripts/hashPassword.js

const password = process.argv[2] || 'admin123';

async function hashPassword() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  console.log('\n========================================');
  console.log('Password Hashing Complete!');
  console.log('========================================');
  console.log('Original Password:', password);
  console.log('Hashed Password:', hashedPassword);
  console.log('\nUse this hashed password in your MongoDB insert command.');
  console.log('========================================\n');

  // Also output the complete MongoDB command
  console.log('Complete MongoDB Command:');
  console.log('========================================');
  console.log(`
use analyx

db.users.insertOne({
  fullName: "Admin User",
  email: "admin@analyx.com",
  password: "${hashedPassword}",
  phoneNumber: "1234567890",
  age: 30,
  gender: "Other",
  city: "Admin City",
  state: "Admin State",
  emergencyContactName: "Emergency Contact",
  emergencyContactPhone: "0987654321",
  role: "admin",
  isActive: true,
  medicalConditions: [],
  knownDrugAllergies: [],
  createdAt: new Date()
})
  `);
  console.log('========================================\n');
}

hashPassword();
