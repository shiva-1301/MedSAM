const { validationResult } = require('express-validator');
const Medicine = require('../models/Medicine');

// @desc    Add new medicine
// @route   POST /api/medicines
// @access  Private/Pharmacy
exports.addMedicine = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Parse arrays if they're strings
    const medicineData = { ...req.body };
    if (typeof medicineData.sideEffects === 'string') {
      medicineData.sideEffects = JSON.parse(medicineData.sideEffects);
    }
    if (typeof medicineData.precautions === 'string') {
      medicineData.precautions = JSON.parse(medicineData.precautions);
    }

    // Add image if uploaded
    if (req.file) {
      medicineData.image = req.file.path;
    }

    // Add pharmacy reference
    medicineData.pharmacy = req.user._id;

    const medicine = await Medicine.create(medicineData);

    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all medicines for logged in pharmacy
// @route   GET /api/medicines/my-medicines
// @access  Private/Pharmacy
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      pharmacy: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private
exports.getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('pharmacy', 'pharmacyName city state phoneNumber');

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Pharmacy
exports.updateMedicine = async (req, res) => {
  try {
    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    // Check ownership
    if (medicine.pharmacy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this medicine' });
    }

    const updateData = { ...req.body };

    // Parse arrays if they're strings
    if (typeof updateData.sideEffects === 'string') {
      updateData.sideEffects = JSON.parse(updateData.sideEffects);
    }
    if (typeof updateData.precautions === 'string') {
      updateData.precautions = JSON.parse(updateData.precautions);
    }

    // Add new image if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }

    medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Pharmacy
exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    // Check ownership
    if (medicine.pharmacy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this medicine' });
    }

    // Soft delete
    medicine.isActive = false;
    await medicine.save();

    res.json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock medicines
// @route   GET /api/medicines/low-stock
// @access  Private/Pharmacy
exports.getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ 
      pharmacy: req.user._id,
      isActive: true,
      stockQuantity: { $lt: 10 }
    }).sort({ stockQuantity: 1 });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get expiring medicines
// @route   GET /api/medicines/expiring
// @access  Private/Pharmacy
exports.getExpiringMedicines = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const medicines = await Medicine.find({ 
      pharmacy: req.user._id,
      isActive: true,
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    }).sort({ expiryDate: 1 });

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search medicines (public)
// @route   GET /api/medicines/search?q=medicine_name&city=city_name
// @access  Public
exports.searchMedicines = async (req, res) => {
  try {
    const { q, city, category } = req.query;
    
    let query = { isActive: true };

    // Search by name or generic name
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { genericName: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    let medicines = await Medicine.find(query)
      .populate('pharmacy', 'pharmacyName city state phoneNumber pharmacyAddress verificationStatus')
      .sort({ name: 1 });

    // Filter by city if provided
    if (city) {
      medicines = medicines.filter(med => 
        med.pharmacy && 
        med.pharmacy.city && 
        med.pharmacy.city.toLowerCase().includes(city.toLowerCase()) &&
        med.pharmacy.verificationStatus === 'approved'
      );
    } else {
      // Only show medicines from verified pharmacies
      medicines = medicines.filter(med => 
        med.pharmacy && med.pharmacy.verificationStatus === 'approved'
      );
    }

    res.json({
      success: true,
      count: medicines.length,
      data: medicines
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Get medicine name suggestions (prefix match)
// @route   GET /api/medicines/suggestions?query=prefix
// @access  Public
exports.getMedicineSuggestions = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === '') {
      return res.json([]);
    }

    const safeQuery = escapeRegex(query.trim());
    const medicines = await Medicine.find({
      name: { $regex: `^${safeQuery}`, $options: 'i' }
    })
      .select('name')
      .limit(10)
      .lean();

    const uniqueNames = [...new Set(medicines.map((m) => m.name))];

    return res.json(uniqueNames);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching suggestions' });
  }
};
