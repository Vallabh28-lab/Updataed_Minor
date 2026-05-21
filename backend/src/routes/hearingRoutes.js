const express = require('express');
const router = express.Router();
const Hearing = require('../models/Hearing'); // Import the map above

// This sends ALL hearings to React
router.get('/all', async (req, res) => {
    try {
        const data = await Hearing.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// This saves a NEW hearing sent from React
router.post('/add', async (req, res) => {
    try {
        const newHearing = new Hearing(req.body);
        await newHearing.save();
        res.send("Saved Successfully!");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
