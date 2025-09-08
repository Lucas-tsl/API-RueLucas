// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const Reservation = require('../models/Reservation');
// const sendSMS = require('../utils/sendSMS');
// const sendEmail = require('../utils/sendEmail');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// URI MongoDB
const MONGO_URI = 'mongodb+srv://lucas:K6kNPr4U8rbGBr2@api-mongodb.pdhadgj.mongodb.net/RueLucas?retryWrites=true&w=majority&appName=API-MongoDB';

// Schéma Mongoose
const reviewSchema = new mongoose.Schema({
  author: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// 📥 Récupérer les avis
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});
// 📥 Ajouter des avis
  app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de l\'ajout', error: err });
  }
});

// // Formulaire de réservation
// router.post('/api/reservations', async (req, res) => {
//   try {
//     const reservation = new Reservation({ ...req.body });
//     reservation.confirmationCode = generateCode();

//     await reservation.save();

//     if (reservation.email) {
//       await sendEmail(reservation.email, reservation.confirmationCode);
//     }

//     if (reservation.phoneNumber) {
//       await sendSMS(reservation.phoneNumber, reservation.confirmationCode);
//     }

//     res.status(201).json({ success: true, code: reservation.confirmationCode });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// });

// function generateCode() {
//   return Math.random().toString(36).substring(2, 8).toUpperCase();
// }





// 🚀 Connexion MongoDB + lancement serveur
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => console.log(`🚀 API en ligne : http://localhost:${PORT}`));
  })
  .catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

