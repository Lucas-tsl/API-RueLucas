require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import des routes
const reservationsRoutes = require('../routes/reservations');
const reviewsRoutes = require('../routes/reviews');

const app = express();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rue_lucas';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(morgan('dev'));

// 🔄 Connexion MongoDB avec cache pour Vercel
let isConnected = false;

async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
    isConnected = true;
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    throw error;
  }
}

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    service: 'API Rue Lucas'
  });
});

// Routes principales
app.use('/reservations', reservationsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    availableRoutes: ['/health', '/reservations', '/api/reviews']
  });
});

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error);
  res.status(500).json({ 
    error: 'Erreur serveur interne',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue'
  });
});

// 📦 Export pour Vercel (serverless)
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
