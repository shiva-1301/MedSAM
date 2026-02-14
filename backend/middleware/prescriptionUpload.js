const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure prescriptions directory exists
const prescriptionsDir = 'uploads/prescriptions';
if (!fs.existsSync(prescriptionsDir)) {
  fs.mkdirSync(prescriptionsDir, { recursive: true });
}

// Configure storage for prescriptions
const prescriptionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, prescriptionsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for prescriptions
const prescriptionFileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'),
      false
    );
  }
};

const prescriptionUpload = multer({
  storage: prescriptionStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: prescriptionFileFilter,
});

module.exports = prescriptionUpload;
