const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addMedicine,
  getAllMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
  getLowStockMedicines,
  getExpiringMedicines,
  searchMedicines,
  getMedicineSuggestions
} = require('../controllers/medicineController');
const { protect, authorize, checkPharmacyVerification } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes (for users to search medicines)
router.get('/suggestions', getMedicineSuggestions);
router.get('/search', searchMedicines);

// Protected routes
router.use(protect);

// Pharmacy routes - requires pharmacy role and verification
router.post('/', 
  authorize('pharmacy'),
  checkPharmacyVerification,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Medicine name is required'),
    body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('composition').notEmpty().withMessage('Composition is required'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('mrp').isFloat({ min: 0 }).withMessage('Valid MRP is required'),
    body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
    body('expiryDate').isISO8601().withMessage('Valid expiry date is required')
  ],
  addMedicine
);

router.get('/my-medicines', authorize('pharmacy'), getAllMedicines);
router.get('/low-stock', authorize('pharmacy'), getLowStockMedicines);
router.get('/expiring', authorize('pharmacy'), getExpiringMedicines);
router.get('/:id', getMedicine);

router.put('/:id', 
  authorize('pharmacy'),
  checkPharmacyVerification,
  upload.single('image'),
  updateMedicine
);

router.delete('/:id', 
  authorize('pharmacy'),
  checkPharmacyVerification,
  deleteMedicine
);

module.exports = router;
