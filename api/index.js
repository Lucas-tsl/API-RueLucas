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
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB :', error);
    throw error;
  }
}

// Middleware de connexion DB pour toutes les routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ 
      error: 'Erreur de connexion à la base de données',
      message: error.message 
    });
  }
});

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
module.exports = app;
