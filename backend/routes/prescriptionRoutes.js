const router = require('express').Router();
const {
  uploadPrescription,
  getPrescriptions,
  getPrescriptionById,
  deletePrescription,
} = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');
const prescriptionUpload = require('../middleware/prescriptionUpload');

// Protect all routes - User only
router.use(protect);
router.use(authorize('user'));

// Upload prescription
router.post('/upload', prescriptionUpload.single('file'), uploadPrescription);

// Get all prescriptions
router.get('/', getPrescriptions);

// Get single prescription
router.get('/:id', getPrescriptionById);

// Delete prescription
router.delete('/:id', deletePrescription);

module.exports = router;
