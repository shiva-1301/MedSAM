const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');

// @desc    Get pharmacy profile
// @route   GET /api/pharmacy/profile
// @access  Private/Pharmacy
exports.getPharmacyProfile = async (req, res) => {
  try {
    console.log('Getting profile for pharmacy ID:', req.user._id);
    const pharmacy = await Pharmacy.findById(req.user._id).select('-password -licenseDocument');
    
    console.log('Fetched pharmacy:', pharmacy);
    
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get pharmacy dashboard data
// @route   GET /api/pharmacy/dashboard
// @access  Private/Pharmacy
exports.getPharmacyDashboard = async (req, res) => {
  try {
    const pharmacyId = req.user._id;

    // Get total medicines count
    const totalMedicines = await Medicine.countDocuments({ pharmacy: pharmacyId, isActive: true });

    // Get low stock medicines (less than 10)
    const lowStockMedicines = await Medicine.countDocuments({ 
      pharmacy: pharmacyId, 
      isActive: true,
      stockQuantity: { $lt: 10 } 
    });

    // Get expiring medicines (expiring in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringMedicines = await Medicine.countDocuments({ 
      pharmacy: pharmacyId,
      isActive: true,
      expiryDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    // Get out of stock medicines
    const outOfStockMedicines = await Medicine.countDocuments({ 
      pharmacy: pharmacyId,
      isActive: true,
      stockQuantity: 0
    });

    // Get recent medicines
    const recentMedicines = await Medicine.find({ 
      pharmacy: pharmacyId,
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name category stockQuantity price expiryDate');

    res.json({
      success: true,
      data: {
        verificationStatus: req.user.verificationStatus,
        pharmacyName: req.user.pharmacyName,
        stats: {
          totalMedicines,
          lowStockMedicines,
          expiringMedicines,
          outOfStockMedicines
        },
        recentMedicines
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pharmacy profile
// @route   PUT /api/pharmacy/profile
// @access  Private/Pharmacy
exports.updatePharmacyProfile = async (req, res) => {
  try {
    const pharmacyId = req.user._id;
    console.log('\n=== UPDATE PHARMACY PROFILE START ===');
    console.log('Pharmacy ID:', pharmacyId);
    console.log('Pharmacy ID Type:', typeof pharmacyId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const updateData = { ...req.body };

    // Remove sensitive/restricted fields
    delete updateData.password;
    delete updateData.email;
    delete updateData.role;
    delete updateData.verificationStatus;
    delete updateData.licenseNumber;

    console.log('Data after filtering:', JSON.stringify(updateData, null, 2));

    // If new license document is uploaded
    if (req.file) {
      updateData.licenseDocument = req.file.path;
    }

    // Check if pharmacy exists before update
    const pharmacyBefore = await Pharmacy.findById(pharmacyId);
    console.log('Pharmacy found before update:', !!pharmacyBefore);
    if (pharmacyBefore) {
      console.log('Current data before update:', {
        phoneNumber: pharmacyBefore.phoneNumber,
        city: pharmacyBefore.city,
        state: pharmacyBefore.state,
        pincode: pharmacyBefore.pincode,
        pharmacyAddress: pharmacyBefore.pharmacyAddress,
        gstNumber: pharmacyBefore.gstNumber
      });
    }

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      pharmacyId,
      { $set: updateData },
      { new: true, runValidators: false }
    );

    console.log('Update result - pharmacy found:', !!pharmacy);
    if (pharmacy) {
      console.log('Data after update:', {
        phoneNumber: pharmacy.phoneNumber,
        city: pharmacy.city,
        state: pharmacy.state,
        pincode: pharmacy.pincode,
        pharmacyAddress: pharmacy.pharmacyAddress,
        gstNumber: pharmacy.gstNumber
      });
    }

    if (!pharmacy) {
      console.log('ERROR: Pharmacy not found after update for ID:', pharmacyId);
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    console.log('=== UPDATE PHARMACY PROFILE SUCCESS ===\n');
    res.json({
      success: true,
      message: 'Pharmacy profile updated successfully',
      data: pharmacy
    });
  } catch (error) {
    console.error('=== UPDATE PHARMACY PROFILE ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('=== END ERROR ===\n');
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update working hours
// @route   PUT /api/pharmacy/working-hours
// @access  Private/Pharmacy
exports.updateWorkingHours = async (req, res) => {
  try {
    const { workingHours } = req.body;

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.user._id,
      { workingHours },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Working hours updated successfully',
      data: pharmacy.workingHours
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby pharmacies using geolocation
// @route   GET /api/pharmacy/nearby
// @access  Public
exports.getNearbyPharmacies = async (req, res) => {
  try {
    const { lat, lng, radiusKm = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    // Convert latitude and longitude to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid latitude or longitude',
      });
    }

    // Convert radius from kilometers to meters
    const radiusMeters = parseFloat(radiusKm) * 1000;

    // Query for approved pharmacies near the given coordinates
    const nearbyPharmacies = await Pharmacy.find({
      verificationStatus: 'approved',
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusMeters,
        },
      },
    }).select('-password -licenseDocument').lean();

    // Calculate distance for each pharmacy
    const pharmaciesWithDistance = nearbyPharmacies.map((pharmacy) => {
      if (pharmacy.location && pharmacy.location.coordinates) {
        const [pharmaLng, pharmaLat] = pharmacy.location.coordinates;

        // Haversine formula to calculate distance
        const R = 6371; // Earth's radius in kilometers
        const dLat = ((pharmaLat - latitude) * Math.PI) / 180;
        const dLng = ((pharmaLng - longitude) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latitude * Math.PI) / 180) *
            Math.cos((pharmaLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return {
          ...pharmacy,
          distance: parseFloat(distance.toFixed(2)),
        };
      }
      return pharmacy;
    });

    // Sort by distance
    pharmaciesWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    res.status(200).json({
      success: true,
      message: `Found ${pharmaciesWithDistance.length} pharmacies nearby`,
      count: pharmaciesWithDistance.length,
      data: pharmaciesWithDistance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby pharmacies',
      error: error.message,
    });
  }
};
