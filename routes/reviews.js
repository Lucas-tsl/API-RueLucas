const { Router } = require('express');
const mongoose = require('mongoose');

const router = Router();

// Schéma Mongoose pour les avis
const reviewSchema = new mongoose.Schema({
  author: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  }
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
    const { author, rating, comment, status = 'approved' } = req.body;
    
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

    // Validation du statut
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Statut invalide',
        validStatuses 
      });
    }

    const newReview = new Review({ author, rating, comment, status });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Erreur ajout avis:', error);
    res.status(400).json({ message: 'Erreur lors de l\'ajout', error: error.message });
  }
});

// 📝 Récupérer un avis par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    res.json(review);
  } catch (error) {
    console.error('Erreur récupération avis:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// ✏️ Modifier un avis
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { author, rating, comment, status } = req.body;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    // Validation des champs requis
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

    // Validation du statut
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Statut invalide',
        validStatuses 
      });
    }

    // Mise à jour de l'avis
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { author, rating, comment, status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error('Erreur modification avis:', error);
    res.status(400).json({ message: 'Erreur lors de la modification', error: error.message });
  }
});

// 🗑️ Supprimer un avis
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }

    const deletedReview = await Review.findByIdAndDelete(id);
    
    if (!deletedReview) {
      return res.status(404).json({ message: 'Avis non trouvé' });
    }

    res.json({ 
      message: 'Avis supprimé avec succès',
      deletedId: id,
      deletedReview 
    });
  } catch (error) {
    console.error('Erreur suppression avis:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression', error: error.message });
  }
});

module.exports = router;
