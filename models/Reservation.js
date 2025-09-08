const { Schema, model } = require('mongoose');

const ReservationSchema = new Schema({
  code: { 
    type: String, 
    index: true, 
    unique: true,
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled'], 
    default: 'pending' 
  },

  // Coordonnées client
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  street: { type: String, required: true },
  postcode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },

  // Dates de séjour
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  // Paiement
  paymentMethod: { 
    type: String, 
    enum: ['card', 'paypal'], 
    required: true 
  },
  amountTotal: { type: Number, required: true },
}, { 
  timestamps: true 
});

module.exports = model('Reservation', ReservationSchema);