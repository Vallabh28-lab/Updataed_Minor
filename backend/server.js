require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const hearingRoutes = require('./src/routes/hearingRoutes');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PORT = process.env.PORT || 5000;
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5177',
  'http://localhost:3000',
  process.env.FRONTEND_PRODUCTION_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by security rules (CORS Validation Error)'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("📁 MongoDB Database Pipeline Connected Successfully."))
.catch(err => {
  console.error("❌ MongoDB Connection Disaster:", err.message);
  process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/lawyers', async (req, res) => {
  const { lat, lng, keyword } = req.query;
  const radius = req.query.radius || 3000;
  const searchTerm = keyword || 'lawyer';
  if (!lat || !lng) return res.status(400).json({ success: false, error: 'Missing coordinates' });

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=,&radius=&keyword=&type=lawyer&key=`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') return res.json(data.results);
    const mockLawyers = [
      {
        name: ` Advocate Sharma`,
        vicinity: "Cantonment Area, Court Road",
        rating: 4.8,
        geometry: { location: { lat: parseFloat(lat) + 0.002, lng: parseFloat(lng) + 0.002 } }
      },
      {
        name: "Legal Associate Patil",
        vicinity: "Shivaji Nagar, Near District Court",
        rating: 4.5,
        geometry: { location: { lat: parseFloat(lat) - 0.003, lng: parseFloat(lng) + 0.001 } }
      }
    ];
    res.json(mockLawyers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/geocode', async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'Address required' });
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=&key=`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === 'OK') {
      res.json(data);
    } else {
      let location = { lat: 18.5204, lng: 73.8567 };
      if (address.toLowerCase().includes('mumbai')) location = { lat: 19.0760, lng: 72.8777 };
      res.json({ status: 'OK', results: [{ geometry: { location } }] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/hearings', hearingRoutes);
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/past-cases', require('./src/routes/past_cases'));
app.use('/api/documents', require('./src/routes/documents'));

app.use('/uploads', express.static('uploads'));

app.get('/api/health', (req, res) => res.json({ status: 'Online' }));

app.listen(PORT, () => console.log(`🚀 Server running on port 5173`));
