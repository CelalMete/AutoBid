const mongoose = require("mongoose");

const durumSchema = new mongoose.Schema({
  kategori: { type: String, required: true },
  key: { type: String, required: true, unique: true }, // Örn: vehicle-Payment
  next: { type: String, required: true },             // Örn: Transport
  subject: {                                         // TR ve EN başlıkları
    tr: { type: String, required: true },
    en: { type: String, required: true }
  },
  message: {                                         // TR ve EN mesajları
    tr: { type: String, required: true },
    en: { type: String, required: true }
  }
}, { collection: "durums" });                     // Mevcut koleksiyon adı

module.exports = mongoose.model("Durum", durumSchema);

 