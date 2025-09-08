const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();

// Schéma Mongoose pour les avis
const reviewSchema = new mongoose.Schema({
  author: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// ✅ Récupérer tous les avis
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✅ Ajouter un nouvel avis
router.post('/', async (req, res) => {
  try {
    const { author, rating, comment } = req.body;
    
    // Validation basique
    if (!author || !rating || !comment) {
      return res.status(400).json({ 
        message: 'Tous les champs sont requis',
        required: ['author', 'rating', 'comment']
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'La note doit être entre 1 et 5' 
      });
    }

    const newReview = new Review({ author, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Erreur ajout avis:', error);
    res.status(400).json({ message: 'Erreur lors de l\'ajout', error: error.message });
  }
});

module.exports = router;
