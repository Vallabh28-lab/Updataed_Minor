require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const hearingRoutes = require('./src/routes/hearingRoutes');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (CORS must be first!)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Google Places API route for lawyers
app.get('/api/lawyers', async (req, res) => {
  const { lat, lng } = req.query;
  const radius = req.query.radius || 3000; // Fix: Default radius

  console.log('🔍 API Request received:', { lat, lng, radius });
  console.log('🔑 API Key exists:', !!API_KEY);
  console.log('🔑 API Key preview:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'MISSING');

  if (!lat || !lng) {
    return res.status(400).json({ error: 'Missing lat or lng parameters' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lawyer&key=${API_KEY}`;
    console.log('🌐 Calling Google Places API:', url);
    
    const response = await fetch(url);
    console.log('📡 Fetch response status:', response.status);
    
    const data = await response.json();
    console.log('📊 Full Google API Response:', JSON.stringify(data, null, 2));
    
    if (data.status !== 'OK') {
      console.error('❌ Google API Error Status:', data.status);
      console.error('❌ Google API Error Details:', data);
      return res.status(400).json({ 
        error: `Google Places API Error: ${data.status}`, 
        details: data.error_message || data.status,
        status: data.status
      });
    }

    if (!data.results || data.results.length === 0) {
      console.log('⚠️ No results found');
      return res.json([]);
    }

    const lawyers = data.results.map(place => ({
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      phone: place.international_phone_number || "Not available"
    }));

    console.log('✅ Sending results:', lawyers.length, 'lawyers');
    console.log('✅ Sample result:', lawyers[0]);
    res.json(lawyers);

  } catch (err) {
    console.error('💥 Server Error:', err.message);
    console.error('💥 Full Error:', err);
    console.error('💥 Stack trace:', err.stack);
    res.status(500).json({ 
      error: "Server error occurred", 
      details: err.message,
      type: err.name
    });
  }
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/hearings', hearingRoutes);
app.use('/api/upload', require('./src/routes/uploadRoutes'));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Legal Dashboard API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
