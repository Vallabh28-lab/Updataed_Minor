require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const hearingRoutes = require('./src/routes/hearingRoutes');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PORT = process.env.PORT || 5000;
const app = express();

// 1. Strict, Production-Grade CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Vite Default local port
  'http://localhost:3000', 
  process.env.FRONTEND_PRODUCTION_URL // Your deployed website domain link
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server or curl requests (origin is undefined)
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

// 2. Optimized Database Initialization Connection Strategy
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => console.log("📁 MongoDB Database Pipeline Connected Successfully."))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err.message);
  console.warn("⚠️ Server continuing without MongoDB - auth features will not work.");
});

// Database state listeners
mongoose.connection.on('error', err => console.error('💥 Running DB Instance Error:', err));
mongoose.connection.on('disconnected', () => console.warn('⚠️ Lost connection to MongoDB database cluster.'));

// 3. Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Google Places API Route for Legal Professionals
app.get('/api/lawyers', async (req, res, next) => {
  const { lat, lng } = req.query;
  const radius = req.query.radius || 3000;

  if (!lat || !lng) {
    return res.status(400).json({ success: false, error: 'Missing geographic coordinates (lat/lng parameters)' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=lawyer&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      return res.status(400).json({ 
        success: false,
        error: `Google Places API Error: ${data.status}`, 
        details: data.error_message || data.status
      });
    }

    if (!data.results || data.results.length === 0) {
      return res.json([]);
    }

    const lawyers = data.results.map(place => ({
      name: place.name,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      phone: place.international_phone_number || "Not available"
    }));

    res.json(lawyers);

  } catch (err) {
    next(err); // Hands error safely off to global error middleware without crashing process
  }
});

// 5. System Route Definitions Setup
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/hearings', hearingRoutes);
app.use('/api/upload', require('./src/routes/uploadRoutes'));
app.use('/api/documents', require('./src/routes/documents'));
app.use('/api/statutes', require('./src/routes/statutes'));

// Proxy prediction requests to Python FastAPI
app.post('/api/predict', async (req, res) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ success: false, error: 'Prediction service unavailable: ' + err.message });
  }
});

// Serve static assets securely
app.use('/uploads', express.static('uploads'));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Online', 
    timestamp: new Date(), 
    environment: process.env.NODE_ENV || 'development' 
  });
});

// 404 Route Catcher
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Requested backend API path does not exist." });
});

// 6. Centralized Production Error Handling Middleware (Defensive Architecture)
app.use((err, req, res, next) => {
  console.error('❌ System Intercepted Unhandled Error Event:', err.stack);
  
  const status = err.status || 500;
  const devMessage = err.message;
  
  res.status(status).json({
    success: false,
    message: 'An unexpected internal gateway operational exception occurred.',
    // Only expose actual stack traces in local development environments
    error: process.env.NODE_ENV === 'development' ? devMessage : 'Internal Server Error'
  });
});

// 7. Engine Ignition Launch
app.listen(PORT, () => {
  console.log(`🌐 Application instance actively listening via Network Interface Port: ${PORT}`);
});