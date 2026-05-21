const express = require('express');
const router = express.Router();
const axios = require('axios');

// GET nearby lawyers using Geoapify
router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ message: "Latitude and Longitude are required" });
  }

  try {
    // Categories 'service.legal' finds lawyers, notaries, and law firms
    const url = `https://api.geoapify.com/v2/places?categories=service.legal&filter=circle:${lng},${lat},5000&bias=proximity:${lng},${lat}&limit=20&apiKey=${apiKey}`;

    const response = await axios.get(url);

    // Clean the data so your React frontend gets exactly what it needs
    const lawyers = response.data.features.map(f => ({
      name: f.properties.name || "Law Office / Advocate",
      address: f.properties.address_line2,
      city: f.properties.city,
      distance: Math.round(f.properties.distance), // Distance in meters
      lat: f.properties.lat,
      lon: f.properties.lon
    }));

    res.status(200).json(lawyers);
  } catch (error) {
    console.error("Geoapify Error:", error.message);
    res.status(500).json({ message: "Failed to find nearby lawyers" });
  }
});

// @route   GET /api/lawyers
// @desc    Get all lawyers
// @access  Public
router.get('/', (req, res) => {
  // TODO: Implement get lawyers logic
  res.json({
    message: 'Get lawyers endpoint',
    lawyers: []
  });
});

// @route   GET /api/lawyers/search
// @desc    Search lawyers by location, court, specialization
// @access  Public
router.get('/search', (req, res) => {
  const { city, court, distance, specialization } = req.query;

  // TODO: Implement lawyer search logic
  res.json({
    message: 'Lawyer search endpoint',
    filters: { city, court, distance, specialization }
  });
});

// @route   GET /api/lawyers/:id/reviews
// @desc    Get lawyer reviews
// @access  Public
router.get('/:id/reviews', (req, res) => {
  // TODO: Implement get reviews logic
  res.json({
    message: 'Get lawyer reviews endpoint',
    reviews: []
  });
});

// @route   POST /api/lawyers/:id/reviews
// @desc    Add lawyer review
// @access  Private
router.post('/:id/reviews', (req, res) => {
  // TODO: Implement add review logic
  res.json({
    message: 'Add lawyer review endpoint'
  });
});

module.exports = router;