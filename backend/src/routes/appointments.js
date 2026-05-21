const express = require('express');
const router = express.Router();
const multer = require('multer');
const Appointment = require('../models/Appointment');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Tells multer to put files in the folder you made in Step 1
  },
  filename: (req, file, cb) => {
    // Renames file to: 17123456789-my-case.pdf
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// @route   GET /api/appointments
// @desc    Get user appointments
// @access  Private
router.get('/', (req, res) => {
  // TODO: Implement get appointments logic
  res.json({
    message: 'Get appointments endpoint',
    appointments: []
  });
});

// @route   POST /api/appointments
// @desc    Book new appointment
// @access  Private
router.post('/', (req, res) => {
  // TODO: Implement book appointment logic
  res.json({
    message: 'Book appointment endpoint'
  });
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment (reschedule)
// @access  Private
router.put('/:id', (req, res) => {
  // TODO: Implement reschedule appointment logic
  res.json({
    message: 'Reschedule appointment endpoint'
  });
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', (req, res) => {
  // TODO: Implement cancel appointment logic
  res.json({
    message: 'Cancel appointment endpoint'
  });
});

// @route   POST /api/appointments/upload/:id
// @desc    Upload document associated with an appointment
// @access  Private
router.post('/upload/:id', upload.single('document'), async (req, res, next) => {
  try {
    const appointmentId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const filePath = req.file.path; // This is where the file is now stored

    // Find the appointment and push the new file path into the array
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { $push: { documents: filePath } },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({
      message: "File uploaded successfully!",
      file: filePath,
      appointment: updatedAppointment
    });
  } catch (error) {
    next(error); // Sends to your Global Error Handler
  }
});

module.exports = router;