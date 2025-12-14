const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Kullanıcı modeli
    required: false,
    index: true // Kullanıcının geçmiş işlemlerini hızlı çekmek için
  },

  ilanId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ilan', // İlgili araç/ilan
    required: false 
  },

  type: {
    type: String,
    enum: ['DEPOSIT', 'PAYMENT', 'REFUND'], 
    default: 'PAYMENT'
  },

  provider: { 
    type: String, 
    enum: ['stripe', 'payoneer', 'paytr'], // Kullandığın sağlayıcılar
    required: true 
  },

  providerPaymentId: { 
    type: String, 
    required: true,
    unique: true // Aynı ID ile iki işlem olamaz (Hızlandırır)
  },

  amount: { 
    type: Number, 
    required: true 
  }, // 1500 = 15.00 (Kuruş/Cent bazlı)

  currency: { 
    type: String, 
    default: 'EUR',
    uppercase: true // Her zaman büyük harf olsun (eur -> EUR)
  },

  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], // 'refunded' eklendi
    default: 'pending',
    index: true
  },

  // Hata mesajları veya ek bilgiler için
  metadata: { 
    type: Object, 
    default: {} 
  }
}, { 
  timestamps: true // createdAt ve updatedAt'i otomatik oluşturur
});

module.exports = mongoose.model('Transaction', txSchema);