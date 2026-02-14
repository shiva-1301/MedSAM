const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

const seedPharmacies = [
  {
    fullName: 'Ravi Kumar',
    email: 'medplus1@test.com',
    password: '123456',
    phoneNumber: '9000000001',
    pharmacyName: 'MedPlus Central',
    licenseNumber: 'LIC1001',
    gstNumber: '22ABCDE1234F1Z5',
    licenseDocument: 'uploads/licenses/medplus-central.pdf',
    verificationStatus: 'approved',
    location: {
      type: 'Point',
      coordinates: [78.4867, 17.3850]
    }
  },
  {
    fullName: 'Suresh Reddy',
    email: 'apollo1@test.com',
    password: '123456',
    phoneNumber: '9000000002',
    pharmacyName: 'Apollo Pharmacy',
    licenseNumber: 'LIC1002',
    gstNumber: '22ABCDE1234F1Z6',
    licenseDocument: 'uploads/licenses/apollo-pharmacy.pdf',
    verificationStatus: 'approved',
    location: {
      type: 'Point',
      coordinates: [78.4011, 17.4435]
    }
  },
  {
    fullName: 'Priya Sharma',
    email: 'care1@test.com',
    password: '123456',
    phoneNumber: '9000000003',
    pharmacyName: 'Care Pharmacy',
    licenseNumber: 'LIC1003',
    gstNumber: '22ABCDE1234F1Z7',
    licenseDocument: 'uploads/licenses/care-pharmacy.pdf',
    verificationStatus: 'approved',
    location: {
      type: 'Point',
      coordinates: [78.4983, 17.4400]
    }
  },
  {
    fullName: 'Arjun Rao',
    email: 'wellness1@test.com',
    password: '123456',
    phoneNumber: '9000000004',
    pharmacyName: 'Wellness Meds',
    licenseNumber: 'LIC1004',
    gstNumber: '22ABCDE1234F1Z8',
    licenseDocument: 'uploads/licenses/wellness-meds.pdf',
    verificationStatus: 'approved',
    location: {
      type: 'Point',
      coordinates: [78.4738, 17.3616]
    }
  }
];

const medicineNames = [
  'Paracetamol',
  'Amoxicillin',
  'Ibuprofen',
  'Cetirizine',
  'Azithromycin',
  'Metformin',
  'Aspirin',
  'Pantoprazole',
  'Atorvastatin',
  'Dolo 650'
];

const buildMedicinePayloads = (pharmacyId) => {
  return medicineNames.map((name) => ({
    name,
    genericName: name,
    manufacturer: 'Generic Pharma',
    category: 'Tablet',
    composition: 'Sample composition',
    stockQuantity: Math.floor(Math.random() * 50),
    price: Math.floor(Math.random() * 200) + 20,
    mrp: Math.floor(Math.random() * 250) + 50,
    manufacturingDate: new Date('2024-01-01'),
    expiryDate: new Date('2026-12-31'),
    dosage: 'Twice daily',
    sideEffects: ['Nausea', 'Headache'],
    precautions: ['Avoid alcohol'],
    pharmacy: pharmacyId
  }));
};

const run = async () => {
  try {
    await connectDB();

    for (const data of seedPharmacies) {
      const existing = await Pharmacy.findOne({ email: data.email });
      if (existing) {
        continue;
      }

      const pharmacy = await Pharmacy.create(data);

      const existingMeds = await Medicine.countDocuments({ pharmacy: pharmacy._id });
      if (existingMeds === 0) {
        const meds = buildMedicinePayloads(pharmacy._id);
        await Medicine.insertMany(meds);
      }
    }

    console.log('Seed completed: pharmacies and medicines inserted.');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

run();
