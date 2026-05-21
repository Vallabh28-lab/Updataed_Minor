const express = require('express');
const router = express.Router();

// GET nearby lawyers using Google Places API
router.get('/', async (req, res) => {
    const { lat, lng } = req.query;
    const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=lawyer&key=${API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Google Places API error: ${response.statusText}`);
        }

        const data = await response.json();

        // Clean the data for frontend
        const lawyers = data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 0,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            place_id: place.place_id
        }));

        res.status(200).json(lawyers);
    } catch (error) {
        console.error("Google Places Error:", error.message);
        res.status(500).json({ message: "Failed to find nearby lawyers" });
    }
});

module.exports = router;
