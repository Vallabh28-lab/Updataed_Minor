// routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Appointment = require('../models/Appointment'); // Import your model

// Link the file to a specific appointment ID
router.post('/:id', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Get the appointment ID from the URL
        const appointmentId = req.params.id;

        // Save the file path into the 'documents' array of that appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            appointmentId,
            { $push: { documents: req.file.path } }, // Push path to array
            { new: true } // Return the updated document
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({
            message: 'File uploaded and linked successfully',
            filePath: req.file.path,
            appointment: updatedAppointment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;