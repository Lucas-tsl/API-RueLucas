const { Router } = require('express');
const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const { generateCode } = require('../utils/generateCode');

const router = Router();

// 📊 Fonction utilitaire pour valider un email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 📊 Fonction utilitaire pour valider les dates
const validateDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, message: 'Dates invalides' };
  }
  
  if (start < now) {
    return { valid: false, message: 'La date de début ne peut pas être dans le passé' };
  }
  
  if (start >= end) {
    return { valid: false, message: 'La date de fin doit être après la date de début' };
  }
  
  return { valid: true };
};

// ✅ Créer une nouvelle réservation
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    
    // Validation des champs requis
    const requiredFields = ['email', 'phoneNumber', 'firstName', 'surname', 'street', 'postcode', 'city', 'country', 'startDate', 'endDate', 'paymentMethod', 'amountTotal'];
    const missingFields = requiredFields.filter(field => !payload[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Champs manquants: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Validation de l'email
    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    // Validation des dates
    const dateValidation = validateDates(payload.startDate, payload.endDate);
    if (!dateValidation.valid) {
      return res.status(400).json({ error: dateValidation.message });
    }

    // Validation du montant
    if (payload.amountTotal <= 0) {
      return res.status(400).json({ error: 'Le montant total doit être positif' });
    }

    // Validation de la méthode de paiement
    const validPaymentMethods = ['card', 'paypal'];
    if (!validPaymentMethods.includes(payload.paymentMethod)) {
      return res.status(400).json({ 
        error: 'Méthode de paiement invalide',
        validMethods: validPaymentMethods
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
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ 
        error: 'Erreur de validation',
        details: Object.values(error.errors).map(e => e.message)
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// ✅ Lister les réservations avec filtres et pagination avancés
router.get('/', async (req, res) => {
  try {
    const { 
      q, 
      status, 
      startDateFrom, 
      startDateTo, 
      endDateFrom, 
      endDateTo,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1', 
      limit = '20' 
    } = req.query;
    
    const p = Math.max(1, parseInt(page));
    const l = Math.min(100, parseInt(limit));
    
    const filter = {};
    
    // Filtre par statut
    if (status) {
      const validStatuses = ['pending', 'paid', 'cancelled'];
      if (validStatuses.includes(status)) {
        filter.status = status;
      }
    }
    
    // Filtres par dates
    if (startDateFrom || startDateTo) {
      filter.startDate = {};
      if (startDateFrom) filter.startDate.$gte = new Date(startDateFrom);
      if (startDateTo) filter.startDate.$lte = new Date(startDateTo);
    }
    
    if (endDateFrom || endDateTo) {
      filter.endDate = {};
      if (endDateFrom) filter.endDate.$gte = new Date(endDateFrom);
      if (endDateTo) filter.endDate.$lte = new Date(endDateTo);
    }
    
    // Recherche textuelle
    if (q) {
      filter.$or = [
        { email: new RegExp(q, 'i') },
        { phoneNumber: new RegExp(q, 'i') },
        { firstName: new RegExp(q, 'i') },
        { surname: new RegExp(q, 'i') },
        { code: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
        { country: new RegExp(q, 'i') }
      ];
    }

    // Gestion du tri
    const validSortFields = ['createdAt', 'startDate', 'endDate', 'amountTotal', 'status'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Reservation.find(filter)
        .sort({ [sortField]: sortDirection })
        .skip((p - 1) * l)
        .limit(l),
      Reservation.countDocuments(filter)
    ]);

    res.json({
      items,
      total,
      page: p,
      pages: Math.ceil(total / l),
      filters: {
        status,
        startDateFrom,
        startDateTo,
        endDateFrom,
        endDateTo,
        q
      },
      sort: {
        field: sortField,
        order: sortOrder
      }
    });
  } catch (error) {
    console.error('Erreur liste réservations:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📊 Statistiques des réservations pour le dashboard
router.get('/stats', async (req, res) => {
  try {
    const [
      totalReservations,
      pendingReservations,
      paidReservations,
      cancelledReservations,
      totalRevenue,
      recentReservations
    ] = await Promise.all([
      Reservation.countDocuments(),
      Reservation.countDocuments({ status: 'pending' }),
      Reservation.countDocuments({ status: 'paid' }),
      Reservation.countDocuments({ status: 'cancelled' }),
      Reservation.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amountTotal' } } }
      ]),
      Reservation.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('code status startDate endDate amountTotal firstName surname')
    ]);

    res.json({
      summary: {
        total: totalReservations,
        pending: pendingReservations,
        paid: paidReservations,
        cancelled: cancelledReservations,
        revenue: totalRevenue[0]?.total || 0
      },
      recent: recentReservations
    });
  } catch (error) {
    console.error('Erreur stats réservations:', error);
    res.status(500).json({ error: error.message });
  }
});

// 🔍 Rechercher une réservation par code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const reservation = await Reservation.findOne({ code: code.toUpperCase() });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée avec ce code' });
    }
    
    res.json(reservation);
  } catch (error) {
    console.error('Erreur recherche par code:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Récupérer une réservation par ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }
    
    const item = await Reservation.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(item);
  } catch (error) {
    console.error('Erreur récupération réservation:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✏️ Mettre à jour une réservation
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    // Validation des champs si présents
    if (updates.email && !isValidEmail(updates.email)) {
      return res.status(400).json({ error: 'Format d\'email invalide' });
    }

    if (updates.amountTotal && updates.amountTotal <= 0) {
      return res.status(400).json({ error: 'Le montant total doit être positif' });
    }

    // Validation des dates si modifiées
    if (updates.startDate || updates.endDate) {
      const current = await Reservation.findById(id);
      if (!current) {
        return res.status(404).json({ error: 'Réservation non trouvée' });
      }
      
      const startDate = updates.startDate || current.startDate;
      const endDate = updates.endDate || current.endDate;
      
      const dateValidation = validateDates(startDate, endDate);
      if (!dateValidation.valid) {
        return res.status(400).json({ error: dateValidation.message });
      }
    }

    // Validation du statut
    if (updates.status) {
      const validStatuses = ['pending', 'paid', 'cancelled'];
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ 
          error: 'Statut invalide',
          validStatuses
        });
      }
    }

    // Validation de la méthode de paiement
    if (updates.paymentMethod) {
      const validPaymentMethods = ['card', 'paypal'];
      if (!validPaymentMethods.includes(updates.paymentMethod)) {
        return res.status(400).json({ 
          error: 'Méthode de paiement invalide',
          validMethods: validPaymentMethods
        });
      }
    }

    // Interdire la modification du code
    if (updates.code) {
      delete updates.code;
    }
    
    const item = await Reservation.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Erreur mise à jour réservation:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ 
        error: 'Erreur de validation',
        details: Object.values(error.errors).map(e => e.message)
      });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// 🗑️ Supprimer une réservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation de l'ID MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID invalide' });
    }
    
    const item = await Reservation.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    
    res.json({ 
      message: 'Réservation supprimée avec succès',
      deletedId: id,
      deletedReservation: {
        code: item.code,
        email: item.email,
        startDate: item.startDate,
        endDate: item.endDate
      }
    });
  } catch (error) {
    console.error('Erreur suppression réservation:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;