const fs = require('fs');
const path = require('path');
require('dotenv').config();

const connectDB = require('../config/db');
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Adherence = require('../models/Adherence');
const Prescription = require('../models/Prescription');

const toPlain = (value) => {
  if (value && value._bsontype === 'ObjectID') {
    return value.toString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
};

const jsonReplacer = (key, value) => toPlain(value);

const exportCollection = async (label, model) => {
  const docs = await model.find({}).lean();
  const json = JSON.stringify(docs, jsonReplacer, 2);
  return `## ${label}\n\n\`\`\`json\n${json}\n\`\`\`\n`;
};

const run = async () => {
  try {
    await connectDB();

    const sections = [];
    sections.push('# Database Export (Full)');
    sections.push('');
    sections.push(`Last Updated: ${new Date().toISOString()}`);
    sections.push('');

    sections.push(await exportCollection('Users', User));
    sections.push(await exportCollection('Pharmacies', Pharmacy));
    sections.push(await exportCollection('Medicines', Medicine));
    sections.push(await exportCollection('Adherence', Adherence));
    sections.push(await exportCollection('Prescriptions', Prescription));

    const output = sections.join('\n');
    const outputPath = path.join(__dirname, '..', '..', 'db.md');
    fs.writeFileSync(outputPath, output, 'utf8');

    console.log('db.md exported successfully.');
  } catch (error) {
    console.error('Export failed:', error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = require('mongoose');
    await mongoose.disconnect();
  }
};

run();
