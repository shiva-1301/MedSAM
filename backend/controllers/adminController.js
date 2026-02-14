const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');
const Medicine = require('../models/Medicine');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPharmacies = await Pharmacy.countDocuments();
    const pendingPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'pending' });
    const approvedPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'approved' });
    const rejectedPharmacies = await Pharmacy.countDocuments({ verificationStatus: 'rejected' });
    const totalMedicines = await Medicine.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalPharmacies,
        pendingPharmacies,
        approvedPharmacies,
        rejectedPharmacies,
        totalMedicines
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pending pharmacies
// @route   GET /api/admin/pharmacies/pending
// @access  Private/Admin
exports.getAllPendingPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ verificationStatus: 'pending' })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pharmacies
// @route   GET /api/admin/pharmacies
// @access  Private/Admin
exports.getAllPharmacies = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.verificationStatus = status;
    }

    const pharmacies = await Pharmacy.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pharmacies.length,
      data: pharmacies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve pharmacy
// @route   PUT /api/admin/pharmacies/:id/approve
// @access  Private/Admin
exports.approvePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'approved',
        verifiedBy: req.user._id,
        verifiedAt: Date.now(),
        rejectionReason: undefined
      },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    res.json({
      success: true,
      message: 'Pharmacy approved successfully',
      data: pharmacy
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject pharmacy
// @route   PUT /api/admin/pharmacies/:id/reject
// @access  Private/Admin
exports.rejectPharmacy = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const pharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'rejected',
        rejectionReason: reason,
        verifiedBy: req.user._id,
        verifiedAt: Date.now()
      },
      { new: true }
    );

    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    res.json({
      success: true,
      message: 'Pharmacy rejected',
      data: pharmacy
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
