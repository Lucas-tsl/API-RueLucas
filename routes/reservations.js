const { Router } = require('express');
const Reservation = require('../models/Reservation');
const { generateCode } = require('../utils/generateCode');

const router = Router();

// ✅ Créer une nouvelle réservation
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    
    // Validation basique
    const requiredFields = ['email', 'phoneNumber', 'firstName', 'surname', 'street', 'postcode', 'city', 'country', 'startDate', 'endDate', 'paymentMethod', 'amountTotal'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Champs manquants: ${missingFields.join(', ')}` 
      });
    }

    // Générer un code unique
    let code;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      code = generateCode();
      const existing = await Reservation.findOne({ code });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ error: 'Impossible de générer un code unique' });
    }

    const doc = await Reservation.create({
      ...payload,
      code,
      status: payload.status || 'pending',
    });

    res.status(201).json(doc);
  } catch (error) {
    console.error('Erreur création réservation:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Code de réservation déjà existant' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// ✅ Lister les réservations avec filtres et pagination
router.get('/', async (req, res) => {
  try {
    const { q, status, page = '1', limit = '20' } = req.query;
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));
    
    const filter = {};
    
    // Filtre par statut
    if (status) {
      filter.status = status;
    }
    
    // Recherche textuelle
    if (q) {
      filter.$or = [
        { email: new RegExp(q, 'i') },
        { phoneNumber: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { surname: new RegExp(q, 'i') },
        { code: new RegExp(q, 'i') },
      ];
    }

    const [items, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l),
      Reservation.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: p,
      pages: Math.ceil(total / l)
    });
  } catch (error) {
    console.error('Erreur liste réservations:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Récupérer une réservation par ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Reservation.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(item);
  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mettre à jour une réservation
router.patch('/:id', async (req, res) => {
  try {
    const item = await Reservation.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const item = await Reservation.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json({ ok: true, message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur suppression réservation:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;