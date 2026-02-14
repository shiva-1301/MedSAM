const Prescription = require('../models/Prescription');
const fs = require('fs');
const path = require('path');

// @desc    Upload prescription
// @route   POST /api/prescriptions/upload
// @access  Private (User only)
exports.uploadPrescription = async (req, res) => {
  try {
    const { doctorName, doctorContact, hospitalName, visitDate, notes } = req.body;

    // Validation
    if (!doctorName || !doctorContact || !hospitalName || !visitDate) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: doctorName, doctorContact, hospitalName, visitDate',
      });
    }

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a prescription file (PDF, JPEG, or PNG)',
      });
    }

    const fileType = req.file.mimetype.split('/')[1].toLowerCase();
    const allowedTypes = ['pdf', 'jpeg', 'jpg', 'png'];

    if (!allowedTypes.includes(fileType)) {
      // Delete uploaded file if not allowed
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, JPEG, and PNG are allowed',
      });
    }

    // Create prescription record
    const prescription = new Prescription({
      userId: req.user.id,
      doctorName,
      doctorContact,
      hospitalName,
      visitDate: new Date(visitDate),
      notes,
      fileUrl: `/uploads/prescriptions/${req.file.filename}`,
      fileType: fileType === 'jpg' ? 'jpeg' : fileType,
    });

    await prescription.save();

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      data: prescription,
    });
  } catch (error) {
    // Delete uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error uploading prescription',
      error: error.message,
    });
  }
};

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private (User only)
exports.getPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id }).sort({
      visitDate: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Prescriptions retrieved',
      count: prescriptions.length,
      data: prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescriptions',
      error: error.message,
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private (User only)
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription retrieved',
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription',
      error: error.message,
    });
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private (User only)
exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
      });
    }

    // Delete file from disk
    if (prescription.fileUrl) {
      const filePath = path.join(
        __dirname,
        '..',
        prescription.fileUrl.replace(/\//g, '\\')
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Prescription deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting prescription',
      error: error.message,
    });
  }
};
